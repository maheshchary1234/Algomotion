import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExecutionStep } from '../../types/algorithm';
import { Search, AlertTriangle, ArrowDownAZ, CheckCircle, XCircle } from 'lucide-react';

interface SearchingVisualizerProps {
  currentStep: ExecutionStep | null;
  target: number;
  onTargetChange: (t: number) => void;
  onSortArray: () => void;
  isBinarySearch: boolean;
}

export const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({
  currentStep,
  target,
  onTargetChange,
  onSortArray,
  isBinarySearch,
}) => {
  const [targetInput, setTargetInput] = useState(target.toString());
  const array = currentStep?.array || [];
  const low = currentStep?.variables?.low;
  const high = currentStep?.variables?.high;
  const mid = currentStep?.variables?.mid;
  const foundIndex = currentStep?.highlightIndices?.found ?? currentStep?.variables?.foundIndex;
  const comparingIndices = new Set(currentStep?.highlightIndices?.comparing || []);

  const isUnsorted = currentStep?.variables?.isSorted === false;

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(targetInput.trim(), 10);
    if (!isNaN(parsed)) {
      onTargetChange(parsed);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls & Target Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <form onSubmit={handleTargetSubmit} className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            Target:
          </label>
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Set Target
          </button>
        </form>

        {isBinarySearch && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSortArray}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 transition-colors"
            >
              <ArrowDownAZ className="w-3.5 h-3.5" />
              <span>Sort Array For Binary Search</span>
            </button>
          </div>
        )}

        {/* Pointers readout */}
        {isBinarySearch && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800/60 text-blue-300">
              Low: <span className="font-bold">{low !== undefined ? low : '-'}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800/60 text-purple-300">
              Mid: <span className="font-bold">{mid !== undefined ? mid : '-'}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
              High: <span className="font-bold">{high !== undefined ? high : '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Unsorted warning banner */}
      {isUnsorted && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Warning:</strong> Array is currently unsorted. Binary search relies on elements being sorted in ascending order.
            </span>
          </div>
          <button
            onClick={onSortArray}
            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shrink-0 transition-colors"
          >
            Sort Now
          </button>
        </div>
      )}

      {/* Main Animation Stage */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 rounded-2xl bg-gradient-to-b from-slate-950/90 to-[#0B101E] border border-slate-800/80 relative overflow-hidden min-h-[320px]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        {/* Target display banner */}
        <div className="mb-6 flex items-center gap-3 z-10">
          <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-200">
            Searching for: <span className="text-cyan-400 text-sm">[{target}]</span>
          </div>

          {foundIndex !== undefined && foundIndex >= 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-md shadow-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Found at index {foundIndex}!</span>
            </div>
          )}

          {currentStep?.variables?.status === 'NOT_FOUND' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Target not present in array (-1)</span>
            </div>
          )}
        </div>

        {/* Array Cells */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 z-10 max-w-full overflow-x-auto py-4">
          {array.map((val, idx) => {
            const isComparing = comparingIndices.has(idx);
            const isFound = foundIndex === idx;
            const isMid = mid === idx;
            const isLow = low === idx;
            const isHigh = high === idx;

            const inRange =
              isBinarySearch && low !== undefined && high !== undefined
                ? idx >= low && idx <= high
                : true;

            let cellBg = inRange
              ? 'bg-slate-900/90 border-slate-700 text-white'
              : 'bg-slate-950/50 border-slate-900 text-slate-600 opacity-40';

            let glow = '';

            if (isFound) {
              cellBg = 'bg-emerald-600/30 border-emerald-400 text-emerald-200';
              glow = 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/40';
            } else if (isMid) {
              cellBg = 'bg-purple-600/30 border-purple-400 text-purple-200';
              glow = 'ring-2 ring-purple-400 shadow-md shadow-purple-500/30';
            } else if (isComparing) {
              cellBg = 'bg-amber-600/30 border-amber-400 text-amber-200';
              glow = 'ring-2 ring-amber-400 shadow-md shadow-amber-500/30';
            }

            return (
              <div key={`search-cell-${idx}`} className="flex flex-col items-center gap-1.5">
                {/* Pointer tags above cell */}
                <div className="h-5 flex items-center justify-center gap-1 text-[10px] font-mono font-bold">
                  {isLow && <span className="px-1 rounded bg-blue-600 text-white">L</span>}
                  {isMid && <span className="px-1 rounded bg-purple-600 text-white">M</span>}
                  {isHigh && <span className="px-1 rounded bg-cyan-600 text-white">H</span>}
                </div>

                {/* Animated Cell */}
                <motion.div
                  layout
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-mono font-bold border backdrop-blur-md transition-all duration-200 ${cellBg} ${glow}`}
                >
                  {val}
                </motion.div>

                {/* Index label */}
                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
