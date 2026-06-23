import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PersonSpace } from '../types';
import { Button } from './ui/components';

// Modular Sub-components Import
import EditorPanel from './personal-spaces/EditorPanel';
import AIContextPanel from './personal-spaces/AIContextPanel';
import SettingsPanel from './personal-spaces/SettingsPanel';

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
    return Object.keys(activeSpace.files)[0] || 'index.tsx';
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

  // Space creation
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

  // File creation and deletion
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

  // Automations trigger rules
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

  // Companion AI analyzer trigger routines
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
      {/* SECTIONS LAYOUT TABS DIVISION NAVIGATION */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 md:p-8 bg-card/50 border border-border/40 rounded-2xl">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] tracking-widest font-mono font-bold text-zinc-550 uppercase mb-1.5 block">ACTIVE WORKPLACE CONSOLE</span>
            <h3 className="text-sm md:text-base font-black text-foreground">
              Current Space: <span className="text-primary font-extrabold">{activeSpace.name}</span>
            </h3>
          </div>
          <span className="hidden sm:inline text-zinc-805">|</span>

          <button
            onClick={() => setShowSpacesList(!showSpacesList)}
            className="p-1.5 px-4 bg-[#0c0d10] hover:bg-zinc-900 border border-border/45 text-[11px] font-extrabold text-zinc-300 rounded-lg transition-colors cursor-pointer"
          >
            {showSpacesList ? "Hide Registry Sidebar" : "Show Registry Sidebar"}
          </button>
        </div>

        {/* MAIN NAVIGATION TAB CONTROLLER */}
        <div className="flex gap-1.5 bg-[#090a0c] p-1.5 border border-border/30 rounded-xl select-none flex-wrap">
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
                onClick={() => {
                  setWorkspaceSubTab(sub.id as any);
                  if (sub.id !== 'files') {
                    // Turn off files tree and editor list secondary flags to save layout space
                    setShowFilesList(false);
                  } else {
                    setShowFilesList(true);
                  }
                }}
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
        {/* LEFT COLLAPSIBLE PROJECTS REGISTRY */}
        {showSpacesList && (
          <div className="lg:col-span-3 bg-card/45 border border-border/80 rounded-2xl p-5 md:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/20">
              <span className="text-[10.5px] tracking-wider font-mono font-extrabold text-zinc-400">PROJECT REGISTRY</span>
              <button
                onClick={() => setIsCreatingSpace(true)}
                className="text-primary hover:text-white cursor-pointer bg-transparent border-none p-0"
                title="Create a custom Independent Project Space"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* SPACE CREATION INLINEPOP */}
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
                    className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase">Objective</span>
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={spaceFormDesc}
                    onChange={(e) => setSpaceFormDesc(e.target.value)}
                    className="w-full text-xs h-8 px-2.5 bg-background border border-border rounded focus:border-primary outline-none text-foreground"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreatingSpace(false)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-200 bg-transparent border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button type="submit" size="sm" className="h-7 text-[10px] font-bold">Launch Node</Button>
                </div>
              </form>
            )}

            {/* SPACES MANAGE BOARD */}
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
                      className="text-zinc-600 hover:text-red-400 p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RIGHT INTERACTIVE CONTENT CANVAS AREA */}
        <div className={`${showSpacesList ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-8 w-full`}>
          {workspaceSubTab === 'files' ? (
            <EditorPanel
              activeSpace={activeSpace}
              selectedFileName={selectedFileName}
              setSelectedFileName={setSelectedFileName}
              fileContentBuffer={fileContentBuffer}
              setFileContentBuffer={setFileContentBuffer}
              isEditingFile={isEditingFile}
              setIsEditingFile={setIsEditingFile}
              handleSaveFileContent={handleSaveFileContent}
              showFilesList={showFilesList}
              isCreatingFile={isCreatingFile}
              setIsCreatingFile={setIsCreatingFile}
              fileFormName={fileFormName}
              setFileFormName={setFileFormName}
              handleCreateFileSubmit={handleCreateFileSubmit}
              handleDeleteFile={handleDeleteFile}
            >
              {/* Inject the AI Context Companion directly into the editor column panel */}
              <AIContextPanel
                aiCompanionResponse={aiCompanionResponse}
                aiContextLoading={aiContextLoading}
                handleTriggerAICompanion={handleTriggerAICompanion}
              />
            </EditorPanel>
          ) : (
            <SettingsPanel
              activeSpace={activeSpace}
              workspaceSubTab={workspaceSubTab}
              handleNotesTextChange={handleNotesTextChange}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              handleAddTaskSubmit={handleAddTaskSubmit}
              handleToggleTask={handleToggleTask}
              handleTaskDelete={handleTaskDelete}
              automations={automations}
              newAutoTrigger={newAutoTrigger}
              setNewAutoTrigger={setNewAutoTrigger}
              newAutoAction={newAutoAction}
              setNewAutoAction={setNewAutoAction}
              newAutoTarget={newAutoTarget}
              setNewAutoTarget={setNewAutoTarget}
              handleAddAutomationRuleSubmit={handleAddAutomationRuleSubmit}
              toggleAutomationActive={toggleAutomationActive}
              deleteAutomationRule={deleteAutomationRule}
            />
          )}
        </div>
      </div>
    </div>
  );
}
