import { useState } from 'react';
import { BookOpen, Star, Crown, Lock } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { LessonCard } from '@/components/LessonCard';
import { LessonContent } from '@/components/LessonContent';

const Lessons = () => {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const levels = [
    {
      level: 0,
      title: "Devanāgarī Script",
      description: "Master the sacred script of Sanskrit",
      lessons: 12,
      completed: 0,
      icon: <BookOpen className="w-5 h-5" />,
      color: "sacred.gold"
    },
    {
      level: 1,
      title: "Basic Vocabulary",
      description: "Learn fundamental Sanskrit words",
      lessons: 24,
      completed: 0,
      icon: <Star className="w-5 h-5" />,
      color: "lotus.pink"
    },
    {
      level: 2,
      title: "Grammar Foundations",
      description: "Understanding Sanskrit grammar rules",
      lessons: 36,
      completed: 0,
      icon: <Crown className="w-5 h-5" />,
      color: "temple.bronze"
    },
    {
      level: 3,
      title: "Sentence Construction",
      description: "Build meaningful Sanskrit sentences",
      lessons: 30,
      completed: 0,
      icon: <BookOpen className="w-5 h-5" />,
      color: "sacred.gold"
    },
    {
      level: 4,
      title: "Advanced Reading",
      description: "Read classical Sanskrit texts",
      lessons: 40,
      completed: 0,
      icon: <Star className="w-5 h-5" />,
      color: "lotus.pink"
    },
    {
      level: 5,
      title: "Conversation & Composition",
      description: "Speak and write in Sanskrit fluently",
      lessons: 50,
      completed: 0,
      icon: <Crown className="w-5 h-5" />,
      color: "temple.bronze"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {selectedLesson !== null ? (
          <LessonContent
            level={selectedLesson}
            lesson={1}
            title={levels[selectedLesson].title}
            onComplete={() => setSelectedLesson(null)}
            onBack={() => setSelectedLesson(null)}
          />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-cinzel font-bold text-sacred-gold mb-3">Learning Path</h1>
              <p className="text-muted-foreground text-lg">Progress through six structured levels from script to fluency</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map((level, idx) => (
                <div key={level.level} onClick={() => setSelectedLesson(level.level)}>
                  <LessonCard {...level} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lessons;
