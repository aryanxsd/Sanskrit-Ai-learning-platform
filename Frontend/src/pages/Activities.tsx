import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Mic, Volume2, Trophy, Zap, BookOpen } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Activities = () => {
  const [activeActivity, setActiveActivity] = useState<'listening' | 'pronunciation' | 'story' | null>(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const listeningExercises = [
    { sanskrit: 'नमस्ते', english: 'Namaste (Hello)', audio: 'Greetings' },
    { sanskrit: 'धन्यवादः', english: 'Thank you', audio: 'Gratitude' },
    { sanskrit: 'शुभम्', english: 'Good/Auspicious', audio: 'Blessing' }
  ];

  const pronunciationWords = [
    { word: 'ॐ', romanized: 'Om', meaning: 'Sacred sound' },
    { word: 'योग', romanized: 'Yoga', meaning: 'Union' },
    { word: 'धर्म', romanized: 'Dharma', meaning: 'Righteousness' }
  ];

  const stories = [
    {
      title: 'The Wise Teacher',
      sanskrit: 'गुरुः ज्ञानम् ददाति',
      translation: 'The teacher gives knowledge',
      moral: 'Knowledge is the greatest gift'
    },
    {
      title: 'The River of Life',
      sanskrit: 'नदी सदा प्रवहति',
      translation: 'The river always flows',
      moral: 'Life keeps moving forward'
    }
  ];

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('sanskrit-progress') || '{}');
    progress.timeSpent = (progress.timeSpent || 0) + 1;
    localStorage.setItem('sanskrit-progress', JSON.stringify(progress));
  }, [activeActivity]);

  const handleListeningAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 50);
      toast({ title: 'Correct! +50 XP 🎯' });
      setTimeout(() => {
        if (currentIndex < listeningExercises.length - 1) {
          setCurrentIndex(i => i + 1);
        } else {
          completeActivity();
        }
      }, 1500);
    } else {
      toast({ title: 'Try again!', variant: 'destructive' });
    }
  };

  const handlePronunciationPractice = () => {
    setScore(s => s + 30);
    toast({ title: 'Great pronunciation! +30 XP 🎤' });
    setTimeout(() => {
      if (currentIndex < pronunciationWords.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        completeActivity();
      }
    }, 1500);
  };

  const completeActivity = () => {
    const progress = JSON.parse(localStorage.getItem('sanskrit-progress') || '{}');
    progress.totalLessonsCompleted = (progress.totalLessonsCompleted || 0) + 1;
    progress.xp = (progress.xp || 0) + score;
    progress.achievements = progress.achievements || [];
    if (!progress.achievements.includes('Activity Master')) {
      progress.achievements.push('Activity Master');
    }
    localStorage.setItem('sanskrit-progress', JSON.stringify(progress));
    
    toast({
      title: `Activity Complete! 🎉`,
      description: `You earned ${score} XP!`
    });
    
    setActiveActivity(null);
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-sacred-gold mb-3">Fun Activities</h1>
          <p className="text-muted-foreground text-lg">Immerse yourself in Sanskrit through engaging activities</p>
        </div>

        {!activeActivity ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="card-vedic p-6 hover:shadow-sacred transition-all cursor-pointer group"
              onClick={() => setActiveActivity('listening')}
            >
              <div className="text-center">
                <Volume2 className="w-16 h-16 text-sacred-gold mx-auto mb-4 group-hover:animate-gentle-float" />
                <h3 className="font-cinzel font-bold text-xl mb-2 text-manuscript-cream">Listening Practice</h3>
                <p className="text-muted-foreground mb-4">Train your ear to understand Sanskrit pronunciation</p>
                <Badge className="bg-sacred-gold/20 text-sacred-gold border-sacred-gold/30">
                  {listeningExercises.length} Exercises
                </Badge>
              </div>
            </Card>

            <Card 
              className="card-vedic p-6 hover:shadow-sacred transition-all cursor-pointer group"
              onClick={() => setActiveActivity('pronunciation')}
            >
              <div className="text-center">
                <Mic className="w-16 h-16 text-lotus-pink mx-auto mb-4 group-hover:animate-gentle-float" />
                <h3 className="font-cinzel font-bold text-xl mb-2 text-manuscript-cream">Pronunciation Guide</h3>
                <p className="text-muted-foreground mb-4">Perfect your Sanskrit pronunciation with guided practice</p>
                <Badge className="bg-lotus-pink/20 text-lotus-pink border-lotus-pink/30">
                  {pronunciationWords.length} Words
                </Badge>
              </div>
            </Card>

            <Card 
              className="card-vedic p-6 hover:shadow-sacred transition-all cursor-pointer group"
              onClick={() => setActiveActivity('story')}
            >
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-temple-bronze mx-auto mb-4 group-hover:animate-gentle-float" />
                <h3 className="font-cinzel font-bold text-xl mb-2 text-manuscript-cream">Sanskrit Stories</h3>
                <p className="text-muted-foreground mb-4">Learn through ancient wisdom and modern tales</p>
                <Badge className="bg-temple-bronze/20 text-temple-bronze border-temple-bronze/30">
                  {stories.length} Stories
                </Badge>
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Badge className="bg-sacred-gold/20 text-sacred-gold border-sacred-gold/30 text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Score: {score}
              </Badge>
              <Button variant="outline" onClick={() => setActiveActivity(null)}>
                Exit Activity
              </Button>
            </div>

            {activeActivity === 'listening' && (
              <Card className="card-vedic p-8 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Badge className="mb-4 bg-sacred-gold/20 text-sacred-gold border-sacred-gold/30">
                    Exercise {currentIndex + 1} of {listeningExercises.length}
                  </Badge>
                  <div className="mb-6 p-6 bg-gradient-to-r from-sacred-gold/10 to-lotus-pink/10 rounded-lg">
                    <h2 className="text-4xl font-bold text-sacred-gold mb-4">
                      {listeningExercises[currentIndex].sanskrit}
                    </h2>
                    <Button className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Play Audio
                    </Button>
                  </div>
                  <p className="text-lg text-muted-foreground mb-6">What does this mean?</p>
                  <div className="space-y-3">
                    <Button
                      className="w-full text-lg py-6"
                      variant="outline"
                      onClick={() => handleListeningAnswer(true)}
                    >
                      {listeningExercises[currentIndex].english}
                    </Button>
                    <Button
                      className="w-full text-lg py-6"
                      variant="outline"
                      onClick={() => handleListeningAnswer(false)}
                    >
                      Something else
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeActivity === 'pronunciation' && (
              <Card className="card-vedic p-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <Badge className="mb-6 bg-lotus-pink/20 text-lotus-pink border-lotus-pink/30">
                    Word {currentIndex + 1} of {pronunciationWords.length}
                  </Badge>
                  <div className="mb-8 p-8 bg-gradient-to-r from-lotus-pink/10 to-temple-bronze/10 rounded-lg">
                    <h2 className="text-6xl font-bold text-sacred-gold mb-4">
                      {pronunciationWords[currentIndex].word}
                    </h2>
                    <p className="text-2xl text-lotus-pink mb-2">
                      {pronunciationWords[currentIndex].romanized}
                    </p>
                    <p className="text-muted-foreground">
                      {pronunciationWords[currentIndex].meaning}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button className="w-full bg-lotus-pink text-primary-foreground hover:bg-lotus-pink/90 py-6 text-lg">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Listen to Pronunciation
                    </Button>
                    <Button
                      className="w-full bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90 py-6 text-lg"
                      onClick={handlePronunciationPractice}
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Practice Speaking
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeActivity === 'story' && (
              <div className="max-w-3xl mx-auto space-y-6">
                {stories.map((story, idx) => (
                  <Card key={idx} className="card-vedic p-8">
                    <div className="flex items-start space-x-4 mb-4">
                      <BookOpen className="w-8 h-8 text-temple-bronze flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-cinzel font-bold text-2xl text-manuscript-cream mb-2">
                          {story.title}
                        </h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-sacred-gold/10 rounded-lg">
                            <p className="text-xl text-sacred-gold mb-2">{story.sanskrit}</p>
                            <p className="text-muted-foreground italic">{story.translation}</p>
                          </div>
                          <div className="p-4 bg-lotus-pink/10 rounded-lg border border-lotus-pink/30">
                            <p className="text-sm text-muted-foreground mb-1">Moral:</p>
                            <p className="text-manuscript-cream">{story.moral}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  onClick={completeActivity}
                  className="w-full bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90 py-6 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Complete Activity
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
