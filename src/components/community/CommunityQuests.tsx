import React, { useState } from 'react';
import { Target, CheckCircle2, ChevronRight, Trophy, Star, Gamepad2, Code, Tv } from 'lucide-react';
import { Card, CardContent } from '../ui/components';
import { Badge } from '../ui/Badge';

export function CommunityQuests() {
  const [quests, setQuests] = useState([
    { id: 1, title: 'Comment on 3 gaming posts', category: 'Gaming', icon: Gamepad2, xp: 50, progress: 1, total: 3, completed: false },
    { id: 2, title: 'Bookmark an API resource to profile', category: 'Dev', icon: Code, xp: 80, progress: 0, total: 1, completed: false },
    { id: 3, title: 'Ask Haven AI Copilot to code a script', category: 'Dev', icon: Star, xp: 120, progress: 0, total: 1, completed: false },
    { id: 4, title: 'Join an Anime voice lobby', category: 'Anime', icon: Tv, xp: 30, progress: 0, total: 1, completed: false },
    { id: 5, title: 'Give feedback on a design', category: 'Art', icon: Target, xp: 50, progress: 0, total: 1, completed: false },
  ]);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold tracking-tight">Daily Quests</h3>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
            Resets in 12h
          </Badge>
        </div>
        <div className="divide-y divide-border/50">
          {quests.map((quest) => {
            const Icon = quest.icon;
            return (
              <div key={quest.id} className={`p-4 transition-colors hover:bg-muted/10 ${quest.completed ? 'opacity-60' : ''}`}>
                <div className="flex gap-3">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${quest.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {quest.completed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold ${quest.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {quest.title}
                      </p>
                      <span className="flex items-center text-xs font-bold text-amber-500 ml-2 whitespace-nowrap">
                        +{quest.xp} XP
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                       <span className="uppercase tracking-wider font-semibold">{quest.category}</span>
                       <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{quest.progress} / {quest.total}</span>
                    </div>
                    {!quest.completed && (
                      <div className="w-full bg-muted rounded-full h-1.5 mt-3 overflow-hidden">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
