import React, { useState } from 'react';
import { LiveChat } from '../components/ui/LiveChat';
import { VoiceChatRoom } from '../components/ui/VoiceChatRoom';
import { Hash, Volume2 } from 'lucide-react';

const textChannels = ['general', 'announcements', 'showcase', 'support'];
const voiceChannels = ['dev-lounge', 'design-lab', 'gaming'];

export default function CommunityPage() {
  const [activeTextChannel, setActiveTextChannel] = useState('general');
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border flex flex-col bg-card/40">
        <div className="px-4 py-5 border-b border-border">
          <h2 className="font-bold text-sm">Haven Community</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Public workspace</p>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Text Channels</p>
            {textChannels.map(ch => (
              <button
                key={ch}
                onClick={() => {
                  setActiveTextChannel(ch);
                  setActiveVoiceChannel(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors mb-0.5 ${
                  activeTextChannel === ch && !activeVoiceChannel
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Hash className="w-4 h-4 shrink-0" />
                {ch}
              </button>
            ))}
          </div>

          <div className="px-4 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Voice Channels</p>
            {voiceChannels.map(ch => (
              <button
                key={ch}
                onClick={() => setActiveVoiceChannel(ch)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors mb-0.5 ${
                  activeVoiceChannel === ch
                    ? 'bg-emerald-500/10 text-emerald-500 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeVoiceChannel ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <VoiceChatRoom roomId={activeVoiceChannel} roomName={activeVoiceChannel} />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <LiveChat roomId={activeTextChannel} roomName={activeTextChannel} />
          </div>
        )}
      </div>
    </div>
  );
}
