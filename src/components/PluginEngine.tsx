import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Terminal, Sliders, ToggleLeft, ToggleRight, 
  Plus, Trash2, Play, CheckCircle, Check, Lock, Unlock, 
  FileCode, Sparkles, RefreshCw, Cpu, HelpCircle, Layers, CheckSquare, Eye, Code, Zap
} from 'lucide-react';
import { HavenExtension, SandboxExecutionLog, PersonSpace } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';
import { PluginManager } from '../lib/PluginManager';

interface PluginEngineProps {
  activeSpace: PersonSpace;
  onRefreshWorkspace?: () => void;
  extensions: HavenExtension[];
  setExtensions: React.Dispatch<React.SetStateAction<HavenExtension[]>>;
  logs: SandboxExecutionLog[];
  setLogs: React.Dispatch<React.SetStateAction<SandboxExecutionLog[]>>;
}

export default function PluginEngine({ 
  activeSpace, 
  onRefreshWorkspace,
  extensions,
  setExtensions,
  logs,
  setLogs
}: PluginEngineProps) {
  const [selectedExtensionId, setSelectedExtensionId] = useState<string>('ext-custom-css');
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxCode, setSandboxCode] = useState('');

  // Pre-compiled script templates based on active extension ID
  useEffect(() => {
    const templates: Record<string, string> = {
      'ext-custom-css': '/* Custom CSS Injector Sandbox code */\nHavenAPI.injectCSS(`\n  .haven-cosmic-glow {\n    border-color: #8b5cf6 !important;\n    box-shadow: 0 0 15px rgba(139, 92, 246, 0.15) !important;\n  }\n`);\nHavenAPI.notifyUser("Dynamic CSS injected successfully. Overlay classes loaded.", "success");',
      
      'ext-seo-audit': '// SEO Scanner Engine\nconst files = HavenAPI.readWorkspaceFiles();\nconst fileNames = Object.keys(files);\nHavenAPI.notifyUser("SEO Crawler started. Inspected files: " + fileNames.join(", "), "info");\n\nfileNames.forEach(f => {\n  const content = files[f];\n  if (content.length < 100) {\n    HavenAPI.notifyUser("Low content density alert on dev node: " + f, "warning");\n  }\n});\nHavenAPI.notifyUser("SEO Audit complete.", "success");',
      
      'ext-webhook-log': '// Algerian Payment Webhook Simulator\nHavenAPI.notifyUser("Firing simulation request to chargily checkout endpoint...", "info");\nHavenAPI.triggerWebhookSim({\n  event: "charge.succeeded",\n  currency: "DZD",\n  method: "EDAHABIA",\n  amount: 4500\n});\nHavenAPI.notifyUser("EDAHABIA webhook simulated successfully. Token matches signature.", "success");',
      
      'ext-json-visualizer': '// JSON Sandbox Visualizer\nHavenAPI.notifyUser("JSON Visualizer reading active workspace files...", "info");\nconst files = HavenAPI.readWorkspaceFiles();\nHavenAPI.notifyUser("Parsed Workspace manifest: " + JSON.stringify(Object.keys(files)), "success");',
      
      'ext-algerian-billing': '// Algorand Billing Monitor\nHavenAPI.notifyUser("Analyzing DZD billing parameters...", "info");\nHavenAPI.triggerWebhookSim({ token: "0xHASH-ALGERIA-V3", status: "CLEARED" });',
      
      'ext-aesthetic-cosmic': '// Applied Cosmic Aesthetics styling\nHavenAPI.injectCSS(".haven-cosmic-theme { border-color: #f43f5e !important; }");\nHavenAPI.notifyUser("Applied neon visual accents to page margins.", "success");',
      
      'ext-micros-logger': '// Latency profiling metrics assembler\nHavenAPI.notifyUser("Registering host database response delays...", "info");\nconst files = HavenAPI.readWorkspaceFiles();\nHavenAPI.notifyUser("Successfully calculated index speed: 4.8ms", "success");'
    };

    setSandboxCode(templates[selectedExtensionId] || '// Custom plug-and-play script\nHavenAPI.notifyUser("Dynamic Sandbox compiling...", "info");');
  }, [selectedExtensionId]);

  const selectedExtension = extensions.find(e => e.id === selectedExtensionId) || extensions[0];

  const addLog = (source: string, permission: string, status: 'GRANTED' | 'DENIED' | 'SIMULATED', message: string) => {
    const isDup = logs.length > 0 && logs[0].message === message;
    if (isDup) return;
    
    const newLog: SandboxExecutionLog = {
      timestamp: new Date().toLocaleTimeString(),
      source,
      permission,
      status,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const toggleExtensionActive = (id: string) => {
    setExtensions(prev => prev.map(e => {
      if (e.id === id) {
        const isTurningOn = !e.active;
        addLog(e.name, 'Initialize Module', isTurningOn ? 'GRANTED' : 'DENIED', 
          `${e.name} ${isTurningOn ? 'activated within Sandbox workspace bounds' : 'terminated by user instruction'}.`
        );
        return { ...e, active: isTurningOn };
      }
      return e;
    }));
  };

  const togglePermission = (extId: string, permission: string) => {
    setExtensions(prev => prev.map(e => {
      if (e.id === extId) {
        const isGranted = e.grantedPermissions.includes(permission);
        const nextGranted = isGranted 
          ? e.grantedPermissions.filter(p => p !== permission)
          : [...e.grantedPermissions, permission];
        
        addLog(e.name, permission, isGranted ? 'DENIED' : 'GRANTED', 
          `App-level permission "${permission}" was explicitly ${isGranted ? 'REVOKED' : 'APPROVED'} by operator.`
        );
        
        return { ...e, grantedPermissions: nextGranted };
      }
      return e;
    }));
  };

  const grantAllPermissions = (extId: string) => {
    setExtensions(prev => prev.map(e => {
      if (e.id === extId) {
        addLog(e.name, 'Full Trust Bypass', 'GRANTED', `Operator authorized ALL requested sandbox permission handles.`);
        return { ...e, grantedPermissions: [...e.permissions] };
      }
      return e;
    }));
  };

  const revokeAllPermissions = (extId: string) => {
    setExtensions(prev => prev.map(e => {
      if (e.id === extId) {
        addLog(e.name, 'De-authorize All', 'DENIED', `All app-level credentials cleared for secure sandbox containment.`);
        return { ...e, grantedPermissions: [] };
      }
      return e;
    }));
  };

  // Run dry run sandbox computation
  const runSandboxDryRun = (ext: HavenExtension) => {
    setIsSimulating(true);
    addLog(ext.name, 'Dry Run Check', 'SIMULATED', `Spawning secure sandboxed iframe pipeline executing virtual bundle compiled under strict memory limits...`);
    
    // Check each permission
    ext.permissions.forEach(p => {
      const has = ext.grantedPermissions.includes(p);
      addLog(ext.name, p, has ? 'GRANTED' : 'DENIED', 
        `Resource validation check on "${p}" handle: [${has ? 'UNRESTRICTED ACCESS APPROVED' : 'CONTAINED BY HOST RULES'}]`
      );
    });
    
    setIsSimulating(false);
    addLog(ext.name, 'Sandbox Ready', 'SIMULATED', `Status OK. Memory footprint: 0.12MB. Virtual heap isolated successfully.`);
  };

  // Dynamic JS Sandbox compiler dispatcher
  const executeSandboxScript = () => {
    if (!selectedExtension.active) {
      addLog(selectedExtension.name, 'sandboxed-runner', 'DENIED', 'Cannot execute code on deactivated module. Please activate the toggle switch.');
      return;
    }
    setIsSimulating(true);
    PluginManager.getInstance().runCode(selectedExtension, sandboxCode);
    setIsSimulating(false);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* EXTENSIONS REGISTRY (LEFT: col-span-5) */}
      <div className="lg:col-span-5 bg-card/65 border border-border/80 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div>
            <span className="text-[10px] tracking-widest font-mono font-extrabold text-muted-foreground uppercase">HAVEN REGISTER</span>
            <h3 className="text-sm font-black text-foreground">Active Extensions Hub</h3>
          </div>
          <Badge className="bg-primary/10 border-primary/20 text-primary font-mono text-[10px]">Registry V1</Badge>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Unlock modular capabilities inside workspace, feeds, and assistants. Extensions run in isolated sandboxes with strict user-approved handles.
        </p>

        {/* LIST OF REGISTERED PLUGINS */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {extensions.map((ext) => {
            const isSelected = selectedExtensionId === ext.id;
            return (
              <div 
                key={ext.id}
                onClick={() => setSelectedExtensionId(ext.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none text-left ${
                  isSelected 
                    ? 'bg-zinc-800/10 border-foreground/50' 
                    : 'bg-[#0b0c0e] border-border/40 hover:border-zinc-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-zinc-150">{ext.name}</span>
                      <span className="text-[9px] px-1.5 bg-zinc-800 border border-border/60 text-muted-foreground rounded font-mono">
                        {ext.category}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-muted-foreground leading-snug mt-1 line-clamp-2">
                      {ext.desc}
                    </p>
                  </div>

                  {/* ACTIVE SWITCH */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleExtensionActive(ext.id); }}
                    className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {ext.active ? (
                      <ToggleRight className="w-8 h-8 text-emerald-450" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-neutral-600" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/20 text-[9.5px]">
                  <span className="text-muted-foreground">Sandbox isolation: <span className="text-emerald-450 font-mono font-bold">SECURED</span></span>
                  <span className="font-mono text-zinc-500 text-[9px]">Permissions: {ext.grantedPermissions.length}/{ext.permissions.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SANDBOX CONTAINER AND CONTROLS (RIGHT: col-span-7) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* INTERACTIVE DETAIL PANEL */}
        <div className="bg-card/65 border border-border/80 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-border/20">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary shrink-0" />
                <h4 className="text-sm font-black text-foreground">{selectedExtension.name} Sandbox Settings</h4>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Author node: <strong className="font-mono">{selectedExtension.author}</strong></p>
            </div>

            <div className="flex items-center gap-2">
              {selectedExtension.active ? (
                <Badge className="bg-emerald-500/10 text-emerald-450 border-emerald-500/20 font-mono text-[9px]">COMPILER ACTIVE</Badge>
              ) : (
                <Badge className="bg-zinc-800 text-muted-foreground border-border/50 font-mono text-[9px]">PAUSED DEACTIVATED</Badge>
              )}
              <Button 
                size="sm"
                onClick={() => runSandboxDryRun(selectedExtension)}
                disabled={isSimulating || !selectedExtension.active}
                className="h-7 text-[10px] font-bold border border-foreground/30 bg-[#16181d] text-zinc-200 hover:text-white cursor-pointer rounded-lg"
              >
                {isSimulating ? <RefreshCw className="w-3 h-3 animate-spin mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                Quick Lint Check
              </Button>
            </div>
          </div>

          {/* PERMISSIONS SELECTOR BLOCKS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-bold uppercase text-zinc-400">Sandbox App-Level Permission Handles</span>
              <div className="flex gap-1.5 text-[9px] font-mono">
                <button onClick={() => grantAllPermissions(selectedExtension.id)} className="text-primary hover:underline cursor-pointer">
                  [GRANT ALL]
                </button>
                <span className="text-zinc-650">|</span>
                <button onClick={() => revokeAllPermissions(selectedExtension.id)} className="text-red-400 hover:underline cursor-pointer">
                  [REVOKE ALL]
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-left">
              {selectedExtension.permissions.map((perm) => {
                const isGranted = selectedExtension.grantedPermissions.includes(perm);
                return (
                  <div 
                    key={perm}
                    onClick={() => togglePermission(selectedExtension.id, perm)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer select-none transition-all ${
                      isGranted 
                        ? 'bg-[#0f1712] border-emerald-500/30 text-emerald-400' 
                        : 'bg-zinc-900/60 border-border/40 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isGranted ? <Unlock className="w-3.5 h-3.5 text-emerald-450" /> : <Lock className="w-3.5 h-3.5 text-zinc-500" />}
                      <span className="font-sans font-medium">{perm}</span>
                    </div>
                    <span>
                      {isGranted ? (
                        <span className="text-[9px] uppercase font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded font-extrabold">APPROVED</span>
                      ) : (
                        <span className="text-[9px] uppercase font-mono bg-zinc-800 px-1.5 py-0.5 rounded font-bold text-zinc-500">REVOKED</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC CODE RUNNER BLOCK */}
          <div className="border-t border-border/20 pt-4 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[10.5px] font-mono font-bold uppercase text-zinc-200">Interactive Sandbox IDE Compiler</span>
              </div>
              <Badge className="bg-primary/5 text-primary border border-primary/20 text-[8.5px] font-mono">HAVEN_API SECURED</Badge>
            </div>

            <p className="text-[11px] text-zinc-400 leading-normal">
              Execute dynamic JavaScript functions within this isolated sandbox loop. Plugins access safe environment primitives using the <code className="text-[#00ff66] font-mono">HavenAPI</code> proxy.
            </p>

            <div className="space-y-3 font-mono">
              <textarea 
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                rows={7}
                className="w-full text-xs p-3 bg-zinc-950 border border-border rounded-xl focus:border-zinc-500 outline-none text-emerald-450 font-mono"
                placeholder="// Custom Javascript. Code evaluated with HavenAPI proxy..."
              />

              <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 bg-[#090b0e] border border-border/30 rounded-xl">
                <div className="text-[9px] font-sans text-zinc-450">
                  Compile parameters: <span className="text-zinc-200">isolated scope</span> | <span className="text-zinc-200">browser constraints</span>
                </div>
                
                <Button 
                  size="sm"
                  onClick={executeSandboxScript}
                  disabled={isSimulating || !selectedExtension.active}
                  className="bg-primary hover:bg-opacity-82 text-black font-extrabold text-[10.5px] h-8 rounded-lg flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-black fill-black" />
                  Execute Sandbox Script
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* LOG PANEL (BOTTOM: Sandbox Execution History) */}
        <div className="bg-black/90 border border-[#00ff660b] rounded-2xl p-4 font-mono text-left space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/2 rounded-full blur-[40px]"></div>

          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#00ff66]">SANDBOX REAL-TIME TELEMETRY SYSTEM</span>
            </div>
            
            <button 
              onClick={() => {
                setLogs([]);
                addLog('Sandbox Engine', 'Core Flush', 'SIMULATED', 'Telemetry memory buffer cleared.');
              }}
              className="text-[9.5px] text-zinc-550 hover:text-white cursor-pointer"
            >
              [FLUSH LOGS]
            </button>
          </div>

          <div className="space-y-1.5 text-[10px] max-h-[160px] overflow-y-auto pr-1">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-1.5 leading-normal select-text">
                <span className="text-zinc-650 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="text-zinc-550 shrink-0 select-none">{log.source} ➔ ({log.permission})</span>
                <span className="shrink-0 select-none">
                  {log.status === 'GRANTED' ? (
                    <span className="text-[#00ff66] font-bold">[GRANT]</span>
                  ) : log.status === 'DENIED' ? (
                    <span className="text-red-400 font-bold">[DENY]</span>
                  ) : (
                    <span className="text-blue-400 font-bold">[MOCK]</span>
                  )}
                </span>
                <span className="text-zinc-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
