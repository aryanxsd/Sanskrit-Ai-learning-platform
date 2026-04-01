import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, XCircle, Volume2, Clock, Zap, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizComponentProps {
  level: number;
  lesson: number;
  onComplete: (passed: boolean) => void;
  onBack: () => void;
}

const quizData = {
  0: {
    1: {
      title: "Sanskrit & Devanāgarī Basics",
      questions: [
        {
          type: "multiple-choice" as const,
          question: "What does the character 'अ' sound like?",
          options: ["as in 'father'", "as in 'but'", "as in 'beet'", "as in 'bit'"],
          correct: 1,
          explanation: "'अ' is pronounced as the short 'a' sound, like 'but' in English."
        },
        {
          type: "multiple-choice" as const,
          question: "Which character represents the long 'ā' sound?",
          options: ["अ", "आ", "इ", "ई"],
          correct: 1,
          explanation: "'आ' represents the long 'ā' sound, twice as long as 'अ'."
        },
        {
          type: "fill-blank" as const,
          question: "Write the Sanskrit character for the sound 'ka': ___",
          answer: "क",
          explanation: "'क' represents the 'ka' sound without aspiration."
        }
      ]
    },
    2: {
      title: "Basic Consonants",
      questions: [
        {
          type: "multiple-choice" as const,
          question: "What is the difference between 'क' and 'ख'?",
          options: ["No difference", "ख is aspirated", "क is longer", "ख is nasal"],
          correct: 1,
          explanation: "'ख' is the aspirated version of 'क', pronounced with a puff of air."
        },
        {
          type: "fill-blank" as const,
          question: "Complete the series: क, ख, ___, घ",
          answer: "ग",
          explanation: "The series is क-ख-ग-घ, representing the velar consonants."
        }
      ]
    }
  },
  1: {
    1: {
      title: "Sacred Words Quiz",
      questions: [
        {
          type: "multiple-choice" as const,
          question: "What does 'नमस्ते' mean?",
          options: ["Hello", "I bow to you", "Goodbye", "Thank you"],
          correct: 1,
          explanation: "'नमस्ते' means 'I bow to you' - a respectful greeting acknowledging the divine in another."
        },
        {
          type: "fill-blank" as const,
          question: "The Sanskrit word for 'teacher' is: ___",
          answer: "गुरु",
          explanation: "'गुरु' (guru) means teacher or spiritual guide."
        }
      ]
    }
  }
};

export const QuizComponent = ({ level, lesson, onComplete, onBack }: QuizComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const quiz = quizData[level as keyof typeof quizData]?.[lesson as keyof typeof quizData[0]];
  
  if (!quiz) {
    return (
      <Card className="card-vedic p-6">
        <div className="text-center">
          <h3 className="text-xl font-cinzel text-manuscript-cream mb-4">Quiz Coming Soon</h3>
          <Button onClick={onBack}>Return to Lesson</Button>
        </div>
      </Card>
    );
  }

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (question.type === "multiple-choice") {
        if (answers[index] === question.correct) correct++;
      } else if (question.type === "fill-blank") {
        const userAnswer = answers[index]?.toString().toLowerCase().trim();
        const correctAnswer = question.answer.toLowerCase().trim();
        
        // Enhanced matching for Sanskrit text (allow both Devanagari and Roman)
        if (userAnswer === correctAnswer || 
            userAnswer === correctAnswer.replace(/[āīūṛṇṭḍśṣṃḥ]/g, match => {
              const romanToSimple: Record<string, string> = {
                'ā': 'a', 'ī': 'i', 'ū': 'u', 'ṛ': 'r', 'ṇ': 'n',
                'ṭ': 't', 'ḍ': 'd', 'ś': 's', 'ṣ': 's', 'ṃ': 'm', 'ḥ': 'h'
              };
              return romanToSimple[match] || match;
            })) {
          correct++;
        }
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const passingScore = Math.ceil(quiz.questions.length * 0.7); // 70% to pass
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="card-vedic p-6">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {passed ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            
            <h3 className="text-2xl font-cinzel font-bold text-manuscript-cream mb-2">
              Quiz Complete!
            </h3>
            
            <div className="text-4xl font-bold mb-2">
              <span className={passed ? 'text-green-400' : 'text-red-400'}>
                {score}
              </span>
              <span className="text-muted-foreground">/{quiz.questions.length}</span>
            </div>
            
            <Badge className={`mb-4 ${
              passed 
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              {passed ? 'Passed!' : 'Keep Practicing'} • {Math.round((score / quiz.questions.length) * 100)}%
            </Badge>
            
            <p className="text-muted-foreground mb-6">
              {passed 
                ? 'Excellent work! You can proceed to the next lesson.'
                : `You need ${passingScore} correct answers to pass. Review the lesson and try again.`
              }
            </p>
          </div>

          {/* Review Answers */}
          <div className="space-y-4 mb-6">
            <h4 className="font-cinzel font-semibold text-manuscript-cream">Review:</h4>
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = question.type === "multiple-choice" 
                ? userAnswer === question.correct
                : typeof userAnswer === "string" && 
                  userAnswer.toLowerCase().trim() === question.answer.toLowerCase();

              return (
                <div key={index} className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className="flex items-start space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-manuscript-cream font-medium">{question.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lesson
            </Button>
            
            {!passed && (
              <Button
                onClick={restartQuiz}
                className="flex-1 bg-lotus-pink text-white hover:bg-lotus-pink/90"
              >
                Try Again
              </Button>
            )}
            
            {passed && (
              <Button
                onClick={() => onComplete(true)}
                className="flex-1 bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
              >
                Continue Learning
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="card-vedic p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
          
          <Badge className="bg-sacred-gold/10 text-sacred-gold border-sacred-gold/30">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>

        <h2 className="text-2xl font-cinzel font-bold text-sacred-gold mb-6 text-center">
          {quiz.title}
        </h2>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-manuscript-cream">
              {question.question}
            </h3>
            {question.question.includes('character') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakText(question.type === 'fill-blank' ? question.answer : 'Sanskrit')}
                className="text-sacred-gold hover:bg-sacred-gold/10"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {question.type === "multiple-choice" && (
            <RadioGroup
              value={answers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswer(parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-sandalwood/5">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-manuscript-cream">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "fill-blank" && (
            <div className="space-y-4">
              <Input
                value={answers[currentQuestion]?.toString() || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="text-lg bg-sandalwood/20 border-border/50 focus:border-sacred-gold/50"
                style={{ fontFamily: 'Noto Sans Devanagari' }}
              />
              <p className="text-sm text-muted-foreground">
                Hint: Type in Devanāgarī script if possible, or use Roman transliteration
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="border-border/30 text-muted-foreground hover:bg-muted/10"
          >
            Previous
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{currentQuestion + 1}/{quiz.questions.length}</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-sacred-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};