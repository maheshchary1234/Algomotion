import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Braces, Sparkles } from 'lucide-react';

interface VariablesInspectorProps {
  variables: Record<string, any>;
  changedVariables?: string[];
  operation?: string;
  isComplete?: boolean;
}

export const VariablesInspector: React.FC<VariablesInspectorProps> = ({
  variables,
  changedVariables = [],
  operation,
  isComplete,
}) => {
  const changedSet = new Set(changedVariables);
  const entries = Object.entries(variables || {});

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          Live Variables Inspector
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {entries.length} tracked
        </span>
      </div>

      {/* Variables List / Grid */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
            No local variables in current scope.
          </div>
        ) : (
          entries.map(([key, value]) => {
            const isChanged = changedSet.has(key);
            let displayVal = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono transition-all border ${
                  isChanged
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isChanged && (
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  )}
                  <span className="text-slate-400 font-medium">{key}:</span>
                </div>
                <span className={`font-bold ${isChanged ? 'text-amber-300' : 'text-cyan-300'} truncate max-w-[200px]`}>
                  {displayVal}
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Status Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">State:</span>
        <span className={`font-semibold ${isComplete ? 'text-emerald-400' : 'text-blue-400'}`}>
          {isComplete ? 'COMPLETED' : (operation ? operation.toUpperCase() : 'EXECUTING')}
        </span>
      </div>
    </div>
  );
};
