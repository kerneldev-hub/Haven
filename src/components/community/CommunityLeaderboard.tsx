import React, { useState } from 'react';
import { Trophy, Gamepad2, Code, Palette, Medal } from 'lucide-react';
import { Card, CardContent } from '../ui/components';
import { Badge } from '../ui/Badge';

export function CommunityLeaderboard() {
  const [activeTab, setActiveTab] = useState('Dev');

  const categories = [
    { name: 'Dev', icon: Code },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Art', icon: Palette },
  ];

  const leaderboards: Record<string, { rank: number; name: string; score: number; avatar: string }[]> = {
    Dev: [
      { rank: 1, name: 'Sarah', score: 12450, avatar: 'S' },
      { rank: 2, name: 'Dave', score: 11200, avatar: 'D' },
      { rank: 3, name: 'Alex', score: 9800, avatar: 'A' },
      { rank: 4, name: 'Ken', score: 8450, avatar: 'K' },
      { rank: 5, name: 'Mia', score: 7200, avatar: 'M' },
    ],
    Gaming: [
      { rank: 1, name: 'Alex', score: 15400, avatar: 'A' },
      { rank: 2, name: 'Ken', score: 14200, avatar: 'K' },
      { rank: 3, name: 'Mia', score: 11800, avatar: 'M' },
    ],
    Art: [
      { rank: 1, name: 'Mia', score: 18450, avatar: 'M' },
      { rank: 2, name: 'Sarah', score: 9200, avatar: 'S' },
      { rank: 3, name: 'Dave', score: 8100, avatar: 'D' },
    ]
  };

  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-500 bg-yellow-500/10';
      case 2: return 'text-slate-400 bg-slate-400/10';
      case 3: return 'text-amber-700 bg-amber-700/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold tracking-tight">Top Contributors</h3>
          </div>
        </div>
        
        <div className="flex border-b border-border/50">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.name}
                onClick={() => setActiveTab(c.name)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors
                  ${activeTab === c.name 
                    ? 'text-foreground border-b-2 border-primary' 
                    : 'text-muted-foreground hover:bg-muted/30'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {c.name}
              </button>
            )
          })}
        </div>

        <div className="p-2 space-y-1 max-h-64 overflow-y-auto no-scrollbar">
          {leaderboards[activeTab].map((user) => (
            <div key={user.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${getRankStyle(user.rank)}`}>
                {user.rank}
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shadow-sm">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{user.score.toLocaleString()} XP</p>
              </div>
              {user.rank === 1 && <Medal className="w-4 h-4 text-yellow-500 drop-shadow-sm" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
