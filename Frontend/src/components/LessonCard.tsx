import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlayCircle, Lock, BookOpen, CheckCircle, Star, Trophy, Award } from "lucide-react";
import { QuizComponent } from "@/components/QuizComponent";
import { LessonContent } from "@/components/LessonContent";
import { useToast } from "@/hooks/use-toast";

interface LessonCardProps {
  level: number;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  icon: React.ReactNode;
  color: string;
}

export const LessonCard = ({ level, title, description, lessons, completed }: LessonCardProps) => {
  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userProgress, setUserProgress] = useState(completed);
  const { toast } = useToast();
  
  const progress = (userProgress / lessons) * 100;
  const isLocked = level > 0 && userProgress === 0;
  const canAccess = level === 0 || userProgress > 0;

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`sanskrit-level-progress-${level}`);
    if (savedProgress) {
      const progressValue = parseInt(savedProgress, 10);
      setUserProgress(progressValue);
    }
  }, [level]);

  // Save progress to localStorage
  const saveProgress = (newProgress: number) => {
    setUserProgress(newProgress);
    localStorage.setItem(`sanskrit-level-progress-${level}`, newProgress.toString());
  };

  const handleStartLesson = () => {
    if (!isLocked) {
      setIsLessonOpen(true);
      // Allow access to current lesson or next unCompleted lesson
      setCurrentLesson(Math.min(userProgress + 1, lessons));
    }
  };

  const handleLessonComplete = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      const newProgress = Math.min(userProgress + 1, lessons);
      saveProgress(newProgress);
      setShowQuiz(false);
      setIsLessonOpen(false);
      
      toast({
        title: "Lesson Completed! 🎉",
        description: `You've mastered lesson ${currentLesson} of ${title}`,
      });
      
      // Check for level completion
      if (newProgress === lessons) {
        toast({
          title: "Level Mastered! 🏆",
          description: `Congratulations! You've completed Level ${level}: ${title}!`,
        });
      }
    } else {
      setShowQuiz(false);
      toast({
        title: "Keep Practicing",
        description: "Review the lesson material and try the quiz again.",
        variant: "destructive",
      });
    }
  };


  return (
    <>
      <Card className="card-vedic p-6 group hover:shadow-sacred transition-all duration-300 relative overflow-hidden">
        {/* Decorative corner pattern */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sacred-gold/10 to-transparent" />
        
        {/* Level completion indicator */}
        {progress === 100 && (
          <div className="absolute top-4 right-4">
            <Trophy className="w-6 h-6 text-sacred-gold animate-gentle-float" />
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sacred-gold/10 text-sacred-gold group-hover:animate-gentle-float">
              {progress === 100 ? <Star className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <Badge variant="outline" className="border-sacred-gold/30 text-sacred-gold">
              Level {level}
            </Badge>
          </div>
          {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
        </div>

        <h3 className="font-cinzel font-semibold text-xl mb-2 text-manuscript-cream">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-sacred-gold font-medium">{userProgress}/{lessons} lessons</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {progress > 0 && progress < 100 && (
            <div className="flex items-center mt-2 text-xs text-sacred-gold">
              <CheckCircle className="w-3 h-3 mr-1" />
              {userProgress} completed • {lessons - userProgress} remaining
            </div>
          )}
          
          {/* Mastery indicator */}
          {progress >= 70 && progress < 100 && (
            <div className="flex items-center mt-2 text-xs text-sacred-gold">
              <Award className="w-3 h-3 mr-1" />
              Great progress! {Math.round(progress)}% mastery
            </div>
          )}
        </div>

        <Button 
          onClick={handleStartLesson}
          className={`w-full ${isLocked 
            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
            : 'bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90'
          }`}
          disabled={isLocked}
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          {isLocked 
            ? 'Complete Previous Level' 
            : userProgress === 0 
              ? 'Start Learning' 
              : progress === 100 
                ? 'Review Lessons'
                : 'Continue Learning'
          }
        </Button>
        
        {canAccess && userProgress > 0 && (
          <div className="mt-3 text-xs text-center text-muted-foreground">
            Next: Lesson {Math.min(userProgress + 1, lessons)}
          </div>
        )}
      </Card>

      {/* Fullscreen overlay for lessons/quizzes to prevent overlap */}
      <Dialog open={isLessonOpen} onOpenChange={setIsLessonOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card">
          {showQuiz ? (
            <QuizComponent
              level={level}
              lesson={currentLesson}
              onComplete={handleQuizComplete}
              onBack={() => setShowQuiz(false)}
            />
          ) : (
            <LessonContent
              level={level}
              lesson={currentLesson}
              title={title}
              onComplete={handleLessonComplete}
              onBack={() => setIsLessonOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};