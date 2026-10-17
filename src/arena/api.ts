import { CodingProblem, ExecutionResponse, SubmissionRecord, LeaderboardUser } from '../types/arena';

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
    const timeoutId = setTimeout(() => controller.abort(), 2000);
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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Failed to execute code');
  }

  return await res.json();
}

export async function executeSubmitSolution(
  problemId: string,
  language: string,
  code: string,
  token?: string | null
): Promise<ExecutionResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/arena/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      problem_id: problemId,
      language,
      code,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Failed to submit solution');
  }

  return await res.json();
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
