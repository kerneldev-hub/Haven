import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, FileCode, CheckCircle2, LayoutGrid, Eye, EyeOff, Plus, Trash2, 
  Save, Play, CheckCircle, PlusCircle, HelpCircle, FileText, ChevronLeft, ChevronRight, Zap,
  MessageSquare, Search, Sparkles, BookOpen, Volume2, ShieldAlert, Users, Send, Check, Settings2
} from 'lucide-react';
import { PersonSpace } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/components';

interface PersonalSpacesProps {
  spaces: PersonSpace[];
  activeSpaceId: string;
  setActiveSpaceId: (id: string) => void;
  syncSpaces: (updated: PersonSpace[]) => void;
  automations: { id: string; trigger: string; action: string; target: string; active: boolean }[];
  setAutomations: React.Dispatch<React.SetStateAction<{ id: string; trigger: string; action: string; target: string; active: boolean }[]>>;
}

export default function PersonalSpaces({
  spaces,
  activeSpaceId,
  setActiveSpaceId,
  syncSpaces,
  automations,
  setAutomations
}: PersonalSpacesProps) {
  const activeSpace = spaces.find(s => s.id === activeSpaceId) || spaces[0] || {
    id: 'space-web',
    name: 'Default Space',
    desc: 'Workspace template',
    files: { 'index.ts': '// Active code files' },
    notes: 'Click custom elements of the Workspace tab to add details.',
    tasks: [],
    connectedApps: []
  };

  const [workspaceSubTab, setWorkspaceSubTab] = useState<'files' | 'notes' | 'tasks' | 'automation'>('files');
  const [selectedFileName, setSelectedFileName] = useState<string>(() => {
    return Object.keys(activeSpace.files)[0] || 'index.ts';
  });

  // Sidebar visibility flags
  const [showSpacesList, setShowSpacesList] = useState(true);
  const [showFilesList, setShowFilesList] = useState(true);

  // Buffer state for file edits
  const [fileContentBuffer, setFileContentBuffer] = useState(() => {
    return activeSpace.files[selectedFileName] || '';
  });
  const [isEditingFile, setIsEditingFile] = useState(false);

  // Companion AI states
  const [aiCompanionResponse, setAiCompanionResponse] = useState<string>('Select an analytics routine to compile file context.');
  const [aiContextLoading, setAiContextLoading] = useState(false);

  // Form states
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [spaceFormName, setSpaceFormName] = useState('');
  const [spaceFormDesc, setSpaceFormDesc] = useState('');

  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [fileFormName, setFileFormName] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Automation rules
  const [newAutoTrigger, setNewAutoTrigger] = useState('When file is modified');
  const [newAutoAction, setNewAutoAction] = useState('AI summarizes code changes');
  const [newAutoTarget, setNewAutoTarget] = useState('Draft note in Space');

  // Sync state with selected file
  useEffect(() => {
    setFileContentBuffer(activeSpace.files[selectedFileName] || '');
    setIsEditingFile(false);
    setAiCompanionResponse(`Workspace context locked on: "${selectedFileName}". Click companion tools below to optimize or explain logic.`);
  }, [selectedFileName, activeSpaceId]);

  // Space logic
  const handleCreateSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceFormName.trim()) return;
    const newId = `space-${Date.now()}`;
    const newSpace: PersonSpace = {
      id: newId,
      name: spaceFormName.trim(),
      desc: spaceFormDesc.trim() || 'Custom independent project node.',
      files: {
        'index.tsx': `// Welcome to the workspace. Write modular clean React components here.\nexport default function Widget() {\n  return <div>Component loaded.</div>;\n}`
      },
      notes: 'Initial workspace draft initialized.',
      tasks: [
        { id: `t-${newId}-1`, title: 'Define workspace routing properties', completed: false }
      ],
      connectedApps: []
    };
    const updatedSpaces = [...spaces, newSpace];
    syncSpaces(updatedSpaces);
    setActiveSpaceId(newId);
    setSelectedFileName('index.tsx');
    setSpaceFormName('');
    setSpaceFormDesc('');
    setIsCreatingSpace(false);
  };

  const handleSelectSpace = (id: string) => {
    setActiveSpaceId(id);
    const sp = spaces.find(s => s.id === id) || spaces[0];
    if (sp) {
      const firstFile = Object.keys(sp.files)[0] || 'index.tsx';
      setSelectedFileName(firstFile);
    }
  };

  const handleDeleteSpace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (spaces.length <= 1) return;
    const filtered = spaces.filter(s => s.id !== id);
    syncSpaces(filtered);
    if (activeSpaceId === id) {
      setActiveSpaceId(filtered[0].id);
      const firstFile = Object.keys(filtered[0].files)[0] || 'index.tsx';
      setSelectedFileName(firstFile);
    }
  };

  // File logic
  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileFormName.trim()) return;
    const cleanName = fileFormName.trim();
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          files: {
            ...s.files,
            [cleanName]: `// Created automatically: ${cleanName}\n`
          }
        };
      }
      return s;
    });
    syncSpaces(updated);
    setSelectedFileName(cleanName);
    setFileFormName('');
    setIsCreatingFile(false);
  };

  const handleDeleteFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fileKeys = Object.keys(activeSpace.files);
    if (fileKeys.length <= 1) {
      alert("At least one workspace file must remain active.");
      return;
    }
    const updatedFiles = { ...activeSpace.files };
    delete updatedFiles[fileName];
    
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return { ...s, files: updatedFiles };
      }
      return s;
    });
    syncSpaces(updated);
    if (selectedFileName === fileName) {
      const keys = Object.keys(updatedFiles);
      setSelectedFileName(keys[0]);
    }
  };

  const handleSaveFileContent = () => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          files: {
            ...s.files,
            [selectedFileName]: fileContentBuffer
          }
        };
      }
      return s;
    });
    syncSpaces(updated);
    setIsEditingFile(false);
  };

  const handleNotesTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return { ...s, notes: e.target.value };
      }
      return s;
    });
    syncSpaces(updated);
  };

  // Checklist tasks
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `tk-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false
    };
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          tasks: [...(s.tasks || []), newTask]
        };
      }
      return s;
    });
    syncSpaces(updated);
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          tasks: (s.tasks || []).map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return s;
    });
    syncSpaces(updated);
  };

  const handleTaskDelete = (taskId: string) => {
    const updated = spaces.map(s => {
      if (s.id === activeSpaceId) {
        return {
          ...s,
          tasks: (s.tasks || []).filter(t => t.id !== taskId)
        };
      }
      return s;
    });
    syncSpaces(updated);
  };

  // Automations trigger rule
  const handleAddAutomationRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: `rule-${Date.now()}`,
      trigger: newAutoTrigger,
      action: newAutoAction,
      target: newAutoTarget,
      active: true
    };
    setAutomations(prev => [...prev, newRule]);
  };

  const toggleAutomationActive = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAutomationRule = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  // Companion trigger actions
  const handleTriggerAICompanion = (actionType: string) => {
    setAiContextLoading(true);
    setAiCompanionResponse("Analyzing workspace elements...");
    
    setTimeout(() => {
      if (actionType === 'optimize') {
        setAiCompanionResponse(`[OPT ANALYSIS for ${selectedFileName}]:
1. Cache state handlers into lazy-loaded hooks.
2. Memoize nested callback structures to prevent re-renders.
3. Optimize CSS classes to match Inter typography tracking.`);
      } else if (actionType === 'unit-test') {
        setAiCompanionResponse(`[TEST SUITE compiled for ${selectedFileName}]:
describe("Workspace File Parser", () => {
  it("verifies safe initialization", () => {
    const parsed = fileContentBuffer;
    expect(parsed).toBeDefined();
  });
});`);
      } else {
        setAiCompanionResponse(`[CODE SUMMARY REPORT]:
- Architecture: Standard Modular layout
- File Weight: ${fileContentBuffer.length} chars
- Dependents: 1 sibling link
- Recommendations: Keep functions pure.`);
      }
      setAiContextLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-8 text-left">
      {/* SECTIONS DIVIDER PANEL */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 md:p-8 bg-card/50 border border-border/40 rounded-2xl">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-550 uppercase mb-1.5 block">ACTIVE WORKPLACE CONSOLE</span>
            <h3 className="text-sm md:text-base font-black text-foreground">
              Current Space: <span className="text-primary font-extrabold">{activeSpace.name}</span>
            </h3>
          </div>
          <span className="hidden sm:inline text-zinc-800">|</span>
          
          <button 
            onClick={() => setShowSpacesList(!showSpacesList)}
            className="p-1.5 px-4 bg-[#0c0d10] hover:bg-zinc-900 border border-border/45 text-[11px] font-extrabold text-zinc-300 rounded-lg transition-colors cursor-pointer"
          >
            {showSpacesList ? "Hide Registry Sidebar" : "Show Registry Sidebar"}
          </button>
        </div>

        {/* WORKSPACE SUB TABS NAV */}
        <div className="flex gap-1.5 bg-[#090a0c] p-1.5 border border-border/30 rounded-xl select-none">
          {[
            { id: 'files', label: '📂 Workspace Files' },
            { id: 'notes', label: '📝 Project Notes' },
            { id: 'tasks', label: '📋 Tasks Checklist' },
            { id: 'automation', label: '⚙ Automations' }
          ].map((sub) => {
            const isSel = workspaceSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setWorkspaceSubTab(sub.id as any)}
                className={`py-2 px-3.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                  isSel ? 'bg-primary text-background shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: COLLAPSIBLE SPACES LIST */}
        {showSpacesList && (
          <div className="lg:col-span-3 bg-card/45 border border-border/80 rounded-2xl p-5 md:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/20">
              <span className="text-[10.5px] tracking-wider font-mono font-extrabold text-zinc-400">PROJECT REGISTRY</span>
              <button 
                onClick={() => setIsCreatingSpace(true)} 
                className="text-primary hover:text-white cursor-pointer"
                title="Create a custom Independent Project Space"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* SPACE CREATION DRAWER INLINE */}
            {isCreatingSpace && (
              <form onSubmit={handleCreateSpaceSubmit} className="p-3.5 bg-[#050608] border border-border/80 rounded-xl space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase">Space Title</span>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Next.js Sandbox" 
                    value={spaceFormName}
                    onChange={(e) => setSpaceFormName(e.target.value)}
                    className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase">Objective</span>
                  <input 
                    type="text" 
                    placeholder="Brief description..." 
                    value={spaceFormDesc}
                    onChange={(e) => setSpaceFormDesc(e.target.value)}
                    className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-primary outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingSpace(false)} 
                    className="text-[10px] text-zinc-500 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <Button type="submit" size="sm" className="h-7 text-[10px] font-bold">Launch Node</Button>
                </div>
              </form>
            )}

            {/* REGISTERED SPACES ITERATION */}
            <div className="space-y-2">
              {spaces.map((sp) => {
                const isSelected = sp.id === activeSpaceId;
                return (
                  <div 
                    key={sp.id}
                    onClick={() => handleSelectSpace(sp.id)}
                    className={`p-3 rounded-xl border cursor-pointer select-none text-left flex items-start justify-between group transition-colors ${
                      isSelected 
                        ? 'bg-zinc-900/40 border-foreground/50' 
                        : 'bg-[#0a0c0d] border-border/30 hover:border-zinc-500/20'
                    }`}
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <span className={`text-xs font-black block transition-colors ${isSelected ? 'text-primary' : 'text-zinc-300'}`}>{sp.name}</span>
                      <span className="text-[10px] text-zinc-500 font-sans block mt-0.5 line-clamp-1">{sp.desc}</span>
                    </div>

                    <button 
                      onClick={(e) => handleDeleteSpace(sp.id, e)}
                      disabled={spaces.length <= 1}
                      className="text-zinc-600 hover:text-red-400 p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MIDDLE CANVAS LAYOUT CONTENT */}
        <div className={`${showSpacesList ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-8`}>
          
          {/* TAB 1: FILES LIST + CODE WORKSPACE EDITOR */}
          {workspaceSubTab === 'files' && (
            <div className="grid md:grid-cols-12 gap-8">
              
              {/* Collapsible Files Column (col-span-3) */}
              {showFilesList && (
                <div className="md:col-span-3 bg-card/45 border border-border/80 rounded-2xl p-5 md:p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-border/20">
                    <span className="text-[10.5px] tracking-wider font-mono font-extrabold text-zinc-400 uppercase">FILES TREE</span>
                    <button onClick={() => setIsCreatingFile(true)} className="text-primary hover:text-white cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* FILE CREATION INLINEPOP */}
                  {isCreatingFile && (
                    <form onSubmit={handleCreateFileSubmit} className="p-3 bg-[#050608] border border-border/60 rounded-xl space-y-3">
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Component.tsx" 
                        value={fileFormName}
                        onChange={(e) => setFileFormName(e.target.value)}
                        className="w-full text-xs h-9 px-3 bg-background border border-border/60 rounded-lg focus:border-primary outline-none"
                      />
                      <div className="flex gap-2.5 justify-end">
                        <button type="button" onClick={() => setIsCreatingFile(false)} className="text-[10px] text-zinc-550 font-bold hover:text-zinc-200">Cancel</button>
                        <button type="submit" className="text-[10px] text-primary font-black">Create</button>
                      </div>
                    </form>
                  )}

                  {/* FILES MAP */}
                  <div className="space-y-1.5">
                    {Object.keys(activeSpace.files || {}).map((f) => {
                      const isSelected = selectedFileName === f;
                      return (
                        <div 
                          key={f}
                          onClick={() => setSelectedFileName(f)}
                          className={`py-2 px-3 rounded-lg text-xs cursor-pointer select-none flex items-center justify-between group transition-colors ${
                            isSelected 
                              ? 'bg-zinc-800/15 text-primary border border-primary/20 font-bold' 
                              : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-1.5">
                            <FileCode className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="font-mono text-[11.5px] truncate">{f}</span>
                          </div>

                          <button 
                            onClick={(e) => handleDeleteFile(f, e)}
                            className="text-zinc-650 hover:text-red-450 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* HIGH CONTRAST SOLID CODE EDITOR (col-span-9) */}
              <div className={`${showFilesList ? 'md:col-span-9' : 'md:col-span-12'} bg-[#07080a]/95 border border-border/85 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[500px] font-mono`}>
                <div className="grid xl:grid-cols-4 gap-8">
                  
                  {/* TextArea Custom IDE */}
                  <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between border-b border-border/20 pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse"></span>
                        <span className="text-xs text-zinc-300 font-bold uppercase tracking-wider">{selectedFileName}</span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        {isEditingFile ? (
                          <span className="text-[9px] font-mono text-amber-400 font-extrabold uppercase bg-amber-500/10 border border-amber-500/15 px-2.5 py-1 rounded">MODIFIED</span>
                        ) : (
                          <span className="text-[9px] font-mono text-emerald-455 font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded">SYNCED</span>
                        )}

                        <Button 
                          size="sm"
                          onClick={handleSaveFileContent}
                          disabled={!isEditingFile}
                          className="h-8 text-[11px] font-mono font-bold bg-primary text-background hover:bg-sky-400 cursor-pointer rounded-lg px-3"
                        >
                          <Save className="w-3.5 h-3.5 mr-1.5" />
                          Save File Contents
                        </Button>
                      </div>
                    </div>

                    <textarea 
                      value={fileContentBuffer}
                      onChange={(e) => {
                        setFileContentBuffer(e.target.value);
                        setIsEditingFile(true);
                      }}
                      className="w-full text-xs p-4 leading-relaxed outline-none resize-none bg-[#040507] text-zinc-200 border border-border/65 focus:border-zinc-500 rounded-xl h-[340px] font-mono"
                      spellCheck="false"
                    />

                    {/* Active Presences */}
                    <div className="p-4 bg-[#0a0c0e] rounded-xl flex items-center justify-between text-xs border border-border/20 font-sans">
                      <span className="text-zinc-500 font-medium">Workspace Active Collaborators:</span>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-350">
                        <Users className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                        <span>operator_node</span>
                      </div>
                    </div>
                  </div>

                  {/* Context Companion AI Panel */}
                  <div className="xl:col-span-1 bg-muted/20 border border-border/50 rounded-xl p-5 md:p-6 flex flex-col justify-between font-sans space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Workspace AI Guide
                        </span>
                        <Badge variant="outline" className="text-[8px] font-mono font-extrabold">READY</Badge>
                      </div>

                      <div className="bg-[#050607] rounded-lg p-3 text-[10.5px] leading-relaxed select-text font-mono border border-border/40 text-zinc-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap">
                        {aiContextLoading ? (
                          <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <div className="w-5 h-5 rounded-full border-t-2 border-primary animate-spin"></div>
                            <span className="text-[9px] text-zinc-500 font-sans">Structuring context...</span>
                          </div>
                        ) : (
                          aiCompanionResponse
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500 font-mono">CODE CHECKS</span>
                      <button
                        onClick={() => handleTriggerAICompanion('optimize')}
                        className="w-full text-left p-2.5 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between font-medium text-zinc-300"
                      >
                        <span>Optimize Variables</span>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      <button
                        onClick={() => handleTriggerAICompanion('unit-test')}
                        className="w-full text-left p-2.5 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between font-medium text-zinc-300"
                      >
                        <span>Formulate Test Suite</span>
                        <FileText className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button
                        onClick={() => handleTriggerAICompanion('summary')}
                        className="w-full text-left p-2.5 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between font-medium text-zinc-300"
                      >
                        <span>File Architecture Report</span>
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>
                  </div>

                </div>

                <div className="flex justify-between items-center bg-[#050607]/50 border-t border-border/10 pt-2.5 text-[10px] text-zinc-500 mt-4">
                  <span>Lines: {fileContentBuffer.split('\n').length}</span>
                  <span>Isolation boundary active</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RICH PERSISTENT NOTES */}
          {workspaceSubTab === 'notes' && (
            <div className="bg-card/45 border border-border/80 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-border/25">
                <div>
                  <h4 className="text-sm md:text-base font-black text-foreground">Project Notes Canvas</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Keep persistent records paired directly with your active space node.</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[9px] font-bold">MARKDOWN INCLUDED</Badge>
              </div>

              <textarea 
                value={activeSpace.notes}
                onChange={handleNotesTextChange}
                rows={12}
                className="w-full text-xs leading-relaxed p-5 bg-[#040507] border border-border/60 focus:border-zinc-500 rounded-xl outline-none text-zinc-300 font-sans shadow-inner"
                placeholder="Write your custom notes, roadmap points, or API blueprints here..."
              />
            </div>
          )}

          {/* TAB 3: CHECKLIST TASKS */}
          {workspaceSubTab === 'tasks' && (
            <div className="bg-card/45 border border-border/80 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-border/25">
                <div>
                  <h4 className="text-sm md:text-base font-black text-[#ffffff]">Space Checkpoint Tasks</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Log milestones for tracking workflow completion across your team.</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-mono text-[10px]">
                  {activeSpace.tasks?.length || 0} Checkpoints
                </Badge>
              </div>

              {/* NEW TASK INLINE FORM */}
              <form onSubmit={handleAddTaskSubmit} className="flex gap-3">
                <input 
                  type="text" 
                  required 
                  placeholder="Task title (e.g. Test sqlite connection schemas)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 text-xs h-10 px-4 bg-[#040507] border border-border/60 rounded-xl focus:border-zinc-500 outline-none"
                />
                <Button type="submit" size="sm" className="h-10 px-5 text-xs font-bold font-sans cursor-pointer rounded-xl">
                  Add Checkpoint
                </Button>
              </form>

              {/* LIST MAP */}
              <div className="space-y-3">
                {(!activeSpace.tasks || activeSpace.tasks.length === 0) ? (
                  <div className="py-12 bg-zinc-900/10 border border-dashed border-border/45 rounded-xl text-center text-xs text-zinc-500 font-sans">
                    No checkpoints initialized yet. Add one above.
                  </div>
                ) : (
                  activeSpace.tasks.map((tsk) => (
                    <div 
                      key={tsk.id}
                      onClick={() => handleToggleTask(tsk.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-colors ${
                        tsk.completed 
                          ? 'bg-[#0f1712] border-emerald-500/15 text-zinc-500' 
                          : 'bg-[#0a0b0d] border-border/30 text-foreground hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={tsk.completed} 
                          onChange={() => {}} 
                          className="w-4 h-4 rounded border-border text-emerald-400 focus:ring-emerald-400 pointer-events-none"
                        />
                        <span className={`text-xs font-medium font-sans ${tsk.completed ? 'line-through text-zinc-500 font-normal' : 'text-zinc-200'}`}>
                          {tsk.title}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTaskDelete(tsk.id); }}
                        className="text-zinc-650 hover:text-red-400 cursor-pointer p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

             {/* TAB 4: WORKSPACE AUTOMATION RULES */}
          {workspaceSubTab === 'automation' && (
            <div className="bg-card/45 border border-border/80 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-border/25">
                <div>
                  <h4 className="text-sm md:text-base font-black text-white">No-Code Workspace Automations</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Configure localized triggers that synchronize files or alerts automatically.</p>
                </div>
                <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/15 font-mono text-[9px]">Edge Core v3</Badge>
              </div>

              {/* AUTOMATION Form */}
              <form onSubmit={handleAddAutomationRuleSubmit} className="grid sm:grid-cols-3 gap-6 p-5 md:p-6 bg-zinc-900/20 rounded-xl border border-border/40 text-left">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block">Trigger Source</span>
                  <select 
                    value={newAutoTrigger}
                    onChange={(e) => setNewAutoTrigger(e.target.value)}
                    className="w-full text-xs h-10 px-3 bg-[#050608] border border-border rounded-lg outline-none text-zinc-350 focus:border-zinc-500"
                  >
                    <option value="When file is modified">When file is modified</option>
                    <option value="When task is completed">When task is completed</option>
                    <option value="On user login event">On user login event</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block">Assisted Action</span>
                  <select 
                    value={newAutoAction}
                    onChange={(e) => setNewAutoAction(e.target.value)}
                    className="w-full text-xs h-10 px-3 bg-[#050608] border border-border rounded-lg outline-none text-zinc-350 focus:border-zinc-500"
                  >
                    <option value="AI summarizes code changes">AI summarizes code changes</option>
                    <option value="Format source file with aesthetic spacing">Format source file with aesthetic spacing</option>
                    <option value="Dispatch alert payload via local webhook">Dispatch alert payload via local webhook</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block">Target Target</span>
                  <select 
                    value={newAutoTarget}
                    onChange={(e) => setNewAutoTarget(e.target.value)}
                    className="w-full text-xs h-10 px-3 bg-[#050608] border border-border rounded-lg outline-none text-zinc-350 focus:border-zinc-500"
                  >
                    <option value="Draft note in Space">Draft note in Space</option>
                    <option value="Commit automatic checkpoint">Commit automatic checkpoint</option>
                    <option value="Append real-time telemetry feed">Append real-time telemetry feed</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end pt-1">
                  <Button type="submit" size="sm" className="h-10 px-5 text-xs font-bold cursor-pointer rounded-xl">
                    Assemble Automation Trigger
                  </Button>
                </div>
              </form>

              {/* CURRENT AUTOMATIONS RULES LIST */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-extrabold text-zinc-400 block uppercase tracking-wider">Assembled Active Rules Registry</span>
                {automations.length === 0 ? (
                  <div className="py-8 bg-zinc-950/10 border border-dashed border-border/20 rounded-xl text-center text-xs text-zinc-500">
                    No active automation pipeline rules set yet.
                  </div>
                ) : (
                  automations.map((aut) => (
                    <div 
                      key={aut.id}
                      className={`p-4 rounded-xl border flex items-center justify-between text-left text-xs transition-opacity ${
                        aut.active ? 'bg-[#0a0b0f] border-border/75' : 'bg-[#0f1013]/55 border-border/20 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-foreground">{aut.trigger}</span>
                          <span className="text-[10px] text-zinc-500">➜</span>
                          <span className="font-bold text-primary">{aut.action}</span>
                          <span className="text-[10px] text-zinc-500">➜</span>
                          <span className="font-semibold text-zinc-300">{aut.target}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleAutomationActive(aut.id)}
                          className={`text-[9px] uppercase font-mono font-extrabold px-2.5 py-1 border rounded cursor-pointer ${
                            aut.active 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
                              : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {aut.active ? "ENABLED" : "PAUSED"}
                        </button>
                        <button 
                          onClick={() => deleteAutomationRule(aut.id)}
                          className="text-zinc-650 hover:text-red-400 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
