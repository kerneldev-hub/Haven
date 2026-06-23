import React, { useState } from 'react';
import { Send, Check, CheckCheck, MapPin, Hash, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/components';

export function HavenChat({ channelName, onClose }: { channelName: string; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Sarah', content: 'Has anyone seen the new design docs?', time: '10:42 AM', status: 'read' },
    { id: 2, user: 'Alex', content: 'Yeah, I added some comments on page 3.', time: '10:45 AM', status: 'read' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: 'You',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered' // initial status
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate reading after 2 seconds
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
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
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.user === 'You' ? 'justify-end' : ''}`}>
            {msg.user !== 'You' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                {msg.user[0]}
              </div>
            )}
            <div className={`flex flex-col ${msg.user === 'You' ? 'items-end' : ''}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm">{msg.user}</span>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-sm sm:max-w-md text-sm ${
                msg.user === 'You' 
                  ? 'bg-primary text-primary-foreground rounded-br-sm' 
                  : 'bg-muted text-foreground rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              {msg.user === 'You' && (
                <div className="text-[10px] items-center gap-1 mt-1 text-muted-foreground flex justify-end">
                  {msg.status === 'read' ? (
                    <span className="flex items-center text-primary"><CheckCheck className="w-3 h-3 mr-0.5" /> Read</span>
                  ) : (
                    <span className="flex items-center"><Check className="w-3 h-3 mr-0.5" /> Delivered</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-card/30">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="w-full bg-muted border border-border/50 text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
