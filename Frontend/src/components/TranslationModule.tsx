import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Volume2, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Comprehensive Sanskrit translation dictionaries
const sanskritToEnglish: Record<string, string> = {
  "ॐ": "Om - The sacred sound, cosmic vibration",
  "गुरु": "Guru - Teacher, spiritual guide", 
  "योग": "Yoga - Union of mind, body and spirit",
  "धर्म": "Dharma - Righteous duty, natural law",
  "कर्म": "Karma - Action, deed, law of cause and effect",
  "मन्त्र": "Mantra - Sacred formula, mystical verse",
  "विद्या": "Vidya - Knowledge, learning, wisdom",
  "शान्ति": "Shanti - Peace, tranquility",
  "आत्मा": "Atma - Soul, inner self",
  "सत्य": "Satya - Truth, reality",
  "अहिंसा": "Ahimsa - Non-violence, compassion",
  "प्रेम": "Prema - Divine love",
  "सूर्य": "Surya - Sun, solar deity",
  "चन्द्र": "Chandra - Moon, lunar deity",
  "वायु": "Vayu - Wind, air element",
  "पृथ्वी": "Prithvi - Earth element",
  "आकाश": "Akasha - Space, ether element",
  "अग्नि": "Agni - Fire element, sacred fire",
  "जल": "Jala - Water element",
  "प्रकाश": "Prakasha - Light, illumination",
  "ज्ञान": "Gyana - Wisdom, spiritual knowledge",
  "भक्ति": "Bhakti - Devotion, loving worship",
  "सेवा": "Seva - Selfless service",
  "नमस्ते": "Namaste - I bow to you",
  "नमस्कार": "Namaskar - Salutations",
  "धन्यवाद": "Dhanyawad - Thank you",
  "क्षमा": "Kshama - Forgiveness",
  "दया": "Daya - Compassion",
  "करुणा": "Karuna - Mercy",
  "मुक्ति": "Mukti - Liberation",
  "मोक्ष": "Moksha - Final liberation",
  "संसार": "Samsara - Cycle of birth and death",
  "तपस्या": "Tapasya - Spiritual practice",
  "साधना": "Sadhana - Spiritual discipline",
  "पूजा": "Puja - Worship, reverence",
  "यज्ञ": "Yajna - Sacred ritual",
  "आशीर्वाद": "Ashirvad - Blessing",
  "कृपा": "Kripa - Grace",
  "उपासना": "Upasana - Devotional practice",
  "सर्वे भवन्तु सुखिनः": "Sarve bhavantu sukhinah - May all beings be happy",
  "विद्या धनं सर्वधनप्रधानम्": "Vidya dhanam sarvadhana-pradhanam - Knowledge is the supreme wealth",
  "वसुधैव कुटुम्बकम्": "Vasudhaiva kutumbakam - The world is one family",
  "अहं ब्रह्मास्मि": "Aham brahmasmi - I am the absolute",
  "तत् त्वम् असि": "Tat tvam asi - Thou art that",
  "सत्यमेव जयते": "Satyameva jayate - Truth alone triumphs"
};

// Enhanced multi-language to Sanskrit dictionary
const multilingualToSanskrit: Record<string, string> = {
  // Basic question words
  "what": "किम्", "who": "कः", "where": "कुत्र", "when": "कदा", "why": "किमर्थम्", "how": "कथम्",
  
  // Pronouns
  "you": "त्वम्", "your": "तव", "yours": "तव", "yourself": "त्वयम्",
  "i": "अहम्", "me": "माम्", "my": "मम", "mine": "मम", "myself": "स्वयम्",
  "he": "सः", "she": "सा", "it": "तत्", "they": "ते", "them": "तान्", "their": "तेषाम्",
  "we": "वयम्", "us": "अस्मान्", "our": "अस्माकम्", "ours": "अस्माकम्",
  "this": "एतत्", "that": "तत्", "these": "एते", "those": "ते",
  
  // Verbs - being
  "is": "अस्ति", "are": "सन्ति", "am": "अस्मि", "was": "आसीत्", "were": "आसन्",
  "be": "भू", "being": "सत्ता", "been": "भूत", "will": "भविष्यति",
  
  // Common verbs
  "do": "कर्", "does": "करोति", "did": "अकरोत्", "done": "कृत", "doing": "कुर्वन्",
  "have": "अस्ति", "has": "अस्ति", "had": "आसीत्", "having": "धारयन्",
  "go": "गम्", "goes": "गच्छति", "went": "अगच्छत्", "going": "गच्छन्", "gone": "गत",
  "come": "आगम्", "comes": "आगच्छति", "came": "आगच्छत्", "coming": "आगच्छन्",
  "see": "पश्य", "sees": "पश्यति", "saw": "अपश्यत्", "seen": "दृष्ट", "seeing": "पश्यन्",
  "know": "जान्", "knows": "जानाति", "knew": "अजानात्", "known": "ज्ञात", "knowing": "जानन्",
  "get": "लभ्", "gets": "लभते", "got": "अलभत्", "getting": "लभमान",
  "give": "दा", "gives": "ददाति", "gave": "अदत्", "given": "दत्त", "giving": "ददत्",
  "take": "गृह्", "takes": "गृह्णाति", "took": "अगृह्णीत्", "taken": "गृहीत", "taking": "गृह्णन्",
  "make": "कृ", "makes": "करोति", "made": "अकरोत्", "making": "कुर्वन्",
  "say": "वद्", "says": "वदति", "said": "अवदत्", "saying": "वदन्",
  "think": "चिन्त्", "thinks": "चिन्तयति", "thought": "अचिन्तयत्", "thinking": "चिन्तयन्",
  "feel": "अनुभू", "feels": "अनुभवति", "felt": "अनुभूत", "feeling": "अनुभवन्",
  
  // Common greetings and polite expressions
  "hello": "नमस्ते", "hi": "नमस्ते", "greetings": "नमस्कार", "namaste": "नमस्ते",
  "goodbye": "पुनर्दर्शनाय", "bye": "पुनर्दर्शनाय", "farewell": "पुनर्दर्शनाय",
  "thanks": "धन्यवाद", "thank you": "धन्यवाद", "thx": "धन्यवाद", "ty": "धन्यवाद",
  "please": "कृपया", "pls": "कृपया", "plz": "कृपया",
  "sorry": "क्षमा", "forgive me": "क्षमा करें", "pardon me": "क्षमा करें",
  "excuse me": "क्षमा करें", "yes": "आम्", "no": "न", "ok": "अस्तु", "okay": "अस्तु",
  
  // Family and relationships
  "mother": "माता", "mom": "माता", "maa": "माता",
  "father": "पिता", "dad": "पिता", "papa": "पिता",
  "son": "पुत्र", "daughter": "पुत्री", "child": "बाल", "children": "बालाः",
  "brother": "भ्राता", "bro": "भ्राता", "sister": "भगिनी", "sis": "भगिनी",
  "friend": "मित्र", "buddy": "मित्र", "pal": "मित्र",
  "husband": "पति", "wife": "पत्नी", "family": "कुटुम्ब",
  
  // Core spiritual concepts  
  "teacher": "गुरु", "guru": "गुरु", "master": "गुरु", "guide": "गुरु",
  "peace": "शान्ति", "tranquility": "शान्ति", "calm": "शान्ति", "serenity": "शान्ति",
  "love": "प्रेम", "affection": "प्रेम", "divine love": "प्रेम",
  "devotion": "भक्ति", "worship": "भक्ति", "reverence": "भक्ति",
  "truth": "सत्य", "reality": "सत्य", "fact": "सत्य", "honesty": "सत्य",
  "knowledge": "विद्या", "learning": "विद्या", "education": "विद्या",
  "wisdom": "ज्ञान", "understanding": "ज्ञान", "insight": "ज्ञान",
  "soul": "आत्मा", "spirit": "आत्मा", "self": "आत्मा", "inner self": "आत्मा",
  "karma": "कर्म", "action": "कर्म", "deed": "कर्म", "work": "कर्म",
  "dharma": "धर्म", "duty": "धर्म", "righteousness": "धर्म", "law": "धर्म",
  "yoga": "योग", "union": "योग", "practice": "साधना",
  "meditation": "ध्यान", "contemplation": "ध्यान",
  "om": "ॐ", "aum": "ॐ", "sacred sound": "ॐ",
  "mantra": "मन्त्र", "chant": "मन्त्र", "sacred formula": "मन्त्र",
  "prayer": "प्रार्थना", "supplication": "प्रार्थना",
  "service": "सेवा", "help": "सेवा", "assistance": "सेवा",
  
  // Elements and nature
  "sun": "सूर्य", "solar": "सूर्य", "sunshine": "सूर्य",
  "moon": "चन्द्र", "lunar": "चन्द्र", "moonlight": "चन्द्र",
  "fire": "अग्नि", "flame": "अग्नि", "heat": "अग्नि",
  "water": "जल", "aqua": "जल", "liquid": "जल",
  "river": "नदी", "stream": "नदी", "ocean": "सागर", "sea": "सागर",
  "earth": "पृथ्वी", "land": "भूमि", "ground": "भूमि", "soil": "भूमि",
  "air": "वायु", "wind": "वायु", "atmosphere": "वायु",
  "breath": "प्राण", "life force": "प्राण", "vitality": "प्राण",
  "space": "आकाश", "sky": "आकाश", "ether": "आकाश",
  "heaven": "स्वर्ग", "paradise": "स्वर्ग",
  "light": "प्रकाश", "brightness": "प्रकाश", "illumination": "प्रकाश",
  
  // Common adjectives
  "good": "अच्छा", "great": "महान्", "excellent": "उत्तम", "best": "श्रेष्ठ",
  "bad": "अशुभ", "evil": "पाप", "wrong": "अनुचित",
  "beautiful": "सुन्दर", "pretty": "सुन्दर", "gorgeous": "रमणीय", "lovely": "सुन्दर",
  "happy": "प्रसन्न", "joy": "आनन्द", "bliss": "आनन्द", "delight": "हर्ष",
  "sad": "दुःखित", "sorrow": "दुःख", "grief": "शोक",
  
  // Time expressions
  "time": "काल", "moment": "क्षण", "today": "अद्य", "now": "अधुना",
  "yesterday": "ह्यः", "tomorrow": "श्वः", "day": "दिन", "night": "रात्रि",
  "morning": "प्रातः", "evening": "सायम्", "afternoon": "मध्याह्न",
  
  // Place and location
  "house": "गृह", "home": "घर", "place": "स्थान", "location": "स्थल",
  "here": "अत्र", "there": "तत्र", "everywhere": "सर्वत्र",
  
  // Objects
  "book": "पुस्तक", "text": "ग्रन्थ", "scripture": "शास्त्र", "writing": "लेख",
  "flower": "पुष्प", "lotus": "कमल", "tree": "वृक्ष", "plant": "पादप",
  "food": "अन्न", "meal": "भोजन", "rice": "अन्न",
  "money": "धन", "wealth": "सम्पत्ति", "gold": "स्वर्ण",
  
  // Actions
  "eat": "खाद्", "drink": "पा", "sleep": "स्वप्", "wake": "बुध्", "walk": "चल्",
  "run": "धाव्", "sit": "उपविश्", "stand": "स्था", "read": "पठ्", "write": "लिख्",
  "speak": "वद्", "listen": "श्रु", "learn": "अधिगम्", "teach": "शिक्ष्",
  
  // People
  "person": "व्यक्ति", "people": "जन", "man": "पुरुष", "woman": "स्त्री",
  "boy": "बाल", "girl": "बालिका", "baby": "शिशु",
  "student": "छात्र", "disciple": "शिष्य", "learner": "अध्येता",
  
  // Numbers
  "one": "एक", "two": "द्वि", "three": "त्रि", "four": "चतुर्", "five": "पञ्च",
  "six": "षट्", "seven": "सप्त", "eight": "अष्ट", "nine": "नव", "ten": "दश",
  
  // Kannada to Sanskrit
  "ಗುರು": "गुरु", "ಶಾಂತಿ": "शान्ति", "ಪ್ರೇಮ": "प्रेम", "ಸತ್ಯ": "सत्य",
  "ಜ್ಞಾನ": "ज्ञान", "ಯೋಗ": "योग", "ಧರ್ಮ": "धर्म", "ಕರ್ಮ": "कर्म",
  "ಆತ್ಮ": "आत्मा", "ಮಂತ್ರ": "मन्त्र", "ಭಕ್ತಿ": "भक्ति", "ಸೇವೆ": "सेवा",
  "ನಮಸ್ತೆ": "नमस्ते", "ನಮಸ್ಕಾರ": "नमस्कार", "ಧನ್ಯವಾದ": "धन्यवाद",
  
  // Hindi to Sanskrit (variations)
  "गुरु": "गुरु", "शांति": "शान्ति", "प्रेम": "प्रेम", "सत्य": "सत्य",
  "ज्ञान": "ज्ञान", "योग": "योग", "धर्म": "धर्म", "कर्म": "कर्म",
  "आत्मा": "आत्मा", "मंत्र": "मन्त्र", "भक्ति": "भक्ति", "सेवा": "सेवा"
};

// Real transliteration function
const transliterateDevanagari = (text: string): string => {
  const devanagariToRoman: Record<string, string> = {
    'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
    'ऋ': 'ṛ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
    'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
    'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
    'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
    'ं': 'ṃ', 'ः': 'ḥ', '्': '', 'ॐ': 'Oṃ'
  };
  
  return text.split('').map(char => devanagariToRoman[char] || char).join('');
};

export const TranslationModule = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [transliteration, setTransliteration] = useState("");
  const [isDevanagari, setIsDevanagari] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("English");
  const { toast } = useToast();

  // Enhanced language detection
  const detectLanguage = (text: string): string => {
    if (!text.trim()) return "English";
    
    // Check for Devanagari script (Sanskrit/Hindi)
    if (/[\u0900-\u097F]/.test(text)) {
      return "Sanskrit/Hindi";
    }
    
    // Check for Kannada script
    if (/[\u0C80-\u0CFF]/.test(text)) {
      return "Kannada";
    }
    
    // Check for common colloquial patterns
    const colloquialPatterns = /\b(thx|u|ur|pls|plz|gud|grt|luv|2day|2morrow|omg|wow|hey|sup)\b/i;
    if (colloquialPatterns.test(text)) {
      return "Colloquial";
    }
    
    return "English";
  };

  // Enhanced multi-language translation function
  const handleTranslate = (textToTranslate?: string) => {
    const input = textToTranslate || inputText;
    if (!input.trim()) return;
    
    const processedInput = input.trim();
    const detectedLang = detectLanguage(processedInput);
    setDetectedLanguage(detectedLang);
    
    let translation = "";
    let romanization = "";

    try {
      if (isDevanagari) {
        // Sanskrit to English translation
        if (sanskritToEnglish[processedInput]) {
          translation = sanskritToEnglish[processedInput];
        } else {
          // Enhanced word-by-word translation
          const words = processedInput.split(/[\s्]+/); // Split on space and virama
          const translatedWords = words.map(word => {
            const cleanWord = word.trim();
            if (!cleanWord) return "";
            
            // Try exact match first
            if (sanskritToEnglish[cleanWord]) {
              const fullTranslation = sanskritToEnglish[cleanWord];
              return fullTranslation.includes(' - ') ? 
                fullTranslation.split(' - ')[1] : 
                fullTranslation;
            }
            
            // Try partial matches for compound words
            for (const [sanskritWord, englishTranslation] of Object.entries(sanskritToEnglish)) {
              if (cleanWord.includes(sanskritWord) && sanskritWord.length > 2) {
                return englishTranslation.includes(' - ') ? 
                  englishTranslation.split(' - ')[1] : 
                  englishTranslation;
              }
            }
            
            // Keep original if no translation found
            return cleanWord;
          }).filter(word => word);
          
          translation = translatedWords.join(' ');
        }
        
        // Generate transliteration
        romanization = transliterateDevanagari(processedInput);
        setTransliteration(romanization);
        
      } else {
        // Multi-language to Sanskrit translation
        const normalizedInput = processedInput.toLowerCase().trim();
        
        // Try exact phrase match first
        if (multilingualToSanskrit[normalizedInput]) {
          translation = multilingualToSanskrit[normalizedInput];
        } else {
          // Enhanced word-by-word translation with better matching
          const words = processedInput.split(/\s+/);
          const translatedWords = words.map(word => {
            const cleanWord = word.toLowerCase().trim().replace(/[^\w\s]/g, '');
            if (!cleanWord) return "";
            
            // Direct exact match
            if (multilingualToSanskrit[cleanWord]) {
              return multilingualToSanskrit[cleanWord];
            }
            
            // Try partial matches and common variations
            for (const [sourceWord, sanskritWord] of Object.entries(multilingualToSanskrit)) {
              // Check if the clean word contains the source word or vice versa
              if ((cleanWord.includes(sourceWord) && sourceWord.length > 2) || 
                  (sourceWord.includes(cleanWord) && cleanWord.length > 2)) {
                return sanskritWord;
              }
            }
            
            // Keep original if no translation found
            return cleanWord;
          }).filter(word => word);
          
          translation = translatedWords.join(' ');
        }
        
        // Generate transliteration for Sanskrit output
        if (translation && translation.match(/[\u0900-\u097F]/)) {
          romanization = transliterateDevanagari(translation);
          setTransliteration(romanization);
        } else {
          setTransliteration("");
        }
      }

      // Set output with improved feedback
      if (translation && translation !== processedInput && translation.trim() !== "") {
        setOutputText(translation);
        toast({
          title: `${detectedLang} → Sanskrit Translation`,
          description: `Successfully translated from ${detectedLang}`,
        });
      } else {
        setOutputText("Translation not found - try simpler words or check spelling");
      }
      
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText("Error occurred during translation");
      toast({
        title: "Translation Error",
        description: "Please try again with different text",
        variant: "destructive"
      });
    }
  };

  const handleSwapLanguages = () => {
    setIsDevanagari(!isDevanagari);
    setInputText(outputText);
    setOutputText(inputText);
    setTransliteration("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Translation has been copied successfully.",
    });
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setTransliteration("");
  };

  const handleSpeak = (text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Auto-translate as user types (with debounce effect)
  const handleInputChange = (value: string) => {
    setInputText(value);
    
    // Clear previous timeout to implement debouncing
    if ((window as any).translationTimeout) {
      clearTimeout((window as any).translationTimeout);
    }
    
    if (value.trim()) {
      // Debounce the translation with 500ms delay for better UX
      (window as any).translationTimeout = setTimeout(() => {
        handleTranslate(value);
      }, 500);
    } else {
      setOutputText("");
      setTransliteration("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-cinzel font-bold text-sacred-gold mb-4">Sanskrit Translation</h3>
        <p className="text-muted-foreground text-lg">
          Real-time Sanskrit ↔ Multi-language translation with phonetic transliteration
        </p>
      </div>

      <Card className="card-vedic p-6">
        {/* Language Direction Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Badge className="bg-sacred-gold/10 text-sacred-gold border-sacred-gold/30">
              {isDevanagari ? "Sanskrit → English" : "Multi-language → Sanskrit"}
            </Badge>
            <Badge variant="outline" className="border-lotus-pink/30 text-lotus-pink">
              {detectedLanguage} • Real-time • Phonetic
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapLanguages}
              className="border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel font-semibold text-manuscript-cream">
                {isDevanagari ? "Sanskrit Text" : `${detectedLanguage} Text`}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSpeak(inputText, isDevanagari ? 'hi-IN' : 'en-US')}
                disabled={!inputText}
                className="text-sacred-gold hover:bg-sacred-gold/10"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            
            <Textarea
              placeholder={isDevanagari 
                ? "Enter Sanskrit text in Devanāgarī script..." 
                : "Enter text in English, Kannada, Hindi, or colloquial language..."
              }
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[150px] bg-sandalwood/20 border-border/50 focus:border-sacred-gold/50 resize-none"
              style={{ fontFamily: isDevanagari ? 'Noto Sans Devanagari' : 'inherit' }}
            />
            
            {transliteration && isDevanagari && (
              <div className="p-3 bg-sacred-gold/5 rounded-lg border border-sacred-gold/20">
                <div className="text-xs text-sacred-gold font-medium mb-1">Romanization:</div>
                <div className="text-sm text-manuscript-cream font-mono">{transliteration}</div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel font-semibold text-manuscript-cream">
                {isDevanagari ? "English Translation" : "Sanskrit Translation"}
              </h4>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeak(outputText, !isDevanagari ? 'hi-IN' : 'en-US')}
                  disabled={!outputText}
                  className="text-sacred-gold hover:bg-sacred-gold/10"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(outputText)}
                  disabled={!outputText}
                  className="text-sacred-gold hover:bg-sacred-gold/10"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div 
              className="min-h-[150px] p-4 bg-sandalwood/10 border border-border/30 rounded-lg text-manuscript-cream leading-relaxed"
              style={{ fontFamily: !isDevanagari ? 'Noto Sans Devanagari' : 'inherit' }}
            >
              {outputText || (
                <span className="text-muted-foreground italic">
                  Translation will appear here as you type...
                </span>
              )}
            </div>
            
            {transliteration && !isDevanagari && outputText && (
              <div className="p-3 bg-sacred-gold/5 rounded-lg border border-sacred-gold/20">
                <div className="text-xs text-sacred-gold font-medium mb-1">Romanization:</div>
                <div className="text-sm text-manuscript-cream font-mono">{transliteration}</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <h5 className="font-cinzel font-medium text-manuscript-cream mb-4">Quick Examples (Click to try):</h5>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { sanskrit: "ॐ शान्ति शान्ति शान्तिः", english: "Om peace peace peace" },
              { sanskrit: "सर्वे भवन्तु सुखिनः", english: "May all beings be happy" },
              { sanskrit: "विद्या धनं सर्वधनप्रधानम्", english: "Knowledge is the supreme wealth" },
              { sanskrit: "वसुधैव कुटुम्बकम्", english: "The world is one family" }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsDevanagari(true);
                  handleInputChange(example.sanskrit);
                }}
                className="p-3 text-left bg-sacred-gold/5 hover:bg-sacred-gold/10 border border-sacred-gold/20 rounded-lg transition-colors group"
              >
                <div className="text-sm text-sacred-gold font-devanagari mb-1">{example.sanskrit}</div>
                <div className="text-xs text-muted-foreground group-hover:text-manuscript-cream">
                  {example.english}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
