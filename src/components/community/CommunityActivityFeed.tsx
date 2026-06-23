import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '../ui/components';
import { Sparkles, MessageSquare, Flame, Globe, Briefcase, Award, Star, User, ShieldAlert, GitBranch, ArrowRight, CheckCircle2, Trophy, FolderPlus, Compass } from 'lucide-react';

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

export function CommunityActivityFeed() {
  const [filter, setFilter] = useState<'all' | 'discussion' | 'project_update' | 'contribution'>('all');
  const [statusInput, setStatusInput] = useState('');
  const [postType, setPostType] = useState<'discussion' | 'project_update'>('discussion');
  const [selectedProject, setSelectedProject] = useState('My OmniApp');
  
  // Real-time list matching initial core states
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
      // Pick random event type
      const randType = Math.random() < 0.35 ? 'discussion' : Math.random() < 0.65 ? 'project_update' : 'contribution';
      const actor = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const avatar = actor[0];
      
      let newEvent: FeedItem;

      if (randType === 'discussion') {
        const topics = [
          'Who is building with Turso replicas? Getting sub-15ms edge routing.',
          'Just launched standard Drizzle migrations via workers. Incredible!',
          'Is anyone hosting heavy datasets inside Hugging Face Spaces on CPU containers?',
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

      setActivities(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 elements
    }, 20000); // Trigger every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusInput.trim()) return;

    let newEvent: FeedItem;
    const currentUser = localStorage.getItem('haven_user') || 'gamerdzbba7';
    const avatar = currentUser[0].toUpperCase();

    if (postType === 'project_update') {
      newEvent = {
        id: `user-${Date.now()}`,
        type: 'project_update',
        user: currentUser,
        avatar,
        content: `@${currentUser} deployed updates on "${selectedProject}": added custom integration and organized stack settings.`,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        meta: { projectName: selectedProject, category: 'Dev' }
      };
    } else {
      newEvent = {
        id: `user-${Date.now()}`,
        type: 'discussion',
        user: currentUser,
        avatar,
        content: statusInput,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        meta: { category: 'Dev' }
      };
    }

    setActivities(prev => [newEvent, ...prev]);
    setStatusInput('');
    
    // Add XP as system reward
    const currentXp = Number(localStorage.getItem('haven_xp') || '4250');
    localStorage.setItem('haven_xp', String(currentXp + 40));
  };

  const handleLike = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, likes: act.likes + 1 };
      }
      return act;
    }));
  };

  const filtered = activities.filter(act => filter === 'all' || act.type === filter);

  return (
    <div className="space-y-6">
      
      {/* Create Activity Form Card */}
      <Card className="border border-primary/20 bg-card shadow-sm hover:border-primary/40 transition-colors">
        <CardContent className="p-5">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Broadcast Activity Status
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPostType('discussion')}
                  className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${
                    postType === 'discussion'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  💬 Post Thread
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('project_update')}
                  className={`text-[10px] px-2 py-1 rounded font-bold transition-all ${
                    postType === 'project_update'
                      ? 'bg-accent/20 text-violet-400 border border-accent/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  🔌 Project Update
                </button>
              </div>
            </div>

            {postType === 'project_update' && (
              <div className="flex gap-3 items-center">
                <span className="text-xs font-semibold text-muted-foreground">Select Project:</span>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-muted border border-border/60 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
                >
                  <option value="My OmniApp">My OmniApp</option>
                  <option value="Serverless Node">Serverless Node</option>
                  <option value="DiceBear Dev">DiceBear Dev</option>
                </select>
              </div>
            )}

            <div className="relative flex items-center">
              <input
                type="text"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                placeholder={
                  postType === 'project_update'
                    ? "Explain what config/APIs you just added... (e.g. Added Mapbox and security filters)"
                    : "Share a discussion thread, question, or tips with other creators..."
                }
                className="w-full bg-muted/60 border border-border rounded-xl text-xs pl-3 pr-20 py-3 outline-none focus:border-primary/50 transition-colors"
                maxLength={200}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] h-7 font-bold shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground"
                disabled={!statusInput.trim()}
              >
                Broadcast
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground leading-none font-mono">
              ⚡ Broadcasts reward +40 XP directly to your profile experience level.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-border/50">
        {(['all', 'discussion', 'project_update', 'contribution'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs px-3 py-1.5 font-bold rounded-lg transition-all border shrink-0 ${
              filter === key
                ? 'bg-muted border-primary text-primary'
                : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {key === 'all' && 'All Activity 🌀'}
            {key === 'discussion' && 'Discussions 💬'}
            {key === 'project_update' && 'Project Updates 🔌'}
            {key === 'contribution' && 'Contributions 🏆'}
          </button>
        ))}
      </div>

      {/* Real-time feed item maps */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="border border-dashed rounded-xl p-10 text-center text-muted-foreground text-xs">
            No dynamic updates matches this category. Post something now!
          </div>
        ) : (
          filtered.map((act) => {
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
              <Card
                key={act.id}
                className={`border-l-4 ${leftBorder} hover:translate-x-1 hover:border-r-primary/10 transition-all shadow-sm bg-card`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/55 flex items-center justify-center font-bold text-md text-foreground shadow-sm relative shrink-0">
                        {act.avatar}
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-[8px] text-white font-mono animate-pulse">
                          ●
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          <span>@{act.user}</span>
                          {act.type === 'project_update' && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/10">UPDATER</span>
                          )}
                          {act.type === 'contribution' && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/10">XP AWARDED</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold mt-0.5">
                          <span>{act.timestamp}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/45" />
                          <span className="uppercase tracking-wider text-primary font-bold">
                            {act.meta?.category || 'Dev'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg ${iconBackground} ${iconColor}`}>
                      {act.type === 'discussion' && <MessageSquare className="w-4 h-4" />}
                      {act.type === 'project_update' && <GitBranch className="w-4 h-4" />}
                      {act.type === 'contribution' && <Trophy className="w-4 h-4" />}
                    </div>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed font-normal mb-4">
                    {act.content}
                  </p>

                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pt-3 border-t border-border/40">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(act.id)}
                        className="flex items-center gap-1.5 hover:text-rose-500 transition-colors group text-[10px]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="w-3.5 h-3.5 transition-transform group-hover:scale-120"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span>{act.likes} Likes</span>
                      </button>

                      {act.type === 'discussion' && (
                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors text-[10px]">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{act.comments} Replies</span>
                        </div>
                      )}
                    </div>

                    {act.type === 'project_update' && act.meta?.projectName && (
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        🎯 Repo: {act.meta.projectName}
                      </span>
                    )}

                    {act.type === 'contribution' && act.meta?.xpEarned && (
                      <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                        🏆 +{act.meta.xpEarned} XP Boosted
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
}
