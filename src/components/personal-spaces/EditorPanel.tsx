import React from 'react';
import { FileCode, Plus, Trash2, Save, Users } from 'lucide-react';
import { Button } from '../ui/components';
import { PersonSpace } from '../../types';

interface EditorPanelProps {
  activeSpace: PersonSpace;
  selectedFileName: string;
  setSelectedFileName: (name: string) => void;
  fileContentBuffer: string;
  setFileContentBuffer: (content: string) => void;
  isEditingFile: boolean;
  setIsEditingFile: (editing: boolean) => void;
  handleSaveFileContent: () => void;
  showFilesList: boolean;
  isCreatingFile: boolean;
  setIsCreatingFile: (creating: boolean) => void;
  fileFormName: string;
  setFileFormName: (name: string) => void;
  handleCreateFileSubmit: (e: React.FormEvent) => void;
  handleDeleteFile: (fileName: string, e: React.MouseEvent) => void;
  children: React.ReactNode; // For the AI Companion nested next to the editor
}

export default function EditorPanel({
  activeSpace,
  selectedFileName,
  setSelectedFileName,
  fileContentBuffer,
  setFileContentBuffer,
  isEditingFile,
  setIsEditingFile,
  handleSaveFileContent,
  showFilesList,
  isCreatingFile,
  setIsCreatingFile,
  fileFormName,
  setFileFormName,
  handleCreateFileSubmit,
  handleDeleteFile,
  children
}: EditorPanelProps) {
  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      {/* Collapsible Files Column */}
      {showFilesList && (
        <div className="md:col-span-3 bg-card/45 border border-border/80 rounded-2xl p-5 md:p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border/20">
            <span className="text-[10.5px] tracking-wider font-mono font-extrabold text-zinc-400 uppercase">FILES TREE</span>
            <button
              onClick={() => setIsCreatingFile(true)}
              className="text-primary hover:text-white cursor-pointer bg-transparent border-none p-0"
              title="Create new file"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* FILE CREATION INLINE */}
          {isCreatingFile && (
            <form onSubmit={handleCreateFileSubmit} className="p-3 bg-[#050608] border border-border/60 rounded-xl space-y-3">
              <input
                type="text"
                required
                placeholder="e.g. Component.tsx"
                value={fileFormName}
                onChange={(e) => setFileFormName(e.target.value)}
                className="w-full text-xs h-9 px-3 bg-background border border-border/60 rounded-lg focus:border-primary outline-none text-foreground"
              />
              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreatingFile(false)}
                  className="text-[10px] text-zinc-550 font-bold hover:text-zinc-200 bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="text-[10px] text-primary font-black bg-transparent border-none cursor-pointer">
                  Create
                </button>
              </div>
            </form>
          )}

          {/* FILES LIST */}
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
                    <span className="font-mono text-[11.5px] truncate text-left">{f}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteFile(f, e)}
                    className="text-zinc-650 hover:text-red-450 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none p-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SOLID CODE EDITOR + AI SIDE PANEL */}
      <div className={`${showFilesList ? 'md:col-span-9' : 'md:col-span-12'} bg-[#07080a]/95 border border-border/85 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[500px] font-mono`}>
        <div className="grid xl:grid-cols-4 gap-8">
          {/* TextArea Custom Editor */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-border/20 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse animate-none"></span>
                <span className="text-xs text-zinc-350 font-bold uppercase tracking-wider">{selectedFileName}</span>
              </div>

              <div className="flex items-center gap-3.5">
                {isEditingFile ? (
                  <span className="text-[9px] font-mono text-amber-400 font-extrabold uppercase bg-amber-500/10 border border-amber-500/15 px-2.5 py-1 rounded select-none">MODIFIED</span>
                ) : (
                  <span className="text-[9px] font-mono text-emerald-450 font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded select-none">SYNCED</span>
                )}

                <Button
                  size="sm"
                  onClick={handleSaveFileContent}
                  disabled={!isEditingFile}
                  className="h-8 text-[11px] font-mono font-bold bg-primary text-background hover:bg-sky-400 cursor-pointer rounded-lg px-3"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save File
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
              <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-350 select-none">
                <Users className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                <span>operator_node</span>
              </div>
            </div>
          </div>

          {/* Nested Companion AI Panel column */}
          <div className="xl:col-span-1">
            {children}
          </div>
        </div>

        <div className="flex justify-between items-center bg-[#050607]/50 border-t border-border/10 pt-2.5 text-[10px] text-zinc-500 mt-4 select-none">
          <span>Lines: {fileContentBuffer.split('\n').length}</span>
          <span>Isolation boundary active</span>
        </div>
      </div>
    </div>
  );
}
