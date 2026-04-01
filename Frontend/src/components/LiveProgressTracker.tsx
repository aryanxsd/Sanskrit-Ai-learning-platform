import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Zap, Target, TrendingUp, Award } from 'lucide-react';

interface ProgressData {
  totalLessonsCompleted: number;
  totalQuizzesTaken: number;
  averageScore: number;
  timeSpent: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  weeklyProgress: number[];
  level: number;
  xp: number;
}

interface LiveProgressTrackerProps {
  userId?: string;
}

export const LiveProgressTracker: React.FC<LiveProgressTrackerProps> = ({ userId }) => {
  const [progress, setProgress] = useState<ProgressData>({
    totalLessonsCompleted: 0,
    totalQuizzesTaken: 0,
    averageScore: 0,
    timeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    level: 1,
    xp: 0
  });

  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  useEffect(() => {
    // Load progress from localStorage (simulate real-time data)
    const loadProgress = () => {
      const savedProgress = localStorage.getItem('sanskrit-progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    };

    loadProgress();

    // Set up real-time updates
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        loadProgress();
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const updateProgress = (newData: Partial<ProgressData>) => {
    const updatedProgress = { ...progress, ...newData };
    setProgress(updatedProgress);
    localStorage.setItem('sanskrit-progress', JSON.stringify(updatedProgress));
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getXPForNextLevel = (level: number): number => {
    return level * 100;
  };

  const progressToNextLevel = () => {
    const xpForLevel = getXPForNextLevel(progress.level);
    const currentLevelXP = progress.xp % xpForLevel;
    return Math.min(100, Math.max(0, (currentLevelXP / xpForLevel) * 100));
  };

  return (
    <Card className="card-vedic p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-cinzel font-semibold text-sacred-gold">Live Progress</h3>
        <Badge 
          variant="outline" 
          className={`border-sacred-gold/30 ${realTimeUpdates ? 'animate-pulse' : ''}`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${realTimeUpdates ? 'bg-green-400' : 'bg-gray-400'}`} />
          {realTimeUpdates ? 'Live' : 'Offline'}
        </Badge>
      </div>

      {/* Level and XP */}
      <div className="mb-6 p-4 bg-gradient-to-r from-sacred-gold/10 to-lotus-pink/10 rounded-lg border border-sacred-gold/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-sacred-gold" />
            <span className="font-cinzel font-medium text-manuscript-cream">Level {progress.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">{progress.xp} XP</span>
        </div>
        <Progress value={progressToNextLevel()} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {getXPForNextLevel(progress.level) - (progress.xp % getXPForNextLevel(progress.level))} XP to next level
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-card/30 rounded-lg">
          <div className="text-2xl font-bold text-sacred-gold mb-1">{progress.totalLessonsCompleted}</div>
          <div className="text-xs text-muted-foreground">Lessons</div>
        </div>
        
        <div className="text-center p-3 bg-card/30 rounded-lg">
          <div className="text-2xl font-bold text-lotus-pink mb-1">{progress.totalQuizzesTaken}</div>
          <div className="text-xs text-muted-foreground">Quizzes</div>
        </div>
        
        <div className="text-center p-3 bg-card/30 rounded-lg">
          <div className="text-2xl font-bold text-temple-bronze mb-1">{progress.averageScore}%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
        
        <div className="text-center p-3 bg-card/30 rounded-lg">
          <div className="text-2xl font-bold text-sacred-gold mb-1">{formatTime(progress.timeSpent)}</div>
          <div className="text-xs text-muted-foreground">Study Time</div>
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <Zap className="w-6 h-6 text-orange-400" />
          <div>
            <div className="font-bold text-orange-400">{progress.currentStreak} days</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <Trophy className="w-6 h-6 text-purple-400" />
          <div>
            <div className="font-bold text-purple-400">{progress.longestStreak} days</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mb-6">
        <h4 className="font-cinzel font-medium text-manuscript-cream mb-3">This Week</h4>
        <div className="flex items-end justify-between space-x-1 h-16">
          {progress.weeklyProgress.map((hours, index) => {
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const maxHours = Math.max(...progress.weeklyProgress, 1);
            const height = Math.max(5, (hours / maxHours) * 100);
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                <div 
                  className="w-full bg-sacred-gold/20 rounded-t transition-all duration-300 hover:bg-sacred-gold/30"
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-muted-foreground mt-1">{dayNames[index]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      {progress.achievements.length > 0 && (
        <div>
          <h4 className="font-cinzel font-medium text-manuscript-cream mb-3">Recent Achievements</h4>
          <div className="space-y-2">
            {progress.achievements.slice(-3).map((achievement, index) => (
              <Badge 
                key={index} 
                className="bg-sacred-gold/10 text-sacred-gold border-sacred-gold/30 mr-2 mb-2"
              >
                🏆 {achievement}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};