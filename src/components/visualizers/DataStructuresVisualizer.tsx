import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionStep } from '../../types/algorithm';
import { 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  HelpCircle, 
  Link as LinkIcon, 
  Search, 
  Compass,
  ArrowRightLeft
} from 'lucide-react';

interface DataStructuresVisualizerProps {
  currentStep: ExecutionStep | null;
  dsType: 'stack' | 'queue' | 'linked-list';
  onExecuteCommand: (cmd: any) => void;
}

export const DataStructuresVisualizer: React.FC<DataStructuresVisualizerProps> = ({
  currentStep,
  dsType,
  onExecuteCommand,
}) => {
  const [inputValue, setInputValue] = useState('42');
  const [listKind, setListKind] = useState<'singly' | 'doubly'>('singly');
  const [selectedOperation, setSelectedOperation] = useState<string>('insert_head');

  const stackItems = currentStep?.stackItems || [];
  const queueItems = currentStep?.queueItems || [];
  const linkedListNodes = currentStep?.linkedListNodes || [];

  const handleAction = (type: string, val?: any) => {
    onExecuteCommand({ type, value: val ?? (parseInt(inputValue, 10) || 42) });
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Input field */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Value:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-16 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Stack Buttons */}
          {dsType === 'stack' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAction('push')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Push</span>
              </button>
              <button
                onClick={() => handleAction('pop')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Pop</span>
              </button>
              <button
                onClick={() => handleAction('peek')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Peek</span>
              </button>
              <button
                onClick={() => handleAction('isEmpty')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Is Empty?</span>
              </button>
            </div>
          )}

          {/* Queue Buttons */}
          {dsType === 'queue' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAction('enqueue')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enqueue (Rear)</span>
              </button>
              <button
                onClick={() => handleAction('dequeue')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Dequeue (Front)</span>
              </button>
              <button
                onClick={() => handleAction('front')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Front</span>
              </button>
            </div>
          )}

          {/* Linked List Buttons */}
          {dsType === 'linked-list' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setListKind('singly')}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                    listKind === 'singly' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Singly
                </button>
                <button
                  onClick={() => setListKind('doubly')}
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                    listKind === 'doubly' ? 'bg-purple-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Doubly
                </button>
              </div>

              <button
                onClick={() => onExecuteCommand({ type: 'insert_head', value: parseInt(inputValue, 10) || 5, listType: listKind })}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                + Head
              </button>
              <button
                onClick={() => onExecuteCommand({ type: 'insert_tail', value: parseInt(inputValue, 10) || 99, listType: listKind })}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                + Tail
              </button>
              <button
                onClick={() => onExecuteCommand({ type: 'delete_val', value: parseInt(inputValue, 10) || 20, listType: listKind })}
                className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete Val
              </button>
              <button
                onClick={() => onExecuteCommand({ type: 'search', value: parseInt(inputValue, 10) || 20, listType: listKind })}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                Search
              </button>
              <button
                onClick={() => onExecuteCommand({ type: 'traverse', listType: listKind })}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                Traverse
              </button>
            </div>
          )}
        </div>

        {/* Readout */}
        <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          Capacity: 7 (Bounded)
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 rounded-2xl bg-gradient-to-b from-slate-950/90 to-[#0B101E] border border-slate-800/80 relative overflow-hidden min-h-[340px]">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        {/* 1. Stack Visualization (Vertical bucket with top indicator) */}
        {dsType === 'stack' && (
          <div className="flex flex-col items-center justify-end z-10 w-full max-w-xs">
            <div className="w-56 h-64 border-b-4 border-x-4 border-slate-700 rounded-b-2xl p-2 flex flex-col-reverse gap-2 bg-slate-950/60 shadow-inner">
              <AnimatePresence>
                {stackItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`h-10 rounded-xl flex items-center justify-between px-4 font-mono font-bold text-sm border shadow-md ${
                      item.isTop
                        ? 'bg-blue-600/30 border-blue-400 text-cyan-200 ring-2 ring-blue-500 shadow-blue-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span>{item.value}</span>
                    {item.isTop && (
                      <span className="text-[10px] uppercase font-bold text-cyan-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                        TOP
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              LIFO Bucket (Last-In, First-Out)
            </div>
          </div>
        )}

        {/* 2. Queue Visualization (Horizontal pipe with Front/Rear pointers) */}
        {dsType === 'queue' && (
          <div className="flex flex-col items-center justify-center z-10 w-full">
            <div className="flex items-center gap-3 overflow-x-auto py-6 max-w-full">
              <AnimatePresence>
                {queueItems.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono py-8">
                    Queue is currently empty. Enqueue elements at Rear!
                  </div>
                ) : (
                  queueItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      {/* Top pointer */}
                      <div className="h-5 text-[10px] font-bold font-mono">
                        {item.isFront && <span className="text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">FRONT</span>}
                        {item.isRear && <span className="text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">REAR</span>}
                      </div>

                      {/* Element box */}
                      <div className="w-14 h-16 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xl text-white shadow-md">
                        {item.value}
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">[{idx}]</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>Exit (Front)</span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>FIFO Pipe</span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Enter (Rear)</span>
            </div>
          </div>
        )}

        {/* 3. Linked List Visualization (Nodes + Pointer arrows) */}
        {dsType === 'linked-list' && (
          <div className="flex flex-col items-center justify-center z-10 w-full">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-8 max-w-full">
              {linkedListNodes.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono">
                  Linked List is empty (Head == null). Insert nodes to begin!
                </div>
              ) : (
                linkedListNodes.map((node, idx) => {
                  let nodeBorder = 'border-slate-700 bg-slate-900 text-white';
                  if (node.isCurrent) {
                    nodeBorder = 'border-purple-500 bg-purple-950/80 text-purple-200 ring-2 ring-purple-400 shadow-lg shadow-purple-500/30';
                  } else if (node.isTarget) {
                    nodeBorder = 'border-rose-500 bg-rose-950/80 text-rose-200 ring-2 ring-rose-400';
                  }

                  return (
                    <div key={node.id} className="flex items-center gap-2 sm:gap-3">
                      {/* Node container */}
                      <motion.div
                        layout
                        className="flex flex-col items-center gap-1.5"
                      >
                        {/* Header tag */}
                        <div className="h-4 text-[10px] font-bold font-mono text-cyan-300">
                          {node.isHead && 'HEAD'}
                          {node.isTail && !node.isHead && 'TAIL'}
                        </div>

                        {/* Node box with data & next pointer compartments */}
                        <div className={`flex rounded-xl border overflow-hidden shadow-md font-mono ${nodeBorder}`}>
                          <div className="px-3.5 py-3 text-lg font-bold flex items-center justify-center">
                            {node.value}
                          </div>
                          <div className="px-2 py-3 bg-slate-950/60 border-l border-slate-800 text-[10px] text-slate-400 flex items-center justify-center">
                            •
                          </div>
                        </div>
                      </motion.div>

                      {/* Pointer Arrow to next node */}
                      {idx < linkedListNodes.length - 1 ? (
                        <div className="flex flex-col items-center text-cyan-400">
                          <ArrowRight className="w-5 h-5" />
                          {listKind === 'doubly' && (
                            <ArrowLeft className="w-5 h-5 text-purple-400 -mt-2" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-xs font-mono font-bold text-slate-600 pl-1">
                          null
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Dynamic Node Pointers • {listKind === 'doubly' ? 'next & prev bidirectional links' : 'singly next links'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
