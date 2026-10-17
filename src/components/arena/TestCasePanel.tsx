import React, { useState } from 'react';
import { ProblemTestCase } from '../../types/arena';
import { CheckSquare, Edit3, Plus, Terminal } from 'lucide-react';

interface TestCasePanelProps {
  sampleTestCases: ProblemTestCase[];
  customInput: string;
  onCustomInputChange: (val: string) => void;
  selectedCaseIndex: number;
  onSelectCaseIndex: (idx: number) => void;
  isCustomSelected: boolean;
  onSelectCustom: (selected: boolean) => void;
}

export const TestCasePanel: React.FC<TestCasePanelProps> = ({
  sampleTestCases,
  customInput,
  onCustomInputChange,
  selectedCaseIndex,
  onSelectCaseIndex,
  isCustomSelected,
  onSelectCustom,
}) => {
  const currentCase = sampleTestCases[selectedCaseIndex] || sampleTestCases[0];

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0B101E] border border-slate-800 p-4">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {sampleTestCases.map((tc, idx) => (
            <button
              key={tc.id}
              onClick={() => {
                onSelectCustom(false);
                onSelectCaseIndex(idx);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                !isCustomSelected && selectedCaseIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
              }`}
            >
              Case {idx + 1}
            </button>
          ))}

          {/* Custom Testcase Tab */}
          <button
            onClick={() => onSelectCustom(true)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              isCustomSelected
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Custom Input</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          {isCustomSelected ? 'Custom Mode' : `Sample Case ${selectedCaseIndex + 1}`}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto py-3 text-xs font-mono">
        {isCustomSelected ? (
          <div className="flex flex-col gap-2 h-full">
            <label className="text-slate-400 font-semibold text-[11px]">
              Provide Custom Stdin Input:
            </label>
            <textarea
              rows={4}
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="e.g. 5&#10;1 2 3 4 5&#10;2"
              className="w-full flex-1 p-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {currentCase && (
              <>
                <div>
                  <span className="text-slate-400 font-semibold text-[11px] block mb-1">
                    Input:
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 whitespace-pre-wrap">
                    {currentCase.input}
                  </pre>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold text-[11px] block mb-1">
                    Expected Output:
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 whitespace-pre-wrap">
                    {currentCase.expected_output}
                  </pre>
                </div>

                {currentCase.explanation && (
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    <strong>Note:</strong> {currentCase.explanation}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
