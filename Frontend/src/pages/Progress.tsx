import { Navigation } from '@/components/Navigation';
import { LiveProgressTracker } from '@/components/LiveProgressTracker';

const Progress = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-sacred-gold mb-3">Your Progress</h1>
          <p className="text-muted-foreground text-lg">Track your learning journey in real-time</p>
        </div>

        <LiveProgressTracker />
      </div>
    </div>
  );
};

export default Progress;
