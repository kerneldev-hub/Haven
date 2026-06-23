import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/components';
import { Github, Twitter, Globe, MapPin, Calendar, GitCommit, Trophy, Star, Server, Component, MessageSquare, Award, CheckCircle2, ShieldCheck, Heart, Trash2, FolderKanban, PlusCircle } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { useReputationSystem } from '../hooks/useReputationSystem';

export default function ProfilePage() {
  const { username } = useParams();
  const { level, xp } = useReputationSystem(username || 'user');

  const [savedResources, setSavedResources] = React.useState<any[]>([]);
  const [savedDiscussions, setSavedDiscussions] = React.useState<any[]>([]);
  const [folders, setFolders] = React.useState<string[]>([]);
  const [activeFolder, setActiveFolder] = React.useState<string>('All');
  const [achievements, setAchievements] = React.useState<any[]>([]);
  
  // Dynamic Cryptographic-Style Signature Certificate SVG States
  const [exportedSvgCert, setExportedSvgCert] = React.useState<string | null>(null);
  const [showCertDialog, setShowCertDialog] = React.useState<boolean>(false);

  const handleExportSignatureCertificate = () => {
    const code = `HVN-REP-LVL${level}-V${Math.floor(Math.random() * 89999 + 10000)}-S${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    
    const svgStr = `&lt;svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%"&gt;
  &lt;!-- BASE CONTAINER GRAPHICS --&gt;
  &lt;rect width="800" height="500" rx="20" fill="#0b0d12" stroke="#1f2937" stroke-width="4" /&gt;
  &lt;rect x="25" y="25" width="750" height="450" rx="15" fill="none" stroke="#6366f1" stroke-dasharray="10 5" stroke-opacity="0.4" stroke-width="2" /&gt;
  &lt;rect x="35" y="35" width="730" height="430" rx="12" fill="none" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="2" /&gt;

  &lt;!-- ABSTRACT VECTOR GRID --&gt;
  &lt;g opacity="0.06"&gt;
    &lt;circle cx="400" cy="250" r="180" fill="none" stroke="#ffffff" stroke-width="1.5"/&gt;
    &lt;circle cx="400" cy="250" r="120" fill="none" stroke="#ffffff" stroke-width="1"/&gt;
    &lt;circle cx="400" cy="250" r="300" fill="none" stroke="#ffffff" stroke-width="0.5"/&gt;
    &lt;path d="M 50 250 L 750 250 M 400 50 L 400 450" stroke="#ffffff" stroke-width="1.5"/&gt;
  &lt;/g&gt;

  &lt;!-- HEADER --&gt;
  &lt;text x="400" y="85" text-anchor="middle" font-family="'Inter', sans-serif" font-size="24" font-weight="900" fill="#ffffff" letter-spacing="4"&gt;
    K E R N E L . D E V
  &lt;/text&gt;
  &lt;text x="400" y="110" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#6366f1" letter-spacing="2"&gt;
    HAVEN NETWORK PROFILE REPUTATION
  &lt;/text&gt;

  &lt;!-- THE STATEMENT --&gt;
  &lt;text x="400" y="185" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" font-weight="500" fill="#9ca3af" italic="true"&gt;
    This document serves to formally certify that
  &lt;/text&gt;
  &lt;text x="400" y="235" text-anchor="middle" font-family="'Inter', sans-serif" font-size="34" font-weight="900" fill="#f59e0b" letter-spacing="1"&gt;
    @${username || 'developer'}
  &lt;/text&gt;
  &lt;text x="400" y="275" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" font-weight="400" fill="#d1d5db"&gt;
    has finalized Level ${level} contribution standing across all distributed work layers.
  &lt;/text&gt;

  &lt;!-- STATS GRID --&gt;
  &lt;g transform="translate(140, 315)"&gt;
    &lt;!-- XP STYLING --&gt;
    &lt;rect x="0" y="0" width="220" height="60" rx="8" fill="#11131a" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" /&gt;
    &lt;text x="20" y="25" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#4b5563" letter-spacing="1"&gt;ACCUMULATED SYNCHRONIZED XP&lt;/text&gt;
    &lt;text x="20" y="45" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#3b82f6"&gt;${xp} DATA XP&lt;/text&gt;
    
    &lt;!-- LEVEL STYLING --&gt;
    &lt;rect x="280" y="0" width="220" height="60" rx="8" fill="#11131a" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" /&gt;
    &lt;text x="300" y="25" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#4b5563" letter-spacing="1"&gt;ECOSYSTEM ACCESS STANDING&lt;/text&gt;
    &lt;text x="300" y="45" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" fill="#10b981"&gt;LEVEL ${level} MEMBER&lt;/text&gt;
  &lt;/g&gt;

  &lt;!-- CRYPTO SPECURE SIGNATURE SEAL --&gt;
  &lt;g transform="translate(100, 410)"&gt;
    &lt;text x="0" y="12" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#4b5563" letter-spacing="1"&gt;VALIDATION SECURE SIGNING METADATA&lt;/text&gt;
    &lt;text x="0" y="26" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#6366f1" opacity="0.9"&gt;${code}&lt;/text&gt;
  &lt;/g&gt;

  &lt;!-- DIGITAL EMBLEM SEAL --&gt;
  &lt;g transform="translate(630, 395)"&gt;
    &lt;circle cx="30" cy="30" r="30" fill="#0f172a" stroke="#f59e0b" stroke-width="2" /&gt;
    &lt;path d="M 18 25 L 30 38 L 42 25" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /&gt;
    &lt;circle cx="30" cy="30" r="23" fill="none" stroke="#6366f1" stroke-dasharray="4 2" stroke-opacity="0.6" /&gt;
  &lt;/g&gt;
  
  &lt;text x="400" y="475" text-anchor="middle" font-family="'Inter', sans-serif" font-size="9" fill="#4b5563"&gt;Verified securely via HAVEN Local cache. Generated ${dateStr}&lt;/text&gt;
&lt;/svg&gt;`;

    // Decode safety
    const cleanSvg = svgStr.replace(/&amp;lt;/g, '<').replace(/&amp;gt;/g, '>');
    setExportedSvgCert(cleanSvg);
    setShowCertDialog(true);
  };

  const handleDownloadCertFile = () => {
    if (!exportedSvgCert) return;
    const blob = new Blob([exportedSvgCert], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `haven-contribution-certificate-${username || 'developer'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    const resValue = localStorage.getItem('haven_bookmarks_resources');
    const discValue = localStorage.getItem('haven_bookmarks_discussions');
    const savedFolders = localStorage.getItem('haven_bookmark_folders');

    if (resValue) {
      try { setSavedResources(JSON.parse(resValue)); } catch (e) {}
    }
    if (discValue) {
      try { setSavedDiscussions(JSON.parse(discValue)); } catch (e) {}
    }

    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders));
      } catch (e) {
        setFolders(['All', 'Unassigned', 'Databases', 'AI APIs', 'Frontend Tools']);
      }
    } else {
      const defaultFolders = ['All', 'Unassigned', 'Databases', 'AI APIs', 'Frontend Tools'];
      setFolders(defaultFolders);
      localStorage.setItem('haven_bookmark_folders', JSON.stringify(defaultFolders));
    }
  }, []);

  // Recalculate dynamic achievements when bookmarks change
  React.useEffect(() => {
    const resCount = savedResources.length;
    const discCount = savedDiscussions.length;
    
    // Check if user has engaged in chat with the Copilot AI assistant
    const isAiEngaged = localStorage.getItem('haven_copilot_history') !== null;

    const list = [
      {
        id: 'haven-pioneer',
        name: 'Haven Pioneer',
        description: 'Joined during the initial core alpha beta testing cycle.',
        requirement: 'Join Haven Network Alpha',
        isUnlocked: true,
        xpBonus: 100,
        icon: '🛡️',
        colorClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      },
      {
        id: 'api-expert',
        name: 'API Expert',
        description: 'Mastered standard public developer directory and SaaS integrations.',
        requirement: 'Bookmark at least 2 public API resources',
        progress: `${Math.min(resCount, 2)}/2`,
        isUnlocked: resCount >= 2,
        xpBonus: 250,
        icon: '🔌',
        colorClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      },
      {
        id: 'top-contributor',
        name: 'Top Contributor',
        description: 'Actively participating in threads or saving discussion insights with members.',
        requirement: 'Bookmark at least 1 Discussion Thread',
        progress: `${Math.min(discCount, 1)}/1`,
        isUnlocked: discCount >= 1,
        xpBonus: 150,
        icon: '⭐',
        colorClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      },
      {
        id: 'ai-architect',
        name: 'AI Architect',
        description: 'Guided and generated custom layouts with AI Copilot stack tools.',
        requirement: 'Interact with AI Stack Copilot Search',
        progress: `${isAiEngaged ? 1 : 0}/1`,
        isUnlocked: isAiEngaged,
        xpBonus: 200,
        icon: '🤖',
        colorClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      },
      {
        id: 'reputation-champion',
        name: 'Reputation Champion',
        description: 'Reached elite rating level status through active community contributions.',
        requirement: 'Reach Player Level 15',
        progress: `${Math.min(level, 15)}/15`,
        isUnlocked: level >= 15,
        xpBonus: 500,
        icon: '🏆',
        colorClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      }
    ];
    setAchievements(list);
  }, [savedResources, savedDiscussions, level]);

  const handleCreateFolder = () => {
    const name = prompt('Enter a name for the new folder:');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    if (trimmed.toLowerCase() === 'all') {
      alert('Reserved name.');
      return;
    }
    if (folders.includes(trimmed)) {
      alert('Folder name already exists!');
      return;
    }
    const newFolders = [...folders, trimmed];
    setFolders(newFolders);
    localStorage.setItem('haven_bookmark_folders', JSON.stringify(newFolders));
  };

  const handleDeleteFolder = (folderName: string) => {
    if (folderName === 'All' || folderName === 'Unassigned') {
      alert('Default system folders cannot be deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete folder "${folderName}"? saved items will be moved to "Unassigned".`)) {
      const newFolders = folders.filter(f => f !== folderName);
      setFolders(newFolders);
      localStorage.setItem('haven_bookmark_folders', JSON.stringify(newFolders));

      // Reset items in that folder to "Unassigned"
      const updatedRes = savedResources.map(res => {
        if (res.folder === folderName) {
          return { ...res, folder: 'Unassigned' };
        }
        return res;
      });
      setSavedResources(updatedRes);
      localStorage.setItem('haven_bookmarks_resources', JSON.stringify(updatedRes));

      const updatedDisc = savedDiscussions.map(disc => {
        if (disc.folder === folderName) {
          return { ...disc, folder: 'Unassigned' };
        }
        return disc;
      });
      setSavedDiscussions(updatedDisc);
      localStorage.setItem('haven_bookmarks_discussions', JSON.stringify(updatedDisc));
      
      setActiveFolder('All');
    }
  };

  const handleMoveResource = (name: string, targetFolder: string) => {
    const updated = savedResources.map(item => {
      if (item.name === name) {
        return { ...item, folder: targetFolder };
      }
      return item;
    });
    setSavedResources(updated);
    localStorage.setItem('haven_bookmarks_resources', JSON.stringify(updated));
  };

  const handleMoveDiscussion = (id: number, targetFolder: string) => {
    const updated = savedDiscussions.map(item => {
      if (item.id === id) {
        return { ...item, folder: targetFolder };
      }
      return item;
    });
    setSavedDiscussions(updated);
    localStorage.setItem('haven_bookmarks_discussions', JSON.stringify(updated));
  };

  const handleRemoveResource = (name: string) => {
    const newVal = savedResources.filter(item => item.name !== name);
    setSavedResources(newVal);
    localStorage.setItem('haven_bookmarks_resources', JSON.stringify(newVal));
  };

  const handleRemoveDiscussion = (id: number) => {
    const newVal = savedDiscussions.filter(item => item.id !== id);
    setSavedDiscussions(newVal);
    localStorage.setItem('haven_bookmarks_discussions', JSON.stringify(newVal));
  };
  
  // Generating a randomized mock contribution graph
  const renderContributionGrid = () => {
    const weeks = 52;
    const daysPerWeek = 7;
    const grid = [];
    
    for (let col = 0; col < weeks; col++) {
      const weekCol = [];
      for (let row = 0; row < daysPerWeek; row++) {
         const intensity = Math.random();
         let colorClass = "bg-muted";
         if (intensity > 0.8) colorClass = "bg-primary";
         else if (intensity > 0.6) colorClass = "bg-primary/80";
         else if (intensity > 0.4) colorClass = "bg-primary/60";
         else if (intensity > 0.2) colorClass = "bg-primary/40";
         
         weekCol.push(<div key={`${col}-${row}`} className={`w-2.5 h-2.5 rounded-sm ${colorClass}`} title="Contribution value" />);
      }
      grid.push(<div key={col} className="flex flex-col gap-1">{weekCol}</div>);
    }
    return grid;
  };
  
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-16">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left Column - Profile Identity Graph */}
        <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
          <div className="flex gap-4 md:flex-col items-center md:items-start relative">
            <div className="w-24 h-24 md:w-full md:h-auto md:aspect-square bg-gradient-to-tr from-accent to-secondary rounded-2xl flex items-center justify-center border font-bold text-4xl text-muted-foreground shadow-sm relative overflow-hidden">
              <span className="z-10">{username?.charAt(0).toUpperCase() || 'D'}</span>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/50 to-transparent"></div>
            </div>
            <div className="absolute -top-2 -right-2 md:top-auto md:bottom-auto md:left-auto flex gap-1">
               <ShieldCheck className="w-6 h-6 text-blue-500 bg-background rounded-full" title="Verified Creator" />
            </div>
            <div className="flex-1 text-center md:text-left w-full mt-2 md:mt-0">
               <h1 className="text-2xl font-bold tracking-tight flex justify-center md:justify-start items-center gap-2">
                 {username || 'Developer'}
               </h1>
               <p className="text-muted-foreground font-mono text-sm mb-2">@{username || 'developer'}</p>
               
               <div className="flex justify-center md:justify-start pt-1 pb-3.5 select-none">
                 <Badge className={`uppercase text-[10px] font-bold tracking-wider px-2.5 py-0.5 ${
                    localStorage.getItem('haven_user_tier') === 'TEAM'
                       ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                       : (localStorage.getItem('haven_user_tier') === 'PRO'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-muted-foreground border-transparent')
                 }`}>
                    {localStorage.getItem('haven_user_tier') || 'FREE'} MEMBERSHIP
                 </Badge>
               </div>
               
               <p className="text-sm mb-6 max-w-sm mx-auto md:mx-0">
                 Systems engineer, open source maintainer, and avid workspace builder. Working on the future of data infrastructure.
               </p>

               <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                 <span className="flex justify-center md:justify-start items-center"><MapPin className="w-4 h-4 mr-2" /> San Francisco, CA</span>
                 <span className="flex justify-center md:justify-start items-center"><Calendar className="w-4 h-4 mr-2" /> Joined March 2023</span>
                 <span className="flex justify-center md:justify-start items-center text-foreground font-medium mt-1" title={`${xp} XP`}>
                    <Trophy className="w-4 h-4 mr-2 text-amber-500" /> Level {level}
                 </span>
               </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full h-10 font-bold tracking-wide">Follow</Button>
            
            <Button 
              onClick={handleExportSignatureCertificate}
              id="export-certificate-action"
              variant="outline"
              className="w-full h-10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-indigo-400 animate-pulse" /> Export Standing Certificate
            </Button>

            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                <Github className="w-4 h-4"/>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                <Twitter className="w-4 h-4"/>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                <Globe className="w-4 h-4"/>
              </Button>
            </div>
          </div>

          {/* DYNAMIC SVG EXPORT CERTIFICATE DIALOG OVERLAY */}
          {showCertDialog && exportedSvgCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
              <div className="bg-[#0b0c10] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/15 font-mono text-[9px] mb-1">HAVEN PROFILE CREDENTIAL</Badge>
                    <h3 className="text-lg font-bold text-white">Your Haven Credential Certificate</h3>
                  </div>
                  <button 
                    onClick={() => setShowCertDialog(false)}
                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer text-xl font-bold py-1 px-3 bg-zinc-900 rounded-lg border border-border/30"
                  >
                    ×
                  </button>
                </div>

                {/* SVG Live Preview Container */}
                <div 
                  className="w-full aspect-[8/5] bg-[#07080b] border border-zinc-800 rounded-xl overflow-hidden shadow-inner p-2 [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: exportedSvgCert }}
                />

                <div className="bg-[#111319] p-4 rounded-xl border border-zinc-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Validation Authority Key</p>
                    <p className="text-indigo-400 font-mono text-xs font-bold leading-relaxed selection:bg-indigo-900">
                      {exportedSvgCert.match(/HVN-REP-LVL\d+-V\d+-S\d+/)?.[0] || "HVN-SECURE-KEY"}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <Button 
                      onClick={() => {
                        const key = exportedSvgCert.match(/HVN-REP-LVL\d+-V\d+-S\d+/)?.[0] || "";
                        navigator.clipboard.writeText(key);
                        alert("Copied cryptographic credential validation key to clipboard!");
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none h-9 text-xs font-bold font-mono text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-500 bg-transparent cursor-pointer"
                    >
                      Copy Hash
                    </Button>
                    <Button 
                      onClick={handleDownloadCertFile}
                      size="sm"
                      className="flex-1 md:flex-none h-9 text-xs font-bold text-background bg-[#10b981] hover:bg-[#059669] text-black cursor-pointer"
                    >
                      Download SVG
                    </Button>
                  </div>
                </div>

                <div className="text-center text-[10.5px] text-zinc-500 font-medium">
                  This portable vector certificate can be printed, self-hosted, or linked to your personal portfolio pages or GitHub repository summaries.
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 text-sm flex items-center"><Award className="w-4 h-4 mr-2 text-primary" /> Badges & Honors</h3>
            <div className="flex flex-wrap gap-1.5 text-xs font-medium">
              {achievements.filter(a => a.isUnlocked).map(badge => (
                <span key={badge.id}>
                  <Badge variant="outline" className={`${badge.colorClass || ''} flex items-center gap-1 py-1 font-bold`}>
                    <span>{badge.icon}</span>
                    <span>{badge.name}</span>
                  </Badge>
                </span>
              ))}
              {achievements.some(a => !a.isUnlocked) && (
                <span title="More honors available under the achievements tab" className="cursor-help">
                  <Badge variant="outline" className="bg-muted text-muted-foreground/50 border-dashed py-1">
                    {achievements.filter(a => !a.isUnlocked).length} Locked
                  </Badge>
                </span>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 text-sm flex items-center"><Award className="w-4 h-4 mr-2 text-primary" /> Core Skills</h3>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">PostgreSQL</Badge>
              <Badge variant="secondary">Golang</Badge>
            </div>
          </div>

           <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 text-sm flex items-center">Workspaces</h3>
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">R</div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">React Developers</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Moderator</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">S</div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">Founders Lounge</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Member</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 text-sm flex items-center">Community Sub-Havens</h3>
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">G</div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">Global Gaming Hub</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Top Contributor</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">A</div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">Anime & Manga</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Member</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs">O</div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">Open Source Comm</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Verified Builder</p>
                  </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Right Column - Developer Experience Tab view */}
        <main className="flex-1 min-w-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 w-full justify-start h-auto p-0 bg-transparent border-b rounded-none space-x-6 overflow-x-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm font-medium">
                 Profile Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm font-medium">
                 Identity Graph
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm font-medium flex items-center gap-1.5">
                 Saved Bookmarks
                 <span className="bg-primary/15 text-primary text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                   {savedResources.length + savedDiscussions.length}
                 </span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 text-sm font-medium flex items-center gap-1.5 text-emerald-400">
                <Trophy className="w-3.5 h-3.5" />
                Achievements Milestones
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  {achievements.filter(a => a.isUnlocked).length}/{achievements.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-10 outline-none">
              
              {/* Contribution Activity Graph */}
              <div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-semibold text-foreground flex items-center"><GitCommit className="w-4 h-4 mr-2 text-primary" /> 452 Contributions in the last year</h3>
                   <span className="text-xs text-muted-foreground hidden sm:block">Building Haven Ecosystem</span>
                </div>
                <div className="border rounded-xl p-6 bg-card flex flex-col justify-center shadow-sm">
                   <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
                      {renderContributionGrid()}
                   </div>
                   <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                      <a href="#" className="hover:underline">Learn how reputation is calculated</a>
                      <div className="flex items-center gap-2">
                         <span>Less</span>
                         <div className="w-3 h-3 rounded-sm bg-muted" />
                         <div className="w-3 h-3 rounded-sm bg-primary/40" />
                         <div className="w-3 h-3 rounded-sm bg-primary/60" />
                         <div className="w-3 h-3 rounded-sm bg-primary/80" />
                         <div className="w-3 h-3 rounded-sm bg-primary" />
                         <span>More</span>
                      </div>
                   </div>
                </div>
              </div>

               {/* Pinned Projects / Showcase */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-foreground flex items-center"><Star className="w-4 h-4 mr-2" /> Pinned Resources & Projects</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                   <Card className="hover:border-primary/50 transition-colors shadow-sm">
                     <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg flex-shrink-0"><Server className="w-5 h-5" /></div>
                        <div>
                           <CardTitle className="text-base font-bold flex items-center">havendb <Badge variant="outline" className="ml-2 font-normal text-[10px]">Go</Badge></CardTitle>
                           <CardDescription className="text-xs mt-1">A fast KV store for analytical workloads.</CardDescription>
                        </div>
                     </CardHeader>
                   </Card>
                   <Card className="hover:border-primary/50 transition-colors shadow-sm">
                     <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg flex-shrink-0"><Component className="w-5 h-5" /></div>
                        <div>
                           <CardTitle className="text-base font-bold flex items-center">ui-components <Badge variant="outline" className="ml-2 font-normal text-[10px]">React</Badge></CardTitle>
                           <CardDescription className="text-xs mt-1">Accessible headless UI primitives.</CardDescription>
                        </div>
                     </CardHeader>
                   </Card>
                </div>
              </div>

               {/* Significant Activity */}
               <div>
                  <h3 className="text-sm font-semibold mb-4 text-foreground flex items-center"><MessageSquare className="w-4 h-4 mr-2" /> Recent High-Value Impact</h3>
                  <div className="space-y-4">
                     <div className="flex gap-4 p-4 border rounded-xl shadow-sm bg-card hover:border-primary/30 transition-colors">
                        <div className="text-emerald-500 mt-1 shrink-0"><CheckCircle2 className="w-5 h-5" /></div>
                        <div>
                           <p className="text-sm text-foreground">
                              Provided an accepted architectural solution for <strong>"Best way to structure React context across micro-frontends?"</strong>
                           </p>
                           <p className="text-xs text-muted-foreground mt-2">in React Developers • Earned 45 reputation points • 2 days ago</p>
                        </div>
                     </div>
                     <div className="flex gap-4 p-4 border rounded-xl shadow-sm bg-card hover:border-primary/30 transition-colors">
                        <div className="text-pink-500 mt-1 shrink-0"><Heart className="w-5 h-5" /></div>
                        <div>
                           <p className="text-sm text-foreground">
                              Published a top-rated guide: <strong>"Building resilient webhook handlers in Go"</strong>
                           </p>
                           <p className="text-xs text-muted-foreground mt-2">in System Design • 120 upvotes • 1 week ago</p>
                        </div>
                     </div>
                  </div>
               </div>

            </TabsContent>

            <TabsContent value="projects" className="outline-none">
                <EmptyState 
                  title="Identity Graph Under Construction" 
                  description="The detailed relationship map of skills, workspaces, and intelligent topic associations is being populated."
                />
            </TabsContent>

            <TabsContent value="bookmarks" className="outline-none space-y-8 animate-in fade-in duration-300">
               {/* Folders Management Toolbar */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 border p-4 rounded-xl">
                 <div className="space-y-1">
                   <h4 className="font-extrabold text-sm flex items-center gap-2">
                     <FolderKanban className="w-4 h-4 text-primary" />
                     Bookmark Workspace Folders
                   </h4>
                   <p className="text-xs text-muted-foreground">Isolate libraries, APIs, or dev forum thoughts into custom category views.</p>
                 </div>
                 <Button onClick={handleCreateFolder} size="sm" className="h-8 text-xs font-bold shrink-0">
                   <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> New Folder
                 </Button>
               </div>

               {/* Folder pills selector row */}
               <div className="flex flex-wrap gap-2 pb-2 border-b">
                 {folders.map(f => {
                   const resCountInF = savedResources.filter(res => f === 'All' || (f === 'Unassigned' ? (!res.folder || res.folder === 'Unassigned') : res.folder === f)).length;
                   const discCountInF = savedDiscussions.filter(disc => f === 'All' || (f === 'Unassigned' ? (!disc.folder || disc.folder === 'Unassigned') : disc.folder === f)).length;
                   const totalInF = resCountInF + discCountInF;
                   
                   return (
                     <div 
                       key={f} 
                       className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs cursor-pointer select-none transition-all ${
                         activeFolder === f 
                           ? 'bg-primary border-primary text-primary-foreground font-bold' 
                           : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground'
                       }`}
                       onClick={() => setActiveFolder(f)}
                     >
                       <span>📁 {f}</span>
                       <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${activeFolder === f ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-zinc-500'}`}>
                         {totalInF}
                       </span>
                       {f !== 'All' && f !== 'Unassigned' && (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDeleteFolder(f);
                           }} 
                           className={`ml-1 hover:text-rose-400 p-0.5 rounded transition-colors ${activeFolder === f ? 'text-primary-foreground/60' : 'text-zinc-500'}`}
                           title="Delete custom folder"
                         >
                           &times;
                         </button>
                       )}
                     </div>
                   );
                 })}
               </div>

               {/* Folders Filter Output */}
               <div className="space-y-8">
                 {/* Resources under Active Folder */}
                 <div>
                   <h3 className="text-sm font-bold mb-4 text-zinc-400 flex items-center gap-2">
                     🔌 SAVED APIS IN FOLDER: "{activeFolder === 'All' ? 'ALL ARCHVES' : activeFolder.toUpperCase()}" ({
                       savedResources.filter(res => activeFolder === 'All' || (activeFolder === 'Unassigned' ? (!res.folder || res.folder === 'Unassigned') : res.folder === activeFolder)).length
                     })
                   </h3>

                   {savedResources.filter(res => activeFolder === 'All' || (activeFolder === 'Unassigned' ? (!res.folder || res.folder === 'Unassigned') : res.folder === activeFolder)).length === 0 ? (
                     <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-xs leading-relaxed">
                       No API resources matching folder "{activeFolder}". Move bookmarks here or search catalog.
                     </div>
                   ) : (
                     <div className="grid sm:grid-cols-2 gap-4">
                       {savedResources.filter(res => activeFolder === 'All' || (activeFolder === 'Unassigned' ? (!res.folder || res.folder === 'Unassigned') : res.folder === activeFolder)).map((res) => (
                         <Card key={res.name} className="hover:border-primary/45 transition-all flex flex-col justify-between hover:shadow">
                           <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                             <div>
                               <div className="flex justify-between items-start gap-2">
                                 <div className="min-w-0">
                                   <div className="flex flex-wrap items-center gap-1.5">
                                     <span className="font-extrabold text-sm truncate text-foreground">{res.name}</span>
                                     {res.badge && <Badge className="text-[8px] bg-primary/10 text-foreground px-1.5 py-0 leading-none">{res.badge}</Badge>}
                                   </div>
                                   <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{res.desc}</p>
                                 </div>
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 shrink-0"
                                   onClick={() => handleRemoveResource(res.name)}
                                   title="Remove bookmark"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                 </Button>
                               </div>
                             </div>

                             <div className="space-y-2 mt-auto">
                               {/* Folder Relocator Dropdown */}
                               <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                 <span>📂 Folder:</span>
                                 <select
                                   value={res.folder || 'Unassigned'}
                                   onChange={(e) => handleMoveResource(res.name, e.target.value)}
                                   className="bg-muted text-foreground border border-border/80 rounded-md py-0.5 px-1.5 outline-none font-bold text-[10px]"
                                 >
                                   {folders.filter(f => f !== 'All').map(f => (
                                     <option key={f} value={f}>{f}</option>
                                   ))}
                                 </select>
                               </div>

                               <div className="bg-muted/30 border p-2 rounded-lg text-[10px] font-mono flex items-center justify-between gap-1 overflow-hidden">
                                 <span className="text-zinc-400 truncate">{res.freeTierLimit}</span>
                                 <a href={res.url} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline shrink-0 whitespace-nowrap">Visit &rarr;</a>
                               </div>
                             </div>
                           </CardContent>
                         </Card>
                       ))}
                     </div>
                   )}
                 </div>

                 {/* Discussions under Active Folder */}
                 <div className="border-t pt-8">
                   <h3 className="text-sm font-bold mb-4 text-zinc-400 flex items-center gap-2">
                     💬 THREADS IN FOLDER: "{activeFolder === 'All' ? 'ALL ARCHIVES' : activeFolder.toUpperCase()}" ({
                       savedDiscussions.filter(disc => activeFolder === 'All' || (activeFolder === 'Unassigned' ? (!disc.folder || disc.folder === 'Unassigned') : disc.folder === activeFolder)).length
                     })
                   </h3>

                   {savedDiscussions.filter(disc => activeFolder === 'All' || (activeFolder === 'Unassigned' ? (!disc.folder || disc.folder === 'Unassigned') : disc.folder === activeFolder)).length === 0 ? (
                     <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground text-xs leading-relaxed">
                       No discussions matching folder "{activeFolder}". Move bookmark threads here.
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {savedDiscussions.filter(disc => activeFolder === 'All' || (activeFolder === 'Unassigned' ? (!disc.folder || disc.folder === 'Unassigned') : disc.folder === activeFolder)).map((feed) => (
                         <Card key={feed.id} className="hover:border-primary/40 transition-all">
                           <CardContent className="p-5 space-y-3">
                             <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 rounded bg-secondary flex items-center justify-center font-bold text-foreground text-md shadow-sm">
                                   {feed.avatar}
                                 </div>
                                 <div>
                                   <div className="font-bold text-sm text-foreground">{feed.user}</div>
                                   <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                     <span>{feed.time}</span>
                                     <span className="w-1 h-1 rounded-full bg-border"></span>
                                     <span className="uppercase tracking-wider font-semibold text-primary">{feed.category}</span>
                                   </div>
                                 </div>
                               </div>
                               <Button
                                 size="sm"
                                 variant="outline"
                                 className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                                 onClick={() => handleRemoveDiscussion(feed.id)}
                                 title="Remove bookmark"
                               >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </Button>
                             </div>

                             <p className="text-xs text-foreground leading-relaxed font-normal bg-muted/10 p-3 rounded-lg border border-border/40">{feed.content}</p>

                             {/* Folder Selector for threads */}
                             <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground pt-1.5">
                               <span>📂 Folder:</span>
                               <select
                                 value={feed.folder || 'Unassigned'}
                                 onChange={(e) => handleMoveDiscussion(feed.id, e.target.value)}
                                 className="bg-muted text-foreground border border-border/80 rounded-md py-0.5 px-2 outline-none font-bold text-[10.5px]"
                               >
                                 {folders.filter(f => f !== 'All').map(f => (
                                   <option key={f} value={f}>{f}</option>
                                 ))}
                               </select>
                             </div>

                           </CardContent>
                         </Card>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
            </TabsContent>

            <TabsContent value="achievements" className="outline-none space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col gap-1.5 mb-6">
                <h2 className="text-xl font-extrabold tracking-tight">Ecosystem Honors & Badges</h2>
                <p className="text-xs text-muted-foreground">Perform core dev actions, curate tech stacks, and discuss architectures to unlock special honors with XP bonuses.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((item) => (
                  <Card key={item.id} className={`border transition-all ${item.isUnlocked ? 'border-primary/20 bg-card' : 'border-dashed bg-muted/10 opacity-75'}`}>
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-2xl shadow-sm border shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold flex items-center gap-2">
                            {item.name}
                            {item.isUnlocked ? (
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none text-[8.5px] font-extrabold leading-none uppercase">Unlocked</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground/60 text-[8.5px] font-mono leading-none uppercase border-dashed">Locked</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1 leading-relaxed">{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-border/40">
                        <span className="text-muted-foreground">Requirement: <span className="text-foreground/80 font-semibold font-sans">{item.requirement}</span></span>
                        {item.progress && <span className="bg-secondary p-1 px-2 rounded-md font-bold text-[10px]">{item.progress}</span>}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">XP Bonus Reward:</span>
                        <span className="text-amber-500 font-extrabold flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> +{item.xpBonus} XP</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>

      </div>
    </div>
  );
}
