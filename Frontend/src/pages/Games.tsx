import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Zap, Trophy, Clock, Target, Star } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Games = () => {
  const [activeGame, setActiveGame] = useState<'memory' | 'matching' | 'typing' | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  // Memory Game State
  const [cards, setCards] = useState<Array<{id: number, english: string, sanskrit: string, flipped: boolean, matched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Matching Game State
  const [matchingPairs, setMatchingPairs] = useState<Array<{english: string, sanskrit: string, matched: boolean}>>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);

  // Typing Game State
  const [currentWord, setCurrentWord] = useState({ english: '', sanskrit: '' });
  const [typedText, setTypedText] = useState('');

  const wordPairs = [
    { english: 'Sun', sanskrit: 'सूर्यः' },
    { english: 'Moon', sanskrit: 'चन्द्रः' },
    { english: 'Water', sanskrit: 'जलम्' },
    { english: 'Fire', sanskrit: 'अग्निः' },
    { english: 'Earth', sanskrit: 'पृथ्वी' },
    { english: 'Sky', sanskrit: 'आकाशः' },
    { english: 'Wind', sanskrit: 'वायुः' },
    { english: 'Love', sanskrit: 'प्रेम' }
  ];

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  const startMemoryGame = () => {
    const shuffled = [...wordPairs, ...wordPairs]
      .sort(() => Math.random() - 0.5)
      .map((pair, id) => ({ ...pair, id, flipped: false, matched: false }));
    setCards(shuffled);
    setActiveGame('memory');
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
  };

  const startMatchingGame = () => {
    const shuffled = wordPairs.map(pair => ({ ...pair, matched: false }));
    setMatchingPairs(shuffled);
    setActiveGame('matching');
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
  };

  const startTypingGame = () => {
    setCurrentWord(wordPairs[Math.floor(Math.random() * wordPairs.length)]);
    setActiveGame('typing');
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setTypedText('');
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].english === cards[second].english) {
        setTimeout(() => {
          const matched = [...cards];
          matched[first].matched = true;
          matched[second].matched = true;
          setCards(matched);
          setFlippedCards([]);
          setScore(s => s + 100 + (streak * 10));
          setStreak(s => s + 1);
          toast({ title: `+${100 + (streak * 10)} points! 🔥 Streak: ${streak + 1}` });
        }, 500);
      } else {
        setTimeout(() => {
          const unflipped = [...cards];
          unflipped[first].flipped = false;
          unflipped[second].flipped = false;
          setCards(unflipped);
          setFlippedCards([]);
          setStreak(0);
        }, 1000);
      }
    }
  };

  const handleMatchingClick = (english: string, sanskrit: string) => {
    if (!selectedEnglish) {
      setSelectedEnglish(english);
    } else {
      const pair = matchingPairs.find(p => p.english === selectedEnglish);
      if (pair && pair.sanskrit === sanskrit) {
        const updated = matchingPairs.map(p =>
          p.english === selectedEnglish ? { ...p, matched: true } : p
        );
        setMatchingPairs(updated);
        setScore(s => s + 50 + (streak * 5));
        setStreak(s => s + 1);
        toast({ title: `Correct! +${50 + (streak * 5)} 🎯 Streak: ${streak + 1}` });
      } else {
        setStreak(0);
        toast({ title: 'Try again!', variant: 'destructive' });
      }
      setSelectedEnglish(null);
    }
  };

  const handleTypingSubmit = () => {
    if (typedText === currentWord.sanskrit) {
      setScore(s => s + 75 + (streak * 8));
      setStreak(s => s + 1);
      toast({ title: `Perfect! +${75 + (streak * 8)} ⚡ Streak: ${streak + 1}` });
      setCurrentWord(wordPairs[Math.floor(Math.random() * wordPairs.length)]);
      setTypedText('');
    } else {
      setStreak(0);
      toast({ title: 'Not quite right!', variant: 'destructive' });
    }
  };

  const endGame = () => {
    setGameActive(false);
    const progress = JSON.parse(localStorage.getItem('sanskrit-progress') || '{}');
    progress.totalQuizzesTaken = (progress.totalQuizzesTaken || 0) + 1;
    progress.xp = (progress.xp || 0) + score;
    localStorage.setItem('sanskrit-progress', JSON.stringify(progress));
    
    toast({
      title: `Game Over! Final Score: ${score}`,
      description: `You earned ${score} XP! 🏆`
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-sacred-gold mb-3">Sanskrit Learning Games</h1>
          <p className="text-muted-foreground text-lg">Master Sanskrit through interactive gameplay</p>
        </div>

        {!activeGame ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-vedic p-6 hover:shadow-sacred transition-all cursor-pointer group" onClick={startMemoryGame}>
              <div className="text-center">
                <Gamepad2 className="w-16 h-16 text-sacred-gold mx-auto mb-4 group-hover:animate-gentle-float" />
                <h3 className="font-cinzel font-bold text-xl mb-2 text-manuscript-cream">Memory Match</h3>
                <p className="text-muted-foreground mb-4">Flip cards and match Sanskrit words with their meanings</p>
                <Button className="w-full bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90">
                  Play Now
                </Button>
              </div>
            </Card>

            <Card className="card-vedic p-6 hover:shadow-sacred transition-all cursor-pointer group" onClick={startMatchingGame}>
              <div className="text-center">
                <Target className="w-16 h-16 text-lotus-pink mx-auto mb-4 group-hover:animate-gentle-float" />
                <h3 className="font-cinzel font-bold text-xl mb-2 text-manuscript-cream">Word Matching</h3>
                <p className="text-muted-foreground mb-4">Connect English words with their Sanskrit translations</p>
                <Button className="w-full bg-lotus-pink text-primary-foreground hover:bg-lotus-pink/90">
                  Play Now
                </Button>
              </div>
            </Card>

            <Card className="card-vedic p-6 hover:shadow-sacred transition-all cursor-pointer group" onClick={startTypingGame}>
              <div className="text-center">
                <Zap className="w-16 h-16 text-temple-bronze mx-auto mb-4 group-hover:animate-gentle-float" />
                <h3 className="font-cinzel font-bold text-xl mb-2 text-manuscript-cream">Speed Typing</h3>
                <p className="text-muted-foreground mb-4">Type Sanskrit words as fast as you can</p>
                <Button className="w-full bg-temple-bronze text-primary-foreground hover:bg-temple-bronze/90">
                  Play Now
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                <Badge className="bg-sacred-gold/20 text-sacred-gold border-sacred-gold/30 text-lg px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  Score: {score}
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-lg px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  Streak: {streak}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-lg px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {timeLeft}s
                </Badge>
              </div>
              <Button variant="outline" onClick={() => setActiveGame(null)}>Exit Game</Button>
            </div>

            {activeGame === 'memory' && (
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    className={`aspect-square flex items-center justify-center cursor-pointer transition-all transform hover:scale-105 ${
                      card.matched ? 'bg-green-500/20 border-green-500' : 'card-vedic'
                    }`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className="text-center">
                      {card.flipped || card.matched ? (
                        <>
                          <div className="text-sm text-muted-foreground">{card.english}</div>
                          <div className="text-xl font-bold text-sacred-gold">{card.sanskrit}</div>
                        </>
                      ) : (
                        <Star className="w-8 h-8 text-sacred-gold" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeGame === 'matching' && (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="space-y-3">
                  <h3 className="font-cinzel font-bold text-xl text-center mb-4 text-manuscript-cream">English</h3>
                  {matchingPairs.map((pair) => (
                    <Button
                      key={pair.english}
                      className={`w-full ${
                        pair.matched
                          ? 'bg-green-500/20 text-green-400 border-green-500'
                          : selectedEnglish === pair.english
                          ? 'bg-sacred-gold text-primary-foreground'
                          : 'bg-card hover:bg-card/80'
                      }`}
                      onClick={() => !pair.matched && handleMatchingClick(pair.english, '')}
                      disabled={pair.matched}
                    >
                      {pair.english}
                    </Button>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="font-cinzel font-bold text-xl text-center mb-4 text-manuscript-cream">Sanskrit</h3>
                  {matchingPairs.sort(() => Math.random() - 0.5).map((pair) => (
                    <Button
                      key={pair.sanskrit}
                      className={`w-full ${
                        pair.matched
                          ? 'bg-green-500/20 text-green-400 border-green-500'
                          : 'bg-card hover:bg-card/80'
                      }`}
                      onClick={() => !pair.matched && selectedEnglish && handleMatchingClick(selectedEnglish, pair.sanskrit)}
                      disabled={pair.matched || !selectedEnglish}
                    >
                      {pair.sanskrit}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {activeGame === 'typing' && (
              <Card className="card-vedic p-8 max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground mb-2">Type this in Sanskrit:</p>
                  <h2 className="text-4xl font-bold text-sacred-gold mb-6">{currentWord.english}</h2>
                  <input
                    type="text"
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTypingSubmit()}
                    className="w-full text-3xl text-center bg-background border-2 border-sacred-gold/30 rounded-lg p-4 focus:outline-none focus:border-sacred-gold"
                    placeholder="Type Sanskrit..."
                    autoFocus
                  />
                  <Button
                    onClick={handleTypingSubmit}
                    className="w-full mt-4 bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
                  >
                    Submit
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
