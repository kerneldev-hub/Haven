import React, { useState } from 'react';
import { 
  Terminal, ShieldAlert, CheckCircle2, Play, Trash2, 
  Settings, HelpCircle, HardDrive, Plus, Info, RefreshCw, Layers,
  ChevronDown, ChevronRight, CheckSquare, Square, Search, BookOpen
} from 'lucide-react';
import { HavenExtension, SandboxExecutionLog, PersonSpace } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';
import PluginDiscovery from './PluginDiscovery';

interface PluginEngineProps {
  activeSpace: PersonSpace;
  extensions: HavenExtension[];
  setExtensions: React.Dispatch<React.SetStateAction<HavenExtension[]>>;
  logs: SandboxExecutionLog[];
  setLogs: React.Dispatch<React.SetStateAction<SandboxExecutionLog[]>>;
}

export default function PluginEngine({
  activeSpace,
  extensions,
  setExtensions,
  logs,
  setLogs
}: PluginEngineProps) {
  const [selectedExtensionId, setSelectedExtensionId] = useState<string>(extensions[0]?.id || 'ext-custom-css');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Collapsible section state for tablet & mobile views
  const [expandedSection, setExpandedSection] = useState<'plugins' | 'editor' | 'logs'>('plugins');

  const selectedExtension = extensions.find(e => e.id === selectedExtensionId) || extensions[0];

  // Mock code content representing the active plugin execution source
  const mockCodeSnippets: Record<string, string> = {
    'ext-custom-css': `// Extension Name: Style Customizer Engine\n// Scope: Client Sandbox Execution\n\nfunction applyStyleTheme() {\n  const style = document.createElement('style');\n  style.textContent = \`\n    .haven-card {\n      border: 1px solid rgba(255, 255, 255, 0.08);\n      background: rgba(10, 11, 15, 0.95);\n      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);\n    }\n  \`;\n  document.head.appendChild(style);\n  return "Sandbox CSS theme layer successfully mounted.";\n}\n\napplyStyleTheme();`,
    'ext-seo-spider': `// Extension Name: SEO Auditor Spider\n// Scope: Project Workspace Local Filesystem\n\nasync function auditWorkspaceMetadata() {\n  const files = await HavenAPI.readWorkspaceFiles();\n  let missingMetaCount = 0;\n  for (const [path, content] of Object.entries(files)) {\n    if (path.endsWith('.html') && !content.includes('<meta')) {\n      missingMetaCount++;\n    }\n  }\n  return \`Audited \${Object.keys(files).length} files. Found \${missingMetaCount} lacking meta.\`;\n}\n\nauditWorkspaceMetadata();`,
    'ext-hook-notifier': `// Extension Name: Webhook Simulator Notifier\n// Scope: Dev Environment Loop Hooks\n\nfunction dispatchWebhookAlert() {\n  const payload = {\n    event: 'checkpoint.completed',\n    timestamp: Date.now(),\n    status: 'OPTIMISTIC'\n  };\n  return HavenAPI.emitSocket('notification_pipe', payload);\n}\n\ndispatchWebhookAlert();`
  };

  const activeCode = mockCodeSnippets[selectedExtension?.id] || `// Custom Plugin Sandbox Session\nconsole.log("Isolated container ready.");`;

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

  const handleToggleExtensionActive = (id: string) => {
    const updated = extensions.map(e => {
      if (e.id === id) {
        const nextState = !e.active;
        addLog(e.name, 'Activation State', 'GRANTED', `Extension node ${nextState ? 'LOADED' : 'UNLOADED'} successfully.`);
        return { ...e, active: nextState };
      }
      return e;
    });
    setExtensions(updated);
  };

  const handleTogglePermission = (id: string, perm: string) => {
    const updated = extensions.map(e => {
      if (e.id === id) {
        const isGranted = e.grantedPermissions.includes(perm);
        const nextGranted = isGranted 
          ? e.grantedPermissions.filter(p => p !== perm)
          : [...e.grantedPermissions, perm];
        
        addLog(e.name, perm, nextGranted.includes(perm) ? 'GRANTED' : 'DENIED', 
          `Permission "${perm}" state updated to: ${nextGranted.includes(perm) ? 'GRANTED' : 'REVOKED'}`
        );

        return { ...e, grantedPermissions: nextGranted };
      }
      return e;
    });
    setExtensions(updated);
  };

  const handleGrantAll = (id: string) => {
    const updated = extensions.map(e => {
      if (e.id === id) {
        addLog(e.name, 'Bulk Operations', 'GRANTED', 'All declared permissions bulk granted.');
        return { ...e, grantedPermissions: [...e.permissions] };
      }
      return e;
    });
    setExtensions(updated);
  };

  const handleRevokeAll = (id: string) => {
    const updated = extensions.map(e => {
      if (e.id === id) {
        addLog(e.name, 'Bulk Operations', 'DENIED', 'All declared permissions bulk revoked.');
        return { ...e, grantedPermissions: [] };
      }
      return e;
    });
    setExtensions(updated);
  };

  const handleRunSandboxScript = (scriptName: string) => {
    if (!selectedExtension || !selectedExtension.active) {
      addLog('Sandbox Engine', 'Core Exception', 'DENIED', 'Aborted process: extension must be loaded and active first.');
      return;
    }

    setIsSimulating(true);
    addLog(selectedExtension.name, 'Sandbox Run', 'SIMULATED', `Spawning isolated memory runtime for execution path...`);

    setTimeout(() => {
      if (selectedExtension.id === 'ext-custom-css') {
        const hasPerm = selectedExtension.grantedPermissions.includes('Inject CSS');
        if (!hasPerm) {
          addLog(selectedExtension.name, 'Inject CSS', 'DENIED', 'Process halted: Missing required permission "Inject CSS"');
        } else {
          addLog(selectedExtension.name, 'Inject CSS', 'GRANTED', 'Success: Compiled custom style layout and injected styles successfully.');
        }
      } else if (selectedExtension.id === 'ext-seo-spider') {
        const hasPerm = selectedExtension.grantedPermissions.includes('Read Workspace Files');
        if (!hasPerm) {
          addLog(selectedExtension.name, 'Read Workspace Files', 'DENIED', 'Process halted: Missing required permission "Read Workspace Files"');
        } else {
          const filesCount = Object.keys(activeSpace?.files || {}).length;
          addLog(selectedExtension.name, 'Read Workspace Files', 'GRANTED', `Success: Audited (${filesCount}) workspace files. Zero missing meta elements discovered.`);
        }
      } else {
        addLog(selectedExtension.name, 'Execution Loop', 'GRANTED', 'Success: Triggered custom script pipeline safely inside container parameters.');
      }
      setIsSimulating(false);
    }, 450);
  };

  const [pluginMode, setPluginMode] = useState<'sandbox' | 'marketplace'>('sandbox');

  return (
    <div className="space-y-8">
      {/* Dynamic Sub-tab Selector */}
      <div className="flex items-center justify-between p-4 bg-card/45 border border-border/40 rounded-xl">
        <div className="text-left">
          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">PLUGIN ENGINE ECOSYSTEM</span>
          <h3 className="text-sm font-black text-foreground mt-0.5">Secure Sandboxing & Integrations</h3>
        </div>

        <div className="flex gap-2 p-1 bg-[#090a0c] border border-border/30 rounded-lg select-none">
          <button
            onClick={() => setPluginMode('sandbox')}
            className={`py-1.5 px-3 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              pluginMode === 'sandbox' ? 'bg-primary text-background' : 'text-zinc-400 hover:text-white'
            }`}
          >
            💻 Active Sandbox
          </button>
          <button
            onClick={() => setPluginMode('marketplace')}
            className={`py-1.5 px-3 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              pluginMode === 'marketplace' ? 'bg-primary text-background' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🔌 Discover Plugins
          </button>
        </div>
      </div>

      {pluginMode === 'marketplace' ? (
        <PluginDiscovery 
          extensions={extensions}
          setExtensions={setExtensions}
          onClose={() => setPluginMode('sandbox')}
        />
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* 1200px+ Desktop Responsive Layout / Less than 1200px Accordion stack */}
          <div className="hidden xl:grid xl:grid-cols-12 gap-6 items-start text-left">
        
        {/* PANE 1: EXTENSION MANAGER (Registry + Permissions Pane) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card/65 border border-border/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h4 className="text-xs uppercase font-mono font-black text-foreground tracking-wider">
                  Sandbox Extensions
                </h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 font-extrabold uppercase">Registry v3.5</span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Select and toggle client-side secure sandbox utilities. Green status indicates active status.
            </p>

            <div className="space-y-3">
              {extensions.map((ext) => {
                const isSelected = ext.id === selectedExtensionId;
                return (
                  <div 
                    key={ext.id}
                    onClick={() => setSelectedExtensionId(ext.id)}
                    className={`p-4 rounded-xl border cursor-pointer select-none text-left flex flex-col justify-between transition-all duration-200 ${
                      isSelected 
                        ? 'bg-zinc-900/35 border-primary/55 ring-1 ring-primary/10 shadow-md' 
                        : 'bg-[#06070a] border-border/30 hover:border-zinc-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {ext.active ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-zinc-650 shrink-0" title="Inactive" />
                          )}
                          <span className={`text-[12px] font-bold block transition-colors ${ext.active ? 'text-white' : 'text-zinc-400'}`}>
                            {ext.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-550 block mt-0.5">by @{ext.author}</span>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleExtensionActive(ext.id); }}
                        className={`text-[9px] font-mono font-bold h-6 px-2 border rounded-lg cursor-pointer transition-colors ${
                          ext.active 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15' 
                            : 'bg-zinc-950 border-zinc-900 text-zinc-550 hover:text-zinc-200'
                        }`}
                      >
                        {ext.active ? "LOADED" : "UNLOADED"}
                      </button>
                    </div>

                    <p className="text-[10.5px] text-muted-foreground mt-2 leading-relaxed">
                      {ext.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PERMISSION MATRIX FOR SELECTED */}
          {selectedExtension && (
            <div className="bg-card/65 border border-border/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/20">
                <div>
                  <span className="text-[8px] tracking-widest font-mono font-black text-primary uppercase">PERMISSIONS SHEET</span>
                  <h5 className="text-[12px] font-extrabold text-foreground mt-0.5 truncate max-w-[200px]">{selectedExtension.name}</h5>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleGrantAll(selectedExtension.id)}
                    className="text-[9.5px] font-mono text-emerald-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    [Grant All]
                  </button>
                  <button 
                    onClick={() => handleRevokeAll(selectedExtension.id)}
                    className="text-[9.5px] font-mono text-zinc-500 hover:underline cursor-pointer bg-transparent border-none p-0"
                  >
                    [Revoke All]
                  </button>
                </div>
              </div>

              <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                Approve workspace sandbox permissions below. Unchecked features are halted at runtime.
              </p>

              <div className="space-y-2.5">
                {selectedExtension.permissions.map(perm => {
                  const isGranted = selectedExtension.grantedPermissions.includes(perm);
                  return (
                    <div 
                      key={perm}
                      onClick={() => handleTogglePermission(selectedExtension.id, perm)}
                      className="p-3 bg-[#050608] border border-border/30 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-2 min-w-0">
                        {isGranted ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-650 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-[11.5px] font-black block text-zinc-350 font-mono truncate">{perm}</span>
                          <span className="text-[9.5px] text-zinc-550 block truncate">Restricts Sandbox container access.</span>
                        </div>
                      </div>
                      <Badge className={isGranted ? "bg-emerald-500/10 text-emerald-400 border-none font-mono text-[8px]" : "bg-zinc-950 text-zinc-600 border-none font-mono text-[8px]"}>
                        {isGranted ? "ALLOWED" : "BLOCKED"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* PANE 2: INTEGRATED CODE WORKSPACE & LAUNCHER (col-span-5) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-[#050608]/95 border border-border/85 rounded-2xl p-6 flex flex-col justify-between min-h-[460px] font-mono">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/20 font-bold">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] text-foreground tracking-wider uppercase">Sandbox Code View</span>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-mono">JavaScript VM</Badge>
              </div>

              {/* MOCK TEXT EDITOR WITH LINE NUMBERS */}
              <div className="rounded-xl border border-border/25 bg-[#020304] p-4 font-mono text-xs overflow-x-auto min-h-[290px] text-left relative shadow-inner">
                <div className="flex items-start gap-4">
                  {/* Line Numbers */}
                  <div className="text-zinc-650 select-none text-right font-mono pr-2 border-r border-[#161922]/15 text-[10.5px] leading-relaxed">
                    {Array.from({ length: activeCode.split('\n').length }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  {/* Rich Code Output Rendering */}
                  <pre className="text-zinc-250 font-mono text-[11px] leading-relaxed select-text overflow-x-auto whitespace-pre">
                    {activeCode}
                  </pre>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-4 border-t border-border/15 flex items-center justify-between">
              <span className="text-[10px] text-zinc-550 font-mono">Execution boundaries restricted locally.</span>
              <Button 
                onClick={() => handleRunSandboxScript('execute')}
                disabled={isSimulating || !selectedExtension?.active}
                className="h-9 px-4 text-xs font-bold font-mono text-white flex items-center gap-1.5 cursor-pointer rounded-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Sandbox Script</span>
              </Button>
            </div>
          </div>
        </div>

        {/* PANE 3: LOGS & CONSOLE PIPELINE (col-span-3) */}
        <div className="xl:col-span-3 bg-card/65 border border-border/80 rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/20 font-mono">
            <span className="text-xs text-foreground font-black tracking-wider uppercase">Sandbox Output</span>
            <button 
              onClick={() => setLogs([])}
              className="text-[9.5px] text-zinc-550 hover:text-white cursor-pointer bg-transparent border-none p-0"
            >
              [Clear]
            </button>
          </div>

          <p className="text-[10.5px] text-muted-foreground leading-relaxed">
            Consolidated Sandbox execution stream and validation results.
          </p>

          <div className="space-y-3 h-[380px] overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-550 italic select-none text-xs">
                Console offline. Run scripts to inspect outputs.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="p-3 bg-[#050608] rounded-xl border border-border/20 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                    <span>{log.timestamp}</span>
                    <span className={`font-black ${
                      log.status === 'GRANTED' ? 'text-emerald-400' : log.status === 'DENIED' ? 'text-rose-400' : 'text-sky-450'
                    }`}>{log.status}</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 font-extrabold truncate">
                    Src: {log.source} | {log.permission}
                  </div>
                  <p className="text-zinc-300 font-sans text-[11px] leading-normal break-words">{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Accordion Stack for Smaller screens (Tablet & Mobile viewport sizes) */}
      <div className="xl:hidden space-y-4">
        
        {/* Accordion Box 1: Plugins Registry */}
        <div className="bg-card/65 border border-border/80 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setExpandedSection(expandedSection === 'plugins' ? 'editor' : 'plugins')}
            className="w-full p-4 flex items-center justify-between bg-[#08090c] font-black text-xs select-none uppercase tracking-wider text-left text-zinc-200 border-b border-border/10 focus:outline-none"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Extensions & Permissions
            </span>
            {expandedSection === 'plugins' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {expandedSection === 'plugins' && (
            <div className="p-4 space-y-5 text-left bg-transparent">
              <div className="space-y-2.5">
                {extensions.map((ext) => {
                  const isSelected = ext.id === selectedExtensionId;
                  return (
                    <div 
                      key={ext.id}
                      onClick={() => setSelectedExtensionId(ext.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer select-none flex items-start justify-between ${
                        isSelected ? 'bg-zinc-900/35 border-primary/50' : 'bg-[#050608] border-border/30'
                      }`}
                    >
                      <div className="min-w-0 pr-2 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`w-1.5 h-1.5 rounded-full ${ext.active ? 'bg-emerald-500' : 'bg-zinc-650'}`} />
                          <span className="text-[11.5px] font-bold block text-white">{ext.name}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{ext.desc}</p>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleExtensionActive(ext.id); }}
                        className="text-[9px] font-mono h-6 px-2 border rounded bg-zinc-950 border-zinc-900 text-zinc-450 hover:text-white"
                      >
                        {ext.active ? "LOADED" : "UNLOADED"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quick Checklist Permissions */}
              {selectedExtension && (
                <div className="pt-3 border-t border-[#1a202c]/20 space-y-2.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Approve Sandbox parameters</span>
                    <button 
                      onClick={() => handleGrantAll(selectedExtension.id)}
                      className="text-[9px] text-primary"
                    >
                      [Grant All]
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {selectedExtension.permissions.map(perm => {
                      const isGranted = selectedExtension.grantedPermissions.includes(perm);
                      return (
                        <div 
                          key={perm}
                          onClick={() => handleTogglePermission(selectedExtension.id, perm)}
                          className="flex items-center justify-between p-2 bg-black/20 rounded-lg text-xs font-mono cursor-pointer"
                        >
                          <span className="text-zinc-350 truncate">{perm}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${isGranted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/5 text-zinc-550'}`}>
                            {isGranted ? "ALLOWED" : "BLOCKED"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion Box 2: Code Editor */}
        <div className="bg-card/65 border border-border/80 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setExpandedSection(expandedSection === 'editor' ? 'logs' : 'editor')}
            className="w-full p-4 flex items-center justify-between bg-[#08090c] font-black text-xs select-none uppercase tracking-wider text-left text-zinc-200 border-b border-border/10 focus:outline-none"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              Code Sandbox launcher
            </span>
            {expandedSection === 'editor' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {expandedSection === 'editor' && (
            <div className="p-4 bg-[#050608]/90 font-mono text-xs flex flex-col justify-between min-h-[350px]">
              <div className="rounded-xl border border-border/20 bg-[#020304] p-3 text-left overflow-x-auto min-h-[220px]">
                <pre className="text-zinc-200 text-[10.5px] leading-relaxed select-text whitespace-pre">
                  {activeCode}
                </pre>
              </div>

              <div className="pt-3 border-t border-border/15 flex justify-end">
                <Button 
                  onClick={() => handleRunSandboxScript('execute')}
                  disabled={isSimulating || !selectedExtension?.active}
                  className="h-9 px-4 text-xs font-mono text-white font-bold cursor-pointer rounded-lg"
                >
                  Run Sandbox Script
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Box 3: Output Log Console */}
        <div className="bg-card/65 border border-border/80 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setExpandedSection(expandedSection === 'logs' ? 'plugins' : 'logs')}
            className="w-full p-4 flex items-center justify-between bg-[#08090c] font-black text-xs select-none uppercase tracking-wider text-left text-zinc-200 border-b border-border/10 focus:outline-none"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              Execution Logs Output
            </span>
            {expandedSection === 'logs' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {expandedSection === 'logs' && (
            <div className="p-4 space-y-3 bg-[#050608] min-h-[260px] max-h-[400px] overflow-y-auto text-left">
              <div className="flex items-center justify-between font-mono pb-2 border-b border-border/10 text-[11px]">
                <span className="text-zinc-450 uppercase">Sandbox Activities</span>
                <button 
                  onClick={() => setLogs([])}
                  className="text-zinc-550"
                >
                  [Clear]
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-zinc-650 italic text-xs select-none">
                  Console streams offline.
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-card/45 rounded-lg border border-border/20 text-xs font-mono space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-zinc-550 pb-1">
                      <span>{log.timestamp}</span>
                      <span className={log.status === 'GRANTED' ? 'text-emerald-400' : 'text-rose-400'}>{log.status}</span>
                    </div>
                    <div className="font-bold text-zinc-400 truncate">Src: {log.source}</div>
                    <p className="text-zinc-300 font-sans leading-normal text-[11px] break-words">{log.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>

      </div>
      )}
    </div>
  );
}
