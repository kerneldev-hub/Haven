import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, FileCode, CheckCircle2, LayoutGrid, Eye, EyeOff, Plus, Trash2, 
  Save, Play, CheckCircle, PlusCircle, HelpCircle, FileText, ChevronLeft, ChevronRight, Zap,
  MessageSquare, Search, Sparkles, BookOpen, Volume2, Mic, MicOff, Wifi, Tv, Image, ShieldAlert, Users, Send, Check
} from 'lucide-react';
import { PersonSpace } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';

interface PersonalSpacesProps {
  spaces: PersonSpace[];
  activeSpaceId: string;
  setActiveSpaceId: (id: string) => void;
  syncSpaces: (updated: PersonSpace[]) => void;
  // Automation rule states
  automations: { id: string; trigger: string; action: string; target: string; active: boolean }[];
  setAutomations: React.Dispatch<React.SetStateAction<{ id: string; trigger: string; action: string; target: string; active: boolean }[]>>;
}

export default function PersonalSpaces({
  spaces,
  activeSpaceId,
  setActiveSpaceId,
  syncSpaces,
  automations,
  setAutomations
}: PersonalSpacesProps) {
  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0] || {
    id: 'space-web',
    name: 'Default Space',
    desc: 'Workspace template',
    files: { 'index.ts': '// Active code files' },
    notes: 'Click custom elements of the Workspace tab to add details.',
    tasks: [],
    connectedApps: []
  };

  // ----------------------------------------------------
  // DUAL-FACET LAYER COHESION STATE (WORK vs COMMUNITY)
  // ----------------------------------------------------
  const [facetMode, setFacetMode] = useState<'work' | 'community'>('work');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'files' | 'notes' | 'tasks' | 'automation'>('files');
  const [communitySubTab, setCommunitySubTab] = useState<'chat' | 'voice' | 'gallery'>('chat');

  const [selectedFileName, setSelectedFileName] = useState<string>(() => {
    return Object.keys(activeSpace.files)[0] || 'index.ts';
  });

  // Sidebar visibility flags for modular uncluttering
  const [showSpacesList, setShowSpacesList] = useState(true);
  const [showFilesList, setShowFilesList] = useState(true);

  // Buffer state for file edits
  const [fileContentBuffer, setFileContentBuffer] = useState(() => {
    return activeSpace.files[selectedFileName] || '';
  });
  const [isEditingFile, setIsEditingFile] = useState(false);

  // Contextual Embedded AI Panel parameters (No unrequested bolting!)
  const [aiCompanionResponse, setAiCompanionResponse] = useState<string>('Select an action to launch our contextual workspace compiler.');
  const [aiContextLoading, setAiContextLoading] = useState(false);

  // Create Space states
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [spaceFormName, setSpaceFormName] = useState('');
  const [spaceFormDesc, setSpaceFormDesc] = useState('');

  // Create File states
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [fileFormName, setFileFormName] = useState('');

  // Checklist Task states
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Create Automation states
  const [newAutoTrigger, setNewAutoTrigger] = useState('When file is modified');
  const [newAutoAction, setNewAutoAction] = useState('AI summarizes code changes');
  const [newAutoTarget, setNewAutoTarget] = useState('Draft note in Space');

  // Sync state with selected file
  useEffect(() => {
    setFileContentBuffer(activeSpace.files[selectedFileName] || '');
    setIsEditingFile(false);
    // Reset AI companion contextual responses based on selected fileName
    setAiCompanionResponse(`Workspace Context focus: "${selectedFileName}". Click actions below to analyze or draft tests.`);
  }, [selectedFileName, activeSpaceId]);

  // ----------------------------------------------------
  // INTEGRATED COHESIVE COMMUNITY FACET STATE MODULES
  // ----------------------------------------------------
  const [chatSearch, setChatSearch] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [spaceChats, setSpaceChats] = useState<Record<string, { id: string; user: string; avatar: string; text: string; time: string }[]>>(() => {
    const saved = localStorage.getItem('haven_space_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'space-web': [
        { id: '1', user: 'Sarah', avatar: '👩‍💻', text: 'I completed adding Cloudflare Pages to the project routing parameters.', time: '10:15 AM' },
        { id: '2', user: 'Alex', avatar: '👨‍🎨', text: 'Excellent, is the Turso SQLite connection parameter stable under load?', time: '10:18 AM' },
        { id: '3', user: 'gamerdzbba7', avatar: '🚀', text: 'Yes, looking good. Running tests with 10k mock requests now.', time: '10:20 AM' },
        { id: '4', user: 'Sarah', avatar: '👩‍💻', text: 'Check out the new design wireframes in the gallery tab too!', time: '10:22 AM' }
      ],
      'space-finance': [
        { id: '1', user: 'Alice', avatar: '📊', text: 'Financial charts modules have been imported.', time: '02:30 PM' },
        { id: '2', user: 'gamerdzbba7', avatar: '🚀', text: 'Understood, make sure to write client-only mocks for now.', time: '02:32 PM' }
      ]
    };
  });

  // Living Wiki FAQ State
  const [isGeneratingWiki, setIsGeneratingWiki] = useState(false);
  const [spaceWikis, setSpaceWikis] = useState<Record<string, { q: string; a: string }[]>>(() => {
    const saved = localStorage.getItem('haven_space_wikis');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'space-web': [
        { q: 'What is the serverless edge database setup?', a: 'This space utilizes Turso libSQL/SQLite database synchronized via Cloudflare Worker edge nodes.' },
        { q: 'How is the styling organized?', a: 'Tailwind utility tokens with full responsive media configurations.' }
      ]
    };
  });

  // Voice Lounge States & Network Reconnect Resilience Simulation
  const [isJoinedVoice, setIsJoinedVoice] = useState(false);
  const [voiceNetworkPing, setVoiceNetworkPing] = useState(14);
  const [voiceNetworkStatus, setVoiceNetworkStatus] = useState<'stable' | 'jitter' | 'reconnecting'>('stable');
  const [voiceIsMuted, setVoiceIsMuted] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState<string[]>(['Sarah (UI Coding)', 'Alex (DB Test)']);

  // Gallery Portfolio and Spoilers Space
  const [spaceGalleries, setSpaceGalleries] = useState<Record<string, { id: string; title: string; image: string; author: string; isSpoiler: boolean; showUnblurred?: boolean }[]>>(() => {
    const saved = localStorage.getItem('haven_space_galleries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'space-web': [
        { 
          id: 'g-1', 
          title: 'UI Workspace Mockup Theme', 
          image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400', 
          author: 'Alex', 
          isSpoiler: false 
        },
        { 
          id: 'g-2', 
          title: 'Database Schema Entity-Relationship Map', 
          image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400', 
          author: 'Sarah', 
          isSpoiler: true 
        }
      ]
    };
  });

  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGallerySpoiler, setNewGallerySpoiler] = useState(false);
  const [activeWatchParty, setActiveWatchParty] = useState({ active: true, title: 'Anime Night: Fate/Stay Night Ep 8', users: 4 });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('haven_space_chats', JSON.stringify(spaceChats));
  }, [spaceChats]);

  useEffect(() => {
    localStorage.setItem('haven_space_wikis', JSON.stringify(spaceWikis));
  }, [spaceWikis]);

  useEffect(() => {
    localStorage.setItem('haven_space_galleries', JSON.stringify(spaceGalleries));
  }, [spaceGalleries]);

  // Voice simulated network jitter loops
  useEffect(() => {
    if (!isJoinedVoice) return;
    const interval = setInterval(() => {
      if (voiceNetworkStatus === 'stable') {
        setVoiceNetworkPing(Math.floor(Math.random() * 8) + 10);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isJoinedVoice, voiceNetworkStatus]);

  // ----------------------------------------------------
  // WORKSPACE ADMINISTRATIVE & CRUD STATE HANDLERS
  // ----------------------------------------------------
  const handleCreateSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceFormName.trim()) return;
    const newId = `space-${Date.now()}`;
    const newSpace: PersonSpace = {
      id: newId,
      name: spaceFormName.trim(),
      desc: spaceFormDesc.trim() || 'Custom user workspace node.',
      files: {
        'index.ts': '// Entrypoint file created automatically.'
      },
      notes: 'Notes draft initialized for workspace.',
      tasks: [
        { id: `t-${newId}-1`, title: 'Verify dependencies setup', completed: false }
      ],
      connectedApps: []
    };
    const updatedSpaces = [...spaces, newSpace];
    syncSpaces(updatedSpaces);
    setActiveSpaceId(newId);
    setSelectedFileName('index.ts');
    setSpaceFormName('');
    setSpaceFormDesc('');
    setIsCreatingSpace(false);
  };

  const handleSelectSpace = (id: string) => {
    setActiveSpaceId(id);
    const sp = spaces.find(s => s.id === id) || spaces[0];
    if (sp) {
      const firstFile = Object.keys(sp.files)[0] || 'index.ts';
      setSelectedFileName(firstFile);
    }
  };

  const handleDeleteSpace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (spaces.length <= 1) return;
    const filtered = spaces.filter(s => s.id !== id);
    syncSpaces(filtered);
    if (activeSpaceId === id) {
      setActiveSpaceId(filtered[0].id);
      const firstFile = Object.keys(filtered[0].files)[0] || 'index.ts';
      setSelectedFileName(firstFile);
    }
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileFormName.trim()) return;
    const cleanName = fileFormName.trim();
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          files: {
            ...s.files,
            [cleanName]: `// Created: ${cleanName}\n`
          }
        };
      }
      return s;
    });
    syncSpaces(updated);
    setSelectedFileName(cleanName);
    setFileFormName('');
    setIsCreatingFile(false);
  };

  const handleSelectFile = (fileName: string) => {
    setSelectedFileName(fileName);
  };

  const handleDeleteFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fileKeys = Object.keys(activeSpace.files);
    if (fileKeys.length <= 1) {
      alert("Workspace requires at least one file active.");
      return;
    }
    const updatedFiles = { ...activeSpace.files };
    delete updatedFiles[fileName];
    
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return { ...s, files: updatedFiles };
      }
      return s;
    });
    syncSpaces(updated);
    if (selectedFileName === fileName) {
      const keys = Object.keys(updatedFiles);
      setSelectedFileName(keys[0]);
    }
  };

  const handleSaveFileContent = () => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          files: {
            ...s.files,
            [selectedFileName]: fileContentBuffer
          }
        };
      }
      return s;
    });
    syncSpaces(updated);
    setIsEditingFile(false);
  };

  const handleNotesTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          notes: e.target.value
        };
      }
      return s;
    });
    syncSpaces(updated);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `tk-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false
    };
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          tasks: [...(s.tasks || []), newTask]
        };
      }
      return s;
    });
    syncSpaces(updated);
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          tasks: (s.tasks || []).map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return s;
    });
    syncSpaces(updated);
  };

  const handleTaskDelete = (taskId: string) => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          tasks: (s.tasks || []).filter(t => t.id !== taskId)
        };
      }
      return s;
    });
    syncSpaces(updated);
  };

  const handleAddAutomationRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: `rule-${Date.now()}`,
      trigger: newAutoTrigger,
      action: newAutoAction,
      target: newAutoTarget,
      active: true
    };
    setAutomations(prev => [...prev, newRule]);
  };

  // ----------------------------------------------------
  // COMMUNITY HANDLERS & SIMULATIONS
  // ----------------------------------------------------
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const activeChats = spaceChats[activeSpaceId] || [];
    const newChat = {
      id: `c-${Date.now()}`,
      user: 'gamerdzbba7 (You)',
      avatar: '🚀',
      text: newCommentText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSpaceChats(prev => ({
      ...prev,
      [activeSpaceId]: [...activeChats, newChat]
    }));
    setNewCommentText('');
  };

  const handleTriggerFAQGeneration = () => {
    setIsGeneratingWiki(true);
    const activeChats = spaceChats[activeSpaceId] || [];
    
    const generatedWiki = [
      { 
        q: `What was discussed recently regarding ${activeSpace.name}?`, 
        a: activeChats.length > 0 
          ? `Collaborators discussed code integrations, including: "${activeChats.slice(-3).map(c => c.text).join('; ')}".`
          : "No active discussions recorded yet. Start chat messages to compile logs!"
      },
      { 
        q: "What is the primary developer deployment pipeline?", 
        a: "The project compiles to standard production-ready static assets or Cloudflare Workers on the edge network." 
      },
      {
        q: "Are database structures fully type-safe?",
        a: "Yes, SQLite parameters are bounded by static Type Definition manifests and local Drizzle ORM code constraints."
      }
    ];

    setSpaceWikis(prev => ({
      ...prev,
      [activeSpaceId]: generatedWiki
    }));
    setIsGeneratingWiki(false);
  };

  const handleSimulateNetworkDrop = () => {
    setVoiceNetworkStatus('reconnecting');
    setVoiceNetworkPing(-1);
    
    setVoiceNetworkStatus('jitter');
    setVoiceNetworkPing(65);
    setVoiceNetworkStatus('stable');
    setVoiceNetworkPing(12);
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle.trim()) return;
    
    const activeGallery = spaceGalleries[activeSpaceId] || [];
    const newItem = {
      id: `g-${Date.now()}`,
      title: newGalleryTitle.trim(),
      image: newGalleryUrl.trim() || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400',
      author: 'gamerdzbba7',
      isSpoiler: newGallerySpoiler
    };

    setSpaceGalleries(prev => ({
      ...prev,
      [activeSpaceId]: [...activeGallery, newItem]
    }));

    setNewGalleryTitle('');
    setNewGalleryUrl('');
    setNewGallerySpoiler(false);
  };

  const handleTriggerAICompanion = (actionType: string) => {
    setAiContextLoading(true);
    setAiCompanionResponse("AI Companion context gathering triggered...");
    
    if (actionType === 'optimize') {
      setAiCompanionResponse(`[AI OPTIMIZATION PROPOSAL for ${selectedFileName}]:\n- Refactored state synchronization using lazy init trackers.\n- Eliminated unnecessary dependency recomputations in useEffect closures.\n- Improved overall responsive memory profile.`);
    } else if (actionType === 'unit-test') {
      setAiCompanionResponse(`[AI GENERATED SERVICE TESTING SUITE]:\ndescribe("${selectedFileName} core integration", () => {\n  it("verifies secure environment declarations", () => {\n    expect(process.env).toBeDefined();\n  });\n});`);
    } else {
      setAiCompanionResponse(`[AI CODE SUMMARY]:\n- Architecture: Modular functional component.\n- Vulnerabilities: None identified.\n- Integration status: Full alignment with private edge protocols.`);
    }
    setAiContextLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTIONS DIVIDER CONTROLS (UNCLUTTERED WORKSPACE LAYOUT) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 bg-card/50 border border-border/40 rounded-2xl text-left">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/15 font-mono text-[9px] mb-1">WORKSPACE PROFILE MODULE</Badge>
            <h3 className="text-sm font-bold text-foreground">Project: <span className="text-primary font-extrabold">{activeSpace.name}</span></h3>
          </div>
          <span className="hidden sm:inline text-zinc-700">|</span>
          
          <div className="flex bg-[#0a0b0d]/70 p-1 rounded-xl border border-border/40 select-none">
            <button
              onClick={() => setFacetMode('work')}
              id="facet-toggle-work"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                facetMode === 'work' ? 'bg-primary text-background shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🛠️ Work Engine
            </button>
            <button
              onClick={() => setFacetMode('community')}
              id="facet-toggle-community"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                facetMode === 'community' ? 'bg-violet-600 text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              👥 Community Hub
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowSpacesList(!showSpacesList)}
              className={`p-1.5 px-2 bg-zinc-900 border border-border/40 hover:border-zinc-500/50 text-[10.5px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer`}
            >
              {showSpacesList ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSpacesList ? "Hide Projects" : "Show Projects"}</span>
            </button>
          </div>
        </div>

        {facetMode === 'work' ? (
          <div className="flex gap-1.5 bg-[#0e0f12] p-1 border border-border/30 rounded-xl select-none">
            {['files', 'notes', 'tasks', 'automation'].map((sub) => {
              const isSel = workspaceSubTab === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setWorkspaceSubTab(sub as any)}
                  className={`py-1.5 px-3 rounded-lg text-xs uppercase font-extrabold tracking-wider transition-colors cursor-pointer ${
                    isSel ? 'bg-primary text-background' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-1.5 bg-[#0e0f12] p-1 border border-border/30 rounded-xl select-none">
            {['chat', 'voice', 'gallery'].map((sub) => {
              const isSel = communitySubTab === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setCommunitySubTab(sub as any)}
                  className={`py-1.5 px-3 rounded-lg text-xs uppercase font-extrabold tracking-wider transition-colors cursor-pointer ${
                    isSel ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {sub === 'chat' ? '💬 Chat' : (sub === 'voice' ? '🔊 Voice' : '🖼️ Gallery')}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* SPACES COLUMN (LEFT: col-span-3 - COLLAPSIBLE) */}
        {showSpacesList && (
          <div className="lg:col-span-3 bg-card/45 border border-border/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/20">
              <span className="text-[10px] tracking-wider font-mono font-bold text-zinc-500">PROJECT REGISTRY</span>
              <button 
                onClick={() => setIsCreatingSpace(true)} 
                className="text-primary hover:text-white cursor-pointer"
                title="Create a custom Independent Project Space"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* SPACE CREATOR DIALOG OR FORM VIEW */}
            {isCreatingSpace && (
              <form onSubmit={handleCreateSpaceSubmit} className="p-3 bg-[#0a0c0e] border border-border/80 rounded-xl space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-450 uppercase">Space Name</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Finance Dashboard" 
                    value={spaceFormName}
                    onChange={(e) => setSpaceFormName(e.target.value)}
                    className="w-full text-xs h-8 px-2 bg-background border border-border rounded focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-450 uppercase">Description</span>
                  <input 
                    type="text" 
                    placeholder="Brief description..." 
                    value={spaceFormDesc}
                    onChange={(e) => setSpaceFormDesc(e.target.value)}
                    className="w-full text-xs h-8 px-2 bg-background border border-border rounded focus:border-primary outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingSpace(false)} 
                    className="text-[10.5px] text-zinc-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <Button type="submit" size="sm" className="h-7 text-[10.5px] font-bold">Compile Space</Button>
                </div>
              </form>
            )}

            {/* SPACES ITERATOR */}
            <div className="space-y-2">
              {spaces.map((sp) => {
                const isSelected = sp.id === activeSpaceId;
                const spChatCount = (spaceChats[sp.id] || []).length;
                return (
                  <div 
                    key={sp.id}
                    onClick={() => handleSelectSpace(sp.id)}
                    className={`p-3 rounded-xl border cursor-pointer select-none text-left flex items-start justify-between group transition-all ${
                      isSelected 
                        ? 'bg-zinc-800/15 border-foreground/50' 
                        : 'bg-[#0a0c0d] border-border/30 hover:border-zinc-500/20'
                    }`}
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black block group-hover:text-primary transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>{sp.name}</span>
                        {spChatCount > 0 && (
                          <Badge className="bg-violet-600/20 text-violet-400 border-none font-mono text-[8px] h-3.5 px-1 leading-none ">{spChatCount}</Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-sans block mt-0.5 line-clamp-1">{sp.desc}</span>
                    </div>

                    <button 
                      onClick={(e) => handleDeleteSpace(sp.id, e)}
                      disabled={spaces.length <= 1}
                      className="text-zinc-650 hover:text-red-400 p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WORKSPACE OPERATIONS CANVAS (MIDDLE & RIGHT: col-span-9 or fill-width) */}
        <div className={`${showSpacesList ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6`}>
          
          {facetMode === 'work' && (
            <>
              {/* TAB 1: FILE EXPLORER + EDITOR CANVAS */}
              {workspaceSubTab === 'files' && (
                <div className="grid md:grid-cols-12 gap-6">
                  
                  {/* Collapsible Files List Bar (col-span-3) */}
                  {showFilesList && (
                    <div className="md:col-span-3 bg-card/45 border border-border/80 rounded-2xl p-4 space-y-4 text-left">
                      <div className="flex items-center justify-between pb-2 border-b border-border/20">
                        <span className="text-[10px] tracking-wider font-mono font-bold text-zinc-500 uppercase">FILES INDEX</span>
                        <button onClick={() => setIsCreatingFile(true)} className="text-primary hover:text-white cursor-pointer">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* FILE CREATION POP */}
                      {isCreatingFile && (
                        <form onSubmit={handleCreateFileSubmit} className="p-2.5 bg-[#0a0c0e] border border-border rounded-xl space-y-2">
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. handler.ts" 
                            value={fileFormName}
                            onChange={(e) => setFileFormName(e.target.value)}
                            className="w-full text-xs h-7 px-2 bg-background border border-border rounded focus:border-primary outline-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setIsCreatingFile(false)} className="text-[10px] text-zinc-500">Cancel</button>
                            <button type="submit" className="text-[10px] text-primary font-bold">Add</button>
                          </div>
                        </form>
                      )}

                      {/* FILES MAP */}
                      <div className="space-y-1.5 max-h-[340px] overflow-y-auto">
                        {Object.keys(activeSpace.files || {}).map((f) => {
                          const isSelected = selectedFileName === f;
                          return (
                            <div 
                              key={f}
                              onClick={() => handleSelectFile(f)}
                              className={`p-2 rounded-xl text-xs cursor-pointer select-none flex items-center justify-between group transition-colors ${
                                isSelected 
                                  ? 'bg-zinc-800/15 text-primary border border-primary/20' 
                                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/5'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-1.5">
                                <FileCode className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                <span className="font-mono text-[11px] truncate font-medium">{f}</span>
                              </div>

                              <button 
                                onClick={(e) => handleDeleteFile(f, e)}
                                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Editor Panel (col-span-9 or fill-width) */}
                  <div className={`${showFilesList ? 'md:col-span-9' : 'md:col-span-12'} bg-[#07080a]/95 border border-border/85 rounded-2xl p-4 flex flex-col justify-between min-h-[460px] font-mono text-left`}>
                    <div className="grid xl:grid-cols-4 gap-6">
                      
                      {/* Interactive Code Editor Field */}
                      <div className="xl:col-span-3 space-y-4">
                        <div className="flex items-center justify-between border-b border-border/30 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                            <span className="text-xs text-zinc-300 font-bold uppercase">{selectedFileName}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isEditingFile ? (
                              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/15 text-[9px] font-mono">DRAFT BUFFER UNSAVED</Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-450 border-emerald-500/15 text-[9px] font-mono font-bold">LIVE COMPILED</Badge>
                            )}

                            <Button 
                              size="sm"
                              onClick={handleSaveFileContent}
                              disabled={!isEditingFile}
                              className="h-7 text-[10px] font-mono font-bold bg-primary text-background hover:bg-sky-400 cursor-pointer rounded-lg"
                            >
                              <Save className="w-3.5 h-3.5 mr-1" />
                              COMMIT WORKSPACE
                            </Button>
                          </div>
                        </div>

                        <textarea 
                          value={fileContentBuffer}
                          onChange={(e) => {
                            setFileContentBuffer(e.target.value);
                            setIsEditingFile(true);
                          }}
                          className="w-full text-xs p-2.5 outline-none resize-none bg-[#050607] text-[#00ff66] hover:bg-[#060709] border border-border/40 focus:border-primary rounded-xl h-[320px] leading-relaxed font-mono"
                          spellCheck="false"
                        />

                        {/* Presences on this workspace */}
                        <div className="p-3 bg-[#0a0c0e] rounded-xl flex items-center justify-between text-xs border border-border/20 font-sans">
                          <span className="text-zinc-500 font-medium">Co-presences on this space:</span>
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span> Sarah (Coding)</span>
                            <span className="inline-flex items-center text-zinc-400"><span className="w-2 h-2 rounded-full bg-zinc-650 mr-1.5"></span> Alex (Review)</span>
                            <span className="inline-flex items-center font-bold text-primary"><span className="w-2 h-2 rounded-full bg-primary mr-1.5"></span> gamerdzbba7 (You)</span>
                          </div>
                        </div>
                      </div>

                      {/* Contextual Embedded AI Panel (First-class integrated feature) */}
                      <div className="xl:col-span-1 bg-muted/20 border border-border/50 rounded-xl p-4 flex flex-col justify-between font-sans relative">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-xs font-mono font-bold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> AI Workspace Companion</span>
                            <Badge variant="outline" className="text-[8px] font-mono">MODEL: CAPABLE</Badge>
                          </div>

                          <div className="bg-[#050607] rounded-lg p-3 text-[11px] leading-relaxed select-text font-mono border text-zinc-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap">
                            {aiContextLoading ? (
                              <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <div className="w-5 h-5 rounded-full border-t-2 border-primary animate-spin"></div>
                                <span className="text-[10px] text-zinc-500 font-sans">Analyzing file variables...</span>
                              </div>
                            ) : (
                              aiCompanionResponse
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-4">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500 font-mono">LAUNCH CONTEXT ACTIONS</span>
                          <button
                            onClick={() => handleTriggerAICompanion('optimize')}
                            className="w-full text-left p-2 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between"
                          >
                            <span>Suggest Optimizations</span>
                            <Zap className="w-3 h-3 text-amber-400" />
                          </button>
                          <button
                            onClick={() => handleTriggerAICompanion('unit-test')}
                            className="w-full text-left p-2 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between"
                          >
                            <span>Formulate Unit Test Suite</span>
                            <FileText className="w-3 h-3 text-primary" />
                          </button>
                          <button
                            onClick={() => handleTriggerAICompanion('summary')}
                            className="w-full text-left p-2 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between"
                          >
                            <span>Core File Report</span>
                            <BookOpen className="w-3 h-3 text-emerald-400" />
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-between items-center bg-[#050607]/50 border-t border-border/10 pt-2.5 text-[9.5px] text-zinc-500 mt-4">
                      <span>Lines: {fileContentBuffer.split('\n').length}</span>
                      <span>Workspace isolation boundaries verified</span>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: RICH COLOR SCRATCHPAD NOTES */}
              {workspaceSubTab === 'notes' && (
                <div className="bg-card/45 border border-border/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-border/25">
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">Interactive Notes Scratchpad</h4>
                      <p className="text-[11px] text-muted-foreground">Keep persistent structured scratchnotes linked on this space instance.</p>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono text-[9px]">WORKSPACE PREFERENCE</Badge>
                  </div>

                  <textarea 
                    value={activeSpace.notes}
                    onChange={(e) => handleNotesTextChange(e.target.value)}
                    rows={11}
                    className="w-full text-xs leading-relaxed p-4 bg-background border border-border/60 hover:bg-neutral-900/5 focus:border-zinc-500 rounded-xl outline-none"
                    placeholder="Start typing your custom workspace records, deployment hooks, local API parameters..."
                  />
                </div>
              )}

              {/* TAB 3: CUSTOM CHECKLIST TASKS */}
              {workspaceSubTab === 'tasks' && (
                <div className="bg-card/45 border border-border/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-border/25">
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">Workspace Task Checklist</h4>
                      <p className="text-[11px] text-muted-foreground">Define checkpoints of this project node. Autodeploys upon completion flags.</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-450 border-emerald-500/15 font-mono text-[10px]">{activeSpace.tasks.length} Checkpoints</Badge>
                  </div>

                  {/* NEW TASK INLINE FORM */}
                  <form onSubmit={handleAddTaskSubmit} className="flex gap-2">
                    <input 
                      type="text" 
                      required 
                      placeholder="Enter task item detail (e.g. Sync sandbox CSS models)..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 text-xs h-9 px-3 bg-background border border-border rounded-xl focus:border-primary outline-none"
                    />
                    <Button type="submit" size="sm" className="h-9 px-4 text-xs font-bold font-sans cursor-pointer">Add Checkpoint</Button>
                  </form>

                  {/* LIST MAP */}
                  <div className="space-y-2">
                    {activeSpace.tasks.length === 0 ? (
                      <div className="py-8 bg-zinc-900/30 rounded-xl border border-border/30 text-center text-xs text-zinc-500 font-sans">
                        No checkpoints initialized yet. Add one above.
                      </div>
                    ) : (
                      activeSpace.tasks.map((tsk) => (
                        <div 
                          key={tsk.id}
                          onClick={() => handleToggleTask(tsk.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-colors ${
                            tsk.completed 
                              ? 'bg-[#0f1712] border-emerald-500/15 text-zinc-500' 
                              : 'bg-[#0a0b0d] border-border/30 text-foreground hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={tsk.completed} 
                              onChange={() => {}} // handled by click of parent
                              className="w-4 h-4 rounded border-border text-emerald-400 focus:ring-emerald-400"
                            />
                            <span className={`text-xs font-medium font-sans ${tsk.completed ? 'line-through text-zinc-500' : ''}`}>
                              {tsk.title}
                            </span>
                          </div>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleTaskDelete(tsk.id); }}
                            className="text-zinc-650 hover:text-red-400 cursor-pointer p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: NO-CODE AUTOMATION TRIGGER ENGINE */}
              {workspaceSubTab === 'automation' && (
                <div className="bg-card/45 border border-border/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-border/25">
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">Zero-Code AI Automations</h4>
                      <p className="text-[11px] text-muted-foreground">Define pipeline logic linking save events to assistant summaries and log hooks.</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[9px]">Edge V3</Badge>
                  </div>

                  {/* AUTOMATION CREATOR FORM */}
                  <form onSubmit={handleAddAutomationRuleSubmit} className="grid sm:grid-cols-3 gap-3 p-3 bg-zinc-900/40 rounded-xl border border-border/40 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Trigger Action</span>
                      <select 
                        value={newAutoTrigger}
                        onChange={(e) => setNewAutoTrigger(e.target.value)}
                        className="w-full text-xs h-9 px-2 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
                      >
                        <option value="When file is modified">When file is modified</option>
                        <option value="When task is completed">When task is completed</option>
                        <option value="On user login event">On user login event</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Automation Logic</span>
                      <select 
                        value={newAutoAction}
                        onChange={(e) => setNewAutoAction(e.target.value)}
                        className="w-full text-xs h-9 px-2 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
                      >
                        <option value="AI summarizes code changes">AI summarizes code changes</option>
                        <option value="Send details to connected Apps">Send details to connected Apps</option>
                        <option value="Log events directly to Discord">Log events directly to Discord</option>
                      </select>
                    </div>

                    <div className="space-y-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Automation Target</span>
                        <select 
                          value={newAutoTarget}
                          onChange={(e) => setNewAutoTarget(e.target.value)}
                          className="w-full text-xs h-9 px-2 bg-background border border-border rounded-lg outline-none text-foreground focus:border-zinc-500"
                        >
                          <option value="Draft note in Space">Draft note in Space</option>
                          <option value="Webhook callback">Webhook callback</option>
                          <option value="Discord Channel">Discord Channel</option>
                        </select>
                      </div>
                      <Button type="submit" size="sm" className="w-full h-9 text-xs font-bold mt-2 cursor-pointer">Commit Automation</Button>
                    </div>
                  </form>

                  {/* AUTOMATION ITERATOR */}
                  <div className="space-y-2 pt-2">
                    {automations.map((auto) => (
                      <div key={auto.id} className="p-3 bg-[#0a0c0e] border border-border/50 rounded-xl flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-bold text-zinc-200">{auto.trigger}</span>
                          </div>
                          <p className="text-[11.5px] text-zinc-500 mt-1 font-sans">
                            Execute: <strong className="text-primary">{auto.action}</strong> ➔ Target: <strong className="text-violet-400">{auto.target}</strong>
                          </p>
                        </div>

                        <button 
                          onClick={() => setAutomations(prev => prev.filter(a => a.id !== auto.id))}
                          className="text-zinc-650 hover:text-red-400 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* COMMUNITY MODE ACTIVATED LAYOUT */}
          {facetMode === 'community' && (
            <div className="space-y-6">
              
              {/* FACET TAB 1: REAL-TIME MESSAGING FOR PROJECT */}
              {communitySubTab === 'chat' && (
                <div className="bg-card border border-border rounded-2xl p-5 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-violet-400">
                        <MessageSquare className="w-4 h-4" />
                        Channel: #project-chat
                      </h4>
                      <p className="text-xs text-muted-foreground">Every project space has its own decentralized chat thread. Chat details compile database state summaries.</p>
                    </div>

                    <div className="flex bg-zinc-950 p-1 rounded-xl border items-center pl-3">
                      <Search className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Search chat memory..." 
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        className="bg-transparent h-7 text-xs border-none outline-none text-zinc-200 w-44 font-sans"
                      />
                    </div>
                  </div>

                  {/* ACTIVE CHAT FEED */}
                  <div className="space-y-4 max-h-[280px] overflow-y-auto p-2 border border-border/20 rounded-xl bg-zinc-950/40">
                    {((spaceChats[activeSpaceId] || [])).filter(comment => {
                      if (!chatSearch) return true;
                      return comment.text.toLowerCase().includes(chatSearch.toLowerCase()) || comment.user.toLowerCase().includes(chatSearch.toLowerCase());
                    }).map((chat) => (
                      <div key={chat.id} className="flex gap-3 hover:bg-muted/15 p-2 rounded-lg transition-all text-sm group">
                        <div className="w-8 h-8 rounded-full bg-[#1b1c20] flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0 leading-relaxed">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-zinc-300 text-xs">{chat.user}</span>
                            <span className="text-[10px] text-zinc-650 font-mono">{chat.time}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 select-text">{chat.text}</p>
                        </div>
                      </div>
                    ))}
                    {((spaceChats[activeSpaceId] || [])).length === 0 && (
                      <div className="py-12 text-center text-zinc-550 text-xs font-sans">
                        No messages in chat history. Express your thoughts to the thread!
                      </div>
                    )}
                  </div>

                  {/* SEND FORUM MESSAGE PANEL */}
                  <form onSubmit={handleSendComment} className="flex gap-2.5">
                    <input 
                      type="text" 
                      placeholder="Discuss architectural modifications, sync limits, team checklists..." 
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 h-10 px-4 text-xs rounded-xl bg-background border border-border/80 text-foreground outline-none focus:border-violet-500 transition-colors"
                    />
                    <Button type="submit" className="h-10 px-4 bg-violet-600 text-white hover:bg-violet-700 cursor-pointer rounded-xl font-bold flex items-center gap-1.5 shrink-0">
                      <Send className="w-3.5 h-3.5" /> Send
                    </Button>
                  </form>

                  {/* DURABLE KNOWLEDGE SUMMARY GENERATION LAYER (Resolving Discords memory deficit) */}
                  <div className="p-4 bg-violet-600/5 border border-violet-500/15 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-violet-400 block">Durable Memory compiler</span>
                        <h5 className="text-xs font-bold text-zinc-200">Compile Living Workspace FAQ / Wiki</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">Summarize discussions, architectural paradigms, and requirements instantly into searchable FAQ blocks.</p>
                      </div>

                      <button
                        onClick={handleTriggerFAQGeneration}
                        disabled={isGeneratingWiki}
                        className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-[11px] font-bold h-8 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        {isGeneratingWiki ? "Summarizing Logs..." : "Compile Living Wiki"}
                      </button>
                    </div>

                    {/* FAQaccordion container */}
                    {(spaceWikis[activeSpaceId] || []).length > 0 && (
                      <div className="pt-2.5 border-t border-violet-500/10 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">Living Wiki accordion & faq:</span>
                        {(spaceWikis[activeSpaceId] || []).map((faq, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-950/60 rounded-xl border border-border/40 space-y-1.5">
                            <h6 className="text-[11.5px] font-extrabold text-violet-400">Q: {faq.q}</h6>
                            <p className="text-[11px] text-muted-foreground select-text leading-relaxed">A: {faq.a}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* FACET TAB 2: LIVE CONNECTED AUDIO LOUNGE */}
              {communitySubTab === 'voice' && (
                <div className="bg-card border border-border rounded-2xl p-5 space-y-6">
                  <div className="flex items-start justify-between border-b pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-violet-400">
                        <Volume2 className="w-4 h-4" />
                        Space Presence: Voice Lounge
                      </h4>
                      <p className="text-xs text-muted-foreground">Jump in and out of the project’s voice channel of the Work Layer casually.</p>
                    </div>

                    {isJoinedVoice && (
                      <div className="flex items-center gap-2 text-xs font-mono select-none">
                        {voiceNetworkStatus === 'reconnecting' ? (
                          <span className="text-yellow-400 font-extrabold flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
                            Auto-Reconnecting Network...
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5" />
                            Ping: {voiceNetworkPing}ms ({voiceNetworkStatus === 'jitter' ? 'Jittery' : 'Stable'})
                          </span>
                        )}
                        
                        <button
                          onClick={handleSimulateNetworkDrop}
                          className="px-2 py-0.5 bg-zinc-900 border text-[9.5px] font-bold text-zinc-400 hover:text-white rounded"
                          title="Click to test the auto-reconnect stabilizer resilient behavior."
                        >
                          Trigger Jitter Drop
                        </button>
                      </div>
                    )}
                  </div>

                  {!isJoinedVoice ? (
                    <div className="p-8 text-center bg-zinc-950/60 rounded-xl border border-border/40 border-dashed space-y-4">
                      <span className="text-2xl block text-slate-500">🔊</span>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">Click below to activate and drop inside the workspace audio lounge. Coordinate code updates with 2 collaborators now online.</p>
                      
                      <button
                        onClick={() => setIsJoinedVoice(true)}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs h-9 px-5 rounded-xl cursor-pointer shadow transition-all duration-300"
                      >
                        ⚡ Connect Voice Channel
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6 items-stretch animate-in fade-in duration-300">
                      
                      {/* Left: speaker active indicator */}
                      <div className="p-4 bg-zinc-950/40 rounded-xl border space-y-4 text-left flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0 flex items-center">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping mr-1.5"></span>
                            ACTIVE AUDIO ROUTE
                          </span>
                          <h5 className="text-xs font-bold text-zinc-300">Speaking in Sync:</h5>
                        </div>

                        {/* Interactive speech wave Peaks */}
                        <div className="flex items-end justify-center gap-1 h-14 bg-[#08090c] rounded-xl border border-white/5 relative overflow-hidden p-3 py-4 select-none">
                          {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 6, 5, 4, 3, 4, 5, 6, 7, 6, 5, 4, 2].map((height, ix) => (
                            <div 
                              key={ix} 
                              className={`w-1 rounded-full bg-violet-500 transition-all duration-500`} 
                              style={{ 
                                height: `${voiceNetworkStatus === 'reconnecting' ? 2 : (voiceIsMuted ? 4 : height * (Math.random() * 5 + 3))}px` 
                              }}
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center bg-zinc-950 rounded-lg p-2 text-[10.5px]">
                          <span className="text-zinc-500">Microphone:</span>
                          <button
                            onClick={() => setVoiceIsMuted(!voiceIsMuted)}
                            className={`p-1 px-2 text-[10px] rounded font-bold transition-colors ${voiceIsMuted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}
                          >
                            {voiceIsMuted ? 'MUTED' : 'ACTIVE LIVE'}
                          </button>
                        </div>
                      </div>

                      {/* Right: people in the conference */}
                      <div className="p-4 bg-zinc-950/40 rounded-xl border space-y-4">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">PARTICIPANTS ({voiceUsers.length + 1})</span>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto">
                          
                          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-background">YOU</span>
                              <span className="text-zinc-200">gamerdzbba7</span>
                            </div>
                            <span className="text-[9px] uppercase font-bold text-primary font-mono">Stream Host</span>
                          </div>

                          {voiceUsers.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center font-bold text-[10px] text-foreground">{u.charAt(0)}</span>
                                <span className="text-zinc-300">{u.split(' ')[0]}</span>
                              </div>
                              <span className="text-[9.5px] text-zinc-500 font-mono italic">{u.split(' ')[1]}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setIsJoinedVoice(false)}
                          className="w-full h-9 bg-red-600/15 border border-red-500/20 hover:bg-red-650 hover:text-white rounded-xl text-red-400 font-bold text-xs cursor-pointer transition-colors"
                        >
                          Disconnect Audio Lounge
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* FACET TAB 3: IMAGE & GALLERY fANDOM PORTFOLIO */}
              {communitySubTab === 'gallery' && (
                <div className="bg-card border border-border rounded-2xl p-5 space-y-6">
                  
                  {/* Anime WATCH PARTY Presence Overlay */}
                  {activeWatchParty.active && (
                    <div className="p-4 bg-gradient-to-r from-violet-950/40 via-violet-900/10 to-transparent border border-violet-500/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center text-xl shrink-0 border border-violet-500/15">
                          🎬
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 font-bold">WATCH PARTY STATUS ACTIVE</span>
                          </div>
                          <span className="text-xs font-black block text-zinc-100">{activeWatchParty.title}</span>
                          <span className="text-[11px] text-zinc-500 block">4 team members are currently watching live sync stream on this space.</span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert("Joining the co-presences Sync Video Watch-Room...")}
                        className="h-8 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-lg transition-all shrink-0"
                      >
                        [Join Watch Room]
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-violet-400">
                        <Image className="w-4 h-4" />
                        Creative Assets & Fandom Portfolio
                      </h4>
                      <p className="text-xs text-muted-foreground">Upload design mockups, fan art, gameplay clips, or visual deliverables. Outfitted with spoiler covers.</p>
                    </div>

                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[9.5px] font-mono font-bold leading-none py-1">CREATIVE CHANNEL</Badge>
                  </div>

                  {/* GALLERY MOCKS GRIDS */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(spaceGalleries[activeSpaceId] || []).map((item) => (
                      <div key={item.id} className="relative border rounded-xl overflow-hidden bg-zinc-950 flex flex-col justify-between group group/card">
                        
                        {/* Interactive Spoiler visual mask */}
                        <div className="relative aspect-video overflow-hidden border-b bg-neutral-900 bg-center bg-cover">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            referrerPolicy="no-referrer"
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              item.isSpoiler && !item.showUnblurred ? 'blur-2xl hover:blur-md select-none' : ''
                            }`}
                          />

                          {item.isSpoiler && !item.showUnblurred && (
                            <div 
                              onClick={() => {
                                const galleryList = spaceGalleries[activeSpaceId] || [];
                                const updatedList = galleryList.map(g => g.id === item.id ? { ...g, showUnblurred: true } : g);
                                setSpaceGalleries(prev => ({
                                  ...prev,
                                  [activeSpaceId]: updatedList
                                }));
                              }}
                              className="absolute inset-0 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none"
                            >
                              <Badge variant="destructive" className="mb-2 font-black uppercase text-[9px]">⚠️ EXPLICIT CONTENT SPOILER</Badge>
                              <span className="text-xs font-bold text-white uppercase tracking-tight">Double-Click to Reveal Spoilers</span>
                              <span className="text-[10px] text-zinc-500 mt-1">Gameplay details or anime episode leaks.</span>
                            </div>
                          )}
                        </div>

                        <div className="p-3.5 space-y-1 text-xs">
                          <h5 className="font-bold text-zinc-200 line-clamp-1">{item.title}</h5>
                          <div className="flex justify-between items-center text-[10px] text-zinc-500">
                            <span>Shared by: <strong>@{item.author}</strong></span>
                            {item.isSpoiler && <span className="text-red-400 font-bold bg-red-400/10 px-1 rounded">SPOILER</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FORM TO UPLOAD DESIGN ASSET OR FAN-ART MOCK */}
                  <form onSubmit={handleAddGalleryItem} className="p-4 bg-muted/10 border rounded-xl space-y-3.5 text-left text-xs text-muted-foreground">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">POST CREATIVE OR DESIGN FILE</span>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span>Asset Title</span>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Website Wireframe v2" 
                          value={newGalleryTitle}
                          onChange={(e) => setNewGalleryTitle(e.target.value)}
                          className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg outline-none text-foreground focus:border-violet-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <span>Image URL (or Unsplash mockup)</span>
                        <input 
                          type="text" 
                          placeholder="e.g. https://images.unsplash.com/..." 
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          className="w-full text-xs h-9 px-3 bg-background border border-border rounded-lg outline-none text-foreground focus:border-violet-500 font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-4 select-none">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input 
                            type="checkbox" 
                            checked={newGallerySpoiler}
                            onChange={(e) => setNewGallerySpoiler(e.target.checked)}
                            className="w-4 h-4 rounded text-violet-500 border-border focus:ring-violet-500"
                          />
                          <span>Mark Spoiler (Blur Image filter)</span>
                        </label>
                      </div>

                      <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-750 text-white font-bold text-xs h-8 px-4 rounded-xl">
                        Add Design Deliverable
                      </Button>
                    </div>
                  </form>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
