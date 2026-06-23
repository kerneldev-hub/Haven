import React, { useState } from 'react';
import { 
  CheckSquare, Plus, PlusCircle, Trash2, Heart, MessageSquare, 
  Share2, Shield, Activity, User, PlusIcon, Layers, EyeOff, Hash
} from 'lucide-react';
import { CommunityPost } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';

interface CommunitySectionProps {
  posts: CommunityPost[];
  setPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
}

export default function CommunitySection({
  posts,
  setPosts
}: CommunitySectionProps) {
  // Feed views toggling
  const [activeChannelId, setActiveChannelId] = useState<string>('all');
  
  // Custom Dynamic Channels State
  const [channels, setChannels] = useState<string[]>(() => {
    const saved = localStorage.getItem('haven_custom_channels_list');
    return saved ? JSON.parse(saved) : ['🚀 general-topics', '💻 development-rails', '🎮 games-and-gaming', '✨ software-lore'];
  });
  
  const [newChannelInput, setNewChannelInput] = useState('');
  const [isAddingChannel, setIsAddingChannel] = useState(false);

  // New Post Form States
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    body: '',
    selectedChannel: 'general-topics',
    tag: 'General'
  });

  const handleAddChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelInput.trim()) return;
    
    // Normalize format to look like slack channels
    const formatted = newChannelInput.trim().toLowerCase().replace(/\s+/g, '-');
    const symbol = formatted.startsWith('🚀') || formatted.startsWith('💻') || formatted.startsWith('🎮') || formatted.startsWith('✨')
      ? ''
      : '🤖 ';
    
    const updated = [...channels, `${symbol}${formatted}`];
    setChannels(updated);
    localStorage.setItem('haven_custom_channels_list', JSON.stringify(updated));
    setNewChannelInput('');
    setIsAddingChannel(false);
  };

  const handleRemoveChannel = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (channels.length <= 1) return;
    const toRemove = channels[idx];
    const updated = channels.filter((_, i) => i !== idx);
    setChannels(updated);
    localStorage.setItem('haven_custom_channels_list', JSON.stringify(updated));
    
    // Clear filter
    const cleanedToRemoveName = toRemove.replace(/^[^\s]+\s+/, '');
    const cleanedActiveName = activeChannelId.replace(/^[^\s]+\s+/, '');
    if (cleanedToRemoveName === cleanedActiveName) {
      setActiveChannelId('all');
    }
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.body.trim()) return;

    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      author: 'operator_node',
      title: postForm.title.trim(),
      body: postForm.body.trim(),
      likes: 1,
      commentsCount: 0,
      tag: postForm.tag,
      channelId: postForm.selectedChannel,
      timestamp: new Date().toLocaleTimeString()
    };

    setPosts([newPost, ...posts]);
    setPostForm({
      title: '',
      body: '',
      selectedChannel: channels[0].replace(/^[^\s]+\s+/, ''),
      tag: 'General'
    });
    setIsCreatingPost(false);
  };

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (activeChannelId === 'all') return true;
    
    // Check clean comparisons (remove emoji prefixes for robust string check)
    const normalizedChannelId = p.channelId ? p.channelId.replace(/^[^\s]+\s+/, '') : 'general-topics';
    const cleanActiveId = activeChannelId.replace(/^[^\s]+\s+/, '');
    return normalizedChannelId === cleanActiveId;
  });

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* CHANNEL MANAGEMENT COLUMN (LEFT: col-span-4) */}
      <div className="lg:col-span-4 bg-card/65 border border-border/80 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/20">
          <div>
            <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-500 uppercase">STREAMLINED INTERFACE</span>
            <h3 className="text-xs font-black text-foreground">Community Channels</h3>
          </div>
          <button 
            onClick={() => setIsAddingChannel(true)}
            className="text-primary hover:text-white cursor-pointer"
            title="Create channel on the fly"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10.5px] text-muted-foreground leading-normal">
          Toggle custom channels to filter public files, technical specifications, and conversations instantly. Create unlimited nodes dynamically.
        </p>

        {/* INLINE CHANNEL CREATOR ADD-ON */}
        {isAddingChannel && (
          <form onSubmit={handleAddChannelSubmit} className="p-3 bg-zinc-900/40 border border-border/40 rounded-xl space-y-2 text-left">
            <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 block">Channel Registry Name</span>
            <input 
              type="text" 
              required
              placeholder="e.g. rust-compilers" 
              value={newChannelInput}
              onChange={(e) => setNewChannelInput(e.target.value)}
              className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
            />
            <div className="flex gap-2 justify-end pt-1">
              <button 
                type="button" 
                onClick={() => setIsAddingChannel(false)} 
                className="text-[10px] text-zinc-500"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="text-[10px] text-primary font-bold cursor-pointer"
              >
                Assemble Channel
              </button>
            </div>
          </form>
        )}

        {/* CHANNELS LIST */}
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
          {/* ALL CHANNELS TOGGLE */}
          <div 
            onClick={() => setActiveChannelId('all')}
            className={`p-2.5 rounded-xl cursor-pointer select-none text-xs flex items-center justify-between transition-colors ${
              activeChannelId === 'all' 
                ? 'bg-zinc-800/15 text-primary border border-primary/20' 
                : 'bg-[#0a0b0c]/60 text-muted-foreground border border-transparent hover:bg-zinc-850/10'
            }`}
          >
            <span className="font-mono font-bold">📂 list-all-channels</span>
            <Badge className="bg-[#15191c] border-border text-zinc-400 text-[9px] px-1 font-mono">{posts.length}</Badge>
          </div>

          {channels.map((chan, idx) => {
            const cleanChanId = chan.replace(/^[^\s]+\s+/, '');
            const isSelected = activeChannelId === cleanChanId;
            const chanPostCount = posts.filter(p => (p.channelId || 'general-topics') === cleanChanId).length;
            
            return (
              <div 
                key={idx}
                onClick={() => setActiveChannelId(cleanChanId)}
                className={`p-2.5 rounded-xl cursor-pointer select-none text-xs flex items-center justify-between group transition-colors ${
                  isSelected 
                    ? 'bg-zinc-800/15 text-primary border border-primary/20' 
                    : 'bg-[#0a0b0c]/60 text-muted-foreground border border-transparent hover:bg-zinc-850/10'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <Hash className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                  <span className="font-mono text-[11px] truncate font-bold">{chan}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-[#15191c] border-border text-zinc-400 text-[9px] px-1 font-mono shrink-0">{chanPostCount}</Badge>
                  <button 
                    onClick={(e) => handleRemoveChannel(idx, e)}
                    disabled={channels.length <= 1}
                    className="text-zinc-650 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FEED DISPLAY COLUMN (RIGHT: col-span-8) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* ACTION PANEL: NEW POST TRIGGERS */}
        <div className="bg-card/65 border border-border/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-left">
          <div>
            <h4 className="text-xs font-black text-foreground uppercase tracking-widest">Active Community Hub</h4>
            <p className="text-[10.5px] text-muted-foreground mt-0.5">Filter: <strong className="font-mono text-zinc-300">#{activeChannelId}</strong></p>
          </div>

          <Button 
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="h-9 px-4 font-bold text-xs bg-foreground text-background hover:bg-neutral-200 cursor-pointer rounded-xl"
          >
            {isCreatingPost ? "Collapse Form" : "Compose Broadcast"}
          </Button>
        </div>

        {/* CREATE POST STREAM INTERACTIVE */}
        {isCreatingPost && (
          <form onSubmit={handleCreatePostSubmit} className="bg-[#0b0c0e] border border-border/80 rounded-2xl p-4 space-y-3 text-left">
            <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-400 uppercase">Draft Broadcast</span>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Title of Broadcast</span>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dynamic CSS templates for V3..." 
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Target Channel Selection</span>
                <select 
                  value={postForm.selectedChannel}
                  onChange={(e) => setPostForm({ ...postForm, selectedChannel: e.target.value })}
                  className="w-full text-xs h-9 px-2 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
                >
                  {channels.map((chan, idx) => {
                    const clean = chan.replace(/^[^\s]+\s+/, '');
                    return (
                      <option key={idx} value={clean}>{chan}</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Tag Identifier</span>
              <select 
                value={postForm.tag}
                onChange={(e) => setPostForm({ ...postForm, tag: e.target.value })}
                className="w-full text-xs h-9 px-2 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
              >
                <option value="General">General</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Security">Security</option>
                <option value="SaaS Pricing">SaaS Pricing</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Body Content</span>
              <textarea 
                required
                rows={4}
                placeholder="Share your structured insights, configurations, repository references..."
                value={postForm.body}
                onChange={(e) => setPostForm({ ...postForm, body: e.target.value })}
                className="w-full text-xs p-3 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button 
                type="button" 
                onClick={() => setIsCreatingPost(false)} 
                className="text-[10px] text-zinc-550"
              >
                Cancel
              </button>
              <Button type="submit" size="sm" className="h-8 text-[11px] font-bold cursor-pointer">Post Broadcast</Button>
            </div>
          </form>
        )}

        {/* POSTS ITERATOR */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="py-12 bg-zinc-900/20 rounded-2xl border border-border/30 text-center text-xs text-zinc-500">
              No active broadcasts in channel #{activeChannelId}. Compose one above!
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="bg-card/55 border border-border/80 rounded-2xl p-5 space-y-4 text-left transition-colors hover:border-zinc-700/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-border/50 text-muted-foreground flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-foreground">@{post.author}</span>
                        <span className="text-[9.5px] px-1 bg-[#101512] border border-emerald-500/10 text-emerald-450 rounded font-bold uppercase">
                          {post.tag}
                        </span>
                        {post.channelId && (
                          <span className="text-[9px] text-zinc-550 font-mono font-bold">
                            #{post.channelId}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">Stream updated: {post.timestamp || 'Latent clock'}</span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleDeletePost(post.id, e)}
                    className="text-zinc-650 hover:text-red-400 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-left">
                  <h5 className="text-[13px] font-extrabold text-foreground tracking-tight leading-snug">{post.title}</h5>
                  <p className="text-[11.5px] text-zinc-300 leading-normal font-sans font-normal whitespace-pre-wrap">{post.body}</p>
                </div>

                {/* LIKE AND COMMENT FEEDBACK */}
                <div className="flex items-center gap-4 pt-3 border-t border-border/20 text-[10.5px]">
                  <button 
                    onClick={(e) => handleLikePost(post.id, e)}
                    className="flex items-center gap-1.5 text-zinc-450 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-500/70 fill-red-500/10 hover:fill-red-500/20" />
                    <span className="font-mono">{post.likes} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-zinc-450">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono">{post.commentsCount} Comments</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
