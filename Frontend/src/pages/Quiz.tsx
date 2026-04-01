import { Navigation } from '@/components/Navigation';
import { QuizComponent } from '@/components/QuizComponent';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-sacred-gold mb-3">Interactive Quizzes</h1>
          <p className="text-muted-foreground text-lg">Test your Sanskrit knowledge with real-time scoring</p>
        </div>

        <QuizComponent 
          level={0} 
          lesson={1}
          onComplete={(passed) => {
            if (passed) {
              console.log('Quiz passed!');
            }
          }}
          onBack={() => {}}
        />
      </div>
    </div>
  );
};

export default Quiz;
