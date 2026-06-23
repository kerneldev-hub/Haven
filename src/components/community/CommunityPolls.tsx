import React, { useState } from 'react';
import { BarChart2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../ui/components';
import { Badge } from '../ui/Badge';

export function CommunityPolls() {
  const [poll, setPoll] = useState({
    question: "What should be our next community event?",
    totalVotes: 156,
    options: [
      { id: 1, text: "Game Jam 2026", votes: 89, color: "bg-blue-500" },
      { id: 2, text: "Open Source Hackathon", votes: 45, color: "bg-emerald-500" },
      { id: 3, text: "Design Challenge", votes: 22, color: "bg-rose-500" },
    ],
    hasVoted: false,
    selectedOption: null as number | null
  });

  const handleVote = (id: number) => {
    if (poll.hasVoted) return;
    
    setPoll(prev => ({
      ...prev,
      hasVoted: true,
      selectedOption: id,
      totalVotes: prev.totalVotes + 1,
      options: prev.options.map(opt => 
        opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
      )
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            <h3 className="font-bold tracking-tight">Community Poll</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {poll.totalVotes} Votes
          </Badge>
        </div>
        <div className="p-4 space-y-4">
          <p className="font-medium text-sm">{poll.question}</p>
          <div className="space-y-3">
            {poll.options.map((option) => {
              const percentage = Math.round((option.votes / (poll.totalVotes || 1)) * 100);
              const isSelected = poll.selectedOption === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={poll.hasVoted}
                  className={`w-full relative overflow-hidden rounded-lg border p-3 flex justify-between items-center text-sm transition-all text-left
                    ${poll.hasVoted 
                      ? isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-border/50 bg-muted/10' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }`}
                >
                  {poll.hasVoted && (
                    <div 
                      className={`absolute top-0 left-0 bottom-0 opacity-10 transition-all duration-1000 ease-out ${option.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <span className="relative z-10 font-medium flex items-center gap-2">
                    {poll.hasVoted && isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    {option.text}
                  </span>
                  {poll.hasVoted && (
                    <span className="relative z-10 font-bold text-muted-foreground">
                      {percentage}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {poll.hasVoted && (
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold pt-2">
              Thanks for voting!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
