import torch
import soundfile as sf
from diagnosis.linguistic_knowledge import *
import json
import Levenshtein


def get_phoneme_segment_details(phoneme_score_vectors: list, index: int) -> dict:
    """
    Retrieves the detailed score vector for a phoneme segment at a given index.
    In a real system, this would be more complex, mapping ASR output segments
    to their full scores. For this exercise, we assume phoneme_score_vectors
    is already aligned with the ground truth for correct/replace operations,
    and separate entries for insertions.
    """
    if 0 <= index < len(phoneme_score_vectors):
        return phoneme_score_vectors[index]
    return {
        'Phoneme': 'UNKNOWN',
        'GOP_AF': -999.0, 
        'GOP_Margin': -999.0,
        'Strongest_Competitor': 'N/A'
    }


def run_substitution_rule_engine(score_vector: dict) -> dict:
    MARGIN_THRESHOLD = 0.3 
    target_phoneme = score_vector.get('Phoneme')
    gop_margin = score_vector.get('GOP_Margin')
    strongest_competitor = score_vector.get('Strongest_Competitor')
    
    # --- 1. Aspiration Errors ---
    if target_phoneme in ASPIRATED_CONSONANTS and strongest_competitor == DEASPIRATION_MAP.get(target_phoneme):
        return {'type': 'De-aspiration', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in UNASPIRATED_CONSONANTS and strongest_competitor == HYPER_ASPIRATION_MAP.get(target_phoneme):
        return {'type': 'Hyper-aspiration', 'details': {'confused_with': strongest_competitor}}

    # --- 2. Vowel Length Errors ---
    elif target_phoneme in LONG_VOWELS and strongest_competitor == VOWEL_SHORTENING_MAP.get(target_phoneme):
        return {'type': 'Vowel Shortening', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in SHORT_VOWELS and strongest_competitor == VOWEL_LENGTHENING_MAP.get(target_phoneme):
        return {'type': 'Vowel Lengthening', 'details': {'confused_with': strongest_competitor}}

    # --- 3. Voicing Errors (Stops only) ---
    elif target_phoneme in VOICING_MAP_STOPS and strongest_competitor == VOICING_MAP_STOPS.get(target_phoneme):
        return {'type': 'Voicing Error (Unvoiced to Voiced)', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in DEVOICING_MAP_STOPS and strongest_competitor == DEVOICING_MAP_STOPS.get(target_phoneme):
        return {'type': 'De-voicing Error (Voiced to Unvoiced)', 'details': {'confused_with': strongest_competitor}}

    # --- 4. Place of Articulation Errors - Specific Consonants (Stops/Nasals) ---
    elif target_phoneme in RETROFLEX_TO_DENTAL_MAP and strongest_competitor == RETROFLEX_TO_DENTAL_MAP.get(target_phoneme):
        return {'type': 'Place Shift: Retroflex to Dental', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in DENTAL_TO_RETROFLEX_MAP and strongest_competitor == DENTAL_TO_RETROFLEX_MAP.get(target_phoneme):
        return {'type': 'Place Shift: Dental to Retroflex', 'details': {'confused_with': strongest_competitor}}

    # --- 5. Place of Articulation Errors - Sibilants ---
    elif target_phoneme in SIBILANT_PALATAL_TO_DENTAL_MAP and strongest_competitor == SIBILANT_PALATAL_TO_DENTAL_MAP.get(target_phoneme):
        return {'type': 'Sibilant Place Shift: Palatal to Dental', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in SIBILANT_RETROFLEX_TO_DENTAL_MAP and strongest_competitor == SIBILANT_RETROFLEX_TO_DENTAL_MAP.get(target_phoneme):
        return {'type': 'Sibilant Place Shift: Retroflex to Dental', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in SIBILANT_PALATAL_TO_RETROFLEX_MAP and strongest_competitor == SIBILANT_PALATAL_TO_RETROFLEX_MAP.get(target_phoneme):
        return {'type': 'Sibilant Place Shift: Palatal to Retroflex', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in SIBILANT_RETROFLEX_TO_PALATAL_MAP and strongest_competitor == SIBILANT_RETROFLEX_TO_PALATAL_MAP.get(target_phoneme):
        return {'type': 'Sibilant Place Shift: Retroflex to Palatal', 'details': {'confused_with': strongest_competitor}}

    # --- 6. R-Vowel Simplification (Vowel Quality) ---
    elif target_phoneme in R_VOWEL_SIMPLIFICATION_MAP and strongest_competitor == R_VOWEL_SIMPLIFICATION_MAP.get(target_phoneme):
        return {'type': 'R-Vowel Simplification', 'details': {'confused_with': strongest_competitor}}
    elif target_phoneme in R_VOWEL_OVERCOMPLICATION_MAP and strongest_competitor == R_VOWEL_OVERCOMPLICATION_MAP.get(target_phoneme):
        return {'type': 'R-Vowel Overcomplication', 'details': {'confused_with': strongest_competitor}}
    
    elif target_phoneme == "M" and strongest_competitor == ANUSVARA_SUBSTITUTION_MAP.get("M"): # Check if 'M' was replaced by 'n'
        return {'type': 'Anusvara Simplification', 'details': {'confused_with': strongest_competitor}}
    
    elif strongest_competitor != 'N/A' and gop_margin is not None and gop_margin < MARGIN_THRESHOLD:
        return {
            'type': 'Imprecise Pronunciation', 
            'details': {
                'reason': 'The phoneme was weakly pronounced and almost confused with another sound.',
                'strongest_competitor': strongest_competitor,
                'gop_margin': gop_margin
            }
        }
    return {
        'type': 'Abnormal Substitution Error',
        'details': {'strongest_competitor': strongest_competitor}
    }


def diagnose_errors_classification(phoneme_score_vectors: list, result: dict) -> list:
    """
    Classifies each phoneme and runs the rule engine for incorrect ones.
    This corrected version uses Levenshtein.opcodes to handle all
    operations (equal, replace, insert, delete) and works with
    lists of phonemes to support multi-character phonemes.
    """ 
    ground_truth_phonemes = result["ground_truth_phonemes"] 
    predicted_phonemes = result["predicted_phonemes"]    
    
    diagnoses_gt_aligned = []
    for i, gt_ph in enumerate(ground_truth_phonemes):
        vector = get_phoneme_segment_details(phoneme_score_vectors, i)
        diagnoses_gt_aligned.append({
            'phoneme': gt_ph, 
            'classification': "CORRECT", # Assume correct
            'error_type': None,
            'details': {},
            'gop_score': vector['GOP_AF'],
            'gop_margin': vector['GOP_Margin'],
            'strongest_competitor': vector['Strongest_Competitor']
        })
    
    opcodes = Levenshtein.opcodes(predicted_phonemes, ground_truth_phonemes)
    
    final_diagnoses = []
    for op_type, pred_start, pred_end, gt_start, gt_end in opcodes:

        if op_type == "equal":
            for i in range(gt_start, gt_end):
                final_diagnoses.append(diagnoses_gt_aligned[i])

        elif op_type == "replace":
            for i in range(gt_start, gt_end):
                vector = diagnoses_gt_aligned[i]
                substitution_error = run_substitution_rule_engine(vector)
                vector.update({
                        "classification": "INCORRECT",
                        "error_type": substitution_error['type'],
                        "details": substitution_error['details']
                    })
                
                final_diagnoses.append(vector)

        elif op_type == 'insert': 
            for i in range(pred_start, pred_end):
                inserted_phoneme = predicted_phonemes[i]
                if inserted_phoneme == '|': 
                    final_diagnoses.append({
                        "phoneme": "|",
                        "classification": "INCORRECT",
                        "error_type": "Unnatural Pause/Space",
                        "details": {"reason": "An unscripted pause was detected."}
                    })
                else:
                    final_diagnoses.append({
                        "phoneme": inserted_phoneme,
                        "classification": "INCORRECT",
                        "error_type": "Insertion",
                        "details": {"inserted_phoneme": inserted_phoneme}
                    })

        elif op_type == 'delete': 
            for i in range(gt_start, gt_end):
                omitted_phoneme = ground_truth_phonemes[i]
                vector = diagnoses_gt_aligned[i] 
                if omitted_phoneme == 'H':
                     vector.update({
                        "classification": "INCORRECT",
                        "error_type": "Visarga Deletion",
                        "details": {"missing_phoneme": omitted_phoneme}
                    })
                else:
                    vector.update({
                        "classification": "INCORRECT",
                        "error_type": "Omission",
                        "details": {"missing_phoneme": omitted_phoneme}
                    })
                final_diagnoses.append(vector)
    for diag in final_diagnoses:
        diag.pop('gop_score', None)
        diag.pop('gop_margin', None)
        diag.pop('strongest_competitor', None)
        
    return final_diagnoses