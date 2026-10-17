import React from 'react';
import { ExecutionStep } from '../../types/algorithm';
import { Info, CheckCircle2, ArrowRight } from 'lucide-react';

interface ExplanationCardProps {
  currentStep: ExecutionStep | null;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ currentStep }) => {
  if (!currentStep) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-purple-950/30 border border-slate-800 text-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
          <Info className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Step Explanation:
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
            {currentStep.operation}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-8">
        {currentStep.explanation}
      </p>
    </div>
  );
};
