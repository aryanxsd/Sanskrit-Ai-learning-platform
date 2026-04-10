# 🕉 Sanskrit AI Learning Platform

An AI-powered Sanskrit pronunciation tutor that provides real-time phoneme-level feedback using speech recognition and machine learning.

---

##  Overview

This project is a full-stack AI application designed to help users learn Sanskrit pronunciation accurately. Unlike traditional learning apps, this system analyzes speech at the phoneme level and provides detailed feedback on pronunciation.

---

##  Features

*  Real-time audio recording from browser
*  AI-based pronunciation analysis
*  Phoneme-level error detection
*  Accuracy scoring using AI model
*  Level-based assignments (Beginner → Advanced)
*  Full-stack integration (Frontend + Backend + AI)

---

##  How It Works

1. User selects a Sanskrit sentence from the assignment page
2. User records pronunciation using microphone
3. Audio is converted to WAV format in frontend
4. Audio + target sentence sent to backend API
5. AI model processes audio and extracts phonemes
6. Predicted phonemes are compared with expected phonemes
7. System calculates pronunciation accuracy
8. Detailed feedback is generated and shown in UI

---

##  Tech Stack

### Frontend

* React (TypeScript)
* Tailwind CSS
* Web Audio API

### Backend

* FastAPI
* Python

### AI Model

* Wav2Vec2 (speech recognition model)
* Phoneme alignment
* GOP (Goodness of Pronunciation) scoring

---

##  Project Structure

```
sanskrit-tutor/
│
├── Frontend/              # React application
│
├── model/                 # FastAPI + AI model
│   ├── api.py
│   ├── main_app.py
│   ├── speech_processing/
│   ├── diagnosis/
│
├── README.md
└── .gitignore
```

---

## ⚙️ Setup & Run Locally

### 1️ Clone Repository

```
git clone https://github.com/aryanxsd/Sanskrit-Ai-learning-platform.git
cd Sanskrit-Ai-learning-platform
```

---

### 2️ Backend Setup

```
cd model
python3 -m venv venv
source venv/bin/activate

pip install fastapi uvicorn torch transformers librosa

uvicorn api:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

### 3️ Frontend Setup

```
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

##  API Endpoint

### POST /analyze

**Input:**

* audio (WAV file)
* target_text (Sanskrit sentence in romanized form)

**Output:**

```json
{
  "score": 85,
  "transcription": "om",
  "overall_feedback": "Good pronunciation, slight vowel issue",
  "phoneme_feedback": []
}
```

---

##  Important Notes

* Model files are not included in this repository due to size
* Place your trained model inside:

```
model/xlsr-53-saved-model/
```

---

##  Vision

To build a Duolingo-like AI tutor specifically for Sanskrit, powered by real speech intelligence and phoneme-level feedback.

---

##  Key Innovation

> This system uses phoneme-level alignment and Goodness of Pronunciation (GOP) scoring instead of basic speech-to-text comparison.

---

##  Author

Priyanshu Aryan
Founder & CEO — Valaxia LLP

---

##  Future Improvements

*  AI conversation mode
*  Progress tracking
*  Gamification
*  Live deployment

---

## 📜 License

This project is for academic and research purposes.
