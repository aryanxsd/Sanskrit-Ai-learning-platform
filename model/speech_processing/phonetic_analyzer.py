import torch
from transformers import (
    Wav2Vec2CTCTokenizer,
    Wav2Vec2FeatureExtractor,
    Wav2Vec2Processor,
    AutoModelForCTC
)
from utils.util_file import RPS_matrix

@torch.inference_mode()
def load_model_and_processor(model_path: str):
    """Load tokenizer, feature extractor, processor, and model."""
    tokenizer = Wav2Vec2CTCTokenizer.from_pretrained(model_path)
    feature_extractor = Wav2Vec2FeatureExtractor(
        feature_size=1,
        sampling_rate=16000,
        padding_value=0.0,
        do_normalize=True,
        return_attention_mask=False
    )
    processor = Wav2Vec2Processor(feature_extractor=feature_extractor, tokenizer=tokenizer)
    model = AutoModelForCTC.from_pretrained(model_path, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
    model.eval()
    blank_token_id = model.config.pad_token_id
    return processor, model, blank_token_id

@torch.inference_mode()
def get_model_prediction(processor, model, input_audio: torch.Tensor):
    """Run model inference and decode phonemes."""
    input_values = processor(input_audio, return_tensors="pt", sampling_rate=16000).input_values
    logits = model(input_values).logits
    log_probs = torch.nn.functional.log_softmax(logits, dim=-1)
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription_str = processor.batch_decode(predicted_ids)[0]
    predicted_phonemes = list(transcription_str.replace(" ", "|"))
    return {
        "predicted_phonemes": predicted_phonemes,
        "log_probs": log_probs,
        "logits": logits,
        "transcription": transcription_str
    }

def calculate_gop_score(log_probs, phoneme_ids, target_idx, blank_token_id):
    """Compute GOP (Goodness of Pronunciation) acoustic likelihood difference."""
    try:
        log_probs_for_loss = log_probs.permute(1, 0, 2)
        input_lengths = torch.tensor([log_probs_for_loss.shape[0]])
        ctc_loss_fn = torch.nn.CTCLoss(blank=blank_token_id, reduction='sum', zero_infinity=True)
        targets = torch.tensor(phoneme_ids, dtype=torch.long)
        target_lengths = torch.tensor([len(phoneme_ids)])
        nll_canonical = ctc_loss_fn(log_probs_for_loss, targets, input_lengths, target_lengths)
        modified_ids = phoneme_ids[:target_idx] + phoneme_ids[target_idx + 1:]
        if modified_ids:
            modified_targets = torch.tensor(modified_ids, dtype=torch.long)
            modified_lengths = torch.tensor([len(modified_ids)])
            nll_modified = ctc_loss_fn(log_probs_for_loss, modified_targets, input_lengths, modified_lengths)
        else:
            nll_modified = torch.tensor(0.0)

        return (nll_modified - nll_canonical).item()
    except Exception:
        return float("nan")


def calculate_gop_margin(processor, logits: torch.Tensor, target_phoneme: str):
    """Compute GOP margin between target phoneme and strongest competitor."""
    rps_set = RPS_matrix().get(target_phoneme, [])
    if not rps_set:
        return float("inf"), "N/A"

    try:
        target_id = processor.tokenizer.convert_tokens_to_ids(target_phoneme)
        competitor_ids = processor.tokenizer.convert_tokens_to_ids(rps_set)
        max_target = torch.max(logits[:, :, target_id]).item()

        max_competitor = -float("inf")
        strongest_comp = "N/A"
        for i, comp_id in enumerate(competitor_ids):
            max_comp = torch.max(logits[:, :, comp_id]).item()
            if max_comp > max_competitor:
                max_competitor = max_comp
                strongest_comp = rps_set[i]

        return max_target - max_competitor, strongest_comp
    except Exception:
        return float("nan"), "N/A"


def calculate_gop_var_logit(processor, logits: torch.Tensor, target_phoneme: str):
    """Compute variance of logit activations for a phoneme."""
    try:
        target_id = processor.tokenizer.convert_tokens_to_ids(target_phoneme)
        return torch.var(logits[0, :, target_id]).item()
    except Exception:
        return float("nan")

def generate_overall_phoneme_scores(processor, model, blank_token_id, loaded_audio: torch.Tensor, canonical_transcript: str):
    """Compute GOP, margin, and variance scores for all phonemes in the input."""
    pred = get_model_prediction(processor, model, loaded_audio)
    logits, log_probs = pred['logits'], pred['log_probs']
    phonemes = list(canonical_transcript.replace(" ", "|"))
    phoneme_ids = processor.tokenizer.convert_tokens_to_ids(phonemes)

    results = []
    for i, p in enumerate(phonemes):
        gop_af = calculate_gop_score(log_probs, phoneme_ids, i, blank_token_id)
        gop_margin, competitor = calculate_gop_margin(processor, logits, p)
        var_logit = calculate_gop_var_logit(processor, logits, p)
        results.append({
            "Phoneme": p,
            "GOP_AF": gop_af,
            "GOP_Margin": gop_margin,
            "Strongest_Competitor": competitor,
            "Var_Logit": var_logit
        })
    return results

def get_phonetic_analysis(processor, model, loaded_audio: torch.Tensor, ground_truth_text: str):
    """End-to-end phonetic analysis pipeline."""
    gt_phonemes = list(ground_truth_text.replace(" ", "|"))
    prediction = get_model_prediction(processor, model, loaded_audio)
    return {
        "transcription": prediction['transcription'],
        "ground_truth_phonemes": gt_phonemes,
        "predicted_phonemes": prediction['predicted_phonemes'],
        "ground_truth_text": ground_truth_text
    }
