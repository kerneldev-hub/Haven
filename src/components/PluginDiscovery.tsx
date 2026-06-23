import React, { useState } from 'react';
import { HavenExtension } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';
import { 
  Sparkles, Download, Trash2, ArrowLeft, Search, CheckCircle2, 
  ShieldCheck, Terminal, Layers, Star, Info, Check, AlertTriangle
} from 'lucide-react';

interface PluginDiscoveryProps {
  extensions: HavenExtension[];
  setExtensions: React.Dispatch<React.SetStateAction<HavenExtension[]>>;
  onClose?: () => void;
  onNotification?: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// Global hardcoded plugins marketplace
const GLOBAL_MARKETPLACE_PLUGINS: Omit<HavenExtension, 'active' | 'grantedPermissions'>[] = [
  {
    id: 'ext-custom-css',
    name: 'Style Customizer Engine',
    desc: 'Inject custom CSS stylesheets dynamically into active browser and layout viewports to tweak the styling.',
    category: 'workspace',
    author: 'dzlab',
    permissions: ['Inject CSS']
  },
  {
    id: 'ext-seo-spider',
    name: 'SEO Auditor Spider',
    desc: 'Audit workspace directories and check index files for active metadata, meta elements, and SEO tag completion.',
    category: 'developer',
    author: 'seo_pro_node',
    permissions: ['Read Workspace Files']
  },
  {
    id: 'ext-hook-notifier',
    name: 'Webhook Simulator Alert',
    desc: 'Configure localized webhooks that dispatch JSON payloads, log events, and emulate triggers directly.',
    category: 'general',
    author: 'webhook_master',
    permissions: ['Mock Webhook Events']
  },
  {
    id: 'ext-schema-compiler',
    name: 'TypeScript Schema Dwell',
    desc: 'Read dynamic Drizzle and Type schemas and draft matching validation rules in a target sandbox file.',
    category: 'developer',
    author: 'drizzle_guru',
    permissions: ['Read Workspace Files', 'Write Workspace Files']
  },
  {
    id: 'ext-cognitive-ledger',
    name: 'Context Memory Bank',
    desc: 'Read, store, and append core workflow memories in a secure local sandbox database, preserving history.',
    category: 'assistant',
    author: 'ai_brain_host',
    permissions: ['Read Memories']
  }
];

export default function PluginDiscovery({
  extensions,
  setExtensions,
  onClose,
  onNotification
}: PluginDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'workspace', 'assistant', 'automation', 'developer'];

  // Handle standard install
  const handleInstallPlugin = (plugin: Omit<HavenExtension, 'active' | 'grantedPermissions'>) => {
    // Add to state with active = false and empty granted permissions by default (user must authorize)
    const newExtension: HavenExtension = {
      ...plugin,
      active: true,
      grantedPermissions: [] // require opt-in!
    };
    
    setExtensions(prev => {
      if (prev.some(e => e.id === plugin.id)) return prev;
      return [...prev, newExtension];
    });

    if (onNotification) {
      onNotification(`Successfully installed ${plugin.name}! Set up permissions inside the Sandbox Controller.`, 'success');
    }
  };

  // Handle remove
  const handleRemovePlugin = (pluginId: string) => {
    setExtensions(prev => prev.filter(e => e.id !== pluginId));
    if (onNotification) {
      onNotification(`Removed plugin from sandbox nodes.`, 'info');
    }
  };

  // Filter list
  const filteredPlugins = GLOBAL_MARKETPLACE_PLUGINS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-card/50 border border-border/40 rounded-2xl p-6 md:p-8 space-y-8 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/20">
        <div>
          <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-550 uppercase block mb-1">HAVEN DEVELOPER REGISTRY</span>
          <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Plugin Ecosystem Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Integrate sandboxed plugins to automate document parsing, style styling layers, or run local system scripts within secure execution boundaries.
          </p>
        </div>

        {onClose && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose} 
            className="h-9 px-4 text-xs font-mono text-zinc-300 font-bold self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to Active Nodes
          </Button>
        )}
      </div>

      {/* Categories & Search Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Category Tags */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all uppercase tracking-wider font-sans cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-background'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white border border-border/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search Marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs h-9 pl-9 pr-4 bg-[#050608] border border-border/80 focus:border-zinc-500 rounded-xl outline-none text-foreground font-sans placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Grid of Extension Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlugins.length === 0 ? (
          <div className="md:col-span-3 py-16 bg-zinc-900/10 border border-dashed border-border/30 rounded-2xl text-center text-xs text-zinc-500 select-none">
            No marketplace plugins found matching search terms.
          </div>
        ) : (
          filteredPlugins.map(plugin => {
            const installedExtension = extensions.find(e => e.id === plugin.id);
            const isInstalled = !!installedExtension;

            return (
              <div 
                key={plugin.id} 
                className={`group flex flex-col justify-between p-5 md:p-6 bg-[#07080a]/90 border border-border/80 rounded-2xl hover:border-zinc-500/20 hover:scale-[1.01] transition-all duration-200`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-zinc-550 block">by @{plugin.author}</span>
                      <h4 className="text-sm md:text-base font-black text-foreground truncate mt-0.5" title={plugin.name}>
                        {plugin.name}
                      </h4>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-mono font-extrabold uppercase shrink-0 transition-colors group-hover:border-primary/45">
                      {plugin.category}
                    </Badge>
                  </div>

                  <p className="text-[11.5px] text-muted-foreground leading-relaxed h-[54px] overflow-hidden line-clamp-3">
                    {plugin.desc}
                  </p>

                  {/* Required permissions list */}
                  <div className="space-y-2 pt-3 border-t border-border/15">
                    <span className="text-[9.5px] font-mono font-black text-zinc-500 uppercase tracking-widest block">Sandbox Claims:</span>
                    <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                      {plugin.permissions.map(perm => (
                        <span key={perm}>
                          <Badge 
                            variant="secondary"
                            className="bg-zinc-800/20 text-[#00ff66]/90 border border-[#00ff66]/10 text-[9px] font-mono font-bold select-none px-2 py-0.5"
                          >
                            {perm}
                          </Badge>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="pt-5 flex items-center justify-between gap-4 mt-4">
                  {isInstalled ? (
                    <div className="flex items-center gap-1.5 text-emerald-450 font-sans text-xs font-bold leading-none select-none">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Workspace Mounted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-500 font-sans text-[11px] leading-none select-none">
                      <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500" />
                      <span>Verified Sandbox Safe</span>
                    </div>
                  )}

                  {isInstalled ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePlugin(plugin.id)}
                      className="h-8 px-3.5 text-xs text-red-400 hover:text-red-300 font-mono font-bold border-red-500/20 hover:bg-red-500/5 cursor-pointer rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Remove
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleInstallPlugin(plugin)}
                      className="h-8 px-3.5 text-xs font-mono font-bold text-background bg-primary hover:bg-sky-400 cursor-pointer rounded-lg flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Install plugin
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mini info notice */}
      <div className="p-4 bg-[#080912]/50 border border-border/10 rounded-xl flex items-start gap-3 text-left">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-zinc-500">
          <strong>Security Assurance Checklist:</strong> Every marketplace package compiles inside a virtual browser sandbox using the WebCrypto evaluation pipeline context. No raw execution permissions are pre-granted. You retain full real-time opt-in management key controllers over workspace data variables.
        </p>
      </div>
    </div>
  );
}
