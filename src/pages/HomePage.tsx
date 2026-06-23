import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot, Code, FileText, Search, Briefcase, CheckSquare, 
  Plus, Settings, Save, Sparkles, Database, Trash2, 
  Send, User, ShieldAlert, Cpu, ArrowRight, Layers, 
  AlertCircle, UploadCloud, SearchCode, BookOpen, Clock, Play,
  RefreshCw, CheckCircle, Copy, Check, Info, HardDrive, Network, 
  FolderOpen, FileCode, CheckCircle2, LayoutGrid, Eye, EyeOff, 
  Settings2, Activity, Zap, Share2, HelpCircle, Key, ArrowUpRight, PlusCircle, Sliders, Hash, Shield, Terminal
} from 'lucide-react';

import { Button } from '../components/ui/components';
import { Badge } from '../components/ui/Badge';
import { PersonSpace, CustomAgent, CommunityPost, AppMarketCard, HavenExtension, SandboxExecutionLog } from '../types';

// Import our newly created modular subcomponents!
import PluginEngine from '../components/PluginEngine';
import PersonalSpaces from '../components/PersonalSpaces';
import HavenAI from '../components/HavenAI';
import CommunitySection from '../components/CommunitySection';
import HomeDashboard from '../components/HomeDashboard';
import HavenMarketplace from '../components/HavenMarketplace';
import IDEModule from '../components/IDEModule';
import { PluginManager } from '../lib/PluginManager';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ----------------------------------------------------
  // PLATFORM HUB TAB ROUTING
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'ai' | 'community' | 'apps' | 'plugins'>('home');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['home', 'workspace', 'ai', 'community', 'apps', 'plugins'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [location.search]);

  const switchTab = (tabName: 'home' | 'workspace' | 'ai' | 'community' | 'apps' | 'plugins') => {
    setActiveTab(tabName);
    navigate(`/workspace?tab=${tabName}`, { replace: true });
  };

  // ----------------------------------------------------
  // BRAND & THEME CONSTRAINTS
  // ----------------------------------------------------
  const [activeTheme, setActiveTheme] = useState<'minimal-glass' | 'stark-swiss' | 'cyber-terminal' | 'cosmic-dark'>(() => {
    return (localStorage.getItem('haven_active_theme') as any) || 'minimal-glass';
  });

  const changeTheme = (themeName: 'minimal-glass' | 'stark-swiss' | 'cyber-terminal' | 'cosmic-dark') => {
    setActiveTheme(themeName);
    localStorage.setItem('haven_active_theme', themeName);
  };

  // ----------------------------------------------------
  // WIDGET CONFIGURATION CONTROL ENGINE
  // ----------------------------------------------------
  const [customShortcuts, setCustomShortcuts] = useState<string[]>(() => {
    const saved = localStorage.getItem('haven_custom_shortcuts');
    return saved ? JSON.parse(saved) : ['Optimize Code', 'Sync Schema', 'Generate Pitch'];
  });
  const [newShortcutVal, setNewShortcutVal] = useState('');

  const [widgetOrder, setWidgetOrder] = useState<string[]>(['activity', 'quick-actions', 'ai-recommender', 'vitals']);
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);
  const [widgetSizes, setWidgetSizes] = useState<Record<string, 'normal' | 'double'>>({
    'activity': 'normal',
    'quick-actions': 'normal',
    'ai-recommender': 'normal',
    'vitals': 'normal'
  });

  const toggleWidgetSize = (key: string) => {
    setWidgetSizes(prev => ({
      ...prev,
      [key]: prev[key] === 'normal' ? 'double' : 'normal'
    }));
  };

  const hideWidget = (key: string) => {
    setHiddenWidgets(prev => [...prev, key]);
  };

  const restoreAllWidgets = () => {
    setHiddenWidgets([]);
    setWidgetSizes({
      'activity': 'normal',
      'quick-actions': 'normal',
      'ai-recommender': 'normal',
      'vitals': 'normal'
    });
    setWidgetOrder(['activity', 'quick-actions', 'ai-recommender', 'vitals']);
  };

  const reorderWidgets = () => {
    // Shifts widgets order as a physical gesture representing custom freedom
    setWidgetOrder(prev => [...prev.slice(1), prev[0]]);
  };

  // ----------------------------------------------------
  // UNIVERSAL '/' COMMAND CENTER BAR STATE
  // ----------------------------------------------------
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowCommandBar(true);
        setTimeout(() => commandInputRef.current?.focus(), 80);
      } else if (e.key === 'Escape') {
        setShowCommandBar(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ----------------------------------------------------
  // PERSISTENCE DATA STATES (WORKSPACE, COMMUNITY, ETC.)
  // ----------------------------------------------------
  const [spaces, setSpaces] = useState<PersonSpace[]>(() => {
    const saved = localStorage.getItem('haven_v3_spaces');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'space-web',
        name: 'Website Project',
        desc: 'Responsive landing page built with fast Cloudflare edge parameters',
        files: {
          'src/index.tsx': `export default function App() {\n  return (\n    <div className="bg-[#050607] text-white min-h-screen p-8">\n      <h1 className="text-4xl font-extrabold font-mono text-emerald-400">HAVEN_V3_WORKSPACE</h1>\n      <p className="text-sm text-zinc-400 mt-2">Zero-complexity edge-routing enabled.</p>\n    </div>\n  );\n}`,
          'server/worker.ts': `export default {\n  async fetch(request: Request): Promise<Response> {\n    return new Response(JSON.stringify({ active: true, db: "Turso SQLite" }), {\n      headers: { "content-type": "application/json" }\n    });\n  }\n};`
        },
        notes: 'Priority: Deliver standard off-white/charcoal minimal templates. Connect to Turso Edge database loops.',
        tasks: [
          { id: 't-1', title: 'Compile worker script to edge dist directory', completed: true },
          { id: 't-2', title: 'Validate HMAC webhooks with sandbox payload', completed: false }
        ],
        connectedApps: ['GitHub', 'Turso Database']
      },
      {
        id: 'space-finance',
        name: 'Monetization Planner',
        desc: 'Analyzing stripe models and Algerian local payment webhooks',
        files: {
          'accounting/transactions.csv': 'Category,Amount,Currency,Status\nSaaS Subscription,29.45,USD,Cleared\nLocal Gateways,4060,DZD,Pending'
        },
        notes: 'Review direct webhook callback loops on Algerian card gateways.',
        tasks: [
          { id: 'tf-1', title: 'Configure DZD currency exchange rate parameters', completed: false }
        ],
        connectedApps: ['Stripe Billing']
      }
    ];
  });

  const [activeSpaceId, setActiveSpaceId] = useState<string>('space-web');
  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0];

  const syncSpaces = (updated: PersonSpace[]) => {
    setSpaces(updated);
    localStorage.setItem('haven_v3_spaces', JSON.stringify(updated));
  };

  // ----------------------------------------------------
  // EXTENSIONS & PLUGINS SANDBOX STORAGE ENGINE
  // ----------------------------------------------------
  const [extensions, setExtensions] = useState<HavenExtension[]>(() => {
    const saved = localStorage.getItem('haven_sandbox_extensions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { 
        id: 'ext-custom-css', 
        name: 'CSS Customizer', 
        desc: 'Compiles and injects custom client configurations dynamically.', 
        category: 'developer', 
        author: 'core_sandbox', 
        active: true, 
        permissions: ['Inject CSS', 'Read Workspace Files'],
        grantedPermissions: ['Inject CSS']
      },
      { 
        id: 'ext-seo-audit', 
        name: 'SEO Core Audit Crawler', 
        desc: 'Checks meta descriptors and image alternates within active workspace files.', 
        category: 'workspace', 
        author: 'semantic_node', 
        active: true, 
        permissions: ['Read Workspace Files'],
        grantedPermissions: ['Read Workspace Files']
      },
      { 
        id: 'ext-webhook-log', 
        name: 'Webhook Event Interceptor', 
        desc: 'Intercepts simulated payment webhooks or callback metrics.', 
        category: 'general', 
        author: 'havpay_engine', 
        active: false, 
        permissions: ['Mock Webhook Events'],
        grantedPermissions: []
      },
      { 
        id: 'ext-git-synthesizer', 
        name: 'Git Commit Template Builder', 
        desc: 'Synthesizes beautiful markdown templates from actively modified files.', 
        category: 'developer', 
        author: 'core_sandbox', 
        active: false, 
        permissions: ['Read Workspace Files', 'Write Workspace Files'],
        grantedPermissions: []
      }
    ];
  });

  // Track sandboxed logs
  const [logs, setLogs] = useState<SandboxExecutionLog[]>(() => [
    { timestamp: new Date().toLocaleTimeString(), source: 'Sandbox Engine', permission: 'Core Initialization', status: 'GRANTED', message: 'HAVEN isolated system sandbox initialized.' }
  ]);

  const [globalToast, setGlobalToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const addLog = (source: string, permission: string, status: 'GRANTED' | 'DENIED' | 'SIMULATED', message: string) => {
    const newLog: SandboxExecutionLog = {
      timestamp: new Date().toLocaleTimeString(),
      source,
      permission,
      status,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    localStorage.setItem('haven_sandbox_extensions', JSON.stringify(extensions));
  }, [extensions]);

  // ----------------------------------------------------
  // DYNAMIC APP INTEGRATIONS STATE
  // ----------------------------------------------------
  const [appMarket, setAppMarket] = useState<AppMarketCard[]>(() => {
    const saved = localStorage.getItem('haven_app_market_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'git', name: 'GitHub Sync Module', category: 'development', desc: 'Secure repository connections linking active project directories.', connected: true, apiKeyName: 'GitHub Personal Token' },
      { id: 'turso', name: 'Turso SQLite Database', category: 'storage', desc: 'Edge database replicas synchronization.', connected: true, apiKeyName: 'Turso Schema Token' },
      { id: 'chargily', name: 'Chargily Gateways', category: 'automation', desc: 'Local Algerian card payment processors billing helper.', connected: false, apiKeyName: 'Chargily Secret Key' },
      { id: 'stripe', name: 'Stripe Billing', category: 'productivity', desc: 'Global subscription and invoice models pipeline.', connected: false, apiKeyName: 'Stripe Private Key' },
      { id: 'resend', name: 'Resend Mailing Rails', category: 'automation', desc: 'Send automatic transaction invoices and alerts.', connected: false, apiKeyName: 'Resend Secret Key' },
      { id: 'ab', name: 'GrowthBook A/B Engine', category: 'ai', desc: 'Optimize layouts dynamically across audience groups.', connected: false, apiKeyName: 'GrowthBook Key' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('haven_app_market_v3', JSON.stringify(appMarket));
  }, [appMarket]);

  // ----------------------------------------------------
  // AUTOMATION STATE
  // ----------------------------------------------------
  const [automations, setAutomations] = useState<{ id: string; trigger: string; action: string; target: string; active: boolean }[]>(() => {
    const saved = localStorage.getItem('haven_v3_automations');
    return saved ? JSON.parse(saved) : [
      { id: 'auto-1', trigger: 'When file is modified', action: 'AI summarizes code changes', target: 'Draft note in Space', active: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('haven_v3_automations', JSON.stringify(automations));
  }, [automations]);

  // ----------------------------------------------------
  // ASSISTANT CUSTOM AGENTS STATE
  // ----------------------------------------------------
  const [customAgents, setCustomAgents] = useState<CustomAgent[]>(() => {
    const saved = localStorage.getItem('haven_custom_agents_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'assistant'; text: string; mode: string }[]>(() => {
    return [
      { role: 'assistant', text: 'Universal Haven System Oracle online. Mode: Coding Oracle loaded. Ask any question to synthesize secure solution blocks.', mode: 'coding' }
    ];
  });

  // ----------------------------------------------------
  // DEVELOPER PREFERENCE CELLS STATE
  // ----------------------------------------------------
  const [savedMemories, setSavedMemories] = useState<string[]>(() => {
    const saved = localStorage.getItem('haven_user_memories');
    return saved ? JSON.parse(saved) : [
      'Preferred Framework: React 18 + Solid State TS',
      'Preferred Style Guidelines: Swiss Modern Off-White/Charcoal Contrast',
      'Deployment Goal: Cloudflare Serverless Workers with zero-overhead SQLite DB replicas'
    ];
  });

  // Register host services with PluginManager
  useEffect(() => {
    PluginManager.getInstance().registerHostServices({
      onLog: (log) => {
        setLogs(prev => [log, ...prev.slice(0, 49)]);
      },
      getFileContext: () => {
        return activeSpace?.files || {};
      },
      setFileContext: (filename, content) => {
        setSpaces(prev => {
          const updated = prev.map(s => {
            if (s.id === activeSpaceId) {
              return {
                ...s,
                files: { ...s.files, [filename]: content }
              };
            }
            return s;
          });
          localStorage.setItem('haven_v3_spaces', JSON.stringify(updated));
          return updated;
        });
        return true;
      },
      onNotification: (msg, type) => {
        setGlobalToast({ message: msg, type: type as any });
        setTimeout(() => setGlobalToast(null), 4000);
      },
      getMemories: () => {
        return savedMemories;
      }
    });
  }, [activeSpace, activeSpaceId, savedMemories]);

  // ----------------------------------------------------
  // COMMUNITY SECTION STATE
  // ----------------------------------------------------
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('haven_community_posts_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'p-1',
        author: 'alex_dev',
        title: 'Configuring Turso SQLite Replicas inside Cloudflare Pages',
        body: 'I have set up the type-safe Drizzle schema bindings representing the transaction logs. The database is blazing fast at sub-10ms response times globally.',
        likes: 24,
        commentsCount: 3,
        tag: 'Development',
        channelId: 'development-rails'
      },
      {
        id: 'p-2',
        author: 'sarah_design',
        title: 'Aesthetic Rule: Negative space is as functional as buttons',
        body: 'When building SaaS pipelines, reduce the menu columns. Let input blocks take high priority with large, typography-paired tracking titles.',
        likes: 38,
        commentsCount: 6,
        tag: 'Design',
        channelId: 'software-lore'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('haven_community_posts_v3', JSON.stringify(posts));
  }, [posts]);

  // ----------------------------------------------------
  // CONFIGURE SETTINGS CONTROL DRAWER
  // ----------------------------------------------------
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settingsCategory, setSettingsCategory] = useState<'appearance' | 'extensions' | 'reorder-widgets'>('appearance');

  // Command Search result mapping
  const getCommandCenterResults = () => {
    if (!commandQuery.trim()) return [];
    const q = commandQuery.toLowerCase();
    const results: { type: string; label: string; action: () => void }[] = [];
    
    // File search inside active space
    Object.keys(activeSpace.files || {}).forEach(f => {
      if (f.toLowerCase().includes(q)) {
        results.push({
          type: '📄 File',
          label: `${activeSpace.name} ➜ ${f}`,
          action: () => { switchTab('workspace'); setShowCommandBar(false); }
        });
      }
    });

    // Spaces search
    spaces.forEach(s => {
      if (s.name.toLowerCase().includes(q)) {
        results.push({
          type: '📂 Space',
          label: `Switch to Space: "${s.name}"`,
          action: () => { setActiveSpaceId(s.id); switchTab('workspace'); setShowCommandBar(false); }
        });
      }
    });

    // Navigation triggers
    ['Home', 'Workspace', 'AI', 'Community', 'Apps', 'Plugins'].forEach(navTab => {
      if (navTab.toLowerCase().includes(q)) {
        results.push({
          type: '🧭 Hub Link',
          label: `Open ${navTab.toUpperCase()} canvas`,
          action: () => { switchTab(navTab.toLowerCase() as any); setShowCommandBar(false); }
        });
      }
    });

    // Presets Action Triggers
    const actionsPreset = [
      { label: 'Flush Memory preference cells', action: () => { setSavedMemories([]); localStorage.removeItem('haven_user_memories'); setShowCommandBar(false); } },
      { label: 'Restore drag layouts and widgets', action: () => { restoreAllWidgets(); setShowCommandBar(false); } },
      { label: 'Open theme appearance options', action: () => { setShowSettingsPanel(true); setSettingsCategory('appearance'); setShowCommandBar(false); } }
    ];

    actionsPreset.forEach(action => {
      if (action.label.toLowerCase().includes(q)) {
        results.push({
          type: '⚡ Action',
          label: action.label,
          action: action.action
        });
      }
    });

    return results;
  };

  // Add custom shortcuts
  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortcutVal.trim() || customShortcuts.includes(newShortcutVal.trim())) return;
    const updated = [...customShortcuts, newShortcutVal.trim()];
    setCustomShortcuts(updated);
    localStorage.setItem('haven_custom_shortcuts', JSON.stringify(updated));
    setNewShortcutVal('');
  };

  const handleRemoveShortcut = (item: string) => {
    const updated = customShortcuts.filter(c => c !== item);
    setCustomShortcuts(updated);
    localStorage.setItem('haven_custom_shortcuts', JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen text-foreground relative z-0 transition-all duration-300 pb-20 ${
      activeTheme === 'cyber-terminal' 
        ? 'bg-black font-mono' 
        : activeTheme === 'stark-swiss'
        ? 'bg-[#101010] font-sans antialiased'
        : activeTheme === 'cosmic-dark'
        ? 'bg-[#06040d] font-sans'
        : 'bg-[#08090b] font-sans antialiased'
    }`}>
      
      {/* BACKGROUND GRAPHIC MOTIFS */}
      {activeTheme === 'cyber-terminal' ? (
        <div className="fixed inset-0 select-none pointer-events-none -z-10 bg-[linear-gradient(to_right,#00ff6602_1px,transparent_1px),linear-gradient(to_bottom,#00ff6602_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      ) : activeTheme === 'cosmic-dark' ? (
        <div className="fixed inset-0 select-none pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-12 left-[15%] w-96 h-96 bg-purple-700/10 rounded-full blur-[140px] animate-pulse"></div>
          <div className="absolute bottom-12 right-[20%] w-80 h-80 bg-fuchsia-600/5 rounded-full blur-[110px]"></div>
        </div>
      ) : activeTheme === 'stark-swiss' ? (
        <div className="fixed inset-0 select-none pointer-events-none -z-10 bg-[#101010]"></div>
      ) : (
        <div className="fixed inset-0 select-none pointer-events-none -z-10">
          <div className="absolute top-0 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[110px]"></div>
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[110px]"></div>
        </div>
      )}

      {/* GLOBAL TOP NAVIGATION CONTROLS */}
      <div className="w-full max-w-7xl mx-auto pt-20 px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/30 pb-4 mb-6 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-widest text-foreground">
                H A V E N
              </span>
              <Badge className="bg-primary/10 border border-primary/20 text-primary py-0 text-[9px] font-mono tracking-widest font-extrabold uppercase">V3 EXPERIENCE</Badge>
            </div>
            <p className="text-[11.5px] text-muted-foreground leading-normal">
              Private, lightweight computer space. Fully modular sandbox loader, app integrations, and custom agent compilers enabled.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* SEARCH PORT */}
            <button 
              onClick={() => setShowCommandBar(true)}
              className="px-3 py-1.5 rounded-xl bg-card border border-border hover:border-zinc-500/40 text-[11px] font-mono text-zinc-400 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Quick search or `/`</span>
              <span className="ml-2 px-1 rounded bg-zinc-800 text-[9px] font-bold">/</span>
            </button>

            {/* DIRECT COUPLER QUICK SETTINGS */}
            <button 
              onClick={() => { setShowSettingsPanel(true); setSettingsCategory('appearance'); }}
              className="p-2 rounded-xl bg-card border border-border hover:border-zinc-500/40 text-muted-foreground hover:text-foreground cursor-pointer transition-all flex items-center justify-center"
              title="Open platform configs"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CORE MODULE NAVIGATION PORTALS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/20 pb-5 mb-8 text-left select-none">
          {[
            { id: 'home', label: 'Home Dashboard', desc: 'Command center' },
            { id: 'workspace', label: 'Personal Spaces', desc: 'Code & automated logs' },
            { id: 'ide', label: 'IDE Core Engine', desc: 'Monaco local Sandbox' },
            { id: 'ai', label: 'Haven AI Stream', desc: 'Preferences & compilers' },
            { id: 'community', label: 'Community Feed', desc: 'Community channels' },
            { id: 'apps', label: 'Haven Marketplace', desc: 'One-click installables' },
            { id: 'plugins', label: 'Sandbox Plugins', desc: 'App-level permissions' }
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id as any)}
                className={`py-2 px-4 rounded-xl text-xs transition-all cursor-pointer text-left ${
                  isSel 
                    ? 'bg-foreground text-background font-black border border-foreground' 
                    : 'bg-[#0e0f11]/60 text-muted-foreground border border-border/30 hover:border-zinc-700/50 hover:text-foreground'
                }`}
              >
                <div className="font-extrabold uppercase tracking-tight text-[11.5px]">{tab.label}</div>
                <div className={`text-[9.5px] font-sans block ${isSel ? 'text-zinc-700' : 'text-zinc-500'}`}>{tab.desc}</div>
              </button>
            );
          })}
        </div>

        {/* ----------------------------------------------------
            ACTIVE VIEW PORTPORTS
            ---------------------------------------------------- */}

        {/* HUB 1: HOME WORKSPACE COMMAND DASHBOARD */}
        {activeTab === 'home' && (
          <HomeDashboard
            widgetOrder={widgetOrder}
            hiddenWidgets={hiddenWidgets}
            widgetSizes={widgetSizes}
            customShortcuts={customShortcuts}
            newShortcutVal={newShortcutVal}
            setNewShortcutVal={setNewShortcutVal}
            activeSpace={activeSpace}
            spaces={spaces}
            onReorderWidgets={reorderWidgets}
            onRestoreAllWidgets={restoreAllWidgets}
            onToggleWidgetSize={toggleWidgetSize}
            onHideWidget={hideWidget}
            onAddShortcut={handleAddShortcut}
            onRemoveShortcut={handleRemoveShortcut}
            switchTab={switchTab}
          />
        )}

        {/* HUB 2: WORKSPACE PORTAL (PERSONAL SPACES CANVAS) */}
        {activeTab === 'workspace' && (
          <PersonalSpaces 
            spaces={spaces}
            activeSpaceId={activeSpaceId}
            setActiveSpaceId={setActiveSpaceId}
            syncSpaces={syncSpaces}
            automations={automations}
            setAutomations={setAutomations}
          />
        )}

        {/* HUB 2.5: IDE CORE ENGINE */}
        {activeTab === 'ide' && (
          <IDEModule />
        )}

        {/* HUB 3: AI ASSISTANT HUB */}
        {activeTab === 'ai' && (
          <HavenAI 
            customAgents={customAgents}
            setCustomAgents={setCustomAgents}
            aiHistory={aiHistory}
            setAiHistory={setAiHistory}
            savedMemories={savedMemories}
            setSavedMemories={setSavedMemories}
          />
        )}

        {/* HUB 4: STREAMLINED COMMUNITY CONVERSATIONS */}
        {activeTab === 'community' && (
          <CommunitySection 
            posts={posts}
            setPosts={setPosts}
          />
        )}

        {/* HUB 5: UNIFIED HAVEN MARKETPLACE */}
        {activeTab === 'apps' && (
          <HavenMarketplace 
            extensions={extensions}
            setExtensions={setExtensions}
            customAgents={customAgents}
            setCustomAgents={setCustomAgents}
            spaces={spaces}
            setSpaces={setSpaces}
            setActiveSpaceId={setActiveSpaceId}
            addLog={addLog}
            onNotification={(msg, type) => {
              setGlobalToast({ message: msg, type: type as any });
              setTimeout(() => setGlobalToast(null), 4000);
            }}
            onNavigateTab={(tabId) => switchTab(tabId)}
          />
        )}

        {/* HUB 6: SANDBOXED PLUGINS CONTROLLER (PERMISSIONS AND LOGS) */}
        {activeTab === 'plugins' && (
          <PluginEngine 
            activeSpace={activeSpace}
            extensions={extensions}
            setExtensions={setExtensions}
            logs={logs}
            setLogs={setLogs}
          />
        )}

      </div>

      {/* ----------------------------------------------------
          UNIVERSAL FLOATING FOOTER OPTION OVERLAYS & STATUS BAR
          ---------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 h-11 bg-card/90 border-t border-border/40 backdrop-blur-md flex items-center justify-between px-6 z-40 select-none">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-ping"></span>
          <span className="font-mono text-[9.5px] text-zinc-400">Sandbox Isolation Boundaries: <strong className="text-[#00ff66]">SECURED</strong></span>
        </div>

        <div className="flex gap-4 text-[10px] font-mono text-zinc-550">
          <button onClick={() => switchTab('plugins')} className="hover:text-primary transition-colors cursor-pointer">
            [Plugins Registry: {extensions.filter(e => e.active).length} Active]
          </button>
          <span className="text-zinc-800">|</span>
          <button onClick={() => switchTab('apps')} className="hover:text-primary transition-colors cursor-pointer">
            [App Connects: {appMarket.filter(a => a.connected).length} Online]
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          UNIVERSAL '/' ROAD COMMAND MODAL
          ---------------------------------------------------- */}
      {showCommandBar && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-start justify-center pt-24 px-4 z-50">
          <div className="bg-[#0b0c10] border border-border/80 rounded-2xl max-w-xl w-full max-h-[460px] flex flex-col justify-between shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full blur-[40px]"></div>

            <div className="p-4 border-b border-border/20 flex items-center gap-3 select-none">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input 
                ref={commandInputRef}
                type="text" 
                placeholder="Type command name, space file, or hub destination..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm border-none outline-none text-foreground placeholder-zinc-500 font-sans"
              />
              <button 
                onClick={() => setShowCommandBar(false)}
                className="text-[10px] text-zinc-500 hover:text-white border border border-border/30 rounded px-1.5 py-0.5"
              >
                ESC
              </button>
            </div>

            {/* RESULTS VIEW */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[300px] text-left">
              {getCommandCenterResults().length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-sans">
                  {commandQuery.trim() ? "No results matching index" : "Start typing to search folders, project pages, or activate command handles..."}
                </div>
              ) : (
                getCommandCenterResults().map((res, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { res.action(); }}
                    className="p-2.5 rounded-xl bg-transparent hover:bg-zinc-900/40 border border-transparent hover:border-border/30 cursor-pointer flex items-center justify-between text-xs transition-all"
                  >
                    <span className="font-semibold text-foreground font-sans">{res.label}</span>
                    <span className="text-[10.5px] px-1.5 py-0.5 bg-zinc-950 text-zinc-500 rounded font-mono font-bold uppercase">{res.type}</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#050607]/40 border-t border-border/10 text-[9.5px] font-mono text-zinc-500 text-left select-none">
              Press <strong>ENTER</strong> or click output element to dispatch. Escape to safely dismiss.
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          PLATFORM QUICK CONFIG DRAWER
          ---------------------------------------------------- */}
      {showSettingsPanel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
          <div className="bg-[#0b0c10] border border-border/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col justify-between text-left">
            <div>
              <div className="p-5 border-b border-border/20 flex justify-between items-center bg-[#07080a]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary shrink-0" />
                  <h3 className="text-sm font-bold text-foreground font-mono">HAVEN QUICK CONTROLS CENTRAL</h3>
                </div>
                <button 
                  onClick={() => setShowSettingsPanel(false)}
                  className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-12 h-[340px]">
                {/* CATEGORIES MENU */}
                <div className="col-span-4 border-r border-border/20 bg-[#050607]/30 p-2 space-y-1 flex flex-col">
                  {[
                    { id: 'appearance', label: 'Theme Vibe' },
                    { id: 'extensions', label: 'Active Plugins' },
                    { id: 'reorder-widgets', label: 'Grid Handles' }
                  ].map((subCat) => (
                    <button
                      key={subCat.id}
                      onClick={() => setSettingsCategory(subCat.id as any)}
                      className={`w-full p-2 py-2.5 rounded-xl text-xs font-mono font-bold text-left transition-colors ${
                        settingsCategory === subCat.id 
                          ? 'bg-zinc-900 border border-border/40 text-primary' 
                          : 'text-zinc-400 hover:bg-zinc-900/25 hover:text-foreground'
                      }`}
                    >
                      {subCat.label}
                    </button>
                  ))}
                </div>

                {/* CONTENT AREA */}
                <div className="col-span-8 p-5 space-y-4 overflow-y-auto">
                  
                  {/* CATEGORY 1: ACTIVE DESIGN THEMES */}
                  {settingsCategory === 'appearance' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-foreground font-mono">SELECT STRUCTURAL VIBE STYLE</h4>
                      <p className="text-[10.5px] text-muted-foreground leading-normal">
                        Toggle different font, border overlays, and ambient backdrop layouts instantly to tailor your focus needs.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'minimal-glass', label: 'Minimal Glass', desc: 'Sleek off-slates/emerald' },
                          { id: 'cosmic-dark', label: 'Cosmic Violet', desc: 'Space fog aesthetics' },
                          { id: 'stark-swiss', label: 'Stark Swiss', desc: 'Chamber modern contrast' },
                          { id: 'cyber-terminal', label: 'Cyber Green', desc: 'Green grid terminal mono' }
                        ].map((th) => {
                          const isSel = activeTheme === th.id;
                          return (
                            <div 
                              key={th.id}
                              onClick={() => changeTheme(th.id as any)}
                              className={`p-3 rounded-xl border text-left cursor-pointer select-none transition-colors ${
                                isSel 
                                  ? 'bg-[#15191d] border-foreground/50' 
                                  : 'bg-zinc-950/60 border-border/30 hover:border-zinc-500/20'
                              }`}
                            >
                              <span className="text-[11px] font-black text-foreground block">{th.label}</span>
                              <span className="text-[9px] text-zinc-550 block mt-0.5">{th.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* CATEGORY 2: PLUGINS INSTANT POINTERS */}
                  {settingsCategory === 'extensions' && (
                    <div className="space-y-4 text-left">
                      <h4 className="text-xs font-extrabold text-foreground font-mono">Sandbox Sandbox Safety Handles</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Manage app-level modular permissions and isolated virtual containment bounds instantly.
                      </p>

                      <div className="space-y-2">
                        {extensions.map((ext) => (
                          <div key={ext.id} className="p-3 bg-zinc-900/30 border border-border/40 rounded-xl flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground">{ext.name}</span>
                            <Badge className={`font-mono text-[9px] ${ext.active ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-500'}`}>
                              {ext.active ? "ACTIVE" : "PAUSED"}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => { setShowSettingsPanel(false); switchTab('plugins'); }}
                        className="w-full h-8 text-[10.5px] font-mono font-bold bg-[#121417] hover:bg-zinc-900 border border-border rounded-xl text-center cursor-pointer text-primary"
                      >
                        [MANAGE APP PERMISSIONS ➔]
                      </button>
                    </div>
                  )}

                  {/* CATEGORY 3: HOMEPAGE WIDGET HANDLES */}
                  {settingsCategory === 'reorder-widgets' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-foreground font-mono">MANAGE WIDGET GRID HANDLES</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Enable or disable reorder metrics on dashboard blocks. Adjust structural span heights instantly.
                      </p>

                      <div className="flex gap-2.5">
                        <Button 
                          onClick={reorderWidgets}
                          size="sm"
                          className="flex-1 bg-zinc-900 border border-border hover:text-white rounded-xl text-xs font-bold"
                        >
                          Shift Grid
                        </Button>
                        <Button 
                          onClick={restoreAllWidgets}
                          size="sm"
                          className="flex-1 bg-zinc-900 border border-border hover:text-white rounded-xl text-xs font-bold"
                        >
                          Restore Size
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            <div className="p-4 bg-[#07080a] border-t border-border/20 text-[10px] font-mono text-zinc-500 text-center select-none">
              Zero telemetry logs compiled or transferred outside isolated boundaries.
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL TOAST POPUP NOTIFICATION ACCENT */}
      {globalToast && (
        <div className="fixed bottom-14 right-6 p-4 rounded-xl border bg-black/90 text-left border-[#00ff6633] shadow-[0_0_20px_rgba(0,255,102,0.06)] backdrop-blur-md flex items-center gap-3 z-50">
          <div className="h-2 w-2 rounded-full bg-[#00ff66] animate-ping shrink-0" />
          <div>
            <div className="text-[10px] font-mono tracking-wider font-extrabold text-zinc-500 uppercase">
              {globalToast.type === 'success' ? 'SUCCESS VERIFIED' : globalToast.type === 'error' ? 'SANDBOX RESTRICTION' : 'NOTIFICATION EVENT'}
            </div>
            <div className="text-xs text-zinc-200 font-sans mt-0.5">{globalToast.message}</div>
          </div>
        </div>
      )}

    </div>
  );
}
