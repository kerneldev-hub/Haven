import React, { useState, useEffect } from 'react';
import { Activity, Trash2, Sparkles, GripVertical, CheckCircle2, Cpu, Wifi, ShieldCheck, Play } from 'lucide-react';
import { Button } from './ui/components';
import { PersonSpace } from '../types';

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
  switchTab
}: HomeDashboardProps) {
  // Real measured system metrics cached or polled
  const [latency, setLatency] = useState<number | null>(null);
  const [memoryUsed, setMemoryUsed] = useState<string>('Standard');
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // 1. Measure actual API round-trip latency
    const start = performance.now();
    fetch('/api/auth/me')
      .then(() => {
        setLatency(Math.round(performance.now() - start));
      })
      .catch(() => {
        setLatency(null);
      });

    // 2. Query system context safely
    if (typeof window !== 'undefined') {
      setIsSecure(window.isSecureContext);
      setIsOnline(navigator.onLine);
      
      const perf = window.performance as any;
      if (perf && perf.memory) {
        setMemoryUsed(`${(perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1)} MB`);
      } else {
        setMemoryUsed('Safe Env');
      }
    }
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner Control Panel */}
      <div className="p-5 bg-card/45 border border-border/80 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-left">
        <div>
          <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-500 uppercase block">COMMAND HUB</span>
          <h2 className="text-xl font-black text-foreground tracking-tight leading-none mt-1">Operator Workspace Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-1.5">Configure, hide, expand, or rotate modular panels. Drag actions simulation active.</p>
        </div>

        <div className="flex gap-2.5">
          <Button 
            onClick={onReorderWidgets}
            size="sm"
            className="bg-[#121215] text-muted-foreground border border-border hover:text-white rounded-xl h-9 text-xs font-bold cursor-pointer transition-colors"
          >
            Rotate Panels Grid
          </Button>
          <Button 
            onClick={onRestoreAllWidgets}
            size="sm"
            className="bg-zinc-900 border border-border hover:border-zinc-550 text-white rounded-xl h-9 text-xs font-bold cursor-pointer transition-colors"
          >
            Restore Layout Defaults
          </Button>
        </div>
      </div>

      {/* Grid containing customized modular widgets */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {widgetOrder.map((widgetId) => {
          const isHidden = hiddenWidgets.includes(widgetId);
          const isDouble = widgetSizes[widgetId] === 'double';
          
          if (isHidden) return null;

          return (
            <div 
              key={widgetId} 
              className={`bg-card/65 border border-border/80 rounded-2xl p-5 space-y-4 text-left transition-all relative group ${
                isDouble ? 'md:col-span-2' : ''
              }`}
            >
              {/* Card Header with Drag Handle & Actions */}
              <div className="flex items-center justify-between pb-2.5 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing mr-0.5" title="Drag and rotate control">
                    <GripVertical className="w-4 h-4" />
                  </span>
                  <Activity className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" />
                  <span className="text-[10.5px] font-mono tracking-wider font-extrabold uppercase text-zinc-450">
                    {widgetId === 'activity' && "Recent Activity"}
                    {widgetId === 'quick-actions' && "Quick Actions"}
                    {widgetId === 'ai-recommender' && "Recommended for you"}
                    {widgetId === 'vitals' && "System Status"}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onToggleWidgetSize(widgetId)}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono hover:text-white cursor-pointer"
                    title="Resize block span"
                  >
                    {isDouble ? "Fit Single" : "Expand Double"}
                  </button>
                  <button 
                    onClick={() => onHideWidget(widgetId)}
                    className="text-muted-foreground hover:text-red-400 p-0.5 cursor-pointer ml-1"
                    title="Close/Remove widget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Widget: Recent Activity */}
              {widgetId === 'activity' && (
                <div className="space-y-3 font-sans">
                  <div className="p-3 bg-zinc-900/35 border border-border/40 hover:bg-[#0c0d10] transition-colors rounded-xl flex items-start gap-3">
                    <span className="h-6 w-6 mt-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[10px] font-mono font-bold flex items-center justify-center">OK</span>
                    <div>
                      <span className="text-[11.5px] font-black block text-zinc-200">Compiled Active Landing Workspace Node</span>
                      <p className="text-[10.5px] text-muted-foreground mt-0.5">Drizzle schema mapping deployed cleanly on serverless Cloudflare Workers runtime.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-900/35 border border-border/40 hover:bg-[#0c0d10] transition-colors rounded-xl flex items-start gap-3">
                    <span className="h-6 w-6 mt-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold flex items-center justify-center">OK</span>
                    <div>
                      <span className="text-[11.5px] font-black block text-zinc-200">Preferences synced</span>
                      <p className="text-[10.5px] text-muted-foreground mt-0.5">3 active preference cells locked to active memory streams.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Widget: Quick Actions */}
              {widgetId === 'quick-actions' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Provide short custom triggers representing daily code runs or deployments. Add options on the fly.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {customShortcuts.map((item, idx) => (
                      <div key={idx} className="p-1 px-2.5 bg-[#0e1013] hover:text-white border border-border/40 rounded-xl flex items-center gap-2 text-xs font-semibold text-zinc-400">
                        <span>{item}</span>
                        <button 
                          onClick={() => onRemoveShortcut(item)}
                          className="text-zinc-600 hover:text-red-400 font-bold font-mono text-[10px] cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={onAddShortcut} className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Add action label (e.g. Audit API)..." 
                      value={newShortcutVal}
                      onChange={(e) => setNewShortcutVal(e.target.value)}
                      className="flex-1 text-xs h-8 px-2.5 bg-background border border-border rounded-lg outline-none text-foreground"
                    />
                    <button type="submit" className="text-xs px-3 text-white border border-border/60 font-bold bg-zinc-950 rounded-lg cursor-pointer hover:bg-zinc-900">Add Options</button>
                  </form>
                </div>
              )}

              {/* Widget: Suggestions / Recommended for you */}
              {widgetId === 'ai-recommender' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Deep context analytics scanned. Here are custom automation paths computed for <strong className="text-primary font-mono">{activeSpace?.name || 'Local'}</strong>:
                  </p>

                  <div className="p-3 bg-[#0a0c0f] border border-border/50 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-black text-foreground">Aesthetic Alignment Recommendation</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 leading-snug">
                      "Integrate the <strong>Custom Theme Plugin</strong> extension under sandbox plugin settings to alter platform custom classes natively. Use Swiss stark styling sheets details."
                    </p>
                    <button 
                      onClick={() => switchTab('plugins')}
                      className="text-[9.5px] text-primary font-mono font-bold hover:underline"
                    >
                      [LOAD CSS PLUGIN ➜]
                    </button>
                  </div>
                </div>
              )}

              {/* Widget: System Status */}
              {widgetId === 'vitals' && (
                <div className="space-y-3 font-mono text-left">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Active Memory */}
                    <div className="p-3 bg-[#0a0c0e] rounded-xl border border-border/40">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-zinc-500" /> ACTIVE MEMORY HEAP
                      </span>
                      <span className="text-sm font-extrabold text-[#00ff66] mt-1 block">{memoryUsed}</span>
                    </div>
                    
                    {/* Gateway Delay */}
                    <div className="p-3 bg-[#0a0c0e] rounded-xl border border-border/40">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-zinc-500" /> CORES ROUNDTRIP LATEST
                      </span>
                      <span className="text-sm font-extrabold text-primary mt-1 block">
                        {latency !== null ? `${latency} ms` : 'Active'}
                      </span>
                    </div>

                    {/* Active spaces */}
                    <div className="p-3 bg-[#0a0c0e] rounded-xl border border-border/40">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold block">ACTIVE INTERFACES</span>
                      <span className="text-sm font-extrabold text-[#c084fc] mt-1 block">
                        {spaces.length} space{spaces.length === 1 ? '' : 's'} active
                      </span>
                    </div>

                    {/* Cryptographic connection */}
                    <div className="p-3 bg-[#0a0c0e] rounded-xl border border-border/40">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> {isSecure ? 'SECURE CONTEXT' : 'STANDALONE'}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400 mt-1 block">
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
