import React, { useState } from 'react';
import { Share2, X, Copy, CheckCircle2, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from './components';

interface ShareModalProps {
  url: string;
  title: string;
}

export function ShareModal({ url, title }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      bg: 'bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      bg: 'bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20'
    },
    {
      name: 'Reddit',
      icon: <MessageCircle className="w-4 h-4" />,
      url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      bg: 'bg-[#FF4500]/10 text-[#FF4500] hover:bg-[#FF4500]/20'
    }
  ];

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Share2 className="w-4 h-4 mr-2" /> Share
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold tracking-tight">Share Project</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Direct Link</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted px-4 py-2.5 rounded-lg text-sm font-mono text-muted-foreground truncate border border-border/50">
                      {url}
                    </div>
                    <Button onClick={handleCopy} variant={copied ? "secondary" : "default"} className="min-w-[80px]">
                      {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Share on Social</label>
                  <div className="grid grid-cols-3 gap-3">
                    {shareOptions.map((opt) => (
                      <a
                        key={opt.name}
                        href={opt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center justify-center gap-2 p-4 border border-transparent rounded-xl transition-colors ${opt.bg}`}
                      >
                        {opt.icon}
                        <span className="text-xs font-semibold">{opt.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
