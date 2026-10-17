import { CodingProblem, ExecutionResponse, SubmissionRecord, LeaderboardUser } from '../types/arena';
import { runPythonInBrowser } from './browserRunner';
import { getProblemById } from './problems';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export interface BackendHealth {
  isAvailable: boolean;
  service?: string;
  supported_languages?: string[];
  error?: string;
}

export async function checkBackendHealth(): Promise<BackendHealth> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return { isAvailable: true, ...data };
    }
    return { isAvailable: false, error: `HTTP ${res.status}` };
  } catch (err: any) {
    return { isAvailable: false, error: err.message || 'Cannot reach backend server' };
  }
}

export async function fetchArenaProblems(): Promise<CodingProblem[]> {
  const res = await fetch(`${API_BASE_URL}/arena/problems`);
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.statusText}`);
  const data = await res.json();
  return data.problems;
}

export async function fetchProblemDetails(problemId: string): Promise<CodingProblem> {
  const res = await fetch(`${API_BASE_URL}/arena/problems/${problemId}`);
  if (!res.ok) throw new Error(`Problem not found: ${problemId}`);
  return await res.json();
}

export async function executeRunCode(
  problemId: string,
  language: string,
  code: string,
  customInput?: string
): Promise<ExecutionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/arena/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problem_id: problemId,
        language,
        code,
        custom_input: customInput || null,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend unavailable, fallback to browser sandbox below
  }

  // Fallback to in-browser execution
  if (language === 'python') {
    const prob = getProblemById(problemId);
    if (prob) {
      return await runPythonInBrowser(prob, code, customInput);
    }
  }

  return {
    status: 'Internal Error',
    total_test_cases: 0,
    passed_test_cases: 0,
    execution_time_ms: 0,
    memory_mb: 0,
    compile_error: null,
    runtime_error: 'Java execution requires the backend server. Start local backend with `uvicorn app.main:app --port 8000` or switch language to Python to execute in your browser.',
    test_case_results: [],
    message: 'Backend Offline for Java',
  };
}

export async function executeSubmitSolution(
  problemId: string,
  language: string,
  code: string,
  token?: string | null
): Promise<ExecutionResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token && !token.startsWith('offline-token-')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/arena/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        problem_id: problemId,
        language,
        code,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend unavailable, fallback to browser sandbox below
  }

  // Fallback to in-browser execution
  if (language === 'python') {
    const prob = getProblemById(problemId);
    if (prob) {
      return await runPythonInBrowser(prob, code);
    }
  }

  return {
    status: 'Internal Error',
    total_test_cases: 0,
    passed_test_cases: 0,
    execution_time_ms: 0,
    memory_mb: 0,
    compile_error: null,
    runtime_error: 'Java execution requires the backend server. Start local backend with `uvicorn app.main:app --port 8000` or switch language to Python to execute in your browser.',
    test_case_results: [],
    message: 'Backend Offline for Java',
  };
}

export async function fetchSubmissions(problemId?: string): Promise<SubmissionRecord[]> {
  const url = problemId
    ? `${API_BASE_URL}/arena/submissions?problem_id=${encodeURIComponent(problemId)}`
    : `${API_BASE_URL}/arena/submissions`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.submissions || [];
}

export async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
  const res = await fetch(`${API_BASE_URL}/arena/leaderboard`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.leaderboard || [];
}
