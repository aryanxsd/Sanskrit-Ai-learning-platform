import streamlit as st
import json
import os
from utils.util_file import SLP1_to_Dev
from TTS.playback_audio_TTS import generate_audio


st.set_page_config(
    page_title="🎧 Correct Pronunciation Audio Generator",
    layout="wide",
    page_icon="🎧"
)

st.markdown("""
<style>
    .title {
        font-size: 40px;
        font-weight: 700;
        text-align: center;
        color: #4A2F2A;
        margin-bottom: 5px;
    }
    .subtitle {
        font-size: 18px;
        text-align: center;
        color: #333;
        margin-bottom: 25px;
    }
    .section-box {
        background: #FFF9F2;
        padding: 20px;
        border-left: 5px solid #D2691E;
        border-radius: 10px;
        margin-bottom: 25px;
    }
    .result-box {
        background: #F0F7FF;
        padding: 20px;
        border-left: 5px solid #1E90FF;
        border-radius: 10px;
        margin-top: 15px;
    }
    hr {
        border: 0;
        height: 1px;
        background: #ccc;
        margin: 30px 0;
    }
</style>
""", unsafe_allow_html=True)


st.markdown('<div class="title">🎧 Correct Pronunciation Audio Generator</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Generate audio *only* for the incorrectly pronounced parts based on your diagnosis report.</div>', unsafe_allow_html=True)

st.markdown('<div class="section-box">', unsafe_allow_html=True)

if st.button("🔄 Load Diagnostics & Generate Audio", use_container_width=True):
    try:
        # Load diagnostics file
        with open("diagnostics.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        diagnostics = data.get("diagnostics", [])
        ground_truth_text = data.get("ground_truth_text", "")

        # Extract incorrect phonemes
        incorrect_phonemes = [
            diag["phoneme"]
            for diag in diagnostics
            if diag.get("classification") == "INCORRECT"
        ]

        if not incorrect_phonemes:
            st.success("🎉 No incorrect pronunciations detected! Perfect pronunciation 🎤✨")
        else:

            dev_text = SLP1_to_Dev("".join(ground_truth_text).replace("|", " "))

            st.markdown('<div class="result-box">', unsafe_allow_html=True)
            st.markdown("### ❌ Incorrect Pronounced Region (Devanagari)")
            st.write(f"**{dev_text}**")
            st.markdown('</div>', unsafe_allow_html=True)
            st.info("🎧 Generating audio focusing on the mispronounced parts...")
            with st.spinner("Creating audio..."):
                audio_path = generate_audio(dev_text)

                if audio_path and os.path.exists(audio_path):
                    st.audio(audio_path)
                    st.success("✅ Audio generated successfully!")
                else:
                    st.error("❌ Audio generation failed. No valid file received.")

    except FileNotFoundError:
        st.error("❌ Diagnostics file missing! Please run the main pronunciation analyzer first.")
    except Exception as e:
        st.error(f"⚠️ Unexpected Error: {str(e)}")

st.markdown('</div>', unsafe_allow_html=True)

st.markdown("""
<hr>
<div style='text-align:center; color:#666;'>
Sanskrit Pronunciation Coach • Incorrect Pronunciation Audio Generator • 2025
</div>
""", unsafe_allow_html=True)
