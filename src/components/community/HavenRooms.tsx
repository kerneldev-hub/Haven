import React, { useState } from 'react';
import { Hash, Volume2, Settings, Plus } from 'lucide-react';
import { Button } from '../ui/components';

import { VoiceRoom } from './VoiceRoom';

export function HavenRooms({ 
  activeTextChannel, 
  setActiveTextChannel 
}: { 
  activeTextChannel: string | null; 
  setActiveTextChannel: (id: string | null) => void;
}) {
  const [activeVoice, setActiveVoice] = useState<string | null>(null);

  const textChannels = [
    { id: 't1', name: 'general', unread: false },
    { id: 't2', name: 'announcements', unread: true },
    { id: 't3', name: 'help-and-support', unread: false },
  ];

  const voiceChannels = [
    { id: 'v1', name: 'Lobby', users: ['Alice', 'Bob'] },
    { id: 'v2', name: 'Pair Programming', users: ['Charlie'] },
    { id: 'v3', name: 'Gaming Lounge', users: [] },
  ];

  return (
    <div className="w-64 bg-card/50 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border/50 flex justify-between items-center shadow-sm">
        <h2 className="font-bold text-sm tracking-tight">Haven Rooms</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2 flex justify-between items-center">
            Text Channels
            <Button variant="ghost" size="icon" className="h-4 w-4"><Plus className="w-3 h-3" /></Button>
          </div>
          <div className="space-y-0.5">
            {textChannels.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveTextChannel(c.name)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                  ${activeTextChannel === c.name 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Hash className="w-4 h-4 opacity-50" />
                <span className={c.unread && activeTextChannel !== c.name ? 'font-bold text-foreground' : ''}>{c.name}</span>
                {c.unread && activeTextChannel !== c.name && <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"></span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2 flex justify-between items-center">
            Voice Channels
            <Button variant="ghost" size="icon" className="h-4 w-4"><Plus className="w-3 h-3" /></Button>
          </div>
          <div className="space-y-2">
            {voiceChannels.map(c => (
              <div key={c.id}>
                <button 
                  onClick={() => setActiveVoice(c.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${activeVoice === c.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  <Volume2 className="w-4 h-4 opacity-50" />
                  <span>{c.name}</span>
                </button>
                {c.users.length > 0 && (
                  <div className="pl-8 pr-2 py-1 space-y-1">
                    {c.users.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[10px]">{u[0]}</div>
                        <span>{u}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeVoice && (
        <VoiceRoom 
          channelName={voiceChannels.find(c => c.id === activeVoice)?.name || 'Unknown Channel'} 
          onDisconnect={() => setActiveVoice(null)} 
        />
      )}
      
      <div className="p-3 bg-muted/30 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
          <div className="truncate">
            <div className="text-xs font-bold truncate">John Doe</div>
            <div className="text-[10px] text-muted-foreground truncate">#4582</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
