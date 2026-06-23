import React from 'react';
import { Sparkles, Zap, FileText, BookOpen } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AIContextPanelProps {
  aiCompanionResponse: string;
  aiContextLoading: boolean;
  handleTriggerAICompanion: (actionType: string) => void;
}

export default function AIContextPanel({
  aiCompanionResponse,
  aiContextLoading,
  handleTriggerAICompanion
}: AIContextPanelProps) {
  return (
    <div className="bg-muted/20 border border-border/50 rounded-xl p-5 md:p-6 flex flex-col justify-between font-sans h-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs font-mono font-bold flex items-center gap-1.5 select-none">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Workspace AI Guide
          </span>
          <Badge variant="outline" className="text-[8px] font-mono font-extrabold select-none">READY</Badge>
        </div>

        <div className="bg-[#050607] rounded-lg p-3 text-[10.5px] leading-relaxed select-text font-mono border border-border/40 text-zinc-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap text-left">
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
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-500 font-mono block text-left">CODE CHECKS</span>
        
        <button
          onClick={() => handleTriggerAICompanion('optimize')}
          className="w-full text-left p-2.5 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between font-medium text-zinc-300 transition-colors"
        >
          <span>Optimize Variables</span>
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </button>
        
        <button
          onClick={() => handleTriggerAICompanion('unit-test')}
          className="w-full text-left p-2.5 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between font-medium text-zinc-300 transition-colors"
        >
          <span>Formulate Test Suite</span>
          <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
        </button>
        
        <button
          onClick={() => handleTriggerAICompanion('summary')}
          className="w-full text-left p-2.5 bg-[#0d0e12] border border-border hover:border-zinc-500 cursor-pointer rounded-lg text-xs flex items-center justify-between font-medium text-zinc-300 transition-colors"
        >
          <span>File Architecture Report</span>
          <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </button>
      </div>
    </div>
  );
}
