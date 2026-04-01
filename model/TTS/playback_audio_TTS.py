import torch
import soundfile as sf
import os
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
import streamlit as st
from huggingface_hub import login
import os  
login(token="--------")



@st.cache_resource(show_spinner=True)
def generate_audio(original_text: str):
    """
    Generate speech audio for a given text using ai4bharat/indic-parler-tts-pretrained.
    Returns the path to a saved .wav file.
    """
    if not original_text or not isinstance(original_text, str):
        raise ValueError("❌ Invalid input text for TTS generation.")

    try:
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        model_name = "ai4bharat/indic-parler-tts-pretrained"

        model = ParlerTTSForConditionalGeneration.from_pretrained(
            model_name, torch_dtype=torch.float32
        ).to(device)

        tokenizer = AutoTokenizer.from_pretrained(model_name)
        desc_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
        description = (
            "Aryan speaks slowly and clearly with a calm, natural tone in high-quality audio."
        )
        desc_inputs = desc_tokenizer(description, return_tensors="pt").to(device)
        prompt_inputs = tokenizer(original_text, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = model.generate(
                input_ids=desc_inputs.input_ids,
                attention_mask=desc_inputs.attention_mask,
                prompt_input_ids=prompt_inputs.input_ids,
                prompt_attention_mask=prompt_inputs.attention_mask,
            )
        audio_arr = outputs.cpu().numpy().squeeze()

        os.makedirs("outputs", exist_ok=True)
        output_path = os.path.join("outputs", "tts_correction.wav")
        sf.write(output_path, audio_arr, model.config.sampling_rate)
        del model, tokenizer, desc_tokenizer
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        return output_path

    except Exception as e:
        raise RuntimeError(f"TTS generation failed: {str(e)}")
