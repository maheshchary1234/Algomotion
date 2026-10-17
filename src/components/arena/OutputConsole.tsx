import React from 'react';
import { ExecutionResponse } from '../../types/arena';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HardDrive, 
  AlertTriangle, 
  AlertOctagon, 
  Check, 
  Terminal,
  Cpu,
  ServerOff
} from 'lucide-react';

interface OutputConsoleProps {
  result: ExecutionResponse | null;
  isLoading: boolean;
  isBackendConnected: boolean;
  onRetryConnection?: () => void;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  result,
  isLoading,
  isBackendConnected,
  onRetryConnection,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 rounded-2xl bg-[#090D16] border border-slate-800 text-slate-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        <span className="text-xs font-mono font-medium text-slate-300">
          Compiling & executing code in sandbox...
        </span>
      </div>
    );
  }

  // If backend is disconnected
  if (!isBackendConnected) {
    return (
      <div className="flex flex-col justify-center p-5 rounded-2xl bg-amber-950/20 border border-amber-800/60 text-xs gap-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <ServerOff className="w-4 h-4 text-amber-400" />
          <span>Execution Service Not Detected</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
          AlgoMotion strictly forbids simulating fake submissions. A genuine sandboxed execution service is required to safely evaluate Java and Python code with timeouts and memory limits.
        </p>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 flex flex-col gap-1">
          <span className="text-slate-400 text-[10px]">Start the FastAPI backend with:</span>
          <code>python -m uvicorn app.main:app --port 8000</code>
        </div>
        {onRetryConnection && (
          <button
            onClick={onRetryConnection}
            className="w-fit px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors"
          >
            Check Connection
          </button>
        )}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 rounded-2xl bg-[#090D16] border border-slate-800 text-slate-500 font-mono text-xs gap-2">
        <Terminal className="w-6 h-6 text-slate-600" />
        <span>Click "Run Code" or "Submit Solution" to see execution results.</span>
      </div>
    );
  }

  const isAccepted = result.status === 'Accepted';
  const isCompileErr = result.status === 'Compilation Error';
  const isTimeLimit = result.status === 'Time Limit Exceeded';
  const isRuntimeErr = result.status === 'Runtime Error';
  const isWrongAnswer = result.status === 'Wrong Answer';

  let statusBg = 'bg-slate-900 border-slate-700 text-slate-200';
  let StatusIcon = Terminal;

  if (isAccepted) {
    statusBg = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40';
    StatusIcon = CheckCircle2;
  } else if (isCompileErr || isRuntimeErr || isWrongAnswer) {
    statusBg = 'bg-rose-950/80 border-rose-500 text-rose-300 ring-1 ring-rose-500/40';
    StatusIcon = XCircle;
  } else if (isTimeLimit) {
    statusBg = 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-500/40';
    StatusIcon = Clock;
  }

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#090D16] border border-slate-800 p-4 gap-3 overflow-hidden shadow-xl">
      {/* Top Banner Status */}
      <div className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${statusBg}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold tracking-tight">{result.status}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{result.execution_time_ms} ms</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            <span>{result.memory_mb} MB</span>
          </span>
        </div>
      </div>

      {/* Summary message */}
      <div className="text-xs text-slate-300 font-mono flex items-center justify-between">
        <span>{result.message}</span>
        <span className="text-slate-400">
          Passed: <strong className={isAccepted ? 'text-emerald-400' : 'text-amber-400'}>{result.passed_test_cases}</strong> / {result.total_test_cases}
        </span>
      </div>

      {/* Errors or Detailed Cases */}
      <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs">
        {/* Compilation Error Output */}
        {result.compile_error && (
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-900 text-rose-300 text-[11px] whitespace-pre-wrap">
            <strong className="block text-rose-400 mb-1">Compiler Error:</strong>
            {result.compile_error}
          </div>
        )}

        {/* Runtime Error Output */}
        {result.runtime_error && !result.compile_error && (
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-900 text-rose-300 text-[11px] whitespace-pre-wrap">
            <strong className="block text-rose-400 mb-1">Runtime Error:</strong>
            {result.runtime_error}
          </div>
        )}

        {/* Test Case Breakdown */}
        {result.test_case_results && result.test_case_results.length > 0 && (
          <div className="space-y-2">
            {result.test_case_results.map((tc, idx) => (
              <div
                key={tc.test_case_id || idx}
                className={`p-3 rounded-xl border text-[11px] flex flex-col gap-1.5 ${
                  tc.passed
                    ? 'bg-slate-950/70 border-emerald-900/60'
                    : 'bg-slate-950 border-rose-900/80'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>
                    Test Case {idx + 1} {tc.is_hidden ? '(Hidden)' : ''}: {tc.passed ? 'Passed ✓' : 'Failed ✗'}
                  </span>
                  <span className="text-slate-500 font-normal">{tc.execution_time_ms} ms</span>
                </div>

                {!tc.is_hidden && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-slate-500 block">Expected:</span>
                      <pre className="p-1.5 rounded bg-slate-900 text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                        {tc.expected_output}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Your Output:</span>
                      <pre className={`p-1.5 rounded bg-slate-900 whitespace-pre-wrap overflow-x-auto ${
                        tc.passed ? 'text-emerald-300' : 'text-rose-300 font-bold'
                      }`}>
                        {tc.actual_output || '(Empty)'}
                      </pre>
                    </div>
                  </div>
                )}

                {tc.stdout && (
                  <div className="mt-1 text-slate-400">
                    <span className="text-slate-500 block">Stdout:</span>
                    <pre className="p-1 rounded bg-slate-900 text-slate-300 whitespace-pre-wrap">
                      {tc.stdout}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
