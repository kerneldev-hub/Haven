import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Code2, Database, Sliders, Play, 
  ArrowRight, FileText, CheckCircle2, CheckSquare, 
  Settings, Sparkles, User, ShieldCheck, HelpCircle, 
  ChevronRight, Laptop, Terminal, Layers, Share2, Trash2,
  Settings2, Eye, EyeOff, LayoutGrid, Check, Plus
} from 'lucide-react';
import { Button } from './ui/components';
import { Badge } from './ui/Badge';
import { PersonSpace, CustomArtifact } from '../types';
import ArtifactStudio from './ArtifactStudio';

interface HomeDashboardProps {
  widgetOrder: string[];
  hiddenWidgets: string[];
  widgetSizes: Record<string, 'normal' | 'double'>;
  customShortcuts: string[];
  newShortcutVal: string;
  setNewShortcutVal: (val: string) => void;
  activeSpace: PersonSpace | undefined;
  spaces: PersonSpace[];
  onReorderWidgets: () => void;
  onRestoreAllWidgets: () => void;
  onToggleWidgetSize: (id: string) => void;
  onHideWidget: (id: string) => void;
  onAddShortcut: (e: React.FormEvent) => void;
  onRemoveShortcut: (item: string) => void;
  switchTab: (tab: any) => void;
  // Custom artifacts integration
  installedArtifacts: CustomArtifact[];
  onArtifactAdded: (art: CustomArtifact) => void;
  onUninstallArtifact: (id: string) => void;
  onShareArtifact: (art: CustomArtifact) => void;
}

export default function HomeDashboard({
  widgetOrder,
  hiddenWidgets,
  widgetSizes,
  customShortcuts,
  newShortcutVal,
  setNewShortcutVal,
  activeSpace,
  spaces,
  onReorderWidgets,
  onRestoreAllWidgets,
  onToggleWidgetSize,
  onHideWidget,
  onAddShortcut,
  onRemoveShortcut,
  switchTab,
  installedArtifacts,
  onArtifactAdded,
  onUninstallArtifact,
  onShareArtifact
}: HomeDashboardProps) {
  // Real memory indicators and stats
  const [memoryUsed, setMemoryUsed] = useState<string>('Standard');
  const [scratchBuffer, setScratchBuffer] = useState<string>(() => {
    return localStorage.getItem('haven_dashboard_scratch') || 'Use this scratchpad for temporary notes...';
  });
  
  // Local toggle for showing/hiding raw memory and status indicator card
  const [showSystemStatus, setShowSystemStatus] = useState(false);

  useEffect(() => {
    localStorage.setItem('haven_dashboard_scratch', scratchBuffer);
  }, [scratchBuffer]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const perf = window.performance as any;
      if (perf && perf.memory) {
        setMemoryUsed(`${(perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1)} MB`);
      } else {
        setMemoryUsed('Optimized');
      }
    }
  }, []);

  // Compute stats
  const totalFiles = spaces.reduce((acc, space) => acc + Object.keys(space.files || {}).length, 0);
  const totalTasks = spaces.reduce((acc, space) => acc + (space.tasks || []).length, 0);
  const completedTasks = spaces.reduce(
    (acc, space) => acc + (space.tasks || []).filter((t) => t.completed).length,
    0
  );

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      {/* Welcome Hero Area */}
      <div className="relative overflow-hidden p-6 md:p-8 bg-[#0a0c10] border border-border/75 rounded-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[110px] pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono tracking-widest font-extrabold uppercase select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Workspace Active Panel
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-none">
              Welcome back to <span className="text-primary font-black">Haven</span>
            </h2>
            <p className="text-xs md:text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
              High-performance workspace orchestration layers. Control self-contained sandbox virtual runtimes, craft plugins, and broadcast automation blueprints with extreme visual flow.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setShowSystemStatus(!showSystemStatus)}
              className="px-4 py-2 bg-card border border-border/85 rounded-xl hover:border-zinc-700 font-mono text-[10px] uppercase font-bold text-zinc-350 tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{showSystemStatus ? "Hide Status Card" : "Show Status Card"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 4 Core Dynamic Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Metric 1 */}
        <div className="p-5 md:p-6 bg-card border border-border/80 rounded-2xl flex flex-col justify-between h-32 hover:border-zinc-800 transition-colors">
          <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
            Project Spaces
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white">{spaces.length}</span>
            <span className="text-[9px] text-zinc-500 font-mono">active folders</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 md:p-6 bg-card border border-border/80 rounded-2xl flex flex-col justify-between h-32 hover:border-zinc-800 transition-colors">
          <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400 flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            Workspace Files
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-primary">{totalFiles}</span>
            <span className="text-[9px] text-zinc-500 font-mono">managed assets</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 md:p-6 bg-card border border-border/80 rounded-2xl flex flex-col justify-between h-32 hover:border-zinc-800 transition-colors">
          <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400 flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            Checkpoints Done
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white">{completedTasks} <span className="text-xs text-zinc-500 font-sans">/ {totalTasks}</span></span>
            <span className="text-[9px] text-zinc-500 font-mono">completed tasks</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 md:p-6 bg-card border border-border/80 rounded-2xl flex flex-col justify-between h-32 hover:border-zinc-800 transition-colors">
          <div className="text-[10px] uppercase font-bold tracking-wider font-mono text-zinc-400 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            Sandbox Memory
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-teal-400">{memoryUsed}</span>
            <span className="text-[9px] text-zinc-500 font-mono">browser heap</span>
          </div>
        </div>
      </div>

      {showSystemStatus && (
        <div className="p-5 md:p-6 bg-[#040507] border border-border/80 rounded-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-border/15">
            <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-primary" />
              Environment Stats Panel
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-mono text-[8px]">ACTIVE</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] font-mono text-zinc-400">
            <div className="p-3.5 bg-black/45 border border-border/20 rounded-xl">
              <span className="text-zinc-500 block text-[9px] uppercase">Node Engine</span>
              <span className="text-white font-bold block mt-1">Express Framework v4</span>
            </div>
            <div className="p-3.5 bg-black/45 border border-border/20 rounded-xl">
              <span className="text-zinc-500 block text-[9px] uppercase">Database Sync</span>
              <span className="text-white font-bold block mt-1">Turso libSQL Client API</span>
            </div>
            <div className="p-3.5 bg-black/45 border border-border/20 rounded-xl">
              <span className="text-zinc-500 block text-[9px] uppercase">Client Sandbox</span>
              <span className="text-white font-bold block mt-1">Wasm / JavaScript Isolated context</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Layout to prevent crowding but maximize scannability */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
        
        {/* Panel Left: Workspace launch routines */}
        <div className="bg-card border border-border/85 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase font-mono font-black tracking-wider text-zinc-200">
                Workspace Launchpad
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 font-extrabold uppercase">ROUTING</span>
          </div>

          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Quickly trigger navigation routines to jump deep into specialist platform portals:
          </p>

          <div className="space-y-3">
            {[
              { id: 'workspace', step: '01', name: 'Personal Spaces Portal', desc: 'Shorthand files, checklists, automations.', color: 'bg-primary/10 text-primary' },
              { id: 'ide', step: '02', name: 'IDE Core Engine', desc: 'Monaco-powered sandbox file auditor with outputs.', color: 'bg-emerald-500/10 text-emerald-450' },
              { id: 'ai', step: '03', name: 'Haven AI Assistant', desc: 'Gemini model stream with custom local context parameters.', color: 'bg-purple-500/10 text-purple-400' },
              { id: 'apps', step: '04', name: 'Haven App Marketplace', desc: 'One-click integrations and sandbox extensions.', color: 'bg-pink-500/10 text-pink-450' }
            ].map((route) => (
              <div 
                key={route.id}
                onClick={() => switchTab(route.id as any)}
                className="p-4 bg-[#050608]/90 hover:bg-zinc-900 border border-border/30 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-150"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg ${route.color} flex items-center justify-center font-bold text-xs select-none shrink-0`}>
                    {route.step}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-zinc-200 block group-hover:text-primary transition-colors truncate">{route.name}</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5 truncate">{route.desc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Panel Right: Scratchpad Persistent Board */}
        <div className="bg-card border border-border/85 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-border/20">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span className="text-xs uppercase font-mono font-black tracking-wider text-zinc-200">
                Persistent Scratchpad
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-border/30 rounded px-2.5 py-1 font-bold uppercase select-none">PERSISTENT</span>
          </div>

          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Record brief outlines, task checklists, or local transaction keys. Content is serialized to localStorage automatically.
          </p>

          <textarea
            value={scratchBuffer}
            onChange={(e) => setScratchBuffer(e.target.value)}
            rows={5}
            className="w-full text-xs p-4 font-mono leading-relaxed outline-none resize-none bg-[#030406] text-zinc-200 border border-border/60 focus:border-zinc-500 rounded-xl shadow-inner"
            placeholder="Type notes here..."
          />

          {/* Active space checklist progress */}
          <div className="pt-4 border-t border-border/20 text-left space-y-3">
            <span className="text-[10px] uppercase tracking-wider font-mono font-extrabold text-zinc-450 block truncate">
              Active space Scope: {activeSpace?.name || 'Unspecified'}
            </span>
            {activeSpace && (activeSpace.tasks || []).length > 0 ? (
              <div className="space-y-2">
                {(activeSpace.tasks || []).slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 text-xs text-zinc-300">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      t.completed ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-[#040507] border-border/40'
                    }`}>
                      {t.completed && <span className="text-[10px]">✔</span>}
                    </span>
                    <span className={`truncate text-xs ${t.completed ? 'line-through text-zinc-650' : 'text-zinc-350 font-medium'}`}>{t.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-zinc-550 block select-none">No checklist items defined in our active space yet. Switch categories to populate.</span>
            )}
          </div>
        </div>

      </div>

      {/* Mounted Custom Widgets container */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/20 select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-mono font-black tracking-wider text-zinc-200">
               Mounted Workspace Custom Artifacts ({installedArtifacts.length})
            </span>
          </div>
          <span className="text-[9px] font-mono text-zinc-500 font-extrabold uppercase">WIDGETS</span>
        </div>

        {installedArtifacts.length === 0 ? (
          <div className="py-12 bg-[#050608]/20 border border-dashed border-border/30 rounded-2xl text-center text-xs text-zinc-500 font-sans select-none">
            No dynamic client widgets are loaded. Design one inside the Artifact Studio workspace below.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {installedArtifacts.map((art) => {
              const borderColors: Record<string, string> = {
                indigo: 'border-indigo-500/25',
                emerald: 'border-emerald-500/25',
                amber: 'border-amber-500/25',
                rose: 'border-rose-500/25',
                cyan: 'border-cyan-500/25',
                violet: 'border-violet-500/25',
              };
              const currentBorder = borderColors[art.accentColor] || 'border-zinc-800';

              return (
                <div 
                  key={art.id} 
                  className={`p-6 rounded-2xl border bg-[#06070a] flex flex-col justify-between shadow-sm hover:border-zinc-700 transition-colors ${currentBorder}`}
                >
                  <div className="flex items-start justify-between border-b border-border/10 pb-2.5 mb-3">
                    <div>
                      <span className="text-[8px] font-mono uppercase font-bold text-zinc-500 block leading-tight">Mounted Element</span>
                      <h4 className="text-xs font-bold text-foreground truncate max-w-[180px]">{art.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        onClick={() => onShareArtifact(art)}
                        className="p-1 text-zinc-500 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer bg-transparent border-none"
                        title="Broadcast configuration payload"
                      >
                        <Share2 className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button 
                        onClick={() => onUninstallArtifact(art.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-900 transition-colors cursor-pointer bg-transparent border-none"
                        title="Uninstall mounted widget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 pb-2">
                    {art.type === 'focus-timer' && (
                      <div className="py-2 text-center space-y-1.5 font-mono select-all">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">25:00</span>
                        <div className="text-[10px] text-zinc-550">Workspace block timer ready</div>
                      </div>
                    )}

                    {art.type === 'habit-tracker' && (
                      <div className="space-y-1 text-xs text-left">
                        {((art.state.habits as any[]) || []).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                            <span className="truncate">{h.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {art.type === 'api-checker' && (
                      <div className="space-y-1.5 text-xs text-left select-all font-mono">
                        <div className="text-[9.5px] text-zinc-400 truncate bg-zinc-950 p-1.5 rounded border border-border/10">
                          Endpoint: {art.state.url}
                        </div>
                        <div className="text-[9.2px] text-emerald-400 font-bold leading-tight">★ Status: Online (Ready monitoring)</div>
                      </div>
                    )}

                    {art.type === 'margin-calculator' && (
                      <div className="space-y-1 bg-zinc-950 p-2 text-center select-all">
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div>
                            <span className="text-zinc-550 block">MAU count:</span>
                            <span className="font-extrabold text-zinc-300">{art.state.mau} users</span>
                          </div>
                          <div>
                            <span className="text-zinc-550 block">Tier price:</span>
                            <span className="font-extrabold text-zinc-300">${art.state.price}/mo</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {art.type === 'markdown-notes' && (
                      <div className="text-left text-[11px] font-mono text-zinc-400 whitespace-pre-line leading-relaxed max-h-[80px] overflow-hidden truncate p-2 bg-zinc-950 rounded border border-border/10">
                        {art.state.text}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border/10 flex items-center justify-between text-[8px] font-mono text-zinc-550 uppercase">
                    <span>Accent: {art.accentColor}</span>
                    <span>Created {art.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Artifact Creator Panel */}
      <ArtifactStudio 
        onArtifactAdded={onArtifactAdded} 
        onShareArtifact={onShareArtifact} 
      />
    </div>
  );
}
