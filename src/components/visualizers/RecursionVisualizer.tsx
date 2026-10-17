import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExecutionStep, RecursionStackFrame, RecursionTreeNode } from '../../types/algorithm';
import { Layers, GitFork, Disc, CornerDownRight, CheckCircle2 } from 'lucide-react';

interface RecursionVisualizerProps {
  currentStep: ExecutionStep | null;
  algoId: string;
}

export const RecursionVisualizer: React.FC<RecursionVisualizerProps> = ({
  currentStep,
  algoId,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'stack' | 'tree'>('both');
  const stack = currentStep?.callStack || [];
  const treeRoot = currentStep?.treeSnapshot;
  const hanoiRods = currentStep?.hanoiRods;
  const isHanoi = algoId === 'tower-of-hanoi' || !!hanoiRods;

  // Recursive tree rendering helper
  const renderTreeNode = (node?: RecursionTreeNode) => {
    if (!node) return null;

    let badgeBg = 'bg-slate-900 border-slate-700 text-slate-300';
    let ring = '';

    if (node.status === 'active') {
      badgeBg = 'bg-purple-950/90 border-purple-400 text-purple-200';
      ring = 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/40';
    } else if (node.status === 'base_case') {
      badgeBg = 'bg-emerald-950/90 border-emerald-400 text-emerald-200';
      ring = 'ring-1 ring-emerald-400';
    } else if (node.status === 'completed') {
      badgeBg = 'bg-blue-950/80 border-blue-600 text-cyan-200';
    }

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node card */}
        <motion.div
          layout
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${badgeBg} ${ring} flex flex-col items-center gap-0.5`}
        >
          <div className="font-bold">{node.name}</div>
          {node.returnValue !== undefined && (
            <div className="text-[10px] text-emerald-300 font-semibold">
              ↳ returns {node.returnValue}
            </div>
          )}
        </motion.div>

        {/* Children branch */}
        {node.children && node.children.length > 0 && (
          <div className="flex flex-col items-center w-full mt-2">
            {/* Vertical connector */}
            <div className="w-0.5 h-3 bg-slate-700" />
            {/* Horizontal line for multiple children */}
            {node.children.length > 1 && (
              <div className="w-3/4 h-0.5 bg-slate-700 mb-2" />
            )}
            <div className="flex justify-center gap-4 sm:gap-8">
              {node.children.map((child) => renderTreeNode(child))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top toolbar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          {!isHanoi && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('both')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setActiveTab('stack')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'stack' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Call Stack Only
              </button>
              <button
                onClick={() => setActiveTab('tree')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'tree' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Recursion Tree Only
              </button>
            </div>
          )}
        </div>

        {/* Stack depth indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-800/60 text-purple-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Stack Depth: {stack.length}</span>
          </div>
        </div>
      </div>

      {/* If Tower of Hanoi: Show Animated 3-Rods Canvas */}
      {isHanoi && hanoiRods ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-950/90 to-[#0B101E] border border-slate-800/80 min-h-[350px]">
          <div className="w-full max-w-2xl grid grid-cols-3 gap-6 sm:gap-12 items-end justify-center h-64 border-b-4 border-slate-700 pb-2">
            {(['A', 'B', 'C'] as const).map((rodKey) => {
              const disks = hanoiRods[rodKey];
              const rodNames = { A: 'Source (A)', B: 'Auxiliary (B)', C: 'Target (C)' };

              return (
                <div key={rodKey} className="relative flex flex-col items-center justify-end h-full">
                  {/* Vertical rod peg */}
                  <div className="absolute bottom-0 w-3 h-48 bg-slate-700 rounded-t-md" />

                  {/* Disks stacked on rod */}
                  <div className="flex flex-col-reverse items-center z-10 w-full mb-1 gap-1">
                    {disks.map((diskSize) => {
                      const colors = [
                        'bg-cyan-500 border-cyan-400',
                        'bg-blue-500 border-blue-400',
                        'bg-indigo-500 border-indigo-400',
                        'bg-purple-500 border-purple-400',
                      ];
                      const color = colors[(diskSize - 1) % colors.length];
                      const widthPercent = Math.min(100, diskSize * 24);

                      return (
                        <motion.div
                          key={`disk-${diskSize}`}
                          layout
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          style={{ width: `${widthPercent}%` }}
                          className={`h-7 rounded-lg border-2 shadow-md flex items-center justify-center text-xs font-mono font-bold text-white ${color}`}
                        >
                          Disk {diskSize}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Rod label */}
                  <span className="mt-3 text-xs font-bold text-slate-300 font-mono">
                    {rodNames[rodKey]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Standard Recursion: Call Stack and/or Recursion Tree */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[340px]">
          {/* Call Stack Panel */}
          {(activeTab === 'both' || activeTab === 'stack') && (
            <div className="flex flex-col rounded-2xl bg-gradient-to-b from-slate-950/90 to-[#0B101E] border border-slate-800/80 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Call Stack (Top is Active)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {stack.length} Frame(s)
                </span>
              </div>

              <div className="flex-1 flex flex-col-reverse justify-start gap-2 overflow-y-auto py-3">
                {stack.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                    Call stack is currently empty (Base case resolved or unstarted).
                  </div>
                ) : (
                  stack.map((frame, idx) => {
                    const isTop = idx === stack.length - 1;
                    return (
                      <motion.div
                        key={frame.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                          isTop
                            ? 'bg-purple-950/80 border-purple-500 text-purple-100 shadow-md shadow-purple-500/20 ring-1 ring-purple-400'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span>{frame.functionName}({Object.entries(frame.args).map(([k, v]) => `${k}=${v}`).join(', ')})</span>
                          {isTop && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500 text-white text-[10px] uppercase font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex justify-between">
                          <span>Depth: {frame.depth}</span>
                          {frame.returnValue !== undefined && (
                            <span className="text-emerald-400 font-semibold">
                              Returns: {frame.returnValue}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Recursion Tree Panel */}
          {(activeTab === 'both' || activeTab === 'tree') && (
            <div className="flex flex-col rounded-2xl bg-gradient-to-b from-slate-950/90 to-[#0B101E] border border-slate-800/80 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  Recursion Tree Call Hierarchy
                </span>
                <span className="text-[11px] text-slate-400">
                  Visual Branching
                </span>
              </div>

              <div className="flex-1 overflow-auto flex items-start justify-center p-4">
                {treeRoot ? (
                  renderTreeNode(treeRoot)
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-500">
                    No recursion tree active.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
