import React, { useState } from 'react';
import { Mic, MicOff, Headphones, HeadphonesIcon, PhoneOff, Volume2, Settings2 } from 'lucide-react';
import { Button } from '../ui/components';

interface VoiceRoomProps {
  channelName: string;
  onDisconnect: () => void;
}

export function VoiceRoom({ channelName, onDisconnect }: VoiceRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [micVolume, setMicVolume] = useState(80);
  const [speakerVolume, setSpeakerVolume] = useState(100);

  return (
    <div className="p-3 bg-card border-t border-border/50 transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-emerald-500 font-bold flex items-center">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1.5"></span> 
          Voice Connected
        </span>
        <span className="text-muted-foreground truncate ml-2 font-medium">{channelName}</span>
      </div>

      <div className="flex gap-1 justify-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMuted(!isMuted)} 
          className={isMuted ? 'text-destructive bg-destructive/10' : ''}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDeafened(!isDeafened)} 
          className={isDeafened ? 'text-destructive bg-destructive/10' : ''}
          title={isDeafened ? "Undeafen" : "Deafen"}
        >
          {isDeafened ? <HeadphonesIcon className="w-4 h-4 text-destructive" /> : <Headphones className="w-4 h-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowSettings(!showSettings)}
          className={showSettings ? 'bg-primary/10 text-primary' : ''}
          title="Audio Settings"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={onDisconnect}
          title="Disconnect"
        >
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>

      {showSettings && (
        <div className="pt-2 border-t border-border/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Input (Mic)</span>
              <span>{micVolume}%</span>
            </div>
            <input 
              type="range" 
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              min="0" max="100" 
              value={micVolume} 
              onChange={(e) => setMicVolume(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Output (Speakers)</span>
              <span>{speakerVolume}%</span>
            </div>
            <input 
              type="range" 
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              min="0" max="200" 
              value={speakerVolume} 
              onChange={(e) => setSpeakerVolume(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
