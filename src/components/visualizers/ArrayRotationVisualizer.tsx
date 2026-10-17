import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionStep } from '../../types/algorithm';
import { RotateCcw, RotateCw, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface ArrayRotationVisualizerProps {
  currentStep: ExecutionStep | null;
  direction: 'left' | 'right';
  k: number;
  method: 'reversal' | 'brute-force';
  onDirectionChange: (d: 'left' | 'right') => void;
  onKChange: (k: number) => void;
  onMethodChange: (m: 'reversal' | 'brute-force') => void;
}

export const ArrayRotationVisualizer: React.FC<ArrayRotationVisualizerProps> = ({
  currentStep,
  direction,
  k,
  method,
  onDirectionChange,
  onKChange,
  onMethodChange,
}) => {
  const array = currentStep?.array || [];
  const rotState = currentStep?.rotationState;
  const originalArray = rotState?.originalArray || array;
  const n = array.length;
  const effectiveK = n > 0 ? k % n : 0;
  const activeIndices = new Set(currentStep?.highlightIndices?.active || []);
  const swappingIndices = new Set(currentStep?.highlightIndices?.swapping || []);
  const sortedIndices = new Set(currentStep?.highlightIndices?.sorted || []);

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Visualizer Header & Configuration bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        {/* Direction Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onDirectionChange('left')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              direction === 'left'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Left Rotation</span>
          </button>
          <button
            onClick={() => onDirectionChange('right')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              direction === 'right'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Right Rotation</span>
          </button>
        </div>

        {/* Rotation Count Input */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400">Rotation Count (k):</span>
          <input
            type="number"
            min={0}
            max={50}
            value={k}
            onChange={(e) => onKChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-14 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold text-center focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Method Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onMethodChange('reversal')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              method === 'reversal'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>3-Reversal (O(n))</span>
          </button>
          <button
            onClick={() => onMethodChange('brute-force')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              method === 'brute-force'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Brute Force (O(n×k))</span>
          </button>
        </div>

        {/* Modulo Pill Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950/40 border border-blue-800/60 text-xs">
          <span className="text-slate-400">Modulo Formula:</span>
          <span className="font-mono text-cyan-300 font-bold">
            k = {k} % {n || 1} = <span className="text-amber-400">{effectiveK}</span>
          </span>
        </div>
      </div>

      {/* Main Animation Stage */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 rounded-2xl bg-gradient-to-b from-slate-950/80 to-[#0B101E]/80 border border-slate-800/80 relative overflow-hidden min-h-[320px]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Phase / Action Indicator */}
        <div className="mb-6 flex items-center gap-2 z-10">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Phase: {rotState?.currentPhase || currentStep?.operation || 'Ready'}</span>
          </div>
          {effectiveK !== k && (
            <div className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
              k ({k}) &gt; n ({n}) Optimized to {effectiveK}
            </div>
          )}
        </div>

        {/* Array Elements Cards */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 z-10 max-w-full overflow-x-auto py-4">
          <AnimatePresence mode="popLayout">
            {array.map((val, idx) => {
              const isSwapping = swappingIndices.has(idx);
              const isActive = activeIndices.has(idx);
              const isSorted = sortedIndices.has(idx);

              let cardBg = 'bg-slate-900/90 border-slate-700/80 text-white';
              let glow = '';

              if (isSwapping) {
                cardBg = 'bg-rose-600/30 border-rose-500 text-rose-200';
                glow = 'shadow-lg shadow-rose-500/40 ring-2 ring-rose-500';
              } else if (isActive) {
                cardBg = 'bg-blue-600/30 border-blue-400 text-cyan-200';
                glow = 'shadow-lg shadow-blue-500/40 ring-2 ring-blue-400';
              } else if (isSorted) {
                cardBg = 'bg-emerald-600/30 border-emerald-500 text-emerald-200';
                glow = 'shadow-md shadow-emerald-500/30';
              }

              return (
                <motion.div
                  key={`arr-elem-${idx}-${val}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isSwapping ? 1.15 : 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold font-mono border backdrop-blur-md transition-all duration-300 ${cardBg} ${glow}`}
                  >
                    {val}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      [{idx}]
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Direction Arrow visualization */}
        <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 z-10 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
          <span>Direction:</span>
          <span className="text-cyan-400 font-bold uppercase">{direction}</span>
          <ArrowRight className={`w-3.5 h-3.5 text-cyan-400 ${direction === 'left' ? 'rotate-180' : ''}`} />
          <span>Shift count: {k} positions (effective: {effectiveK})</span>
        </div>
      </div>

      {/* Comparison: Original vs Current State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Initial Array</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Original</span>
          </div>
          <div className="font-mono text-sm text-slate-200">
            [{originalArray.join(', ')}]
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current / Result State</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              {currentStep?.isComplete ? 'Complete' : 'In Progress'}
            </span>
          </div>
          <div className="font-mono text-sm text-cyan-300 font-bold">
            [{array.join(', ')}]
          </div>
        </div>
      </div>

      {/* Method Explainer Card */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-2 font-semibold text-slate-100 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Why the 3-Reversal Algorithm is Superior:</span>
        </div>
        <p>
          Brute-force shifting moves 1 element at a time, requiring{' '}
          <span className="font-mono text-rose-300 font-semibold">O(n × k)</span> time. In contrast, the{' '}
          <span className="text-purple-300 font-semibold">3-reversal algorithm</span> reverses sub-partitions in place,
          visiting each element only twice (<span className="font-mono text-emerald-400 font-semibold">O(n) time</span>) and requiring{' '}
          <span className="font-mono text-emerald-400 font-semibold">O(1) auxiliary space</span> without copying to a secondary array.
        </p>
      </div>
    </div>
  );
};
