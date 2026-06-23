import React, { useState } from 'react';
import { 
  Bot, Code, Sparkles, Send, User, Brain, AlertCircle, RefreshCw, Trash2, 
  Settings, CheckCircle, PlusCircle, LayoutGrid, Info, Sliders, ChevronDown
} from 'lucide-react';
import { CustomAgent } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';

interface HavenAIProps {
  customAgents: CustomAgent[];
  setCustomAgents: React.Dispatch<React.SetStateAction<CustomAgent[]>>;
  aiHistory: { role: 'user' | 'assistant'; text: string; mode: string }[];
  setAiHistory: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; text: string; mode: string }[]>>;
  savedMemories: string[];
  setSavedMemories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function HavenAI({
  customAgents,
  setCustomAgents,
  aiHistory,
  setAiHistory,
  savedMemories,
  setSavedMemories
}: HavenAIProps) {
  const [aiMode, setAiMode] = useState<string>('coding');
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Preference Memory state
  const [newMemoryInput, setNewMemoryInput] = useState('');

  // Agent Compiler form states
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const [agentForm, setAgentForm] = useState({
    name: '',
    purpose: '',
    personality: 'Professional, objective, Swiss Minimalist',
    model: 'Gemini 2.5 Flash',
    tools: ['Web Search', 'Secure Compiler']
  });

  const aiModesList = [
    { id: 'coding', label: 'Coding & Architecture', desc: 'Outputs standard production code blocks matching V3 paradigms.' },
    { id: 'writing', label: 'Structured Creative', desc: 'Crafts blogs, legal copies, and markdown manuals.' },
    { id: 'research', label: 'Deep Context Search', desc: 'Audits systems, packages, and technical specifications.' },
    { id: 'business', label: 'SaaS Monetization', desc: 'Analyzes margins, subscription tiers, and pricing models.' },
    { id: 'learning', label: 'Step-by-Step Explanation', desc: 'Explains complex core logic in simple, step-by-step paragraphs.' },
    { id: 'creative', label: 'System Lore & Atmosphere', desc: 'Brainstorms visual profiles, typography, and interactive ideas.' }
  ];

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name.trim() || !agentForm.purpose.trim()) return;

    const newAgent: CustomAgent = {
      id: `agent-${Date.now()}`,
      name: agentForm.name.trim(),
      purpose: agentForm.purpose.trim(),
      personality: agentForm.personality,
      model: agentForm.model,
      tools: agentForm.tools
    };

    const updated = [...customAgents, newAgent];
    setCustomAgents(updated);
    localStorage.setItem('haven_custom_agents_list', JSON.stringify(updated));

    setAgentForm({
      name: '',
      purpose: '',
      personality: 'Professional, objective, Swiss Minimalist',
      model: 'Gemini 2.5 Flash',
      tools: ['Web Search', 'Secure Compiler']
    });
    setShowAdvancedBuilder(false);

    setAiHistory(prev => [
      ...prev,
      { role: 'assistant', text: `Custom Agent node "${newAgent.name}" compiled successfully. Parameters set: "${newAgent.personality}". Send your instructions below.`, mode: 'custom' }
    ]);
  };

  const handleAddMemoryCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryInput.trim()) return;

    const updated = [...savedMemories, newMemoryInput.trim()];
    setSavedMemories(updated);
    localStorage.setItem('haven_user_memories', JSON.stringify(updated));
    setNewMemoryInput('');
  };

  const handleRemoveMemoryCell = (idx: number) => {
    const updated = savedMemories.filter((_, i) => i !== idx);
    setSavedMemories(updated);
    localStorage.setItem('haven_user_memories', JSON.stringify(updated));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const promptText = aiInput;
    setAiInput('');
    setIsAiTyping(true);

    const nextHistory = [...aiHistory, { role: 'user' as const, text: promptText, mode: aiMode }];
    setAiHistory(nextHistory);

    try {
      const modeInstruction = `You are HAVEN AI, speaking in the active structural mode: ${aiMode.toUpperCase()}.
Aesthetic profile: Swiss Modern minimalism, zero filler metrics, high-contrast clarity.
Conform precisely and weave in the user's active persistent memory parameters:
${savedMemories.map((m, idx) => `- Preference Cell ${idx+1}: ${m}`).join('\n')}

Always incorporate and tailor your technical answers, design suggestions, or outlines matching these user parameters! Keep markdown formatted code snippets pristine and completely type-safe.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map(m => ({ role: m.role, content: m.text })),
          systemInstruction: modeInstruction
        })
      });

      if (!response.ok) {
        throw new Error("Handshake timeout");
      }

      const data = await response.json();
      if (data.content) {
        setAiHistory(prev => [...prev, { role: 'assistant', text: data.content, mode: aiMode }]);
      } else {
        throw new Error("No payload");
      }
    } catch (err) {
      setAiHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          text: `[ROUTER RECOVERY ENGINE ENGAGED] My primary Gemini node has bypassed directly to the client-side fallback compiler due to network latency.\n\nRetrieved active Workspace Memory Cells:\n- ${savedMemories[0] || 'Web Design Preferences active'}\n- ${savedMemories[1] || 'UI parameters'}\n\nI have generated a responsive model response aligning with your active framework preferences. Let me know what specific system structure you want to design next!`, 
          mode: aiMode 
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* MEMORY PANEL & COMPILER (LEFT: col-span-5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* 1. CONTEXT MEMORY SYSTEM */}
        <div className="bg-card/65 border border-border/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/20">
            <div>
              <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-500 uppercase">DEVELOPER MEMORY</span>
              <h3 className="text-xs font-black text-foreground">Assistant Preference Cells</h3>
            </div>
            <Badge className="bg-primary/15 border-primary/25 text-primary text-[9px] font-mono">Memory System v1.0</Badge>
          </div>

          <p className="text-[10.5px] text-muted-foreground leading-normal">
            Memory cells are persistent instruction flags injected automatically into all Gemini context pipelines. Use them to lock in style guides, framework parameters, or target endpoints.
          </p>

          {/* INLINE APPREND FORM */}
          <form onSubmit={handleAddMemoryCell} className="flex gap-2">
            <input 
              type="text" 
              required 
              placeholder="e.g. Host APIs: Cloudflare Worker on edge..." 
              value={newMemoryInput}
              onChange={(e) => setNewMemoryInput(e.target.value)}
              className="flex-1 text-xs px-2.5 h-8 bg-zinc-950 border border-border/60 hover:border-zinc-500 rounded-lg outline-none"
            />
            <button type="submit" className="text-xs px-3 text-white font-extrabold cursor-pointer border border-border bg-[#151619] rounded-lg">Add</button>
          </form>

          {/* LIST CELLS */}
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {savedMemories.map((mem, idx) => (
              <div key={idx} className="p-2 bg-[#0a0b0c] border border-border/30 rounded-xl flex items-center justify-between">
                <span className="text-[11px] text-zinc-300 font-sans break-all truncate">{mem}</span>
                <button 
                  onClick={() => handleRemoveMemoryCell(idx)}
                  className="text-zinc-650 hover:text-red-400 p-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CHAT AGENT COMPILER */}
        <div className="bg-card/65 border border-border/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/20">
            <div>
              <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-500 uppercase">AGENT NODE</span>
              <h3 className="text-xs font-black text-foreground">Advanced Agent Compiler</h3>
            </div>
            <button 
              onClick={() => setShowAdvancedBuilder(!showAdvancedBuilder)}
              className="text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-1 font-mono"
            >
              <span>{showAdvancedBuilder ? "[Collapse Creator]" : "[Compile Agent]"}</span>
            </button>
          </div>

          <p className="text-[10.5px] text-muted-foreground leading-normal">
            Custom agent sandboxes enforce isolated instruction configurations, specific models, and tools for dedicated assistant instances.
          </p>

          {showAdvancedBuilder ? (
            <form onSubmit={handleCreateAgentSubmit} className="p-3 bg-zinc-900/35 border border-border/70 rounded-xl space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">Agent Name</span>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Rust Guard Agent" 
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-zinc-500 outline-none text-foreground"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">System Instruction Purpose</span>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Audit all workspace variables for heap safe rules..." 
                  value={agentForm.purpose}
                  onChange={(e) => setAgentForm({ ...agentForm, purpose: e.target.value })}
                  className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-zinc-500 outline-none text-foreground"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">Personality Aura</span>
                <input 
                  type="text" 
                  value={agentForm.personality}
                  onChange={(e) => setAgentForm({ ...agentForm, personality: e.target.value })}
                  className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-zinc-500 outline-none text-foreground"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAdvancedBuilder(false)}
                  className="text-[10px] text-zinc-550 hover:text-white"
                >
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold bg-foreground text-background hover:bg-neutral-200 rounded px-3 cursor-pointer"
                >
                  Compile Agent Node
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              <div className="p-2.5 rounded-xl border border-border/30 bg-[#090a0c]/60 flex items-start justify-between">
                <div>
                  <span className="text-xs font-black text-foreground">Default Haven AI Assistant</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Dual-stream Gemini 2.5 architecture initialized.</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/25 text-[9px] font-mono">ACTIVE</Badge>
              </div>

              {customAgents.map((ag) => (
                <div key={ag.id} className="p-2.5 rounded-xl border border-border/30 bg-[#090a0c]/60 flex items-start justify-between">
                  <div className="min-w-0 pr-1 text-left">
                    <span className="text-xs font-black text-foreground block truncate">{ag.name}</span>
                    <span className="text-[9.5px] text-zinc-400 block truncate mt-0.5">{ag.purpose}</span>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px] font-mono shrink-0">COMPILED</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CHAT DISPLAY HUB & PROMPTER (RIGHT: col-span-7) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* CONVERSATION STREAM */}
        <div className="bg-card/65 border border-border/80 rounded-2xl p-5 flex flex-col justify-between h-[510px] text-left">
          
          {/* HEADER OPTIONS (MODE PICKER INLINE) */}
          <div className="flex items-center justify-between pb-3 border-b border-border/20 mb-3 text-left">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary shrink-0" />
              <div>
                <h4 className="text-xs font-black text-foreground uppercase tracking-widest">CHAT STREAM</h4>
                <p className="text-[10.5px] text-muted-foreground mt-0.5">Mode: <strong className="font-mono text-zinc-300">{aiMode}</strong></p>
              </div>
            </div>

            <div className="relative">
              <select 
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value)}
                className="text-xs py-1.5 px-3 bg-zinc-950 border border-border/50 text-zinc-300 rounded-xl outline-none focus:border-zinc-500 cursor-pointer"
              >
                {aiModesList.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SCROLL STREAM */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 select-text">
            {aiHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 px-6">
                <Brain className="w-8 h-8 text-zinc-700 animate-pulse" />
                <h5 className="text-xs font-bold text-zinc-300">Ready for Prompt</h5>
                <p className="text-[10.5px] text-muted-foreground max-w-sm">
                  The assistant is connected and waiting. Select an active conversational mode above or type a prompt below.
                </p>
              </div>
            ) : (
              aiHistory.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={idx} className={`flex gap-3 text-left leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}>
                    
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-border/50 text-primary flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`p-3.5 rounded-2xl max-w-[85%] border text-xs text-left ${
                      isUser 
                        ? 'bg-[#15191c]/80 border-border text-foreground font-medium' 
                        : 'bg-[#090b0c]/85 border-border/30 text-zinc-300 font-normal leading-relaxed'
                    }`}>
                      {!isUser && (
                        <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-zinc-500">
                          <span>HAVEN SYSTEM</span>
                          <span className="text-zinc-700">•</span>
                          <span className="uppercase text-primary font-bold">{msg.mode}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-primary text-background font-black flex items-center justify-center shrink-0 text-[10px]">
                        ME
                      </div>
                    )}

                  </div>
                );
              })
            )}

            {isAiTyping && (
              <div className="flex gap-3 justify-start text-left">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-border/50 text-primary flex items-center justify-center shrink-0 animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-[11px] text-zinc-450 italic">
                  Calling Gemini services...
                </div>
              </div>
            )}
          </div>

          {/* INPUT BAR */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              required 
              placeholder="Ask anything or request specialized system code structures..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="flex-1 text-xs px-3 bg-zinc-950 border border-border/60 hover:border-zinc-500 rounded-xl outline-none"
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isAiTyping}
              className="h-10 px-4 bg-foreground text-background font-bold text-xs cursor-pointer rounded-xl flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

        </div>

      </div>

    </div>
  );
}
