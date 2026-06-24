import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Hash, Loader2 } from 'lucide-react';
import { useAblyChannel } from '../../hooks/useAbly';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  content: string;
  createdAt: string;
}

interface Props {
  roomId: string;
  roomName?: string;
}

export function LiveChat({ roomId, roomName = 'general' }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { subscribe, publish, connected } = useAblyChannel(`chat:${roomId}`);

  // Load history
  useEffect(() => {
    setLoading(true);
    fetch(`/api/chat/${roomId}/history`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  // Subscribe to real-time messages
  useEffect(() => {
    return subscribe('message', (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.data.id)) return prev;
        return [...prev, msg.data];
      });
    });
  }, [subscribe]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || sending || !user) return;

    setInput('');
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${roomId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (data.success) {
        const newMsg: Message = {
          id: data.id,
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          content,
          createdAt: new Date().toISOString(),
        };
        publish('message', newMsg);
      }
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  }, [input, sending, user, roomId, publish]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{roomName}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${connected ? 'text-emerald-500' : 'text-muted-foreground'}`}>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
          {connected ? 'Live' : 'Connecting...'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full bg-muted/50 shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold">
                {msg.avatarUrl
                  ? <img src={msg.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  : (msg.displayName || msg.username)[0].toUpperCase()
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-foreground">
                    {msg.displayName || msg.username}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        {!user ? (
          <div className="text-center text-xs text-muted-foreground py-3 border border-dashed border-border rounded-xl">
            Sign in to join the conversation
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-xl px-4 py-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-5 max-h-24"
              placeholder={`Message #${roomName}`}
              disabled={!connected}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending || !connected}
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
