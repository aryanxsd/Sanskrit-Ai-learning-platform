import json
import math
from fpdf import FPDF # Not used in this particular script, but kept from original
import os

FEEDBACK_RULES = {
    # --- Aspiration Errors ---
    "De-aspiration": {
        "title": "🗣️ Aspiration Error (De-aspiration)",
        "what_i_heard": "It sounds like you pronounced the phoneme **{phoneme}** without the required 'puff of air.' It sounded more like **{details[confused_with]}**.",
        "the_difference": "In Sanskrit, **{phoneme}** is an **aspirated** sound, meaning you must release a strong puff of air, like the 'p-h' in the English word 'pot-hook.' The sound **{details[confused_with]}** is **unaspirated**, meaning it's spoken without that puff of air. This distinction changes meaning!",
        "how_to_fix": "Practice this: Hold your hand or a small piece of paper about an inch from your mouth. When you say **{phoneme}** correctly, you should feel a strong puff of air hit your hand. When you say **{details[confused_with]}**, you should feel almost nothing. Exaggerate the breath release."
    },
    "Hyper-aspiration": {
        "title": "🗣️ Aspiration Error (Hyper-aspiration)",
        "what_i_heard": "It sounds like you added an extra 'puff of air' to the phoneme **{phoneme}**, making it sound like **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** is an **unaspirated** sound, meaning it should be spoken clearly without an extra puff of air. The sound **{details[confused_with]}** is **aspirated**. Adding aspiration can change the word's meaning or make it unintelligible.",
        "how_to_fix": "Practice making the sound short and clear. Try to say **{phoneme}** without pushing any air from your lungs after the sound is formed. Focus on a crisp, light articulation."
    },

    # --- Vowel Length Errors ---
    "Vowel Shortening": {
        "title": "⏱️ Vowel Length Error (Shortening)",
        "what_i_heard": "It sounds like you pronounced the long vowel **{phoneme}** as a short vowel, like **{details[confused_with]}**.",
        "the_difference": "The long vowel **{phoneme}** (e.g., in 'k**ā**nta') should be held for about **twice as long** as its short counterpart **{details[confused_with]}** (e.g., in 'k**a**nta'). This duration is crucial in Sanskrit and often changes word meaning.",
        "how_to_fix": "Practice feeling the duration. Try saying '{phoneme}' and count 'one-two' in your head. Then, say '{details[confused_with]}' and count 'one.' Sustain the sound slightly longer with relaxed articulation."
    },
    "Vowel Lengthening": {
        "title": "⏱️ Vowel Length Error (Lengthening)",
        "what_i_heard": "It sounds like you held the short vowel **{phoneme}** for too long, making it sound like the long vowel **{details[confused_with]}**.",
        "the_difference": "The short vowel **{phoneme}** should be very quick and crisp. The long vowel **{details[confused_with]}** is held for about twice as long. Incorrect lengthening can alter meaning.",
        "how_to_fix": "Practice making the **{phoneme}** sound quick and sharp. Think of it as 'touching' the sound rather than 'holding' it. Aim for a very precise, brief articulation."
    },

    # --- Voicing Errors ---
    "Voicing Error (Unvoiced to Voiced)": {
        "title": "🎶 Voicing Error (Unvoiced to Voiced)",
        "what_i_heard": "It sounds like you pronounced the unvoiced phoneme **{phoneme}** with vocal cord vibration, making it sound like its voiced counterpart **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** is an **unvoiced** sound (Aghoṣa), produced without vocal cord vibration. **{details[confused_with]}** is a **voiced** sound (Ghoṣa), requiring vibration. Feel the difference in your throat!",
        "how_to_fix": "Place your fingers on your throat. When saying **{phoneme}**, you should feel no vibration. For **{details[confused_with]}**, you should feel a buzz. Practice producing **{phoneme}** with a clear, voiceless articulation."
    },
    "De-voicing Error (Voiced to Unvoiced)": {
        "title": "🎶 De-voicing Error (Voiced to Unvoiced)",
        "what_i_heard": "It sounds like you pronounced the voiced phoneme **{phoneme}** without vocal cord vibration, making it sound like its unvoiced counterpart **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** is a **voiced** sound (Ghoṣa), requiring vocal cord vibration. **{details[confused_with]}** is **unvoiced** (Aghoṣa). This distinction is phonemic in Sanskrit.",
        "how_to_fix": "Place your fingers on your throat. When saying **{phoneme}**, you should feel a clear vibration. Practice sustaining the vibration throughout the production of **{phoneme}**, maintaining vocal energy."
    },

    # --- Place of Articulation Errors (Consonants) ---
    "Place Shift: Retroflex to Dental": {
        "title": "👅 Place Shift Error (Retroflex to Dental)",
        "what_i_heard": "It sounds like you pronounced the retroflex phoneme **{phoneme}** with your tongue touching your teeth, making it sound like a dental consonant **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** is a **retroflex** sound (Mūrdhanya). It requires curling your tongue back to touch the roof of your mouth. **{details[confused_with]}** is a **dental** sound (Dantya), made with the tongue touching the back of your front teeth. This is a critical distinction in Sanskrit!",
        "how_to_fix": "Curl your tongue back significantly for **{phoneme}**. Aim to touch the *middle* of the roof of your mouth (hard palate) with the *underside* of your tongue tip, or just behind the alveolar ridge, avoiding the teeth entirely. Exaggerate the curl."
    },
    "Place Shift: Dental to Retroflex": {
        "title": "👅 Place Shift Error (Dental to Retroflex)",
        "what_i_heard": "It sounds like you pronounced the dental phoneme **{phoneme}** with your tongue curled back, making it sound like a retroflex consonant **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** is a **dental** sound (Dantya), formed by touching the back of your front teeth. **{details[confused_with]}** is a **retroflex** sound (Mūrdhanya), requiring a curled-back tongue. Incorrect retroflexion of dental sounds is a common error.",
        "how_to_fix": "Keep your tongue tip touching the back of your upper front teeth (or just above them) for **{phoneme}**. Ensure your tongue does *not* curl back. Feel the gentle pressure against your teeth."
    },

    # --- Sibilant Place of Articulation Errors ---
    "Sibilant Place Shift: Palatal to Dental": {
        "title": "🌬️ Sibilant Error (Palatal 'ś' to Dental 's')",
        "what_i_heard": "It sounds like you pronounced the palatal sibilant **{phoneme}** like the dental sibilant **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** (ś) is a **palatal** sibilant, made with the tongue closer to the hard palate (like 'sh' in 'ship'). **{details[confused_with]}** (s) is a **dental** sibilant, made with the tongue near the front teeth (like 's' in 'sit').",
        "how_to_fix": "For **{phoneme}**, spread your lips slightly and raise the middle of your tongue towards the roof of your mouth, behind your teeth, creating a broader hiss. For **{details[confused_with]}**, keep your tongue flatter and closer to your front teeth."
    },
    "Sibilant Place Shift: Retroflex to Dental": {
        "title": "🌬️ Sibilant Error (Retroflex 'ṣ' to Dental 's')",
        "what_i_heard": "It sounds like you pronounced the retroflex sibilant **{phoneme}** like the dental sibilant **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** (ṣ) is a **retroflex** sibilant, requiring a curled-back tongue (like 'sh' in 'rush' but with more curl). **{details[confused_with]}** (s) is a **dental** sibilant. This is a very common error.",
        "how_to_fix": "Curl your tongue back for **{phoneme}**, much like for retroflex consonants. Position the tip behind the alveolar ridge (or further back on the palate), forming a hollow space under the tongue, and direct the air over the curled tip."
    },
    "Sibilant Place Shift: Palatal to Retroflex": {
        "title": "🌬️ Sibilant Error (Palatal 'ś' to Retroflex 'ṣ')",
        "what_i_heard": "It sounds like you pronounced the palatal sibilant **{phoneme}** like the retroflex sibilant **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** (ś) is **palatal** (tongue near hard palate), while **{details[confused_with]}** (ṣ) is **retroflex** (tongue curled back). The tongue position is different.",
        "how_to_fix": "Focus on keeping your tongue flatter for **{phoneme}** (ś) compared to the strong curl needed for **{details[confused_with]}** (ṣ). Listen carefully to the subtle difference in the hiss quality."
    },
    "Sibilant Place Shift: Retroflex to Palatal": {
        "title": "🌬️ Sibilant Error (Retroflex 'ṣ' to Palatal 'ś')",
        "what_i_heard": "It sounds like you pronounced the retroflex sibilant **{phoneme}** like the palatal sibilant **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** (ṣ) is **retroflex** (tongue curled back), while **{details[confused_with]}** (ś) is **palatal** (tongue closer to hard palate).",
        "how_to_fix": "Ensure a clear tongue curl for **{phoneme}** (ṣ). For **{details[confused_with]}** (ś), relax the tongue curl and raise the tongue body more towards the palate."
    },

    # --- R-Vowel Quality Errors ---
    "R-Vowel Simplification": {
        "title": "🌱 R-Vowel Error (Simplification of 'ṛ')",
        "what_i_heard": "It sounds like you simplified the vocalic 'ṛ' (long or short **{phoneme}**) by pronouncing it like a regular vowel, perhaps **{details[confused_with]}** (i) or 'ri'.",
        "the_difference": "The Sanskrit 'ṛ' vowel (short **{phoneme}** / long **{details[confused_with]}** if long 'ṝ') is a unique vocalic 'r' sound, not a simple 'i' or 'ri'. It's formed by placing the tongue as if for a retroflex 'r' but sustaining the vowel quality.",
        "how_to_fix": "Practice: Start with the English 'r' sound, then try to make it a sustained vowel without following it with another vowel. For **{phoneme}**, curl the tongue back for a retroflex position and try to hum, making the 'r' itself a vowel."
    },
     "R-Vowel Overcomplication": {
        "title": "🌱 R-Vowel Error (Overcomplication of 'i' to 'ṛ')",
        "what_i_heard": "It sounds like you pronounced the simple vowel **{phoneme}** as if it were the vocalic 'ṛ' vowel, **{details[confused_with]}**.",
        "the_difference": "**{phoneme}** is a straightforward vowel. **{details[confused_with]}** is a distinct vocalic 'r' sound that requires a specific tongue position and is not interchangeable.",
        "how_to_fix": "Ensure your tongue is not curling back for **{phoneme}**. It should be pronounced clearly and simply, like the 'i' in 'sit' (for short 'i') or 'machine' (for long 'I'), without any 'r'-like quality."
    },

    # --- General/Catch-all Errors ---
    "Insertion": {
        "title": "➕ Insertion Error (Extra Sound)",
        "what_i_heard": "You added an extra sound, **'{details[inserted_phoneme]}'**, where it wasn't expected in the word.",
        "the_difference": "The correct pronunciation of the word at this point does not include this phoneme. Adding extra sounds can alter the word's form and meaning.",
        "how_to_fix": "Focus on precise articulation and listen carefully to the rhythm and phoneme sequence of the reference audio. Aim to pronounce only the sounds that are present in the word."
    },
    "Omission": {
        "title": "➖ Omission Error (Missing Sound)",
        "what_i_heard": "The phoneme **'{phoneme}'** was missing from your pronunciation at this point in the word.",
        "the_difference": "This sound is a necessary part of the word's correct form. Omitting sounds can change meaning or make a word unrecognizable.",
        "how_to_fix": "Be mindful of every sound in the word. Practice by slowly enunciating each phoneme, ensuring none are left out. Use visual aids if available to track each required sound."
    },
    "IMPRECISE": {
        "title": "〰️ Imprecise Pronunciation",
        "what_i_heard": "You pronounced **{phoneme}**, but its clarity or strength was not optimal. It was identifiable but sounded weak or distorted.",
        "the_difference": "While the phoneme was identifiable, its acoustic qualities (like clarity, full duration for vowels, or distinctness for consonants) were not optimal, making it sound somewhat 'mumbled' or 'unclear.'",
        "how_to_fix": "Aim for a crisper, more deliberate pronunciation of **{phoneme}**. Ensure full articulatory effort. For vowels, hold them for their full duration; for consonants, ensure the point of articulation is firm and precise."
    },
    "Abnormal Substitution Error": {
        "title": "🔄 General Substitution Error",
        "what_i_heard": "The sound you made for **{phoneme}** was unclear or different from the target. It may have sounded like a different phoneme, possibly **{details[strongest_competitor]}**, or it was not clearly identifiable.",
        "the_difference": "The target sound **{phoneme}** has a specific place and manner of articulation unique to Sanskrit. A general substitution means you produced a sound that was not the target and didn't fit a common error pattern.",
        "how_to_fix": "Let's focus on the correct production of **{phoneme}**. Pay close attention to the position of your tongue, lips, and the way you manage airflow. Listen to the reference audio multiple times for this specific sound."
    },
    "FALLBACK": { 
        "title": "⚠️ Unclassified Error",
        "what_i_heard": "An error was detected on the phoneme **{phoneme}**, but the specific type of error could not be precisely identified.",
        "the_difference": "This might be a highly unusual substitution, a very distorted sound, or a combination of errors that didn't fit the established rules.",
        "how_to_fix": "Please listen carefully to the reference audio for **{phoneme}** and try to match it as closely as possible. If possible, record yourself again trying to exaggerate the correct pronunciation."
    }
}

def generate_markdown_report(diagnostics_json_path: str, output_md_path: str = "Pronunciation_Report.md") -> str:

    try:
        with open(diagnostics_json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        error_text = f"# Error\nCould not read or parse JSON file: {e}"
        with open(output_md_path, "w", encoding="utf-8") as f:
            f.write(error_text)
        return output_md_path

    diagnostics = data.get("diagnostics", [])
    ground_truth_text = data.get("ground_truth_text", "")

    if not isinstance(diagnostics, list):
        with open(output_md_path, "w", encoding="utf-8") as f:
            f.write("# Error\nInvalid JSON: 'diagnostics' must be a list.")
        return output_md_path
    
    total_analyzed_phonemes = 0
    correct_count = 0
    incorrect_count = 0

    error_type_counts = {
        "De-aspiration": 0, "Hyper-aspiration": 0,
        "Vowel Shortening": 0, "Vowel Lengthening": 0,
        "Voicing Error (Unvoiced to Voiced)": 0, "De-voicing Error (Voiced to Unvoiced)": 0,
        "Place Shift: Retroflex to Dental": 0, "Place Shift: Dental to Retroflex": 0,
        "Sibilant Place Shift: Palatal to Dental": 0, "Sibilant Place Shift: Retroflex to Dental": 0,
        "Sibilant Place Shift: Palatal to Retroflex": 0, "Sibilant Place Shift: Retroflex to Palatal": 0,
        "R-Vowel Simplification": 0, "R-Vowel Overcomplication": 0,"IMPRECISE": 0,
        "Insertion": 0, "Omission": 0,
        "Abnormal Substitution Error": 0,
        "FALLBACK": 0
    }

    report_parts = []
    items_for_detailed_feedback = []

    correctly_pronounced_list = []
    incorrectly_pronounced_list = []

    predicted_text_display_list = []

    for item in diagnostics:
        phoneme = item.get("phoneme", "")
        classification = item.get("classification")
        error_type = item.get("error_type")
        details = item.get("details", {})

        if error_type == "Omission":
            predicted_text_display_list.append(f"({phoneme})")
        elif error_type == "Insertion":
            inserted = details.get("inserted_phoneme", "?")
            predicted_text_display_list.append(f"[{inserted}]")
        elif phoneme and phoneme != "|" and not phoneme.isspace():
            predicted_text_display_list.append(phoneme)

        if not phoneme or phoneme.isspace() or phoneme == "|":
            if error_type == "Insertion":
                inserted = details.get("inserted_phoneme", "?")
                incorrect_count += 1
                incorrectly_pronounced_list.append(inserted)
                error_type_counts["Insertion"] += 1
                items_for_detailed_feedback.append(item)
            continue

        # Count this phoneme
        total_analyzed_phonemes += 1

        if classification == "CORRECT":
            correct_count += 1
            correctly_pronounced_list.append(phoneme)
            continue

        if classification == "IMPRECISE":
            items_for_detailed_feedback.append(item)
            continue

        if classification == "INCORRECT":
            incorrect_count += 1
            incorrectly_pronounced_list.append(phoneme)
            items_for_detailed_feedback.append(item)

            if error_type in error_type_counts:
                error_type_counts[error_type] += 1
            else:
                error_type_counts["FALLBACK"] += 1

    for item in diagnostics:
        if item.get("error_type") == "Omission":
            err = item["error_type"]
            error_type_counts[err] = error_type_counts.get(err, 0)

    mispronunciation_rate = (
        incorrect_count / total_analyzed_phonemes * 100
        if total_analyzed_phonemes else 0
    )

    report_parts.append("# 🌟 Your Sanskrit Pronunciation Report\n")

    if ground_truth_text:
        report_parts.append(f"### Reference Text:\n> {ground_truth_text}\n")

    report_parts.append(f"### Your Pronunciation:\n> {''.join(predicted_text_display_list)}\n")

    report_parts.append("## Overall Pronunciation Summary\n")
    report_parts.append(f"- **Total Phonemes Analyzed:** {total_analyzed_phonemes}")
    report_parts.append(f"- **Correctly Pronounced:** {correct_count}")
    report_parts.append(f"- **Incorrectly Pronounced:** {incorrect_count}")
    report_parts.append(f"- **Mispronunciation Rate:** **{mispronunciation_rate:.1f}%** (IMPRECISE ignored)\n")

    if mispronunciation_rate == 0:
        report_parts.append("🎉 **Perfect pronunciation!**")
    elif mispronunciation_rate < 10:
        report_parts.append("👍 **Excellent accuracy with very few mistakes.**")
    elif mispronunciation_rate < 25:
        report_parts.append("🙂 **Good — let’s refine certain sounds.**")
    else:
        report_parts.append("💡 **Many errors — review the feedback below to improve.**")

    report_parts.append("\n---\n")

    if any(count > 0 for count in error_type_counts.values()):
        report_parts.append("## 📊 Error-Type Breakdown")
        for etype, count in error_type_counts.items():
            if count > 0:
                report_parts.append(f"- **{FEEDBACK_RULES[etype]['title']}**: {count}")
        report_parts.append("\n---\n")

    if items_for_detailed_feedback:
        report_parts.append("## 💡 Detailed Feedback\n")

        for item in items_for_detailed_feedback:
            phoneme = item.get("phoneme", "?")
            error_type = item.get("error_type") or "FALLBACK"
            details = item.get("details", {})
            rule = FEEDBACK_RULES.get(error_type, FEEDBACK_RULES["FALLBACK"])

            if error_type == "Insertion":
                phoneme = details.get("inserted_phoneme", "?")

            report_parts.append(f"### {rule['title']} — **{phoneme}**")
            report_parts.append(f"* **What I Heard:** {rule['what_i_heard'].format(phoneme=phoneme, details=details)}")
            report_parts.append(f"* **The Difference:** {rule['the_difference'].format(phoneme=phoneme, details=details)}")
            report_parts.append(f"* **How to Fix:** {rule['how_to_fix'].format(phoneme=phoneme, details=details)}\n")
            report_parts.append("---")

    report_parts.append("\n## 🔤 Phoneme Summary")
    report_parts.append("### ✅ Correctly Pronounced")
    report_parts.append(" ".join(f"`{p}`" for p in correctly_pronounced_list) or "None")

    report_parts.append("\n### ❌ Incorrectly Pronounced")
    report_parts.append(" ".join(f"`{p}`" for p in incorrectly_pronounced_list) or "None")


    markdown_text = "\n".join(report_parts)

    with open(output_md_path, "w", encoding="utf-8") as f:
        f.write(markdown_text)

    return os.path.abspath(output_md_path)
