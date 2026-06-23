import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Play, Square, Pause, RotateCcw, Activity, ShieldCheck, 
  Trash2, Share2, Sparkles, Sliders, Layers, Calculator, FileText, CheckSquare, 
  Timer, Laptop, Wifi, CheckCircle2, Heart 
} from 'lucide-react';
import { CustomArtifact, CommunityPost } from '../types';
import { Badge } from './ui/Badge';

interface ArtifactStudioProps {
  onArtifactAdded: (art: CustomArtifact) => void;
  onShareArtifact: (art: CustomArtifact) => void;
}

export default function ArtifactStudio({ onArtifactAdded, onShareArtifact }: ArtifactStudioProps) {
  // Built-in Blueprint presets
  const blueprints = [
    {
      type: 'focus-timer',
      name: 'Monospace Focus Timer',
      desc: 'Sleek, minimalist countdown timer designed to track focused development blocks without distractions.',
      defaultState: { duration: 25 * 60, active: false, cycles: 0 }
    },
    {
      type: 'habit-tracker',
      name: 'Custom Productive Habits Board',
      desc: 'Interactive checklist of recurring coding best-practices, tests, and security checkpoints.',
      defaultState: { habits: [
        { name: "Run linters & typings", checked: false },
        { name: "Review webhook signatures", checked: false },
        { name: "Verify visual font pairings", checked: false }
      ]}
    },
    {
      type: 'api-checker',
      name: 'Sleek Endpoint Health Auditor',
      desc: 'Verify server endpoints or simulate response latency and HTTP headers with edge telemetry.',
      defaultState: { url: 'https://api.haven.dev/v1/health', logs: [] }
    },
    {
      type: 'margin-calculator',
      name: 'SaaS Billing & Margin Estimatrix',
      desc: 'Interactive calculator measuring pricing models, Stripe vs Chargily fees, and net edge margin.',
      defaultState: { mau: 500, price: 15, gatway: 'stripe' }
    },
    {
      type: 'markdown-notes',
      name: 'Quick Markdown Memo Board',
      desc: 'Refined markdown notepad containing quick draft codes or system coordinates.',
      defaultState: { text: '# System Roadmap\n- [ ] Deploy Edge Workers\n- [ ] Scale isolated databases' }
    }
  ];

  // Form Configuration States
  const [selectedType, setSelectedType] = useState<any>('focus-timer');
  const [artifactName, setArtifactName] = useState('');
  const [selectedColor, setSelectedColor] = useState<'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet'>('emerald');
  
  // Local preview states for interactive sandbox
  const [timerLeft, setTimerLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  
  const [habitsList, setHabitsList] = useState([
    { name: "Compile project outputs", checked: false },
    { name: "Audit security boundaries", checked: false },
    { name: "Inspect layout responsiveness", checked: false }
  ]);
  const [newHabitName, setNewHabitName] = useState('');

  const [apiUrl, setApiUrl] = useState('https://api.haven.dev/v1/health');
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [apiTesting, setApiTesting] = useState(false);

  const [mauVal, setMauVal] = useState(1200);
  const [priceVal, setPriceVal] = useState(19);
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'chargily'>('stripe');

  const [notesContent, setNotesContent] = useState('#### Workspace Draft\n- Optimize database queries\n- Apply Swiss Modern color theme.');

  // Color Mapping helper
  const colorsMap = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/5' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/5' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/5' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', glow: 'shadow-rose-500/5' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/5' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/5' },
  };

  // Timer simulation loop
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(prev => prev - 1);
      }, 1000);
    } else if (timerLeft === 0) {
      setTimerActive(false);
      setTimerLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerLeft]);

  // Handlers
  const handleSimulateApiCall = () => {
    setApiTesting(true);
    setApiLogs(prev => [`[PINGING ENGINE] Connecting to: ${apiUrl}`, ...prev]);
    
    setTimeout(() => {
      const lat = Math.floor(Math.random() * 80) + 15;
      const statuses = ['200 OK', '201 Created', '304 Not Modified'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      setApiLogs(prev => [
        `[RESPONSE SUCCESS] Status: ${status} | Latency: ${lat}ms`,
        `[HEADERS] Content-Type: application/json | Server: cloudflare-edge`,
        ...prev
      ]);
      setApiTesting(false);
    }, 450);
  };

  const handleAssembleArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = artifactName.trim() || blueprints.find(b => b.type === selectedType)?.name || 'Custom Widget';
    
    let finalState: Record<string, any> = {};
    if (selectedType === 'focus-timer') {
      finalState = { duration: timerLeft, active: false };
    } else if (selectedType === 'habit-tracker') {
      finalState = { habits: habitsList };
    } else if (selectedType === 'api-checker') {
      finalState = { url: apiUrl, logs: apiLogs };
    } else if (selectedType === 'margin-calculator') {
      finalState = { mau: mauVal, price: priceVal, gateway: selectedGateway };
    } else if (selectedType === 'markdown-notes') {
      finalState = { text: notesContent };
    }

    const newArt: CustomArtifact = {
      id: `art-${Date.now()}`,
      name: finalName,
      type: selectedType,
      accentColor: selectedColor,
      blueprintName: blueprints.find(b => b.type === selectedType)?.name || 'Basic Widget',
      state: finalState,
      createdAt: new Date().toLocaleDateString()
    };

    onArtifactAdded(newArt);
    setArtifactName('');
  };

  const calculateSaasPayout = () => {
    const revenue = mauVal * priceVal;
    let gatewayFees = 0;
    if (selectedGateway === 'stripe') {
      // Stripe fee: 2.9% + $0.30
      gatewayFees = (revenue * 0.029) + (mauVal * 0.30);
    } else {
      // Chargily fee: 1.5% fixed
      gatewayFees = revenue * 0.015;
    }
    const platformFee = revenue * 0.005; // 0.5% system cost
    const net = revenue - gatewayFees - platformFee;
    return {
      revenue: revenue.toFixed(0),
      fees: (gatewayFees + platformFee).toFixed(0),
      net: net > 0 ? net.toFixed(0) : '0',
      percentage: revenue > 0 ? ((net / revenue) * 100).toFixed(1) : '100'
    };
  };

  const saasData = calculateSaasPayout();

  return (
    <div className="bg-card/50 border border-border/40 rounded-2xl p-6 space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="border-b border-border/20 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-500 uppercase block mb-1">CRAFT PLATFORM WIDGETS</span>
          <h3 className="text-base font-black text-foreground">
            Aesthetic Custom Artifact Studio
          </h3>
          <p className="text-[11.5px] text-muted-foreground mt-1">
            Build serverless, interactive custom micro-widgets to mount on your dashboard or share with the workspace circle.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-[#101217] border border-border/30 rounded-xl px-3 py-1.5 font-mono text-[10px] text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" />
          <span>No-Code Builder</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DESIGN PARAMETERS FORM (col-span-6) */}
        <form onSubmit={handleAssembleArtifact} className="lg:col-span-6 space-y-5">
          
          {/* Blueprint selector */}
          <div className="space-y-2">
            <label className="text-[10.5px] uppercase font-mono font-extrabold text-zinc-400 block">
              1. Choose Core Blueprint Preset
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {blueprints.map((bp) => {
                const isSel = selectedType === bp.type;
                return (
                  <div 
                    key={bp.type}
                    onClick={() => {
                      setSelectedType(bp.type as any);
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all select-none ${
                      isSel 
                        ? 'bg-[#121419]/70 border-foreground/50' 
                        : 'bg-[#08090c] border-[#16181d] hover:border-zinc-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {bp.type === 'focus-timer' && <Timer className="w-4 h-4 text-emerald-400" />}
                      {bp.type === 'habit-tracker' && <CheckSquare className="w-4 h-4 text-indigo-400" />}
                      {bp.type === 'api-checker' && <Activity className="w-4 h-4 text-cyan-400" />}
                      {bp.type === 'margin-calculator' && <Calculator className="w-4 h-4 text-rose-400" />}
                      {bp.type === 'markdown-notes' && <FileText className="w-4 h-4 text-amber-400" />}
                      <span className={`text-[12px] font-black ${isSel ? 'text-primary' : 'text-zinc-200'}`}>{bp.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-normal block">{bp.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sizing & colors */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5 text-left">
              <label className="text-[10.5px] uppercase font-mono font-extrabold text-zinc-400 block">
                2. Customize Widget Label
              </label>
              <input 
                type="text"
                placeholder="e.g. My Monospace Focus Node"
                value={artifactName}
                onChange={(e) => setArtifactName(e.target.value)}
                className="w-full text-xs h-9 px-3 bg-zinc-950 border border-border/60 rounded-xl focus:border-zinc-500 outline-none text-zinc-200"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10.5px] uppercase font-mono font-extrabold text-zinc-400 block">
                3. Ambient Color Aura
              </label>
              <div className="flex gap-2 h-9 items-center select-none">
                {(['indigo', 'emerald', 'amber', 'rose', 'cyan', 'violet'] as const).map((col) => {
                  const active = selectedColor === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                        col === 'indigo' ? 'bg-indigo-500 border-indigo-400' :
                        col === 'emerald' ? 'bg-emerald-500 border-emerald-400' :
                        col === 'amber' ? 'bg-amber-500 border-amber-400' :
                        col === 'rose' ? 'bg-rose-500 border-rose-400' :
                        col === 'cyan' ? 'bg-cyan-500 border-cyan-400' :
                        'bg-violet-500 border-violet-400'
                      } ${active ? 'scale-110 ring-4 ring-primary/20 ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'}`}
                      title={`${col} aura theme`}
                    >
                      {active && <Check className="w-3.5 h-3.5 text-white shrink-0 font-extrabold" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Builder confirmation Actions */}
          <div className="pt-4 border-t border-border/10 flex flex-wrap gap-2 items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500 select-none">Generates self-contained, lightweight JS states.</span>
            
            <div className="flex gap-2">
              <button 
                type="submit"
                className="h-9 px-4 text-xs font-bold font-sans bg-primary text-background hover:bg-sky-400 rounded-xl cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assemble & Mount Widget</span>
              </button>
            </div>
          </div>

        </form>

        {/* RIGHT COLUMN: INTERACTIVE LIVE SANDBOX PREVIEW (col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[10.5px] uppercase font-mono font-extrabold text-zinc-400 block text-left">
            Live Interactive Sandbox Preview
          </span>

          <div className={`p-6 border rounded-2xl bg-[#090a0d] min-h-[280px] flex flex-col justify-between transition-all ${colorsMap[selectedColor].border} shadow-lg ${colorsMap[selectedColor].glow}`}>
            
            {/* Header layout inside preview */}
            <div className="flex items-start justify-between border-b border-border/10 pb-3">
              <div>
                <span className="text-[9px] font-mono uppercase font-bold text-zinc-500">Custom Active Node</span>
                <h4 className="text-sm font-black text-foreground leading-snug">
                  {artifactName.trim() || blueprints.find(b => b.type === selectedType)?.name}
                </h4>
              </div>
              <Badge variant="outline" className={`text-[8px] font-mono border-none py-0.5 px-2 font-bold ${colorsMap[selectedColor].bg} ${colorsMap[selectedColor].text}`}>
                {blueprints.find(b => b.type === selectedType)?.name.split(' ').pop()}
              </Badge>
            </div>

            {/* Sandbox specific controls depending on selected blueprint */}
            <div className="py-4 flex-1 flex flex-col justify-center">
              
              {/* Preset 1: Monospace Focus Timer */}
              {selectedType === 'focus-timer' && (
                <div className="text-center space-y-4">
                  <div className="text-4xl font-mono font-bold tracking-tight text-foreground select-all">
                    {Math.floor(timerLeft / 60).toString().padStart(2, '0')}:{(timerLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex justify-center gap-2.5">
                    <button 
                      type="button" 
                      onClick={() => setTimerActive(!timerActive)}
                      className={`p-2 rounded-xl transition-all border ${timerActive ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/15' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450 hover:bg-emerald-500/15'}`}
                    >
                      {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setTimerActive(false); setTimerLeft(25 * 60); }}
                      className="p-2 rounded-xl bg-zinc-950 border border-border/30 text-zinc-400 hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Preset 2: Habit Board */}
              {selectedType === 'habit-tracker' && (
                <div className="space-y-2 text-left">
                  {habitsList.map((hab, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        const updated = [...habitsList];
                        updated[idx].checked = !updated[idx].checked;
                        setHabitsList(updated);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer select-none flex items-center justify-between text-xs transition-colors ${
                        hab.checked 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-400' 
                          : 'bg-zinc-950/40 border-border/20 text-zinc-200'
                      }`}
                    >
                      <span className={hab.checked ? 'line-through text-zinc-500' : 'font-medium'}>{hab.name}</span>
                      <span className={`w-4 h-4 rounded border flex items-center justify-center select-none ${
                        hab.checked ? 'bg-emerald-400 border-emerald-400 text-black' : 'border-zinc-700 bg-zinc-900/40'
                      }`}>
                        {hab.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </div>
                  ))}

                  <div className="flex gap-1.5 pt-1">
                    <input 
                      type="text"
                      placeholder="Add habit routine..."
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      className="flex-1 bg-zinc-950 text-[11px] h-7 px-2 border border-border/40 focus:border-zinc-500 rounded outline-none"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (!newHabitName.trim()) return;
                        setHabitsList(prev => [...prev, { name: newHabitName.trim(), checked: false }]);
                        setNewHabitName('');
                      }}
                      className="px-2.5 bg-zinc-900 border border-border rounded text-[11px] text-zinc-300 font-extrabold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Preset 3: Endpoint Checker */}
              {selectedType === 'api-checker' && (
                <div className="space-y-3 text-left">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="flex-1 bg-zinc-950 text-xs px-2 h-7.5 border border-border/40 focus:border-zinc-500 rounded-lg outline-none font-mono text-zinc-300"
                    />
                    <button 
                      type="button" 
                      onClick={handleSimulateApiCall}
                      disabled={apiTesting}
                      className="px-3 h-7.5 bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-zinc-500 text-primary rounded-lg text-xs font-bold"
                    >
                      {apiTesting ? 'Testing...' : 'Ping audit'}
                    </button>
                  </div>

                  <div className="bg-black/90 p-2.5 rounded-lg text-[9.5px] font-mono text-emerald-400 h-28 overflow-y-auto border border-border/20 space-y-1">
                    {apiLogs.length === 0 ? (
                      <span className="text-zinc-650 italic">Log outputs appear here. Click "Ping audit" to trigger connection event.</span>
                    ) : (
                      apiLogs.map((log, idx) => (
                        <div key={idx} className="break-all whitespace-pre-wrap">{log}</div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Preset 4: SaaS Margin calculator */}
              {selectedType === 'margin-calculator' && (
                <div className="space-y-3.5 text-left text-xs">
                  <div className="grid grid-cols-3 gap-2.5 font-mono select-none">
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-zinc-650 block">MAUs</span>
                      <input 
                        type="number" 
                        value={mauVal}
                        onChange={(e) => setMauVal(Number(e.target.value))}
                        className="w-full bg-zinc-950 text-xs h-7 px-2 border border-border/10 rounded outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-zinc-650 block">Price/Mo</span>
                      <input 
                        type="number" 
                        value={priceVal}
                        onChange={(e) => setPriceVal(Number(e.target.value))}
                        className="w-full bg-zinc-950 text-xs h-7 px-2 border border-border/10 rounded outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[8.5px] uppercase font-bold text-zinc-650 block">Gateway</span>
                      <select 
                        value={selectedGateway}
                        onChange={(e: any) => setSelectedGateway(e.target.value)}
                        className="w-full bg-zinc-950 text-xs h-7 px-1.5 border border-border/10 rounded outline-none text-zinc-400"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="chargily">Chargily (Alg)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 px-3 bg-black/40 border border-border/25 rounded-xl text-center select-all">
                    <div>
                      <span className="text-[8px] uppercase font-mono text-zinc-500 block">Gross Revenue</span>
                      <span className="font-mono text-zinc-200 font-bold">${saasData.revenue}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-mono text-zinc-500 block">System Fees</span>
                      <span className="font-mono text-red-400 font-bold">${saasData.fees}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-mono text-zinc-500 block">Net Edge Payout</span>
                      <span className={`font-mono font-extrabold ${colorsMap[selectedColor].text}`}>${saasData.net}</span>
                    </div>
                  </div>

                  <span className="text-[9.5px] text-zinc-500 font-sans block text-center">
                    Operating margin: <strong className="text-emerald-450">{saasData.percentage}%</strong> from payments.
                  </span>
                </div>
              )}

              {/* Preset 5: Markdown notepad */}
              {selectedType === 'markdown-notes' && (
                <div className="space-y-2 text-left">
                  <textarea 
                    value={notesContent}
                    onChange={(e) => setNotesContent(e.target.value)}
                    rows={4}
                    className="w-full bg-zinc-950 text-xs p-2 rounded-lg border border-border/30 focus:border-zinc-500 outline-none text-zinc-300 font-mono leading-relaxed resize-none"
                    placeholder="Write anything..."
                  />
                </div>
              )}

            </div>

            {/* Footer actions representing community and sharing integration */}
            <div className="border-t border-border/10 pt-3 flex items-center justify-between text-[11px] font-mono select-none">
              <span className="text-zinc-600">Preset isolation limits active</span>
              
              <button 
                type="button" 
                onClick={() => {
                  const finalName = artifactName.trim() || blueprints.find(b => b.type === selectedType)?.name || 'Custom Widget';
                  let finalState: Record<string, any> = {};
                  if (selectedType === 'focus-timer') {
                    finalState = { duration: timerLeft, active: false };
                  } else if (selectedType === 'habit-tracker') {
                    finalState = { habits: habitsList };
                  } else if (selectedType === 'api-checker') {
                    finalState = { url: apiUrl, logs: apiLogs };
                  } else if (selectedType === 'margin-calculator') {
                    finalState = { mau: mauVal, price: priceVal, gateway: selectedGateway };
                  } else if (selectedType === 'markdown-notes') {
                    finalState = { text: notesContent };
                  }

                  const art: CustomArtifact = {
                    id: `art-${Date.now()}`,
                    name: finalName,
                    type: selectedType,
                    accentColor: selectedColor,
                    blueprintName: blueprints.find(b => b.type === selectedType)?.name || 'Basic Widget',
                    state: finalState,
                    createdAt: new Date().toLocaleDateString()
                  };
                  onShareArtifact(art);
                }}
                className={`py-1 px-2.5 bg-[#0e1014] hover:bg-zinc-850 rounded-lg text-[10px] flex items-center gap-1 border border-border/30 text-zinc-300 hover:text-white transition-all`}
              >
                <Share2 className="w-3 h-3 text-primary shrink-0" />
                <span>Share blueprint to feed</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
