import React, { useState } from 'react';
import { 
  Hash, Plus, MailOpen, Send, Trash2, ArrowUpRight, 
  Tag, DownloadCloud, Sparkles, MessageSquare, Copy, BookOpen 
} from 'lucide-react';
import { CommunityPost, CustomArtifact } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';

interface CommunitySectionProps {
  posts: CommunityPost[];
  setPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  onInstallSharedArtifact?: (art: CustomArtifact) => void;
}

export default function CommunitySection({
  posts,
  setPosts,
  onInstallSharedArtifact
}: CommunitySectionProps) {
  const [channels, setChannels] = useState<{ id: string; name: string; icon: string }[]>(() => {
    return [
      { id: 'development-rails', name: 'development-rails', icon: '💻' },
      { id: 'software-lore', name: 'software-lore', icon: '✨' },
      { id: 'payment-flows', name: 'payment-flows', icon: '💳' },
      { id: 'releases', name: 'releases-pipeline', icon: '🚀' }
    ];
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('all');
  const [newChannelVal, setNewChannelVal] = useState('');
  const [showChannelForm, setShowChannelForm] = useState(false);

  // Forms for new broadcast post
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postTag, setPostTag] = useState('Development');
  const [postChannel, setPostChannel] = useState('development-rails');

  const [notification, setNotification] = useState<string | null>(null);

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelVal.trim()) return;
    const cleanId = newChannelVal.trim().toLowerCase().replace(/\s+/g, '-');
    if (channels.some(c => c.id === cleanId)) return;
    
    setChannels(prev => [...prev, { id: cleanId, name: cleanId, icon: '🔥' }]);
    setNewChannelVal('');
    setShowChannelForm(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postBody.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'operator_node',
      title: postTitle.trim(),
      body: postBody.trim(),
      likes: 0,
      commentsCount: 0,
      tag: postTag,
      channelId: postChannel
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('haven_community_posts_v3', JSON.stringify(updated));

    setPostTitle('');
    setPostBody('');
    setNotification("Blueprint broadcast completed successfully.");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('haven_community_posts_v3', JSON.stringify(updated));
  };

  // Highly useful workflow integration: Extracts community post text and appends it to active Workspace Notes
  const handleExtractToWorkspace = (post: CommunityPost) => {
    try {
      const savedSpaces = localStorage.getItem('haven_v3_spaces');
      if (!savedSpaces) {
        setNotification("Initiate a Workspace first to enable node extraction.");
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      
      const parsed = JSON.parse(savedSpaces);
      if (parsed.length === 0) {
        setNotification("Configure a Project Space first to host this note.");
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      // Append extracted community text to first space (or active space if saved)
      parsed[0].notes = `${parsed[0].notes || ''}\n\n---\n[EXTRACTED COMMUNITY MEMO - Channel #${post.channelId}]\nTitle: ${post.title}\nAuthor: @${post.author}\nContent:\n${post.body}\n---`;
      
      localStorage.setItem('haven_v3_spaces', JSON.stringify(parsed));
      setNotification(`Extracted directly into Space "${parsed[0].name}" Notes!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      setNotification("Failed to capture node configuration.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filteredPosts = activeChannelId === 'all' 
    ? posts 
    : posts.filter(p => p.channelId === activeChannelId);

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* LEFT PANEL: CHANNELS NAVIGATION */}
      <div className="lg:col-span-3 bg-card/65 border border-border/80 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/20">
          <span className="text-[10px] tracking-wider font-mono font-bold text-zinc-500 uppercase">CHANNELS DIRECTORY</span>
          <button 
            onClick={() => setShowChannelForm(!showChannelForm)}
            className="text-primary hover:text-white cursor-pointer"
            title="Create a tech broadcast channel"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* CHANNEL CREATOR */}
        {showChannelForm && (
          <form onSubmit={handleCreateChannel} className="p-3 bg-[#050608] border border-border/60 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Channel ID</span>
            <input 
              type="text" 
              required 
              placeholder="e.g. build-logs"
              value={newChannelVal}
              onChange={(e) => setNewChannelVal(e.target.value)}
              className="w-full text-xs h-7 px-2.5 bg-background border border-border rounded focus:border-zinc-500 outline-none text-zinc-200"
            />
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setShowChannelForm(false)} className="text-[10px] text-zinc-500">Cancel</button>
              <button type="submit" className="text-[10px] text-primary font-bold">Mount</button>
            </div>
          </form>
        )}

        {/* ACTIVE CHANNELS ITERATION */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveChannelId('all')}
            className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left ${
              activeChannelId === 'all' 
                ? 'bg-zinc-900 border border-border/60 text-primary' 
                : 'text-zinc-400 hover:bg-zinc-900/15 hover:text-foreground'
            }`}
          >
            <span>📜</span>
            <span className="font-mono"># all-broadcasts</span>
          </button>

          {channels.map((chan) => (
            <button 
              key={chan.id}
              onClick={() => setActiveChannelId(chan.id)}
              className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                activeChannelId === chan.id 
                  ? 'bg-zinc-900 border border-border/60 text-primary' 
                  : 'text-zinc-400 hover:bg-zinc-900/15 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span>{chan.icon}</span>
                <span className="font-mono truncate"># {chan.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CANVAS: BROADCAST FEED */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* POST FORM TRIGGER */}
        <div className="bg-card/60 border border-border/85 rounded-2xl p-5 space-y-4">
          <div className="pb-2 border-b border-border/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
              <h4 className="text-xs uppercase font-mono font-black text-zinc-200">
                Broadcast Technical Blueprint
              </h4>
            </div>
            <span className="text-[9px] font-mono text-zinc-550">BROADCAST NODE: ONLINE</span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4 text-left">
            <div className="grid md:grid-cols-12 gap-4">
              <div className="md:col-span-8 flex flex-col gap-1">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Title Blueprint</span>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Optimized Stripe checkouts under heavy edge request loads..." 
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="text-xs h-9 px-3 bg-zinc-950 border border-border/60 rounded-xl focus:border-zinc-500 outline-none text-zinc-200 font-medium"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Category Tag</span>
                <select 
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="text-xs h-9 px-2.5 bg-zinc-950 border border-border/60 text-zinc-350 rounded-xl outline-none focus:border-zinc-500"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Billing Details">Billing Details</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Target Channel</span>
                <select 
                  value={postChannel}
                  onChange={(e) => setPostChannel(e.target.value)}
                  className="text-xs h-9 px-2.5 bg-zinc-950 border border-border/60 text-zinc-350 rounded-xl outline-none focus:border-zinc-500"
                >
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}>#{ch.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Memo Body Markdown</span>
              <textarea 
                required 
                rows={4}
                placeholder="Share your structured code patterns, architectural insights, or design negative-space layout guidelines..." 
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="w-full text-xs p-3 font-sans leading-relaxed bg-zinc-950 border border-border/60 rounded-xl focus:border-zinc-500 outline-none text-zinc-300"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="h-9 px-4 text-xs font-bold font-sans cursor-pointer">
                Commit Broadcast Pipe
              </Button>
            </div>
          </form>
        </div>

        {/* FEED POSTS MAP */}
        <div className="space-y-4 pr-1">
          {filteredPosts.length === 0 ? (
            <div className="py-12 bg-card/30 border border-dashed border-border/30 rounded-2xl text-center text-xs text-zinc-500 font-sans">
              No technical blueprints reported on active channel directory yet.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-[#08090b] border border-border/65 rounded-2xl p-5 space-y-4 hover:border-zinc-750 transition-colors">
                
                {/* HEADER INFO */}
                <div className="flex items-center justify-between border-b border-border/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-border/30 flex items-center justify-center font-mono text-[9px] text-zinc-500 select-none">
                      OP
                    </div>
                    <div>
                      <span className="text-xs font-black text-foreground">@{post.author}</span>
                      <span className="text-zinc-650 font-mono text-[9px] mx-1.5">•</span>
                      <span className="text-[10px] text-zinc-500 font-mono">channel/<strong>#{post.channelId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[8.5px] font-mono font-bold uppercase tracking-wider">{post.tag}</Badge>
                    {post.author === 'operator_node' && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-zinc-650 hover:text-red-400 p-1 rounded hover:bg-zinc-900/10 cursor-pointer"
                        title="Delete broadcast"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* POST BODY */}
                <div className="text-left space-y-2">
                  <h5 className="text-xs font-black text-zinc-200 font-sans tracking-tight leading-relaxed">
                    {post.title}
                  </h5>
                  {(() => {
                    const artMatch = post.body.match(/\[ARTIFACT_DATA:(.*?)\]/);
                    let sharedArtifact: CustomArtifact | null = null;
                    if (artMatch) {
                      try { sharedArtifact = JSON.parse(artMatch[1]); } catch (e) {}
                    }
                    const displayBody = post.body.replace(/\[ARTIFACT_DATA:.*?\]/, "").trim();
                    return (
                      <div className="space-y-3">
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans whitespace-pre-line select-text">
                          {displayBody}
                        </p>
                        {sharedArtifact && (
                          <div className="p-3.5 bg-zinc-900/60 border border-border/40 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs select-none">
                            <div>
                              <span className="text-[9px] font-mono font-extrabold uppercase text-primary tracking-wider">Custom Widget Bundle</span>
                              <div className="font-bold text-zinc-200">{sharedArtifact.name}</div>
                              <div className="text-[10px] text-zinc-500 font-sans mt-0.5">Blueprint: {sharedArtifact.blueprintName}</div>
                            </div>
                            <button
                              onClick={() => {
                                if (onInstallSharedArtifact && sharedArtifact) {
                                  onInstallSharedArtifact(sharedArtifact);
                                  setNotification(`Successfully mounted "${sharedArtifact.name}" onto your active Dashboard!`);
                                  setTimeout(() => setNotification(null), 3500);
                                }
                              }}
                              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/15 border border-primary/25 hover:border-zinc-300 text-primary hover:text-white rounded-lg text-[10.5px] font-bold cursor-pointer font-sans shrink-0 flex items-center justify-center gap-1.5 transition-all"
                            >
                              <DownloadCloud className="w-3.5 h-3.5" />
                              <span>Mount to Dashboard</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* DYNAMIC ACTION WORKFLOW: EXACT NOTE TO SPACE */}
                <div className="pt-3 border-t border-border/10 flex items-center justify-between text-[11px] font-mono">
                  <button 
                    onClick={() => handleExtractToWorkspace(post)}
                    className="px-2.5 py-1 text-primary hover:text-white bg-primary/10 border border-primary/25 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-primary/15 flex items-center gap-1 transition-all"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Extract Memo context to Workspace Notes</span>
                  </button>

                  <span className="text-zinc-650 text-[10px] select-none">Shared community component</span>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* FLOAT TOAST NOTIF */}
      {notification && (
        <div className="fixed bottom-14 right-6 p-4 rounded-xl border border-primary/25 bg-black/95 text-left text-xs font-mono text-zinc-200 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-ping" />
            <span>{notification}</span>
          </div>
        </div>
      )}

    </div>
  );
}
