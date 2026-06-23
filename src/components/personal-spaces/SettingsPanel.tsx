import React from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/components';
import { PersonSpace } from '../../types';

interface SettingsPanelProps {
  activeSpace: PersonSpace;
  workspaceSubTab: 'notes' | 'tasks' | 'automation';
  // Notes props
  handleNotesTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // Tasks props
  newTaskTitle: string;
  setNewTaskTitle: (val: string) => void;
  handleAddTaskSubmit: (e: React.FormEvent) => void;
  handleToggleTask: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => void;
  // Automations props
  automations: { id: string; trigger: string; action: string; target: string; active: boolean }[];
  newAutoTrigger: string;
  setNewAutoTrigger: (val: string) => void;
  newAutoAction: string;
  setNewAutoAction: (val: string) => void;
  newAutoTarget: string;
  setNewAutoTarget: (val: string) => void;
  handleAddAutomationRuleSubmit: (e: React.FormEvent) => void;
  toggleAutomationActive: (id: string) => void;
  deleteAutomationRule: (id: string) => void;
}

export default function SettingsPanel({
  activeSpace,
  workspaceSubTab,
  handleNotesTextChange,
  newTaskTitle,
  setNewTaskTitle,
  handleAddTaskSubmit,
  handleToggleTask,
  handleTaskDelete,
  automations,
  newAutoTrigger,
  setNewAutoTrigger,
  newAutoAction,
  setNewAutoAction,
  newAutoTarget,
  setNewAutoTarget,
  handleAddAutomationRuleSubmit,
  toggleAutomationActive,
  deleteAutomationRule
}: SettingsPanelProps) {
  return (
    <div className="w-full">
      {/* TAB 2: RICH PERSISTENT NOTES */}
      {workspaceSubTab === 'notes' && (
        <div className="bg-card/45 border border-border/80 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-border/25">
            <div className="text-left">
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
            <div className="text-left">
              <h4 className="text-sm md:text-base font-black text-white">Space Checkpoint Tasks</h4>
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
              className="flex-1 text-xs h-10 px-4 bg-[#040507] border border-border/60 rounded-xl focus:border-zinc-500 outline-none text-foreground"
            />
            <Button type="submit" size="sm" className="h-10 px-5 text-xs font-bold font-sans cursor-pointer rounded-xl shrink-0">
              Add Checkpoint
            </Button>
          </form>

          {/* LIST MAP */}
          <div className="space-y-3">
            {(!activeSpace.tasks || activeSpace.tasks.length === 0) ? (
              <div className="py-12 bg-zinc-900/10 border border-dashed border-border/45 rounded-xl text-center text-xs text-zinc-500 font-sans select-none">
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
                    <span className={`text-xs font-medium font-sans text-left ${tsk.completed ? 'line-through text-zinc-500 font-normal' : 'text-zinc-250'}`}>
                      {tsk.title}
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleTaskDelete(tsk.id); }}
                    className="text-zinc-650 hover:text-red-450 cursor-pointer p-0.5 bg-transparent border-none shrink-0"
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
            <div className="text-left">
              <h4 className="text-sm md:text-base font-black text-white">No-Code Workspace Automations</h4>
              <p className="text-[12px] text-muted-foreground mt-0.5">Configure localized triggers that synchronize files or alerts automatically.</p>
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/15 font-mono text-[9px] select-none">Edge Core v3</Badge>
          </div>

          {/* AUTOMATION Form */}
          <form onSubmit={handleAddAutomationRuleSubmit} className="grid sm:grid-cols-3 gap-6 p-5 md:p-6 bg-zinc-900/20 rounded-xl border border-border/40 text-left">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block">Trigger Source</span>
              <select
                value={newAutoTrigger}
                onChange={(e) => setNewAutoTrigger(e.target.value)}
                className="w-full text-xs h-10 px-3 bg-[#050608] border border-border rounded-lg outline-none text-zinc-350 focus:border-zinc-500 text-foreground"
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
                className="w-full text-xs h-10 px-3 bg-[#050608] border border-border rounded-lg outline-none text-zinc-350 focus:border-zinc-500 text-foreground"
              >
                <option value="AI summarizes code changes">AI summarizes code changes</option>
                <option value="Format source file with aesthetic spacing">Format source file with aesthetic spacing</option>
                <option value="Dispatch alert payload via local webhook">Dispatch alert payload via local webhook</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 block">Target Action</span>
              <select
                value={newAutoTarget}
                onChange={(e) => setNewAutoTarget(e.target.value)}
                className="w-full text-xs h-10 px-3 bg-[#050608] border border-border rounded-lg outline-none text-zinc-350 focus:border-zinc-500 text-foreground"
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
            <span className="text-[10px] font-mono font-extrabold text-zinc-400 block uppercase tracking-wider text-left">Assembled Active Rules Registry</span>
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
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap text-left leading-relaxed">
                      <span className="font-extrabold text-foreground">{aut.trigger}</span>
                      <span className="text-[10px] text-zinc-500">➜</span>
                      <span className="font-bold text-primary">{aut.action}</span>
                      <span className="text-[10px] text-zinc-500">➜</span>
                      <span className="font-semibold text-zinc-350">{aut.target}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleAutomationActive(aut.id)}
                      className={`text-[9px] uppercase font-mono font-extrabold px-2.5 py-1 border rounded cursor-pointer transition-colors bg-transparent ${
                        aut.active
                          ? 'border-emerald-500/20 text-emerald-450 hover:bg-emerald-500/5'
                          : 'border-zinc-700 text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {aut.active ? "ENABLED" : "PAUSED"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAutomationRule(aut.id)}
                      className="text-zinc-650 hover:text-red-400 cursor-pointer p-0.5 bg-transparent border-none"
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
  );
}
