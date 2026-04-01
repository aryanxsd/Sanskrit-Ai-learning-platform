# Sanskrit Pronunciation Assessment and Diagnostic System

This repository contains the implementation of a Computer-Assisted Pronunciation Training (CAPT) system specifically designed for learners of Sanskrit.The system analyzes a user's speech to detect and diagnose specific phonetic errors, providing detailed, actionable feedback. 

## 📋 Table of Contents
- [System Overview](#-system-overview)
- [Features](#-features)
- [Methodology](#-methodology)
  - [Speech-to-Phoneme Model](#speech-to-phoneme-model)
  - [Dataset](#dataset)
  - [Hybrid Scoring Model](#hybrid-scoring-model)
- [Rule-Based Diagnosis](#-rule-based-diagnosis)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)

---

## 🏛️ System Overview

This project implements the core functions of a modern CAPT system, which include Mispronunciation Detection and Diagnosis (MDD) to pinpoint specific phonetic errors.  It is composed of three main components:

1.  **Acoustic Front-End**: Converts the user's audio waveform into a sequence of phonemes. 
2.  **Detection Core**: Compares the user's phoneme sequence against the canonical pronunciation to identify errors like substitutions, deletions, and insertions.
3.  **Diagnostic Back-End**: Interprets the identified errors and generates meaningful, instructive feedback for the learner. 

---

## ✨ Features

* **Speech-to-Phoneme Conversion**: Transforms raw audio into its phonetic representation using a finetuned ASR model. 
* **Alignment-Free GOP Calculation**: Assigns a Goodness of Pronunciation (GOP) score to each phoneme without requiring a strict time alignment, indicating how well it was pronounced.
* **Multi-Metric Hybrid Scoring**: Generates a rich feature vector for each phoneme, including baseline GOP, logit margin, and logit variance, to overcome the limitations of a single GOP score. 
* **Rule-Based Diagnostic Engine**: Uses the hybrid scores to diagnose specific, common phonological errors (e.g., De-aspiration, Vowel Shortening).
* **Interactive Web Application**: A user-friendly interface built with Streamlit for easy interaction.

---

## 🔬 Methodology

### Speech-to-Phoneme Model 

The system is built upon a Wav2Vec2-based architecture, specifically Facebook's Wav2Vec2-XLSR-53, which is ideal because its frame-level logits can be used to calculate GOP scores indirectly. This base model was finetuned on the Vāksañcayaḥ - Sanskrit ASR Corpus to function as a speech-to-phoneme model.

The task is simplified for the phonetically consistent Sanskrit language by using SLP1 encoding. An SLP1 word like DarmaH directly and unambiguously maps to the phoneme sequence D-a-r-m-a-H, allowing the model to be trained as a Speech-to-SLP1 text model.

The base model was pretrained on 16kHz-sampled speech audio, so any speech input must also be sampled at 16kHz.

Base Model Link:  https://huggingface.co/facebook/wav2vec2-large-xlsr-53

### Dataset

The Base model was finetuned on a custom-balanced subset of the **Vāksañcayaḥ - Sanskrit ASR Corpus**. 

* **Corpus**: Contains over 78 hours of Sanskrit readings from various texts and contemporary sources. 
* **Balanced Subset**: To ensure model generalization, a subset of **8,766 audio files** was created. This subset includes a balanced mix of male and female speakers from diverse linguistic backgrounds (Tamil, Telugu, Kannada, etc.).

| Language | Male | Female | Total |
| :--- | :--- | :--- | :--- |
| Telugu | 517 | 941 | 1458 |
| Malayalam | 494 | 737 | 1231 |
| Tamil | 107 | 1300 | 1407 |
| Kannada | 1747 | – | 1747 |
| Marathi | – | 612 | 612 |
| Others | 1221 | 1090 | 2311 |
| **Count** | **4086** | **4680** | **8766** |



### Hybrid Scoring Model

To overcome the limitations of a single GOP score, this system uses a logit-based, multi-metric engine that computes a feature vector for each phoneme. This allows the system to move from simple detection to detailed diagnosis. 

The feature vector includes:
* **GOP-DNN**: The conventional log posterior probability, serving as a baseline acoustic match score. 
* **GOP-Margin**: Quantifies the separation between the target phoneme and its strongest competitor, making it powerful for diagnosing substitutions. 
* **GOP-Var-Logit**: Measures the stability of the model's confidence over time, indicating hesitant or inconsistent articulation.

This model operates on the principle of **Restricted Phoneme Substitution (RPS)**, constraining the analysis to phonetically plausible error pairs to remain computationally efficient. 

---

## ⚙️ Rule-Based Diagnosis

The multi-metric score vectors are fed into a rule-based engine that identifies the specific nature of a mispronunciation. The engine uses a series of `if/elif` checks on the score vector to classify errors.

**Example Logic:**
1.  **Classification**: A phoneme is first classified as `CORRECT`, `IMPRECISE`, or `INCORRECT` based on its `GOP-DNN` score against high and low thresholds.
2.  **Diagnosis**: If `INCORRECT`, the rule engine is triggered.
    * It checks for **substitution errors** by analyzing the `GOP-Margin` and `strongest_competitor`. For example, if the target is an aspirated consonant like `'bh'` and the strongest competitor is `'b'` with a low margin, the error is diagnosed as **'De-aspiration'**.
    * It checks for **omissions** and **insertions** by comparing the ASR transcription sequence with the canonical sequence using the Levenshtein algorithm.

---

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/saitharshith/mispronunciation-detection-diagnosis.git
    cd mispronunciation-detection-diagnosis
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Linux/macOS
    python3 -m venv .venv
    source .venv/bin/activate

    # For Windows
    python -m venv .venv
    .venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

---

## ▶️ Usage

1.  Ensure your fine-tuned Wav2Vec2 model is located in the `saved_model` directory.
2.  Run the Streamlit application from your terminal:
    ```bash
    streamlit run main_app.py
    ```
3.  Open the provided URL in your browser, enter the canonical Sanskrit text, upload your audio recording, and click "Analyze Pronunciation."

---





