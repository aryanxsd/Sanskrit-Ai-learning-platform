import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Volume2, Eye, EyeOff, Clock, CheckCircle, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonContentProps {
  level: number;
  lesson: number;
  title: string;
  onComplete: () => void;
  onBack: () => void;
}

const lessonData = {
  0: {
    title: "Devanāgarī Script",
    lessons: [
      {
        title: "Introduction to Sanskrit & Devanāgarī",
        content: {
          theory: "Sanskrit is the sacred language of ancient India, written in the beautiful Devanāgarī script. Each character represents a sound, making it phonetic and logical.",
          characters: [
            { char: "अ", roman: "a", sound: "as in 'but'", example: "अम्मा (amma)" },
            { char: "आ", roman: "ā", sound: "as in 'father'", example: "आत्मा (ātmā)" },
            { char: "इ", roman: "i", sound: "as in 'bit'", example: "इष्ट (iṣṭa)" },
            { char: "ई", roman: "ī", sound: "as in 'beet'", example: "ईश (īśa)" },
          ],
          practice: "Practice writing and pronouncing each vowel. Notice how आ is longer than अ, and ई is longer than इ."
        }
      },
      {
        title: "Basic Consonants - Part 1",
        content: {
          theory: "Sanskrit consonants are organized by the position in mouth where they're pronounced. This logical arrangement makes learning systematic.",
          characters: [
            { char: "क", roman: "ka", sound: "as in 'kite'", example: "कमल (kamala)" },
            { char: "ख", roman: "kha", sound: "aspirated 'k'", example: "खगोल (khagola)" },
            { char: "ग", roman: "ga", sound: "as in 'gate'", example: "गुरु (guru)" },
            { char: "घ", roman: "gha", sound: "aspirated 'g'", example: "घर (ghara)" },
          ],
          practice: "Feel the difference between क and ख - the second has a puff of air. Practice: क-ख-ग-घ"
        }
      }
    ]
  },
  1: {
    title: "Basic Vocabulary",
    lessons: [
      {
        title: "Sacred Words & Greetings",
        content: {
          theory: "Learn the most important Sanskrit words used in daily spiritual practice and greetings.",
          characters: [
            { char: "नमस्ते", roman: "namaste", sound: "nah-mas-tay", example: "I bow to you" },
            { char: "गुरु", roman: "guru", sound: "goo-roo", example: "Teacher" },
            { char: "योग", roman: "yoga", sound: "yo-ga", example: "Union" },
            { char: "शान्ति", roman: "śānti", sound: "shaan-ti", example: "Peace" },
          ],
          practice: "Use these words in meditation and daily practice. Feel their sacred vibration."
        }
      }
    ]
  }
};

export const LessonContent = ({ level, lesson, title, onComplete, onBack }: LessonContentProps) => {
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  
  const currentLessonData = lessonData[level as keyof typeof lessonData]?.lessons[lesson - 1];
  
  if (!currentLessonData) {
    return (
      <Card className="card-vedic p-6">
        <div className="text-center">
          <h3 className="text-xl font-cinzel text-manuscript-cream mb-4">Lesson Coming Soon</h3>
          <p className="text-muted-foreground mb-4">This lesson is being prepared for you.</p>
          <Button onClick={onBack}>Return to Lessons</Button>
        </div>
      </Card>
    );
  }

  const handleSectionComplete = (sectionIndex: number) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionIndex);
    setCompletedSections(newCompleted);
  };

  const canComplete = completedSections.size >= 2; // Need to complete theory and practice

  const speakText = (text: string, lang: string = 'hi-IN') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="card-vedic p-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-sacred-gold/10 text-sacred-gold border-sacred-gold/30">
              Level {level} • Lesson {lesson}
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransliteration(!showTransliteration)}
              className="border-lotus-pink/30 text-lotus-pink hover:bg-lotus-pink/10"
            >
              {showTransliteration ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showTransliteration ? 'Hide' : 'Show'} Roman
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-cinzel font-bold text-sacred-gold mb-2">
          {currentLessonData.title}
        </h1>
        <h2 className="text-xl text-manuscript-cream">{title}</h2>
      </Card>

      {/* Theory Section */}
      <Card className="card-vedic p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-cinzel font-semibold text-manuscript-cream">Theory</h3>
          <Badge variant="outline" className="border-sacred-gold/30 text-sacred-gold">
            Section 1
          </Badge>
        </div>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          {currentLessonData.content.theory}
        </p>
        
        <Button
          onClick={() => handleSectionComplete(0)}
          disabled={completedSections.has(0)}
          className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
        >
          {completedSections.has(0) ? 'Completed ✓' : 'Mark as Read'}
        </Button>
      </Card>

      {/* Characters/Vocabulary Section */}
      <Card className="card-vedic p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-cinzel font-semibold text-manuscript-cream">
            {level === 0 ? 'Characters' : 'Vocabulary'}
          </h3>
          <Badge variant="outline" className="border-sacred-gold/30 text-sacred-gold">
            Section 2
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {currentLessonData.content.characters.map((item, index) => (
            <div key={index} className="p-4 bg-sandalwood/10 rounded-lg border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <div className="text-3xl font-devanagari text-sacred-gold">
                  {item.char}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(item.char)}
                  className="text-sacred-gold hover:bg-sacred-gold/10"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              
              {showTransliteration && (
                <div className="text-lg font-mono text-manuscript-cream mb-1">
                  {item.roman}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground mb-2">
                {item.sound}
              </div>
              
              <div className="text-sm text-lotus-pink font-devanagari">
                {item.example}
              </div>
            </div>
          ))}
        </div>
        
        <Button
          onClick={() => handleSectionComplete(1)}
          disabled={completedSections.has(1)}
          className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
        >
          {completedSections.has(1) ? 'Practiced ✓' : 'Practice Complete'}
        </Button>
      </Card>

      {/* Practice Section */}
      <Card className="card-vedic p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-cinzel font-semibold text-manuscript-cream">Practice Tips</h3>
          <Badge variant="outline" className="border-sacred-gold/30 text-sacred-gold">
            Section 3
          </Badge>
        </div>
        
        <div className="p-4 bg-sacred-gold/5 rounded-lg border border-sacred-gold/20 mb-6">
          <p className="text-manuscript-cream leading-relaxed">
            {currentLessonData.content.practice}
          </p>
        </div>
        
        <Button
          onClick={() => handleSectionComplete(2)}
          disabled={completedSections.has(2)}
          className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
        >
          {completedSections.has(2) ? 'Understood ✓' : 'Got It!'}
        </Button>
      </Card>

      {/* Complete Lesson */}
      {canComplete && (
        <Card className="card-vedic p-6 text-center">
          <h3 className="text-xl font-cinzel font-semibold text-manuscript-cream mb-4">
            Ready for Quiz?
          </h3>
          <p className="text-muted-foreground mb-6">
            Complete the quiz to test your understanding and unlock the next lesson.
          </p>
          <Button
            onClick={onComplete}
            className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90 px-8"
          >
            Take Quiz
          </Button>
        </Card>
      )}
    </div>
  );
};