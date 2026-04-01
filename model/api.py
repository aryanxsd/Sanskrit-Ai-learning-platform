from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os

from main_app import process_audio

app = FastAPI(title="Sanskrit Pronunciation AI")

# Allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Pronunciation Model API Running"}

#  UPDATED: Now accepts target_text for AI tutor mode
from fastapi import Form

@app.post("/analyze")
async def analyze_audio(
    audio: UploadFile = File(...),
    target_text: str = Form(...)
):

    temp_filename = f"temp_{uuid.uuid4()}.wav"

    # Save uploaded audio
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    try:
        print(f" Target Lesson Text: {target_text}")

        #  Pass assignment sentence to AI model
        result = process_audio(
            audio_path=temp_filename,
            ground_truth_text=target_text
        )

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

    return result