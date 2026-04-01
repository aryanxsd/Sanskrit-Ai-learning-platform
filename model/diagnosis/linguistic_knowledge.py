ASPIRATED_CONSONANTS = {'kh', 'gh', 'ch', 'jh', 'Wh', 'qh', 'th', 'dh', 'ph', 'bh'}
UNASPIRATED_CONSONANTS = {'k', 'g', 'c', 'j', 'W', 'q', 't', 'd', 'p', 'b'}
RETROFLEX_CONSONANTS = {'W', 'Wh', 'q', 'qh', 'R', 'z'} 
DENTAL_CONSONANTS = {'t', 'th', 'd', 'dh', 'n', 's'} 
PALATAL_CONSONANTS = {'c', 'ch', 'j', 'jh', 'Y', 'S'} 
SHORT_VOWELS = {'a', 'i', 'u', 'f', 'x'} 
LONG_VOWELS = {'A', 'I', 'U', 'F', 'X'} 
DIPHTHONGS = {'e', 'o', 'E', 'O'} 
SIBILANTS = {'S', 'z', 's'} 
# 1. Aspiration Errors (Phonological Feature)
DEASPIRATION_MAP = {
    "kh": "k", "gh": "g", "ch": "c", "jh": "j", "Wh": "W",
    "qh": "q", "th": "t", "dh": "d", "ph": "p", "bh": "b"
}
HYPER_ASPIRATION_MAP = {v: k for k, v in DEASPIRATION_MAP.items()}
# 2. Vowel Length Errors (Phonological Feature)
VOWEL_LENGTHENING_MAP = {"a": "A", "i": "I", "u": "U", "f": "F", "x": "X"}
VOWEL_SHORTENING_MAP = {v: k for k, v in VOWEL_LENGTHENING_MAP.items()}
# 3. Voicing Errors (Phonological Feature)
VOICING_MAP = {
    "k": "g", "c": "j", "W": "q", "t": "d", "p": "b",
    "kh": "gh", "ch": "jh", "Wh": "qh", "th": "dh", "ph": "bh",
}
VOICING_MAP_STOPS = {
    "k": "g", "c": "j", "W": "q", "t": "d", "p": "b",
    "kh": "gh", "ch": "jh", "Wh": "qh", "th": "dh", "ph": "bh"
}
DEVOICING_MAP_STOPS = {v: k for k, v in VOICING_MAP_STOPS.items()}

RETROFLEX_TO_DENTAL_MAP = {
    "W": "t", "Wh": "th", "q": "d", "qh": "dh", "R": "n"
}
DENTAL_TO_RETROFLEX_MAP = {v: k for k, v in RETROFLEX_TO_DENTAL_MAP.items()}
SIBILANT_PALATAL_TO_DENTAL_MAP = {
    "S": "s" 
}
SIBILANT_RETROFLEX_TO_DENTAL_MAP = {
    "z": "s" 
}
SIBILANT_PALATAL_TO_RETROFLEX_MAP = {
    "S": "z" 
}

SIBILANT_RETROFLEX_TO_PALATAL_MAP = {
    "z": "S" 
}
R_VOWEL_SIMPLIFICATION_MAP = {
    "f": "i", 
    "F": "I" 
}
R_VOWEL_OVERCOMPLICATION_MAP = {
    "i": "f", 
    "I": "F"  
}
ANUSVARA_SUBSTITUTION_MAP = {
    "M": "n", 
}
