import React from 'react';
import { ComplexityInfo } from '../../types/algorithm';
import { Clock, HardDrive, CheckCircle2, XCircle, Info } from 'lucide-react';

interface ComplexityPanelProps {
  complexity: ComplexityInfo;
}

export const ComplexityPanel: React.FC<ComplexityPanelProps> = ({ complexity }) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Complexity Analysis
        </span>
        <div className="flex items-center gap-2">
          {complexity.inPlace !== undefined && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              complexity.inPlace ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
            }`}>
              {complexity.inPlace ? 'In-Place: Yes' : 'In-Place: No'}
            </span>
          )}
          {complexity.stability !== undefined && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              complexity.stability ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-slate-800 text-slate-400'
            }`}>
              {complexity.stability ? 'Stable: Yes' : 'Stable: No'}
            </span>
          )}
        </div>
      </div>

      {/* Grid Cards for Best, Average, Worst, Space */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Best */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Best Time</span>
          <span className="text-sm font-mono font-bold text-emerald-400">{complexity.timeBest}</span>
        </div>

        {/* Average */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Time</span>
          <span className="text-sm font-mono font-bold text-blue-400">{complexity.timeAverage || '—'}</span>
        </div>

        {/* Worst */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Worst Time</span>
          <span className="text-sm font-mono font-bold text-amber-400">{complexity.timeWorst}</span>
        </div>

        {/* Space */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Auxiliary Space</span>
          <span className="text-sm font-mono font-bold text-purple-400">{complexity.spaceAuxiliary}</span>
        </div>
      </div>

      {/* Explanations */}
      <div className="space-y-2 pt-1 text-slate-300 leading-relaxed text-[11px]">
        <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <strong className="text-slate-200">Time Reasoning: </strong>
          {complexity.timeExplanation}
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <strong className="text-slate-200">Space Reasoning: </strong>
          {complexity.spaceExplanation}
        </div>
      </div>
    </div>
  );
};
