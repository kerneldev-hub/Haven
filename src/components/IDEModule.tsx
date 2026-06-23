import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from './ui/components';
import { Code2, Play, Save, TerminalSquare } from 'lucide-react';

export default function IDEModule() {
  const [files, setFiles] = useState<{ id: string, name: string, content: string }[]>([
    { id: '1', name: 'main.ts', content: 'console.log("Kernel Mode Initialized");\n\nfunction executeTask() {\n  return "Done";\n}' },
    { id: '2', name: 'style.css', content: 'body { background: #000; color: #fff; }' },
  ]);
  const [activeFile, setActiveFile] = useState<string | null>('1');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initialized synchronously
  }, []);

  const currentFile = files.find(f => f.id === activeFile);

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    setFiles(files.map(f => f.id === activeFile ? { ...f, content: value } : f));
  };

  const saveFile = () => {
    setIsSaving(true);
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-[600px] border border-border rounded-xl bg-card overflow-hidden text-left">
      <div className="flex items-center justify-between p-2 border-b border-border bg-black/40">
        <div className="flex items-center gap-1">
          {files.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFile(f.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeFile === f.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
          <Button onClick={saveFile} variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 bg-zinc-900 border-zinc-700">
            <Save className="w-3 h-3" />
            {isSaving ? 'SAVING...' : 'SAVE'}
          </Button>
          <Button size="sm" className="h-7 text-[10px] gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white border-0">
            <Play className="w-3 h-3" />
            RUN COMPILE
          </Button>
        </div>
      </div>
      <div className="flex-1 flex relative">
        <div className="flex-1 w-full h-full relative">
          <Editor
            height="100%"
            language={currentFile?.name.endsWith('css') ? 'css' : 'typescript'}
            theme="vs-dark"
            value={currentFile?.content || ''}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: '"JetBrains Mono", monospace',
              padding: { top: 16 },
              lineHeight: 24,
            }}
            className="absolute inset-0"
          />
        </div>
      </div>
      <div className="h-8 border-t border-border bg-black/50 flex items-center px-4 font-mono text-[10px] text-zinc-500 justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span>Language Server: Connected (Edge)</span>
        </div>
        <div className="flex items-center gap-2">
          <TerminalSquare className="w-3.5 h-3.5" />
          <span>Worker VM Sandbox Status: AWAITING_INSTRUCTION</span>
        </div>
      </div>
    </div>
  );
}
