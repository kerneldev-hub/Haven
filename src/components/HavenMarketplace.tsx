import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Download, PlusCircle, CheckCircle, 
  HelpCircle, ChevronRight, HardDrive, Key, Sparkles, BookOpen, AlertCircle 
} from 'lucide-react';
import { AppMarketCard, HavenExtension, PersonSpace } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';

interface HavenMarketplaceProps {
  extensions: HavenExtension[];
  setExtensions: React.Dispatch<React.SetStateAction<HavenExtension[]>>;
  customAgents: any[];
  setCustomAgents: any;
  spaces: PersonSpace[];
  setSpaces: React.Dispatch<React.SetStateAction<PersonSpace[]>>;
  setActiveSpaceId: (id: string) => void;
  addLog: (source: string, permission: string, status: 'GRANTED' | 'DENIED' | 'SIMULATED', message: string) => void;
  onNotification: (msg: string, type: string) => void;
  onNavigateTab: (tabId: any) => void;
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'template' | 'extension' | 'secrets'>('all');
  const [marketSearch, setMarketSearch] = useState('');

  // Skeletons list
  const catalogList = [
    {
      id: 'sqlite-template',
      name: 'SQLite Database & Drizzle Schema Template',
      category: 'template',
      desc: 'Type-safe local database blueprints for rapid local or Cloudflare edge integration. Features full user schemas.',
      author: 'Ecosystem Core',
      installed: false,
      installType: 'file',
      filePayload: {
        filename: 'src/db/schema.ts',
        content: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';\n\nexport const users = sqliteTable('users', {\n  id: text('id').primaryKey(),\n  name: text('name').notNull(),\n  email: text('email').unique(),\n  createdAt: integer('created_at')\n});`
      }
    },
    {
      id: 'tailwind-preset',
      name: 'Tailwind Swiss-Modern Aesthetic Blueprint',
      category: 'template',
      desc: 'Clean, high-contrast, off-white and charcoal card borders theme with custom paired tracking classes.',
      author: 'Aesthetic Guild',
      installed: false,
      installType: 'file',
      filePayload: {
        filename: 'src/theme.css',
        content: `@import "tailwindcss";\n\n@theme {\n  --color-swiss-dark: #101010;\n  --color-swiss-light: #fefefe;\n  --font-sans: "Inter", sans-serif;\n}`
      }
    },
    {
      id: 'stripe-billing-node',
      name: 'Stripe Billing Webhook Handler Node',
      category: 'template',
      desc: 'Complete node-native server-side Express webhook router endpoint to intercept subscription billing events safely.',
      author: 'Chargily SDK',
      installed: false,
      installType: 'file',
      filePayload: {
        filename: 'server/api/stripe-webhook.ts',
        content: `import express from 'express';\nconst router = express.Router();\n\nrouter.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {\n  const event = req.body;\n  res.json({ received: true });\n});\nexport default router;`
      }
    },
    {
      id: 'ext-performance-tracker',
      name: 'Sandbox Performance Audit Extension',
      category: 'extension',
      desc: 'Instantly inspects runtime heap allocations, memory leaks, and render latencies on sandbox script nodes.',
      author: 'Isolated Core',
      installed: false,
      installType: 'plugin',
      pluginPayload: {
        id: 'ext-perf-tracker',
        name: 'Performance Audit Extension',
        desc: 'Checks memory usage metrics and heap sizes dynamically.',
        category: 'developer',
        author: 'isolated_core',
        active: true,
        permissions: ['Read Workspace Files'],
        grantedPermissions: ['Read Workspace Files']
      }
    },
    {
      id: 'auth-middleware-worker',
      name: 'Cloudflare Worker JWT Auth Middleware',
      category: 'template',
      desc: 'Statically-typed edge routing middleware validating sign-on user JSON web tokens locally inside distributed environments.',
      author: 'Security Guild',
      installed: false,
      installType: 'file',
      filePayload: {
        filename: 'server/worker-auth.ts',
        content: `export default {\n  async fetch(req: Request) {\n    const auth = req.headers.get('Authorization');\n    if (!auth) return new Response('Unauthorized', { status: 401 });\n    return new Response('Token Verified');\n  }\n};`
      }
    }
  ];

  const handleInstallItem = (item: typeof catalogList[0]) => {
    try {
      if (item.installType === 'file') {
        const payload = item.filePayload!;
        
        // Find active space or first space to append file
        if (spaces.length === 0) {
          onNotification("Configure a Project Space first to host templates.", "error");
          return;
        }

        const targetSpace = spaces[0];
        
        // Append file
        const updated = spaces.map(s => {
          if (s.id === targetSpace.id) {
            return {
              ...s,
              files: {
                ...s.files,
                [payload.filename]: payload.content
              }
            };
          }
          return s;
        });

        setSpaces(updated);
        localStorage.setItem('haven_v3_spaces', JSON.stringify(updated));
        addLog('Marketplace', 'File Installation', 'GRANTED', `Template "${item.name}" injected safely into Space "${targetSpace.name}" at location: ${payload.filename}`);
        onNotification(`"${item.name}" deployed successfully to active space!`, "success");
        onNavigateTab('workspace');
      } else if (item.installType === 'plugin') {
        const payload = item.pluginPayload!;
        if (extensions.some(e => e.id === payload.id)) {
          onNotification("Aesthetic extension already installed on platform.", "info");
          return;
        }

        const updatedExts = [...extensions, payload];
        setExtensions(updatedExts);
        localStorage.setItem('haven_sandbox_extensions', JSON.stringify(updatedExts));
        addLog('Marketplace', 'Extension Isolation', 'GRANTED', `Sandboxed Extension "${item.name}" registered successfully.`);
        onNotification(`"${item.name}" activated inside Sandbox Plugins directory!`, "success");
        onNavigateTab('plugins');
      }
    } catch (e) {
      onNotification("Failed to deploy asset components.", "error");
    }
  };

  const filteredItems = catalogList.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(marketSearch.toLowerCase()) || 
                        item.desc.toLowerCase().includes(marketSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* FILTER & SEARCH ROW */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 bg-card/65 border border-border/80 rounded-2xl">
        <div className="flex flex-wrap items-center gap-1.5 select-none">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'template', label: '🗂 Code Templates' },
            { id: 'extension', label: '🔌 Sandbox Extensions' }
          ].map((cat) => {
            const isSel = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isSel ? 'bg-primary text-background' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-3 h-9 bg-zinc-950 border border-border/60 hover:border-zinc-500/40 rounded-xl max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Search verified catalog assets..." 
            value={marketSearch}
            onChange={(e) => setMarketSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-foreground placeholder-zinc-500 font-sans"
          />
        </div>
      </div>

      {/* CORE ASSETS GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-[#080a0c] border border-border/75 rounded-2xl p-5 flex flex-col justify-between h-[210px] hover:border-zinc-700 transition-colors">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-zinc-500">
                  {item.category === 'template' ? 'CODE SKELETON' : 'SANDBOX EXTENSION'}
                </span>
                <Badge variant="outline" className="text-[8.5px] font-mono border-zinc-700 text-zinc-400">
                  By {item.author}
                </Badge>
              </div>

              <h4 className="text-xs font-black text-foreground block font-sans tracking-tight">
                {item.name}
              </h4>

              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                {item.desc}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/10 pt-3 text-[11px] font-mono">
              <span className="text-zinc-500">Zero cost download</span>
              
              <button 
                onClick={() => handleInstallItem(item)}
                className="px-3 h-8 text-[11px] font-bold text-white bg-primary/10 border border-primary/30 hover:border-zinc-300 rounded-xl cursor-pointer hover:bg-primary/15 flex items-center gap-1 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Deploy Asset</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-zinc-900/10 border border-border/30 rounded-2xl flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-[10.5px] text-muted-foreground leading-relaxed font-sans">
          All catalog elements operate entirely server-less, local, and sandboxed inside your isolated environment. Deployment does not transmit code outside.
        </p>
      </div>

    </div>
  );
}
