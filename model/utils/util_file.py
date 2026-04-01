import torch
import torchaudio
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

def load_audio (file_path):
    waveform, sample_rate = torchaudio.load(file_path)
    if sample_rate != 16000:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = resampler(waveform)
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)
    return waveform.squeeze()

def SLP1_to_Dev (slp1_text):
    devanagari_text = transliterate(slp1_text, sanscript.SLP1, sanscript.DEVANAGARI)
    return devanagari_text

def Dev_to_slp1 (dev_text):
    slp1_text = transliterate(dev_text, sanscript.DEVANAGARI, sanscript.SLP1)
    return slp1_text

def RPS_matrix ():
    RPS_MATRIX = {
    # Vowel Lengthening/Shortening Errors
    "a": ["A"],
    "A": ["a"],
    "i": ["I"],
    "I": ["i"],
    "u": ["U"],
    "U": ["u"],
    "f": ["F"], 
    "F": ["f"],
    "x": ["X"],
    "X": ["x"],
    # Aspiration Errors (Deaspiration & Hyper-aspiration)
    "kh": ["k"],
    "gh": ["g"],
    "ch": ["c"],
    "jh": ["j"],
    "Wh": ["W"], 
    "qh": ["q"],
    "th": ["t"],
    "dh": ["d"],
    "ph": ["p"],
    "bh": ["b"],
    "k": ["kh"],
    "g": ["gh"],
    "c": ["ch"],
    "j": ["jh"],
    "W": ["Wh"],
    "q": ["qh"],
    "t": ["th"],
    "d": ["dh"],
    "p": ["ph"],
    "b": ["bh"],
    # Place of Articulation Errors (Retroflex to Dental)
    "W": ["t", "Wh"], 
    "Wh": ["th", "W"],
    "q": ["d", "qh"],
    "qh": ["dh", "q"],
    "R": ["n"], 
    # Sibilant Errors (Palatal/Retroflex to Dental)
    "S": ["s"], 
    "z": ["s"], 
    # Visarga Errors
    "H": [""] 
                    }
    return RPS_MATRIX