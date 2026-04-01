import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Gamepad2, Trophy, Sparkles, Home, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/lessons', label: 'Lessons', icon: BookOpen },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/quiz', label: 'Quizzes', icon: Trophy },
    { path: '/activities', label: 'Activities', icon: Sparkles },
    { path: '/progress', label: 'Progress', icon: TrendingUp },
    { path: '/social', label: 'Community', icon: Users },
    { path: '/assignments', label: 'Assignments', icon: BookOpen },
  ];

  return (
    <nav className="bg-card/50 border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-cinzel font-bold text-sacred-gold">संस्कृत गुरु</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-sacred-gold text-primary-foreground shadow-sacred'
                      : 'text-muted-foreground hover:text-sacred-gold hover:bg-sacred-gold/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline font-semibold text-sm">{label}</span>
                  {path === '/progress' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-1 scale-90">
                      Live
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
