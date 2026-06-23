import React, { useState } from 'react';
import { 
  Sparkles, Bot, Layers, Download, CheckCircle, 
  Search, ShieldAlert, Check, HelpCircle, ArrowRight,
  Terminal, AppWindow, Cpu, Code2, Database, Sliders, Zap
} from 'lucide-react';
import { HavenExtension, CustomAgent, PersonSpace, SandboxExecutionLog } from '../types';
import { Button } from './ui/components';

interface HavenMarketplaceProps {
  extensions: HavenExtension[];
  setExtensions: React.Dispatch<React.SetStateAction<HavenExtension[]>>;
  customAgents: CustomAgent[];
  setCustomAgents: React.Dispatch<React.SetStateAction<CustomAgent[]>>;
  spaces: PersonSpace[];
  setSpaces: React.Dispatch<React.SetStateAction<PersonSpace[]>>;
  setActiveSpaceId: (id: string) => void;
  addLog: (source: string, perm: string, status: any, msg: string) => void;
  onNotification?: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onNavigateTab: (tabId: 'home' | 'workspace' | 'ai' | 'community' | 'apps' | 'plugins') => void;
}

export default function HavenMarketplace({
  extensions,
  setExtensions,
  customAgents,
  setCustomAgents,
  spaces,
  setSpaces,
  setActiveSpaceId,
  addLog,
  onNotification,
  onNavigateTab
}: HavenMarketplaceProps) {
  const [activeCatalog, setActiveCatalog] = useState<'all' | 'plugins' | 'agents' | 'templates'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installedNotification, setInstalledNotification] = useState<{ id: string, type: string, actionLabel: string, actionTab: any } | null>(null);

  // 1. DATA: INSTALLABLE PLUGINS
  const installablePlugins = [
    {
      id: 'ext-json-visualizer',
      name: 'JSON Sandbox Visualizer',
      desc: 'Renders, formats, and structuralizes nested configuration dictionaries with sandboxed safety checking.',
      category: 'developer' as const,
      author: 'private_data',
      permissions: ['Read Workspace Files'],
      code: `
        const files = HavenAPI.readWorkspaceFiles();
        const keys = Object.keys(files);
        HavenAPI.notifyUser("Found " + keys.length + " files in sandbox space structure.", "info");
        HavenAPI.notifyUser("JSON Visualizer Sandbox parsed schema mapping.", "success");
      `
    },
    {
      id: 'ext-algerian-billing',
      name: 'Algorand Billing Monitor',
      desc: 'Audit transaction hashes, currency mappings, and simulated token callback loops natively.',
      category: 'general' as const,
      author: 'chargily_copilot',
      permissions: ['Mock Webhook Events'],
      code: `
        HavenAPI.notifyUser("Billing monitor loop initialized.", "info");
        HavenAPI.triggerWebhookSim({ gateway: "Chargily", currency: "DZD", amount: 4500 });
      `
    },
    {
      id: 'ext-aesthetic-cosmic',
      name: 'Cosmic Violet Dark Style',
      desc: 'Applies deep violet overlays, soft glass effects, and customized font pairings on active components.',
      category: 'developer' as const,
      author: 'stark_aesthetics',
      permissions: ['Inject CSS'],
      code: `
        const css = \`
          .haven-cosmic-glow {
            border-color: #8b5cf6 !important;
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.1) !important;
          }
          .haven-card-custom {
            background-color: #0c081e !important;
          }
\`;
        HavenAPI.injectCSS(css);
        HavenAPI.notifyUser("CSS applied successfully.", "success");
      `
    },
    {
      id: 'ext-micros-logger',
      name: 'Performance Profiler',
      desc: 'Aids in compiling performance logs and mapping latency parameters on host workspace environments.',
      category: 'workspace' as const,
      author: 'core_sandbox',
      permissions: ['Read Workspace Files', 'Inject CSS'],
      code: `
        const files = HavenAPI.readWorkspaceFiles();
        const textCss = ".haven-latency-indicator { color: #10b981 !important; }";
        HavenAPI.injectCSS(textCss);
        HavenAPI.notifyUser("Latency profiler compiled successfully.", "success");
      `
    }
  ];

  // 2. DATA: INSTALLABLE AI ORACLES
  const installableAgents = [
    {
      id: 'ag-drizzle-sql',
      name: 'Schema Engine Oracle',
      purpose: 'Generates database table structures and SQLite schemas.',
      personality: 'Mathematical, ultra-concise, authoritative on edge structures.',
      model: 'gemini-2.5-flash',
      tools: ['Drizzle ORM Engine', 'Turso Edge CLI', 'Strict Type Checking']
    },
    {
      id: 'ag-pitch-converter',
      name: 'Copywriter Assistant',
      purpose: 'Transforms technical descriptions into premium, structured marketing copylines.',
      personality: 'Persuasive, highly strategic, focused on direct buyer psychology.',
      model: 'gemini-2.5-flash',
      tools: ['Copywriting Optimizer', 'A/B Test Simulator']
    },
    {
      id: 'ag-hmac-gatekeeper',
      name: 'Cryptographic Callback Guard',
      purpose: 'Codes secure API key checking loops for authentic transaction callbacks.',
      personality: 'Defensive, detail-focused, specializing in cryptographic parameters.',
      model: 'gemini-2.1-pro',
      tools: ['HMAC Loop', 'OpenSSL Validator']
    }
  ];

  // 3. DATA: WORKSPACE TEMPLATES
  const installableTemplates = [
    {
      id: 'tm-astro-blog',
      name: 'Astro Serverless Blog Layout',
      desc: 'Modern layout designed for maximum performance, using Fontsource and Lucide vectors.',
      connectedApps: ['GitHub Sync Module', 'Turso SQLite Database'],
      files: {
        'wrangler.toml': `# Cloudflare Pages Deployment Configuration\nname = "astro-edge-blog"\ncompatibility_date = "2026-06-20"\n\n[vars]\nDB_URL = "libsql://edge-replicas.turso.io"`,
        'src/pages/index.astro': `---\nconst title = "Edge Blog";\n---\n<main class="max-w-4xl mx-auto py-12 px-6"><h1 class="text-4xl font-extrabold text-white">{title}</h1></main>`
      },
      notes: 'Contains lightweight Astro routing configurations, precompiled and ready for deployment.'
    },
    {
      id: 'tm-nextjs-drizzle',
      name: 'Next.js Relational Database Template',
      desc: 'Type-safe Drizzle migrations with pre-coded schemas representing transaction histories.',
      connectedApps: ['Turso SQLite Database', 'Stripe Billing'],
      files: {
        'src/db/schema.ts': `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';\n\nexport const transactions = sqliteTable('transactions', {\n  id: text('id').primaryKey(),\n  amount: integer('amount').notNull(),\n  currency: text('currency').notNull(),\n  status: text('status').notNull()\n});`
      },
      notes: 'Includes Drizzle schema mappings and strict TypeScript type validations.'
    }
  ];

  // 4. ACTION: COMPREHENSIVE ONE-CLICK INSTALLER
  const installAsset = (type: 'plugin' | 'agent' | 'template', asset: any) => {
    setInstallingId(asset.id);
    
    setTimeout(() => {
      if (type === 'plugin') {
        if (extensions.some(e => e.id === asset.id)) {
          if (onNotification) onNotification(`${asset.name} is already registered inside your workspace.`, 'info');
          setInstallingId(null);
          return;
        }

        const newPlugin: HavenExtension = {
          id: asset.id,
          name: asset.name,
          desc: asset.desc,
          category: asset.category,
          author: asset.author,
          active: true,
          permissions: asset.permissions,
          grantedPermissions: [...asset.permissions]
        };

        setExtensions(prev => [...prev, newPlugin]);
        addLog(asset.name, 'One-Click Installer', 'GRANTED', `Compiled sandboxed manifest successfully. Module loaded into active memory.`);
        
        if (onNotification) onNotification(`Successfully installed ${asset.name} plugin within HAVEN sandbox.`, 'success');
        
        setInstalledNotification({
          id: asset.id,
          type: 'Plugin',
          actionLabel: 'Configure Sandbox Perks',
          actionTab: 'plugins' as const
        });

      } else if (type === 'agent') {
        if (customAgents.some(a => a.id === asset.id)) {
          if (onNotification) onNotification(`${asset.name} is already added. Check your AI Oracle Stream.`, 'info');
          setInstallingId(null);
          return;
        }

        const newAgent: CustomAgent = {
          id: asset.id,
          name: asset.name,
          purpose: asset.purpose,
          personality: asset.personality,
          model: asset.model,
          tools: asset.tools
        };

        setCustomAgents(prev => [...prev, newAgent]);
        addLog('AI Stream', 'Compile AI Agent', 'GRANTED', `Compiled active AI memory block representing: ${asset.name}.`);

        if (onNotification) onNotification(`Custom Agent ${asset.name} compiled. Ready for chat interface questions.`, 'success');

        setInstalledNotification({
          id: asset.id,
          type: 'AI Agent',
          actionLabel: 'Chat with AI Copilot',
          actionTab: 'ai' as const
        });

      } else if (type === 'template') {
        if (spaces.some(s => s.id === asset.id)) {
          if (onNotification) onNotification(`${asset.name} space template is already initialized.`, 'info');
          setInstallingId(null);
          return;
        }

        const newSpace: PersonSpace = {
          id: asset.id,
          name: asset.name,
          desc: asset.desc,
          files: asset.files,
          notes: asset.notes,
          tasks: [
            { id: `t-init-${asset.id}-1`, title: 'Compile build parameters', completed: false },
            { id: `t-init-${asset.id}-2`, title: 'Verify bindings locally', completed: false }
          ],
          connectedApps: asset.connectedApps
        };

        setSpaces(prev => [...prev, newSpace]);
        setActiveSpaceId(asset.id);
        addLog('Workspace Engine', 'Scaffold Template', 'GRANTED', `Precompiled serverless tree for "${asset.name}" written successfully.`);

        if (onNotification) onNotification(`Scaffolded ${asset.name} structures. Switched workspace active node.`, 'success');

        setInstalledNotification({
          id: asset.id,
          type: 'Workspace Template',
          actionLabel: 'Explore Scaffolds & Files',
          actionTab: 'workspace' as const
        });
      }

      setInstallingId(null);
    }, 650);
  };

  const isInstalled = (type: 'plugin' | 'agent' | 'template', id: string) => {
    if (type === 'plugin') return extensions.some(e => e.id === id);
    if (type === 'agent') return customAgents.some(a => a.id === id);
    if (type === 'template') return spaces.some(s => s.id === id);
    return false;
  };

  const getCatalogItems = () => {
    const raw: { id: string; type: 'plugin' | 'agent' | 'template'; name: string; desc: string; author?: string; metaInfo: string; payload: any }[] = [];

    if (activeCatalog === 'all' || activeCatalog === 'plugins') {
      installablePlugins.forEach(p => {
        raw.push({
          id: p.id,
          type: 'plugin',
          name: p.name,
          desc: p.desc,
          author: p.author,
          metaInfo: `Permissions: ${p.permissions.join(', ')}`,
          payload: p
        });
      });
    }

    if (activeCatalog === 'all' || activeCatalog === 'agents') {
      installableAgents.forEach(a => {
        raw.push({
          id: a.id,
          type: 'agent',
          name: a.name,
          desc: a.purpose,
          author: 'dev_haven',
          metaInfo: `Tools: ${a.tools.slice(0, 2).join(', ')}`,
          payload: a
        });
      });
    }

    if (activeCatalog === 'all' || activeCatalog === 'templates') {
      installableTemplates.forEach(t => {
        raw.push({
          id: t.id,
          type: 'template',
          name: t.name,
          desc: t.desc,
          author: 'dev_haven',
          metaInfo: `Files: ${Object.keys(t.files).join(', ')}`,
          payload: t
        });
      });
    }

    if (!searchQuery.trim()) return raw;
    const q = searchQuery.toLowerCase();
    return raw.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.metaInfo.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="p-5 bg-card/45 border border-border/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-500 uppercase block">CENTRAL DISTRIBUTOR</span>
          <h2 className="text-xl font-black text-foreground tracking-tight leading-none mt-1">HAVEN Unified Marketplace</h2>
          <p className="text-xs text-muted-foreground mt-1.5">Installable sandboxed components, custom agent intelligence nodes, and ready-to-run workspace files in one click.</p>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search plugins, templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs h-8 pl-9 pr-3 bg-zinc-950 border border-border/60 hover:border-zinc-500 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* FILTER BUTTONS ROW */}
      <div className="flex flex-wrap items-center gap-1.5 justify-start text-left bg-card/45 p-2 rounded-2xl border border-border/50">
        {[
          { id: 'all', label: 'All Artifacts' },
          { id: 'plugins', label: 'Modular Plugins' },
          { id: 'agents', label: 'AI Oracles' },
          { id: 'templates', label: 'Workspace Templates' }
        ].map((cat) => (
          <button 
            key={cat.id}
            onClick={() => { setActiveCatalog(cat.id as any); setInstalledNotification(null); }}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCatalog === cat.id 
                ? 'bg-[#15161a] border border-border text-white' 
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* SUCCESS BANNER ALERT FEEDBACK */}
      {installedNotification && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-3 animate-fade-in animate-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-450 shrink-0" />
            <div>
              <span className="text-xs font-black text-white block">Installation Verification: Ready!</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">Your newly configured {installedNotification.type} has compiled and is active within the isolated sandbox boundaries.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              onNavigateTab(installedNotification.actionTab);
              setInstalledNotification(null);
            }}
            className="text-[10.5px] px-3 py-1.5 h-8 bg-zinc-950 border border-border hover:border-zinc-650 text-emerald-450 font-mono font-bold rounded-xl whitespace-nowrap cursor-pointer"
          >
            {installedNotification.actionLabel} ➜
          </button>
        </div>
      )}

      {/* RENDER PRODUCTS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {getCatalogItems().length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed border-border/40 rounded-3xl space-y-2">
            <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-400">No templates match query</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">Try clearing search parameters to retrieve certified edge modules and sandboxed nodes.</p>
          </div>
        ) : (
          getCatalogItems().map((item) => {
            const installed = isInstalled(item.type, item.id);
            const installing = installingId === item.id;
            
            // Single view showing card shell or beautiful layout skeleton matching the final card if installing matching layout shape
            if (installing) {
              return (
                <div 
                  key={item.id}
                  className="bg-card/45 border border-border/50 rounded-3xl p-5 h-[200px] flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="h-4 bg-zinc-850 rounded w-2/3" />
                    <div className="h-3 bg-zinc-850 rounded w-1/3" />
                    <div className="space-y-1.5 pt-2">
                      <div className="h-3 bg-zinc-850 rounded w-full" />
                      <div className="h-3 bg-zinc-850 rounded w-5/6" />
                    </div>
                  </div>
                  <div className="h-8 bg-zinc-850 rounded-xl w-1/3 self-end" />
                </div>
              );
            }

            return (
              <div 
                key={item.id}
                className="bg-card/75 border border-border hover:border-zinc-700 rounded-3xl p-5 flex flex-col justify-between h-[200px] transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 text-left">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-zinc-100 truncate">{item.name}</span>
                        {item.type === 'plugin' && <Sliders className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                        {item.type === 'agent' && <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        {item.type === 'template' && <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[9.5px] uppercase font-mono font-bold text-zinc-500 block mt-0.5">
                        {item.author || 'dev_haven'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed line-clamp-3 text-left">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/30 flex items-center justify-between gap-2.5">
                  <span className="text-[9px] font-mono text-zinc-550 truncate max-w-[150px]" title={item.metaInfo}>
                    {item.metaInfo}
                  </span>

                  <button
                    onClick={() => installAsset(item.type, item.payload)}
                    disabled={installed || installing}
                    className={`h-8 font-extrabold text-[10.5px] font-mono rounded-xl px-3.5 flex items-center gap-1 border transition-all cursor-pointer ${
                      installed 
                        ? 'bg-[#101317] text-zinc-500 border-border/40 cursor-default' 
                        : 'bg-foreground text-background hover:bg-neutral-200 border-foreground/50'
                    }`}
                  >
                    {installed ? (
                      <>
                        <Check className="w-3 h-3 text-[#00ff66]" />
                        <span>Installed</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-0.5" />
                        <span>Get</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
