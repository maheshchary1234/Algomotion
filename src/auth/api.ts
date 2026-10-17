import { 
  UserProfile, 
  AuthResponse, 
  DashboardStats, 
  UserProgressData 
} from '../types/auth';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function registerStudent(data: {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Registration failed. Please check your details.');
  }
  return body as AuthResponse;
}

export async function loginStudent(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Invalid email or password.');
  }
  return body as AuthResponse;
}

export async function logoutStudent(token: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders(token),
    });
  } catch (err) {
    console.error('Logout error:', err);
  }
}

export async function fetchCurrentUser(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error('Session expired or invalid.');
  }
  return await res.json();
}

export async function requestPasswordReset(email: string): Promise<{ message: string; reset_token_dev?: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function resetStudentPassword(token: string, new_password: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Failed to reset password.');
  }
  return body;
}

export async function fetchUserDashboard(token: string): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/user/dashboard`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error('Failed to load student dashboard.');
  }
  return await res.json();
}

export async function saveCodeDraft(
  token: string, 
  problem_id: string, 
  language: string, 
  code: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/user/draft`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ problem_id, language, code }),
  });

  if (!res.ok) {
    throw new Error('Failed to save code draft.');
  }
  return await res.json();
}

export async function fetchCodeDraft(
  token: string, 
  problem_id: string, 
  language: string
): Promise<{ code: string | null }> {
  const res = await fetch(`${API_BASE_URL}/user/draft/${problem_id}/${language}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    return { code: null };
  }
  return await res.json();
}

export async function toggleBookmark(
  token: string, 
  problem_id: string
): Promise<{ is_bookmarked: boolean }> {
  const res = await fetch(`${API_BASE_URL}/user/bookmark`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ problem_id }),
  });

  if (!res.ok) {
    throw new Error('Failed to toggle bookmark.');
  }
  return await res.json();
}

export async function fetchUserBookmarks(token: string): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/user/bookmarks`, {
    headers: authHeaders(token),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.bookmarks || [];
}

export async function fetchUserProgress(token: string): Promise<UserProgressData> {
  const res = await fetch(`${API_BASE_URL}/user/progress`, {
    headers: authHeaders(token),
  });

  if (!res.ok) return { solved: [], attempted: [] };
  return await res.json();
}
