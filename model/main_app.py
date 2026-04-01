import torch
import gc
import json
import os

from utils.util_file import load_audio
from diagnosis.rules_engine import diagnose_errors_classification
from report_generation.report_generator import generate_markdown_report
from speech_processing.phonetic_analyzer import (
    load_model_and_processor,
    get_phonetic_analysis,
    generate_overall_phoneme_scores
)

#  Correct Linux path (your model is inside model/xlsr-53-saved-model)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "xlsr-53-saved-model")
DIAGNOSTICS_FILE_PATH = os.path.join(BASE_DIR, "diagnostics.json")
MD_REPORT_PATH = os.path.join(BASE_DIR, "pronunciation_report.md")

#  GLOBAL VARIABLES (Lazy loading for performance)
processor = None
model = None
blank_token_id = None
device = None


def load_model():
    """
    Load model only once (prevents reload on every API call)
    """
    global processor, model, blank_token_id, device

    if processor is None or model is None:
        print("🔄 Loading Speech Model...")
        processor, model, blank_token_id = load_model_and_processor(MODEL_PATH)
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model.to(device)
        print("✅ Model Loaded Successfully")

    return processor, model, blank_token_id, device


def compute_real_score(diagnostics, analysis) -> int:
    try:
        predicted = analysis.get("predicted_phonemes", [])
        ground_truth = analysis.get("ground_truth_phonemes", [])

        if not ground_truth:
            return 0

        correct = 0

        for item in diagnostics:
            if isinstance(item, dict):
                if item.get("classification") == "CORRECT":
                    correct += 1

        total = len(ground_truth)

        score = int((correct / total) * 100)
        return score

    except Exception as e:
        print("Score calculation error:", str(e))
        return 0

def generate_realtime_feedback(analysis, diagnostics):
    """
    Generate real tutor-style feedback using model outputs.
    No hardcoding — uses predicted vs ground truth phonemes.
    """

    try:

        ground_truth = analysis.get("ground_truth_phonemes", [])
        predicted = analysis.get("predicted_phonemes", [])

        feedback_messages = []

        # missing phonemes
        if len(predicted) < len(ground_truth):
            missing = ground_truth[len(predicted):]
            feedback_messages.append(
                f"You missed the sound: {' '.join(missing)}"
            )

        # extra phonemes
        if len(predicted) > len(ground_truth):
            extra = predicted[len(ground_truth):]
            feedback_messages.append(
                f"Extra sound detected: {' '.join(extra)}"
            )

        # substitution errors from diagnostics
        for d in diagnostics:
            if isinstance(d, dict):
                if d.get("classification") == "INCORRECT":
                    phoneme = d.get("phoneme")
                    feedback_messages.append(
                        f"Try improving pronunciation of '{phoneme}'"
                    )

        if not feedback_messages:
            return "Excellent pronunciation! All phonemes detected correctly."

        return " | ".join(feedback_messages)

    except Exception as e:
        print("Feedback generation error:", e)
        return "Pronunciation analyzed."


def process_audio(
    audio_path: str,
    ground_truth_text: str = "mAtApitfByAm jagato namo vAmArDajAnaye"
):
    """
    MAIN AI PIPELINE
    Frontend → FastAPI → This Function → Real Model → JSON Response
    """

    try:
        #  STEP 1: Load model (lazy)
        processor, model, blank_token_id, device = load_model()

        print(f" Loading audio: {audio_path}")

        # STEP 2: Load audio file
        loaded_audio = load_audio(audio_path)

        #  STEP 3: ASR + Phonetic Analysis (REAL MODEL)
        analysis = get_phonetic_analysis(
            processor,
            model,
            loaded_audio,
            ground_truth_text
        )

        print(" Analysis Output:", analysis)

        #  STEP 4: Phoneme scoring (GOP)
        scores = generate_overall_phoneme_scores(
            processor,
            model,
            blank_token_id,
            loaded_audio,
            ground_truth_text
        )

        #  STEP 5: Diagnosis using your real rules engine
        diagnostics = diagnose_errors_classification(scores, analysis)

        print(" Diagnostics Output:", diagnostics)

        #  STEP 6: Compute REAL dynamic score (NOT hardcoded)
        real_score = compute_real_score(diagnostics, analysis)
        feedback_text = generate_realtime_feedback(analysis, diagnostics)

        #  Save diagnostics (optional but useful)
        try:
            with open(DIAGNOSTICS_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(
                    {
                        "diagnostics": diagnostics,
                        "ground_truth_text": ground_truth_text
                    },
                    f,
                    indent=4
                )
        except Exception as save_error:
            print(" Could not save diagnostics:", str(save_error))

        #  HANDLE BOTH LIST & DICT FORMAT (VERY IMPORTANT FIX)
        if isinstance(diagnostics, list):
            phoneme_feedback = diagnostics
        elif isinstance(diagnostics, dict):
            phoneme_feedback = diagnostics.get("errors", [])
        else:
            phoneme_feedback = []

        #  FINAL RESPONSE TO FRONTEND (MATCHES modelApi.ts)
        result = {
            "score": real_score,
            "overall_feedback": feedback_text,
            "transcription": analysis.get("transcription", "No transcription"),
            "phoneme_feedback": phoneme_feedback
        }

        print("✅ Final API Response:", result)
        return result

    except Exception as e:
        print(" MODEL ERROR:", str(e))
        return {
            "score": 0,
            "overall_feedback": f"Model error: {str(e)}",
            "transcription": "No transcription",
            "phoneme_feedback": []
        }

    finally:
        #  Memory cleanup (important for large AI models)
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()