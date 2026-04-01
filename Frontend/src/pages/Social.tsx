import { Navigation } from '@/components/Navigation';
import { CollaborativeFeatures } from '@/components/CollaborativeFeatures';

const Social = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-sacred-gold mb-3">Community</h1>
          <p className="text-muted-foreground text-lg">Learn together with fellow Sanskrit enthusiasts</p>
        </div>

        <CollaborativeFeatures />
      </div>
    </div>
  );
};

export default Social;
