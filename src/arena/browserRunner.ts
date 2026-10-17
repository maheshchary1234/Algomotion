import { CodingProblem, ExecutionResponse, TestCaseResult } from '../types/arena';

// Singleton instance of Pyodide WebAssembly runtime
let pyodidePromise: Promise<any> | null = null;

async function getPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      // Check if pyodide script is already loaded
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise((res, rej) => {
          script.onload = res;
          script.onerror = () => rej(new Error('Failed to load Pyodide WebAssembly runtime.'));
        });
      }

      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      resolve(pyodide);
    } catch (err) {
      pyodidePromise = null;
      reject(err);
    }
  });

  return pyodidePromise;
}

/**
 * Runs Python code in the browser WebAssembly sandbox against test cases
 */
export async function runPythonInBrowser(
  problem: CodingProblem,
  userCode: string,
  customInput?: string
): Promise<ExecutionResponse> {
  const startTime = performance.now();

  try {
    const pyodide = await getPyodide();

    const testCasesToRun = customInput !== undefined
      ? [{ id: 'custom', input: customInput, expected_output: '', is_hidden: false }]
      : problem.sample_test_cases;

    const results: TestCaseResult[] = [];
    let passedCount = 0;

    for (let i = 0; i < testCasesToRun.length; i++) {
      const tc = testCasesToRun[i];
      const tcStart = performance.now();

      // Wrap execution to capture stdin/stdout
      const runnerScript = `
import sys
from io import StringIO

sys.stdin = StringIO(${JSON.stringify(tc.input)})
_captured_stdout = StringIO()
_captured_stderr = StringIO()
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr

_execution_error = None
try:
${userCode.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    import traceback
    _execution_error = traceback.format_exc()

_out = _captured_stdout.getvalue()
_err = _captured_stderr.getvalue()
`;

      try {
        await pyodide.runPythonAsync(runnerScript);
        const stdout = pyodide.globals.get('_out') || '';
        const stderr = pyodide.globals.get('_err') || '';
        const execError = pyodide.globals.get('_execution_error');
        const tcTime = Math.max(1, Math.round(performance.now() - tcStart));

        if (execError) {
          return {
            status: 'Runtime Error',
            total_test_cases: testCasesToRun.length,
            passed_test_cases: passedCount,
            execution_time_ms: Math.round(performance.now() - startTime),
            memory_mb: 32,
            runtime_error: execError,
            test_case_results: results,
            message: 'Runtime Error in browser sandbox.',
          };
        }

        const trimmedOut = stdout.trim();
        const trimmedExpected = tc.expected_output.trim();
        const passed = customInput !== undefined ? true : (trimmedOut === trimmedExpected);

        if (passed) passedCount++;

        results.push({
          test_case_id: tc.id || `case-${i + 1}`,
          passed,
          input: tc.input,
          expected_output: tc.expected_output,
          actual_output: trimmedOut,
          stdout,
          stderr,
          is_hidden: tc.is_hidden,
          execution_time_ms: tcTime,
        });
      } catch (runErr: any) {
        return {
          status: 'Compilation Error',
          total_test_cases: testCasesToRun.length,
          passed_test_cases: passedCount,
          execution_time_ms: Math.round(performance.now() - startTime),
          memory_mb: 32,
          compile_error: runErr.message || 'Syntax/Execution Error',
          test_case_results: results,
          message: 'Error executing Python code.',
        };
      }
    }

    const allPassed = passedCount === testCasesToRun.length;

    return {
      status: customInput !== undefined ? 'Finished' : (allPassed ? 'Accepted' : 'Wrong Answer'),
      total_test_cases: testCasesToRun.length,
      passed_test_cases: passedCount,
      execution_time_ms: Math.max(1, Math.round(performance.now() - startTime)),
      memory_mb: 32,
      test_case_results: results,
      message: allPassed 
        ? 'Accepted! All test cases passed in browser sandbox.' 
        : `Wrong Answer (${passedCount}/${testCasesToRun.length} cases passed).`,
    };
  } catch (err: any) {
    // If Pyodide fails to download/initialize (e.g. offline with no cached Wasm)
    return {
      status: 'Internal Error',
      total_test_cases: 0,
      passed_test_cases: 0,
      execution_time_ms: 0,
      memory_mb: 0,
      runtime_error: `Browser Sandbox Error: ${err.message || 'Could not load Pyodide.'}\n\nTo run code with local backend, start:\npython -m uvicorn app.main:app --port 8000`,
      test_case_results: [],
      message: 'Sandbox initialization failed.',
    };
  }
}
