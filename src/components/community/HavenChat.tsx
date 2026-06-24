import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, ArrowLeft, Users } from 'lucide-react';
import { Button } from '../ui/components';
import { getAblyClient } from '../../lib/ablyClient';

interface Message {
  id: string;
  user: string;
  content: string;
  time: string;
}

export function HavenChat({ channelName, onClose }: { channelName: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [currentUsername, setCurrentUsername] = useState('You');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setCurrentUsername(data.username);
        }
      })
      .catch(err => console.error("Error fetching me:", err));
  }, []);

  // Load chat history & subscribe to Ably real-time events
  useEffect(() => {
    // 1. Fetch DB history
    fetch(`/api/chat/messages?roomId=${encodeURIComponent(channelName)}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.status === 'ok' && Array.isArray(resData.data)) {
          const loaded = resData.data.map((msg: any) => ({
            id: msg.id,
            user: msg.user || 'User',
            content: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(loaded);
        }
      })
      .catch(err => console.error("Error loading chat history:", err));

    // 2. Setup Ably connection
    let channel: any = null;
    let isSubscribed = true;

    try {
      const ably = getAblyClient();
      channel = ably.channels.get(`chat:${channelName}`);

      // Subscribe to real-time messages
      channel.subscribe('message', (message: any) => {
        if (!isSubscribed) return;
        const msgData = message.data;
        
        // Deduplicate messages already in state
        setMessages(prev => {
          if (prev.some(m => m.id === msgData.id)) return prev;
          return [...prev, {
            id: msgData.id,
            user: msgData.user,
            content: msgData.content,
            time: new Date(msgData.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }];
        });
      });

      // Join Presence
      channel.presence.enter({ username: currentUsername });

      // Track online presence members
      const updatePresence = () => {
        channel.presence.get((err: any, members: any[]) => {
          if (!err && isSubscribed && members) {
            setOnlineCount(members.length || 1);
          }
        });
      };

      channel.presence.subscribe('enter', updatePresence);
      channel.presence.subscribe('leave', updatePresence);
      channel.presence.subscribe('update', updatePresence);
      
      // Initial count
      updatePresence();

    } catch (err) {
      console.warn("Ably client connection skipped or unconfigured. Falling back to simulation.", err);
    }

    return () => {
      isSubscribed = false;
      if (channel) {
        try {
          channel.unsubscribe();
          channel.presence.leave();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [channelName, currentUsername]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    setInputValue('');

    const tempId = `temp_${Date.now()}`;

    // 1. Persist message to backend SQLite Database
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: channelName, content: messageText })
      });
      const resData = await res.json();

      if (resData.status === 'ok') {
        const dbMsg = resData.data;

        // 2. Publish to Ably Realtime channel
        try {
          const ably = getAblyClient();
          const channel = ably.channels.get(`chat:${channelName}`);
          channel.publish('message', {
            id: dbMsg.id,
            user: currentUsername,
            content: messageText,
            createdAt: dbMsg.createdAt
          });
        } catch (ablyErr) {
          // If Ably is unconfigured, manually update local state for preview
          setMessages(prev => [...prev, {
            id: dbMsg.id,
            user: currentUsername,
            content: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      }
    } catch (dbErr) {
      console.error("Failed to save chat message", dbErr);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background border-r border-border/50">
      <div className="px-6 py-4 border-b border-border shadow-sm flex items-center justify-between bg-card/60 backdrop-blur-md">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1 -ml-2 text-muted-foreground lg:hidden" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Hash className="w-5 h-5 text-muted-foreground" />
          {channelName}
        </h2>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/15">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Users className="w-3.5 h-3.5 mr-0.5 text-emerald-500" />
          {onlineCount} active
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.user === currentUsername ? 'justify-end' : ''}`}>
            {msg.user !== currentUsername && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-1 uppercase text-foreground">
                {msg.user[0] || 'U'}
              </div>
            )}
            <div className={`flex flex-col ${msg.user === currentUsername ? 'items-end' : ''}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm text-foreground">{msg.user}</span>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-sm sm:max-w-md text-sm leading-relaxed ${
                msg.user === currentUsername 
                  ? 'bg-primary text-primary-foreground rounded-br-sm font-medium' 
                  : 'bg-muted text-foreground rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card/30">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="w-full bg-muted border border-border/50 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-2 text-muted-foreground hover:text-primary hover:bg-transparent"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
