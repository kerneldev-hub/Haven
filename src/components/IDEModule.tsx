import React, { useState, useEffect } from 'react';
import { Button } from './ui/components';
import { 
  Code2, Play, Save, TerminalSquare, FileCode, Check, 
  HelpCircle, RefreshCw, Terminal, ArrowRight, Layers 
} from 'lucide-react';
import { Badge } from './ui/Badge';

export default function IDEModule() {
  const [files, setFiles] = useState<{ id: string, name: string, content: string, language: string }[]>([
    { 
      id: '1', 
      name: 'main.ts', 
      content: '// Kernel Mode Initialized\n\nfunction executeCoreWorkflow(payload: string) {\n  console.log("Processing edge stream: " + payload);\n  return "System Check: OK";\n}\n\nexecuteCoreWorkflow("Active_Session_Node");',
      language: 'typescript' 
    },
    { 
      id: '2', 
      name: 'style.css', 
      content: '/* Swiss Minimalist Stylesheet */\n:root {\n  --color-canvas-bg: #0b0c10;\n  --color-accent-teal: #00ff66;\n  --font-display: "Space Grotesk", sans-serif;\n}', 
      language: 'css' 
    },
    {
      id: '3',
      name: 'worker.ts',
      content: '// Cloudflare worker endpoint handler\nexport default {\n  async fetch(request: Request) {\n    return new Response(JSON.stringify({ status: "ok" }), {\n      headers: { "content-type": "application/json" }\n    });\n  }\n};',
      language: 'typescript'
    }
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [isSaving, setIsSaving] = useState(false);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  
  // Terminal outputs simulator
  const [terminalLogs, setTerminalLogs] = useState<string[]>(() => [
    'System VM Sandbox initialized.',
    'Status: Awaiting Compilation instructions.'
  ]);
  const [compilingState, setCompilingState] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: nextVal } : f));
  };

  const handleSaveFile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowStatusAlert(true);
      setTimeout(() => setShowStatusAlert(false), 2500);
    }, 200);
  };

  const handleCompileAndRun = () => {
    setCompilingState(true);
    setTerminalLogs(prev => [...prev, `[COMPILER RUNNING] Executing transpiler for file "${activeFile.name}"...`]);
    
    setTimeout(() => {
      setCompilingState(false);
      
      let outputs: string[] = [];
      if (activeFile.name === 'main.ts') {
        outputs = [
          'Transpilation success. Output format: ES Module CJS fallback.',
          'Stdout: "Processing edge stream: Active_Session_Node"',
          'Return execution value: "System Check: OK"',
          'Status: EXITED_SUCCESS (Code 0)'
        ];
      } else if (activeFile.name === 'style.css') {
        outputs = [
          'CSS parser loaded success.',
          'Validated properties count: 3 entries.',
          'Status: INJECTED_AESTHETICS (Code 0)'
        ];
      } else {
        outputs = [
          'Transpiled worker entry point.',
          'Simulated request callback check: HTTP 200 OK.',
          'Status: WORKER_READY (Code 0)'
        ];
      }
      
      setTerminalLogs(prev => [...prev, ...outputs]);
    }, 400);
  };

  const clearTerminal = () => {
    setTerminalLogs(['Console stream cleared. Awaiting transpiler routine.']);
  };

  return (
    <div className="flex flex-col h-[600px] border border-border/80 rounded-2xl bg-card overflow-hidden text-left font-mono">
      {/* EDITOR CONTROL PANEL */}
      <div className="flex items-center justify-between p-3.5 border-b border-border bg-[#07080a]/90 select-none">
        
        {/* ACTIVE MODULE SELECTS */}
        <div className="flex items-center gap-1">
          {files.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFileId(f.id)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
                activeFileId === f.id 
                  ? 'bg-[#15191d] text-primary border-foreground/30 font-bold' 
                  : 'text-zinc-500 hover:text-white border-transparent hover:bg-zinc-900/40'
              }`}
            >
              📄 {f.name}
            </button>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          {showStatusAlert && (
            <span className="text-[10px] text-primary font-bold mr-2 uppercase animate-fade-in flex items-center gap-1">
              ✔ Code Synced
            </span>
          )}

          <Button 
            onClick={handleSaveFile} 
            variant="outline" 
            size="sm" 
            className="h-8 text-[11px] font-bold bg-[#0d0e12] border-zinc-700/60 hover:text-white rounded-lg cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            {isSaving ? 'SAVING...' : 'SAVE'}
          </Button>

          <Button 
            size="sm" 
            onClick={handleCompileAndRun}
            disabled={compilingState}
            className="h-8 text-[11px] font-bold bg-primary text-background hover:bg-sky-400 border-0 rounded-lg cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            {compilingState ? 'COMPILING...' : 'RUN COMPILE'}
          </Button>
        </div>

      </div>

      {/* WORKSPACE DIVIDER EDITOR / TERMINAL SCREEN */}
      <div className="flex-1 grid md:grid-cols-12 overflow-hidden bg-zinc-950 font-mono">
        
        {/* EDIT CONTAINER (Left: Col-span-7) */}
        <div className="md:col-span-7 h-full flex flex-col relative border-r border-border/10">
          <textarea
            value={activeFile.content}
            onChange={handleEditorChange}
            className="flex-1 w-full p-4 outline-none resize-none bg-[#040507] text-zinc-200 font-mono text-[12.5px] leading-relaxed"
            spellCheck="false"
            placeholder="// Add code lines here..."
          />
        </div>

        {/* LIVE TERMINAL DISPLAY (Right: Col-span-5) */}
        <div className="md:col-span-5 h-full bg-[#030406] flex flex-col justify-between p-4">
          
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b pb-2 border-border/20 select-none">
              <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Compiler stdout
              </span>
              <button 
                onClick={clearTerminal} 
                className="text-[9px] hover:text-white text-zinc-600"
              >
                [Clear Terminal]
              </button>
            </div>

            {/* LIVE STREAM LIST */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[10.5px] select-text">
              {terminalLogs.map((lg, idx) => (
                <div key={idx} className="font-mono leading-relaxed text-zinc-300 break-words font-medium">
                  <span className="text-zinc-650 font-bold select-none mr-1.5">➜</span>
                  {lg}
                </div>
              ))}
              {compilingState && (
                <div className="text-[10px] text-primary italic animate-pulse">
                  Linking sandbox dependencies from edge repositories...
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/15 pt-2.5 font-mono text-[9px] text-zinc-550 flex items-center justify-between select-none">
            <span>Terminal status: LIVE (DZD, Edge optimized)</span>
            <span>Memory isolation bounds enforced</span>
          </div>

        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="h-9 border-t border-border bg-black/50 flex items-center px-4 font-mono text-[10px] text-zinc-500 justify-between select-none">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span>Language Server: Connected (Local Isolation)</span>
        </div>
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-3.5 h-3.5 text-zinc-550" />
          <span>Active VM Sandbox State: <strong className="text-[#00ff66]">READY_AWAIT_TRIGGER</strong></span>
        </div>
      </div>
    </div>
  );
}
