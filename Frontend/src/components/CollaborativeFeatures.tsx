import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, MessageCircle, Share2, Trophy, Crown, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyBuddy {
  id: string;
  name: string;
  level: number;
  avatar: string;
  status: 'online' | 'offline' | 'studying';
  currentLesson?: string;
  score?: number;
}

interface StudySession {
  id: string;
  title: string;
  participants: StudyBuddy[];
  startTime: Date;
  currentTopic: string;
  isActive: boolean;
}

interface LeaderboardEntry {
  rank: number;
  user: StudyBuddy;
  weeklyXP: number;
  streak: number;
  badges: string[];
}

export const CollaborativeFeatures: React.FC = () => {
  const [studyBuddies, setStudyBuddies] = useState<StudyBuddy[]>([
    {
      id: '1',
      name: 'Arjun',
      level: 3,
      avatar: '🧘‍♂️',
      status: 'studying',
      currentLesson: 'Devanāgarī Script',
      score: 85
    },
    {
      id: '2',
      name: 'Priya',
      level: 2,
      avatar: '👩‍🎓',
      status: 'online',
      currentLesson: 'Basic Vocabulary',
      score: 92
    },
    {
      id: '3',
      name: 'Ravi',
      level: 4,
      avatar: '👨‍🏫',
      status: 'offline',
      score: 78
    }
  ]);

  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: '1',
      title: 'Sanskrit Pronunciation Practice',
      participants: [studyBuddies[0], studyBuddies[1]],
      startTime: new Date(),
      currentTopic: 'Vowel Sounds',
      isActive: true
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      user: studyBuddies[1],
      weeklyXP: 450,
      streak: 7,
      badges: ['🔥', '🎯', '⚡']
    },
    {
      rank: 2,
      user: studyBuddies[0],
      weeklyXP: 380,
      streak: 5,
      badges: ['🏆', '📚']
    },
    {
      rank: 3,
      user: studyBuddies[2],
      weeklyXP: 320,
      streak: 3,
      badges: ['🌟']
    }
  ]);

  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const sendEncouragement = (buddy: StudyBuddy) => {
    toast({
      title: "Encouragement sent! 💪",
      description: `You sent motivation to ${buddy.name}`,
    });
  };

  const joinStudySession = (session: StudySession) => {
    toast({
      title: "Joined study session! 🎓",
      description: `Now studying: ${session.currentTopic}`,
    });
  };

  const shareProgress = () => {
    toast({
      title: "Progress shared! 📤",
      description: "Your achievements have been shared with study buddies",
    });
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Study Buddies */}
      <Card className="card-vedic p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-cinzel font-semibold text-sacred-gold">Study Buddies</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
          >
            <Users className="w-4 h-4 mr-2" />
            Find More
          </Button>
        </div>

        <div className="space-y-3">
          {studyBuddies.map((buddy) => (
            <div key={buddy.id} className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-sacred-gold/20 rounded-full flex items-center justify-center text-lg">
                    {buddy.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                    buddy.status === 'online' ? 'bg-green-400' :
                    buddy.status === 'studying' ? 'bg-orange-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-manuscript-cream">{buddy.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Level {buddy.level} • {buddy.status === 'studying' ? `Studying: ${buddy.currentLesson}` : buddy.status}
                  </div>
                  {buddy.score && (
                    <Badge className="bg-lotus-pink/10 text-lotus-pink border-lotus-pink/30 mt-1">
                      Latest: {buddy.score}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => sendEncouragement(buddy)}
                  className="text-sacred-gold hover:bg-sacred-gold/10"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="text-lotus-pink hover:bg-lotus-pink/10"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Study Sessions */}
      <Card className="card-vedic p-6">
        <h3 className="text-xl font-cinzel font-semibold text-sacred-gold mb-4">Live Study Sessions</h3>
        
        <div className="space-y-3">
          {studySessions.filter(session => session.isActive).map((session) => (
            <div key={session.id} className="p-4 bg-gradient-to-r from-sacred-gold/10 to-lotus-pink/10 rounded-lg border border-sacred-gold/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-cinzel font-medium text-manuscript-cream">{session.title}</h4>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30 animate-pulse">
                  Live
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Currently: {session.currentTopic}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">Participants:</span>
                    {session.participants.map((participant, index) => (
                      <span key={index} className="text-lg">
                        {participant.avatar}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => joinStudySession(session)}
                  className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
                >
                  Join Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="card-vedic p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-cinzel font-semibold text-sacred-gold">Weekly Leaderboard</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={shareProgress}
            className="border-sacred-gold/30 text-sacred-gold hover:bg-sacred-gold/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div key={entry.user.id} className={`flex items-center space-x-4 p-3 rounded-lg ${
              entry.rank === 1 ? 'bg-gradient-to-r from-sacred-gold/20 to-sacred-gold/10 border border-sacred-gold/30' :
              entry.rank === 2 ? 'bg-gray-500/10 border border-gray-500/30' :
              entry.rank === 3 ? 'bg-temple-bronze/10 border border-temple-bronze/30' :
              'bg-card/30'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  entry.rank === 1 ? 'bg-sacred-gold text-primary-foreground' :
                  entry.rank === 2 ? 'bg-gray-400 text-primary-foreground' :
                  entry.rank === 3 ? 'bg-temple-bronze text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {entry.rank === 1 ? <Crown className="w-4 h-4" /> : entry.rank}
                </div>
                
                <div className="w-10 h-10 bg-sacred-gold/20 rounded-full flex items-center justify-center text-lg">
                  {entry.user.avatar}
                </div>
                
                <div>
                  <div className="font-medium text-manuscript-cream">{entry.user.name}</div>
                  <div className="text-sm text-muted-foreground">Level {entry.user.level}</div>
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <div className="font-bold text-sacred-gold">{entry.weeklyXP} XP</div>
                <div className="text-sm text-muted-foreground">{entry.streak} day streak</div>
              </div>
              
              <div className="flex space-x-1">
                {entry.badges.map((badge, index) => (
                  <span key={index} className="text-lg">{badge}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Chat */}
      {showChat && (
        <Card className="card-vedic p-4">
          <h4 className="font-cinzel font-medium text-manuscript-cream mb-3">Study Group Chat</h4>
          
          <div className="bg-card/30 rounded-lg p-3 mb-3 h-32 overflow-y-auto text-sm">
            <div className="space-y-2">
              <div className="text-muted-foreground">
                <span className="text-sacred-gold">Priya:</span> Just finished the vowel pronunciation quiz! 🎉
              </div>
              <div className="text-muted-foreground">
                <span className="text-lotus-pink">Arjun:</span> Great job! I'm working on the same lesson.
              </div>
              <div className="text-muted-foreground">
                <span className="text-temple-bronze">You:</span> Let's practice together! 📚
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                if (message.trim()) {
                  setMessage('');
                  toast({
                    title: "Message sent! 💬",
                    description: "Your message was sent to the study group",
                  });
                }
              }}
              className="bg-sacred-gold text-primary-foreground hover:bg-sacred-gold/90"
            >
              Send
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};