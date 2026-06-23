import React, { useState, useEffect } from 'react';
import { HavenRooms } from './HavenRooms';
import { HavenChat } from './HavenChat';
import { 
  Sparkles, Gamepad2, Tv, Code, Palette, Search, 
  MessageSquare, Heart, ArrowLeft, Activity, Flame, 
  Trophy, GitBranch, ShieldAlert, BarChart2, CheckCircle2,
  Send, Target, Star, Globe, Award
} from 'lucide-react';
import { Card, CardContent, Button } from '../ui/components';
import { Badge } from '../ui/Badge';

interface FeedItem {
  id: string;
  type: 'discussion' | 'project_update' | 'contribution';
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  meta?: {
    category?: string;
    projectName?: string;
    badgeName?: string;
    xpEarned?: number;
    techIcon?: string;
    stackItem?: string;
  };
}

export function CommunityHub() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTextChannel, setActiveTextChannel] = useState<string | null>(null);
  
  // Consolidated central tab: 'feed' | 'quests' | 'polls' | 'leaderboard'
  const [currentTab, setCurrentTab] = useState<'feed' | 'quests' | 'polls' | 'leaderboard'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusInput, setStatusInput] = useState('');

  const isLoggedIn = localStorage.getItem('haven_session') === 'active';

  // --- DATA 1: DISCUSSIONS / BOOKMARKS ---
  const [bookmarkedDiscussions, setBookmarkedDiscussions] = useState<any[]>(() => {
    const saved = localStorage.getItem('haven_bookmarks_discussions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const toggleBookmarkDiscussion = (feed: any) => {
    const isBookmarked = bookmarkedDiscussions.some(item => item.id === feed.id);
    let newBookmarks = [];
    if (isBookmarked) {
      newBookmarks = bookmarkedDiscussions.filter(item => item.id !== feed.id);
    } else {
      newBookmarks = [...bookmarkedDiscussions, feed];
    }
    setBookmarkedDiscussions(newBookmarks);
    localStorage.setItem('haven_bookmarks_discussions', JSON.stringify(newBookmarks));
  };

  // --- DATA 2: LIVE ACTIVITY STREAM ---
  const [activities, setActivities] = useState<FeedItem[]>(() => {
    const saved = localStorage.getItem('haven_community_activities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'init-1',
        type: 'project_update',
        user: 'Sarah',
        avatar: 'S',
        content: 'Sarah integrated Gemini Developer API into "OmniApp" stack for zero-cost conversational routing.',
        timestamp: 'Just now',
        likes: 12,
        comments: 3,
        meta: { projectName: 'OmniApp', stackItem: 'Gemini Developer API', category: 'AI & Data' }
      },
      {
        id: 'init-2',
        type: 'contribution',
        user: 'Alex',
        avatar: 'A',
        content: 'Alex completed quest "Bookmark an API resource to profile" and unlocked "API Expert" Badge.',
        timestamp: '3m ago',
        likes: 18,
        comments: 0,
        meta: { badgeName: 'API Expert', xpEarned: 80, category: 'Dev' }
      },
      {
        id: 'init-3',
        type: 'discussion',
        user: 'gamerdzbba7',
        avatar: 'G',
        content: 'Are we default-routing our websocket client tokens via Ably or standard SSE? Getting weird latency on cold starts.',
        timestamp: '15m ago',
        likes: 4,
        comments: 6,
        meta: { category: 'Dev' }
      },
      {
        id: 'init-4',
        type: 'project_update',
        user: 'Mia',
        avatar: 'M',
        content: 'Mia added Polar.sh subscriptions and let-encrypt certificates to "CreativeHub" stack.',
        timestamp: '1h ago',
        likes: 8,
        comments: 2,
        meta: { projectName: 'CreativeHub', stackItem: 'Polar.sh', category: 'FOSS Alternatives' }
      },
      {
        id: 'init-5',
        type: 'contribution',
        user: 'Ken',
        avatar: 'K',
        content: 'Ken reached Level 15 (Max Level) after publishing top-voted Docker compose scripts!',
        timestamp: '2h ago',
        likes: 45,
        comments: 11,
        meta: { xpEarned: 240, category: 'Global' }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('haven_community_activities', JSON.stringify(activities));
  }, [activities]);

  // Simulate real-time community events crawling in
  useEffect(() => {
    const mockUsers = ['Mia', 'Sarah', 'Alex', 'Ken', 'Dave', 'Elena', 'Ryan', 'Zack'];
    const mockTech = ['Turso DB', 'Drizzle ORM', 'Let\'s Encrypt', 'Hugging Face Spaces', 'DiceBear Avatars', 'PostHog Suite'];
    const mockProjects = ['CloudFlare Edge Node', 'Rust MicroKV', 'AnimeFinder v2', 'Haven Terminal', 'ZeroScale Webhook'];
    const mockBadges = ['Top Contributor', 'API Expert', 'Creator Master', 'Cloud Native Creator'];

    const interval = setInterval(() => {
      const randType = Math.random() < 0.35 ? 'discussion' : Math.random() < 0.65 ? 'project_update' : 'contribution';
      const actor = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const avatar = actor[0];
      
      let newEvent: FeedItem;

      if (randType === 'discussion') {
        const topics = [
          'Who is building with Turso replicas? Getting sub-15ms edge routing.',
          'Just launched standard Drizzle migrations via workers. Incredible!',
          'Is any teammate hosting datasets inside Hugging Face Spaces on CPU containers?',
          'What is the best way to handle HMAC validation inside serverless headers?',
          'Reviewing Polar.sh payout fees. Extremely clean system compared to Stripe Billing.'
        ];
        newEvent = {
          id: `sim-${Date.now()}`,
          type: 'discussion',
          user: actor,
          avatar,
          content: topics[Math.floor(Math.random() * topics.length)],
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          meta: { category: Math.random() > 0.5 ? 'Dev' : 'Art' }
        };
      } else if (randType === 'project_update') {
        const tech = mockTech[Math.floor(Math.random() * mockTech.length)];
        const project = mockProjects[Math.floor(Math.random() * mockProjects.length)];
        newEvent = {
          id: `sim-${Date.now()}`,
          type: 'project_update',
          user: actor,
          avatar,
          content: `${actor} upgraded project "${project}": successfully bound ${tech} to production serverless edge rails.`,
          timestamp: 'Just now',
          likes: 1,
          comments: 0,
          meta: { projectName: project, stackItem: tech, category: 'Dev' }
        };
      } else {
        const badge = mockBadges[Math.floor(Math.random() * mockBadges.length)];
        newEvent = {
          id: `sim-${Date.now()}`,
          type: 'contribution',
          user: actor,
          avatar,
          content: `${actor} unlocked the "${badge}" Achievement and was awarded reputation points!`,
          timestamp: 'Just now',
          likes: 3,
          comments: 0,
          meta: { badgeName: badge, xpEarned: Math.random() > 0.5 ? 80 : 120, category: 'Dev' }
        };
      }

      setActivities(prev => [newEvent, ...prev.slice(0, 30)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleLike = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, likes: act.likes + 1 };
      }
      return act;
    }));
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusInput.trim()) return;

    const newPost: FeedItem = {
      id: `usr-${Date.now()}`,
      type: 'discussion',
      user: 'You',
      avatar: 'Y',
      content: statusInput,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      meta: { category: 'Dev' }
    };

    setActivities(prev => [newPost, ...prev]);
    setStatusInput('');
  };

  // --- DATA 3: POLLS SYSTEM ---
  const [poll, setPoll] = useState({
    question: "What should be our next community tech event?",
    totalVotes: 156,
    options: [
      { id: 1, text: "Hackathon 2026", votes: 89, color: "bg-blue-500" },
      { id: 2, text: "Web3/Edge Mini Jam", votes: 45, color: "bg-emerald-500" },
      { id: 3, text: "UI Design Showdown", votes: 22, color: "bg-rose-500" },
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

  // --- DATA 4: LEADERBOARD ---
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'Dev' | 'Gaming' | 'Art'>('Dev');
  const leaderboards = {
    Dev: [
      { rank: 1, name: 'Sarah', score: 12450, avatar: 'S' },
      { rank: 2, name: 'Dave', score: 11200, avatar: 'D' },
      { rank: 3, name: 'Alex', score: 9800, avatar: 'A' },
      { rank: 4, name: 'Ken', score: 8450, avatar: 'K' },
      { rank: 5, name: 'Mia', score: 7200, avatar: 'M' },
    ],
    Gaming: [
      { rank: 1, name: 'Alex', score: 15400, avatar: 'A' },
      { rank: 2, name: 'Ken', score: 14200, avatar: 'K' },
      { rank: 3, name: 'Mia', score: 11800, avatar: 'M' },
    ],
    Art: [
      { rank: 1, name: 'Mia', score: 18450, avatar: 'M' },
      { rank: 2, name: 'Sarah', score: 9200, avatar: 'S' },
      { rank: 3, name: 'Dave', score: 8100, avatar: 'D' },
    ]
  };

  // --- DATA 5: DAILY QUESTS ---
  const [quests, setQuests] = useState([
    { id: 1, title: 'Interact with 3 forum posts', category: 'General', icon: Gamepad2, xp: 50, progress: 1, total: 3, completed: false },
    { id: 2, title: 'Bookmark an API resource', category: 'Dev', icon: Code, xp: 80, progress: 1, total: 1, completed: true },
    { id: 3, title: 'Ask Assistant to code a script', category: 'Dev', icon: Star, xp: 120, progress: 0, total: 1, completed: false },
    { id: 4, title: 'Join an active session lobby', category: 'Lobbies', icon: Tv, xp: 30, progress: 0, total: 1, completed: false },
    { id: 5, title: 'Provide layout feedback', category: 'Art', icon: Target, xp: 50, progress: 0, total: 1, completed: false },
  ]);

  const toggleQuestProgress = (id: number) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        const nextProg = q.progress + 1;
        const done = nextProg >= q.total;
        return { ...q, progress: done ? q.total : nextProg, completed: done };
      }
      return q;
    }));
  };

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Gaming', icon: Gamepad2 },
    { name: 'Anime', icon: Tv },
    { name: 'Dev', icon: Code },
    { name: 'Art', icon: Palette },
  ];

  // Filters for feed
  const filteredActivities = activities.filter(act => {
    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!act.content.toLowerCase().includes(q) && !act.user.toLowerCase().includes(q)) {
        return false;
      }
    }
    // category filter
    if (activeCategory !== 'All') {
      const categoryMap: Record<string, string> = { 'Gaming': 'Gaming', 'Anime': 'Anime', 'Dev': 'Dev', 'Art': 'Art' };
      const itemCategory = act.meta?.category || 'Dev';
      if (itemCategory !== activeCategory) return false;
    }
    return true;
  });

  return (
    <div className="flex h-[800px] border border-border rounded-2xl overflow-hidden bg-background max-h-[80vh] shadow-sm text-left">
      
      {/* 1. ROOMS LIST COLUMN (LEFT SIDE) */}
      <HavenRooms 
        activeTextChannel={activeTextChannel} 
        setActiveTextChannel={setActiveTextChannel} 
      />
      
      {/* 2. MAIN ACTIVE WINDOW CONTENT OR ACTIVE CHAT TAB */}
      {activeTextChannel ? (
        <HavenChat channelName={activeTextChannel} onClose={() => setActiveTextChannel(null)} />
      ) : (
        <div className="flex-1 flex flex-col min-w-0 border-r border-border/50 bg-background text-left">
          
          {/* HEADER NAV ROW */}
          <div className="px-6 py-4 border-b border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-md font-bold text-foreground">Community</h2>
              
              {/* PRIMARY COHERENT TABS */}
              <div className="flex bg-[#121316] p-1 rounded-xl border border-border/60">
                {(['feed', 'quests', 'polls', 'leaderboard'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all capitalize whitespace-nowrap cursor-pointer ${
                      currentTab === tab
                        ? 'bg-foreground text-background font-extrabold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab === 'feed' ? 'Live Feed' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH PARAMETERS */}
            {currentTab === 'feed' && (
              <div className="relative w-full sm:w-48 lg:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search feeds..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 bg-zinc-950 border border-border/50 text-xs rounded-xl pl-9 pr-3 outline-none" 
                />
              </div>
            )}
          </div>

          {/* VIEWPORT CONTROLLER */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* A. TAB: FEED */}
            {currentTab === 'feed' && (
              <div className="space-y-6 text-left">
                {/* INLINE STATUS PUBLISHER */}
                <form onSubmit={handlePublishPost} className="bg-card/45 border border-border p-4 rounded-2xl flex gap-3 items-start text-left">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-sm text-white shrink-0">
                    Y
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      placeholder="Share a project update or ask a question..."
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full text-xs bg-transparent border-0 resize-none outline-none text-foreground placeholder:text-zinc-500 min-h-[48px]"
                    />
                    <div className="flex justify-between items-center pt-2 border-t border-border/20">
                      <div className="flex items-center gap-1.5">
                        {categories.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setActiveCategory(c.name)}
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all border ${
                              activeCategory === c.name
                                ? 'bg-zinc-800 text-white border-zinc-700'
                                : 'text-zinc-400 hover:bg-zinc-900 border-transparent'
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                      <button 
                        type="submit"
                        disabled={!statusInput.trim()}
                        className="py-1 px-3 bg-white text-zinc-950 disabled:opacity-40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-zinc-200"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* ACTIVITIES LIST */}
                <div className="space-y-4">
                  {filteredActivities.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border/30 rounded-2xl text-zinc-500 text-xs">
                      No feed activities match this filter. Share an update above!
                    </div>
                  ) : (
                    filteredActivities.map((act) => {
                      let leftBorder = 'border-l-primary';
                      let iconColor = 'text-primary';
                      let iconBackground = 'bg-primary/10';

                      if (act.type === 'project_update') {
                        leftBorder = 'border-l-purple-500';
                        iconColor = 'text-purple-400';
                        iconBackground = 'bg-purple-500/10';
                      } else if (act.type === 'contribution') {
                        leftBorder = 'border-l-amber-500';
                        iconColor = 'text-amber-500';
                        iconBackground = 'bg-amber-500/10';
                      }

                      return (
                        <div
                          key={act.id}
                          className={`bg-card/65 border border-border border-l-4 ${leftBorder} rounded-2xl p-5 hover:translate-x-0.5 transition-transform text-left`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3 text-left">
                              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-border/50 flex items-center justify-center font-bold text-xs text-foreground shrink-0">
                                {act.avatar}
                              </div>
                              <div>
                                <div className="font-bold text-xs flex items-center gap-1.5 justify-start">
                                  <span>@{act.user}</span>
                                  {act.type === 'project_update' && (
                                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/10 uppercase">update</span>
                                  )}
                                  {act.type === 'contribution' && (
                                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/10 uppercase">award</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                                  <span>{act.timestamp}</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                  <span className="text-zinc-400 font-bold uppercase">{act.meta?.category || 'Dev'}</span>
                                </div>
                              </div>
                            </div>

                            <div className={`p-1.5 rounded-lg ${iconBackground} ${iconColor} shrink-0`}>
                              {act.type === 'discussion' && <MessageSquare className="w-3.5 h-3.5" />}
                              {act.type === 'project_update' && <GitBranch className="w-3.5 h-3.5" />}
                              {act.type === 'contribution' && <Trophy className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          <p className="text-xs text-zinc-300 leading-relaxed text-left min-h-[20px]">
                            {act.content}
                          </p>

                          <div className="flex items-center justify-between text-[10.5px] text-zinc-500 pt-3 mt-3 border-t border-border/10">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLike(act.id)}
                                className="flex items-center gap-1.5 hover:text-rose-500 transition-colors group cursor-pointer"
                              >
                                <Heart className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                <span>{act.likes} Likes</span>
                              </button>

                              {act.type === 'discussion' && (
                                <span className="flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{act.comments} Replies</span>
                                </span>
                              )}
                            </div>

                            {act.type === 'project_update' && act.meta?.projectName && (
                              <span className="text-[9.5px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/15">
                                Repo: {act.meta.projectName}
                              </span>
                            )}

                            {act.type === 'contribution' && act.meta?.xpEarned && (
                              <span className="text-[9.5px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
                                +{act.meta.xpEarned} XP Boosted
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* B. TAB: QUESTS */}
            {currentTab === 'quests' && (
              <div className="bg-card/45 border border-border rounded-2xl p-5 space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-border/20">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Active Daily Tasks</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Fulfill goals across HAVEN environment to unlock reputation levels and badges.</p>
                  </div>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-500 font-mono text-[9px] uppercase font-bold py-0.5 px-2">Resets in 12h</Badge>
                </div>

                <div className="divide-y divide-border/20">
                  {quests.map((quest) => {
                    const Icon = quest.icon;
                    return (
                      <div key={quest.id} className={`py-4 flex gap-4 text-left items-start ${quest.completed ? 'opacity-50' : ''}`}>
                        <button
                          disabled={quest.completed}
                          onClick={() => toggleQuestProgress(quest.id)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${
                            quest.completed ? 'bg-emerald-500/25 text-emerald-400' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                          }`}
                        >
                          {quest.completed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-3">
                            <span className={`text-xs font-bold ${quest.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                              {quest.title}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-500">+{quest.xp} XP</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-2">
                            <span className="uppercase tracking-wider font-semibold">{quest.category}</span>
                            <span>•</span>
                            <span className="font-mono">{quest.progress} / {quest.total} complete</span>
                          </div>

                          {!quest.completed && (
                            <div className="w-full bg-zinc-900 rounded-full h-1 mt-3.5 overflow-hidden">
                              <div 
                                className="bg-white h-1 transition-all duration-300" 
                                style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. TAB: POLLS */}
            {currentTab === 'polls' && (
              <div className="bg-card/45 border border-border rounded-2xl p-5 space-y-5 text-left">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Active Poll</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-normal">Vote to direct the upcoming development milestones and integration guidelines.</p>
                </div>

                <div className="bg-zinc-950/40 p-4 border border-border/80 rounded-2xl space-y-4 text-left">
                  <p className="font-bold text-xs text-zinc-300">{poll.question}</p>
                  
                  <div className="space-y-3 pt-1">
                    {poll.options.map((option) => {
                      const percentage = Math.round((option.votes / (poll.totalVotes || 1)) * 100);
                      const isSelected = poll.selectedOption === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleVote(option.id)}
                          disabled={poll.hasVoted}
                          className={`w-full relative overflow-hidden rounded-xl border p-3 flex justify-between items-center text-xs transition-all text-left cursor-pointer
                            ${poll.hasVoted 
                              ? isSelected ? 'border-zinc-500 bg-white/5' : 'border-border/30 bg-muted/10 opacity-70' 
                              : 'border-border hover:border-zinc-500 hover:bg-zinc-900'
                            }`}
                        >
                          {/* Animated vote metric indicator */}
                          {poll.hasVoted && (
                            <div 
                              className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-500 ${option.color}`}
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="flex items-center gap-2 z-10">
                            {poll.hasVoted && isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                            <span className="font-semibold">{option.text}</span>
                          </div>

                          <div className="flex items-center gap-3 z-10 font-mono text-[10.5px]">
                            {poll.hasVoted && (
                              <span className="font-bold text-indigo-400">{percentage}%</span>
                            )}
                            <span className="text-zinc-550">{option.votes} votes</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-zinc-550 pt-2 font-mono">
                    <span>Total responses: {poll.totalVotes}</span>
                    {poll.hasVoted && <span className="text-indigo-400">Thank you for voting!</span>}
                  </div>
                </div>
              </div>
            )}

            {/* D. TAB: LEADERBOARD */}
            {currentTab === 'leaderboard' && (
              <div className="bg-card/45 border border-border rounded-2xl p-5 space-y-5 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/20">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Top Contributors</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Top repute levels achieved by makers of active edge stacks.</p>
                  </div>

                  <div className="flex bg-[#121316] p-0.5 rounded-lg border border-border/60 shrink-0 self-start">
                    {(['Dev', 'Gaming', 'Art'] as const).map((col) => (
                      <button
                        key={col}
                        onClick={() => setActiveLeaderboardTab(col)}
                        className={`px-2.5 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                          activeLeaderboardTab === col
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 text-left">
                  {leaderboards[activeLeaderboardTab].map((row) => (
                    <div 
                      key={row.rank}
                      className="flex items-center justify-between p-3.5 bg-zinc-950/20 border border-border/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0 ${
                          row.rank === 1 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          row.rank === 2 ? 'bg-zinc-500/15 text-zinc-400 border border-zinc-550/20' :
                          'bg-zinc-900 border border-border/50 text-zinc-500'
                        }`}>
                          {row.rank}
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center font-black text-xs text-white uppercase shrink-0">
                          {row.avatar}
                        </div>
                        <span className="text-xs font-bold text-zinc-100">@{row.name}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-zinc-300">{row.score.toLocaleString()}</span>
                        <span className="text-[10px] text-zinc-550">reputation</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
