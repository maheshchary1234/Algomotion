import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExecutionStep } from '../../types/algorithm';
import { Shuffle, ArrowUpDown, BarChart2, Hash } from 'lucide-react';

interface SortingVisualizerProps {
  currentStep: ExecutionStep | null;
  onGenerateRandom: () => void;
  onCustomArray: (arr: number[]) => void;
  onToggleOrder?: () => void;
  isDescending?: boolean;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  currentStep,
  onGenerateRandom,
  onCustomArray,
  onToggleOrder,
  isDescending = false,
}) => {
  const [viewMode, setViewMode] = useState<'bars' | 'cells'>('bars');
  const [customInputText, setCustomInputText] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const array = currentStep?.array || [35, 10, 45, 20, 50, 15, 30];
  const maxVal = Math.max(...array, 10);
  const minVal = Math.min(...array, 0);
  const range = Math.max(maxVal - minVal, 1);

  const comparing = new Set(currentStep?.highlightIndices?.comparing || []);
  const swapping = new Set(currentStep?.highlightIndices?.swapping || []);
  const sorted = new Set(currentStep?.highlightIndices?.sorted || []);
  const pivot = currentStep?.highlightIndices?.pivot;
  const active = new Set(currentStep?.highlightIndices?.active || []);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customInputText
      .split(/[\s,]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));
    if (parsed.length > 0) {
      onCustomArray(parsed.slice(0, 20)); // Limit to max 20 items for readability
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Random Array</span>
          </button>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <Hash className="w-3.5 h-3.5 text-blue-400" />
            <span>Custom Input</span>
          </button>
        </div>

        {/* View Switcher: Bars vs Cells */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('bars')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === 'bars'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>Bars</span>
          </button>
          <button
            onClick={() => setViewMode('cells')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === 'cells'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="w-3 h-3" />
            <span>Cells</span>
          </button>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300">
            <span>Comparisons:</span>
            <span className="font-bold">{currentStep?.comparisonsCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-800/60 text-rose-300">
            <span>Swaps:</span>
            <span className="font-bold">{currentStep?.swapsCount ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Custom input modal */}
      {showCustomModal && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/40 shadow-xl">
          <form onSubmit={handleApplyCustom} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. 50, 20, 80, 10, 30"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Animation Stage */}
      <div className="flex-1 flex flex-col justify-end items-center p-6 rounded-2xl bg-gradient-to-b from-slate-950/90 to-[#0B101E] border border-slate-800/80 relative overflow-hidden min-h-[340px]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        {/* Status / Legend banner */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Legend:</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Unsorted
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> Comparing
            </span>
            <span className="flex items-center gap-1 text-[11px] text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Swapping
            </span>
            <span className="flex items-center gap-1 text-[11px] text-purple-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Pivot
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span> Sorted
            </span>
          </div>

          <div className="text-xs font-mono text-cyan-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
            n = {array.length} elements
          </div>
        </div>

        {/* Visualizer Display Mode: Vertical Bars */}
        {viewMode === 'bars' ? (
          <div className="w-full h-56 flex items-end justify-center gap-1.5 sm:gap-2.5 z-10 pb-2">
            {array.map((val, idx) => {
              const isComp = comparing.has(idx);
              const isSwap = swapping.has(idx);
              const isSort = sorted.has(idx);
              const isPiv = pivot === idx;
              const isAct = active.has(idx);

              // Calculate normalized height percentage (minimum 15% to keep readable)
              const heightPercent = Math.max(14, Math.round(((val - minVal + 5) / (range + 5)) * 100));

              let barBg = 'bg-gradient-to-t from-blue-700 to-cyan-500 border-cyan-400';
              let textColor = 'text-cyan-300';

              if (isSwap) {
                barBg = 'bg-gradient-to-t from-rose-700 to-red-500 border-rose-400 shadow-lg shadow-rose-500/40 ring-1 ring-rose-400';
                textColor = 'text-rose-300';
              } else if (isComp) {
                barBg = 'bg-gradient-to-t from-amber-600 to-yellow-400 border-yellow-300 shadow-md shadow-amber-500/30';
                textColor = 'text-amber-300';
              } else if (isPiv) {
                barBg = 'bg-gradient-to-t from-purple-700 to-violet-500 border-purple-400 shadow-md shadow-purple-500/40';
                textColor = 'text-purple-300';
              } else if (isSort) {
                barBg = 'bg-gradient-to-t from-emerald-700 to-green-500 border-emerald-400';
                textColor = 'text-emerald-300';
              } else if (isAct) {
                barBg = 'bg-gradient-to-t from-indigo-700 to-blue-500 border-indigo-400';
              }

              return (
                <div key={`bar-${idx}`} className="flex-1 max-w-[50px] flex flex-col items-center gap-1.5 h-full justify-end">
                  {/* Bar Value label */}
                  <span className={`text-[10px] sm:text-xs font-mono font-bold ${textColor}`}>
                    {val}
                  </span>

                  {/* Animated Bar */}
                  <motion.div
                    layout
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className={`w-full rounded-t-lg border-t border-x ${barBg} transition-colors duration-200`}
                  />

                  {/* Index label */}
                  <span className="text-[10px] font-mono text-slate-500">
                    {idx}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode: Array Cells */
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-10 py-6">
            {array.map((val, idx) => {
              const isComp = comparing.has(idx);
              const isSwap = swapping.has(idx);
              const isSort = sorted.has(idx);
              const isPiv = pivot === idx;

              let cellBg = 'bg-slate-900 border-slate-700 text-white';

              if (isSwap) cellBg = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500';
              else if (isComp) cellBg = 'bg-amber-950/80 border-amber-500 text-amber-200 ring-2 ring-amber-500';
              else if (isPiv) cellBg = 'bg-purple-950/80 border-purple-500 text-purple-200';
              else if (isSort) cellBg = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';

              return (
                <div key={`cell-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    layout
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-mono font-bold border transition-colors ${cellBg}`}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
