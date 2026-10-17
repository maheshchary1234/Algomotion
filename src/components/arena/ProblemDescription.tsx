import React, { useState } from 'react';
import { CodingProblem, SubmissionRecord } from '../../types/arena';
import { 
  FileText, 
  Lightbulb, 
  BookOpen, 
  History, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface ProblemDescriptionProps {
  problem: CodingProblem;
  submissions: SubmissionRecord[];
  onOpenVisualizer: (visualizerId: string) => void;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  submissions,
  onOpenVisualizer,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'editorial' | 'submissions'>('description');
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const toggleHint = (index: number) => {
    setRevealedHints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const diffBadgeColor =
    problem.difficulty === 'Easy'
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
      : problem.difficulty === 'Medium'
      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
      : 'bg-rose-950/80 text-rose-300 border-rose-800';

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden shadow-xl">
      {/* Header with Title & Tabs */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500 font-bold">
              #{problem.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${diffBadgeColor}`}>
              {problem.difficulty}
            </span>
            {problem.is_draft ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Draft • Tests Pending
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified
              </span>
            )}
            <h2 className="text-lg font-bold text-white tracking-tight">{problem.title}</h2>
          </div>

          {/* Visualizer Connector */}
          {problem.visualizer_id && (
            <button
              onClick={() => onOpenVisualizer(problem.visualizer_id!)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900/60 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open in Visualizer</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800/80 pb-1 text-xs">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'description'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Description</span>
          </button>

          <button
            onClick={() => setActiveTab('hints')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'hints'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Hints ({problem.hints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('editorial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'editorial'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-300" />
            <span>Editorial</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'submissions'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Submissions ({submissions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-5 overflow-y-auto text-xs text-slate-300 leading-relaxed font-sans">
        {activeTab === 'description' && (
          <div className="flex flex-col gap-5">
            {/* Draft Notice Banner */}
            {problem.is_draft && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-200">Question Bank Draft — Verification Pending</p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5 leading-normal">
                    This challenge is part of the AlgoMotion 300-Question Bank. Official test cases are currently pending verification. You can draft, practice, and autosave your solution in Python or Java, and verify logic using <strong>Run Code</strong> with custom inputs. Automated Accepted grading is disabled until test cases are verified.
                  </p>
                </div>
              </div>
            )}

            {/* Problem Statement */}
            <div className="whitespace-pre-line text-sm text-slate-200 leading-relaxed font-sans">
              {problem.description}
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples</h4>
                {problem.examples.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2 font-mono text-xs">
                  <div className="font-bold text-slate-300">Example {idx + 1}:</div>
                  <div>
                    <span className="text-slate-400 font-semibold">Input:</span>
                    <pre className="p-2 rounded bg-slate-900 border border-slate-800/80 text-cyan-300 mt-1 overflow-x-auto">
                      {ex.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Output:</span>
                    <pre className="p-2 rounded bg-slate-900 border border-slate-800/80 text-emerald-300 mt-1 overflow-x-auto">
                      {ex.output}
                    </pre>
                  </div>
                  {ex.explanation && (
                    <div className="text-[11px] text-slate-400 font-sans mt-1">
                      <strong>Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-1">Sample Inputs & Test Boundaries</span>
                Official example test cases are pending verification for this question bank draft. Use the <strong>Custom Input</strong> tab in the testcase panel to supply custom inputs and test execution with <strong>Run Code</strong>.
              </div>
            )}

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-slate-300 text-xs uppercase block mb-1">Input Format</span>
                <p className="text-slate-400 whitespace-pre-line text-[11px] font-mono">{problem.input_format}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="font-bold text-slate-300 text-xs uppercase block mb-1">Output Format</span>
                <p className="text-slate-400 whitespace-pre-line text-[11px] font-mono">{problem.output_format}</p>
              </div>
            </div>

            {/* Constraints */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-slate-300 text-xs uppercase block mb-1">Constraints</span>
              <pre className="text-slate-400 font-mono text-[11px] whitespace-pre-line">{problem.constraints}</pre>
            </div>
          </div>
        )}

        {/* Hints Tab */}
        {activeTab === 'hints' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-400 mb-2">
              Hints are hidden by default to encourage independent problem-solving. Click to reveal each hint sequentially.
            </p>
            {problem.hints.map((hint, idx) => {
              const isRevealed = revealedHints[idx];
              return (
                <div key={idx} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleHint(idx)}
                    className="w-full p-3 flex items-center justify-between text-left font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Hint {idx + 1}</span>
                    </span>
                    {isRevealed ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isRevealed && (
                    <div className="p-3 pt-0 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed font-sans">
                      {hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Editorial Tab */}
        {activeTab === 'editorial' && (
          <div className="flex flex-col gap-4">
            <div className="whitespace-pre-line text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {problem.editorial}
            </div>

            {problem.visualizer_id && (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/60 flex items-center justify-between gap-3">
                <span className="text-xs text-cyan-200">
                  Ready to see this algorithm in action? Open the interactive AlgoMotion visualizer.
                </span>
                <button
                  onClick={() => onOpenVisualizer(problem.visualizer_id!)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0"
                >
                  Visualize Approach
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="flex flex-col gap-3">
            {submissions.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No previous submissions recorded for this problem yet. Write your code and click Submit Solution!
              </div>
            ) : (
              submissions.map((sub) => {
                const isAccepted = sub.status === 'Accepted';
                return (
                  <div key={sub.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2.5">
                      {isAccepted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <div>
                        <div className={`font-bold ${isAccepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {sub.status}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {sub.passed_test_cases} / {sub.total_test_cases} test cases • {sub.language.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{sub.execution_time_ms}ms</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{sub.timestamp}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
