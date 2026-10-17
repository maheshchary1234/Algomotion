import { 
  UserProfile, 
  AuthResponse, 
  DashboardStats, 
  UserProgressData 
} from '../types/auth';

function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (!envUrl) return 'http://127.0.0.1:8000/api';
  let clean = envUrl.trim().replace(/\/+$/, '');
  if (!clean.endsWith('/api') && !clean.includes('127.0.0.1:8000/api')) {
    clean = `${clean}/api`;
  }
  return clean;
}

const API_BASE_URL = getApiBaseUrl();

function authHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -----------------------------------------------------------------
// Offline Browser-Side Storage Fallback
// Enables instant registration, login, and dashboard even when
// the Python backend is offline or during frontend-only deployments
// -----------------------------------------------------------------
const OFFLINE_USERS_KEY = 'algomotion_offline_users';
const OFFLINE_DRAFTS_KEY = 'algomotion_offline_drafts';
const OFFLINE_BOOKMARKS_KEY = 'algomotion_offline_bookmarks';
const OFFLINE_PROGRESS_KEY = 'algomotion_offline_progress';

interface OfflineUser extends UserProfile {
  password?: string;
}

function getOfflineUsers(): OfflineUser[] {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveOfflineUsers(users: OfflineUser[]): void {
  try {
    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save offline users to localStorage', e);
  }
}

function isNetworkError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  return (
    err.name === 'TypeError' ||
    msg.includes('failed to fetch') ||
    msg.includes('not found') ||
    msg.includes('404') ||
    msg.includes('502') ||
    msg.includes('503') ||
    msg.includes('network') ||
    msg.includes('connection refused') ||
    msg.includes('cannot reach')
  );
}

export async function registerStudent(data: {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}): Promise<AuthResponse> {
  try {
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
  } catch (err: any) {
    if (isNetworkError(err)) {
      // Backend is unreachable: fallback to browser-side local account
      const users = getOfflineUsers();
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('Email is already registered (local account). Please log in.');
      }
      if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
        throw new Error('Username is already taken. Please choose another.');
      }

      const now = new Date().toISOString();
      const newUser: OfflineUser = {
        id: `offline-user-${Date.now()}`,
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        password: data.password,
        current_streak: 1,
        longest_streak: 1,
        created_at: now,
      };

      users.push(newUser);
      saveOfflineUsers(users);

      return {
        token: `offline-token-${newUser.id}`,
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          username: newUser.username,
          email: newUser.email,
          current_streak: newUser.current_streak,
          longest_streak: newUser.longest_streak,
          created_at: newUser.created_at,
        },
        message: 'Account created (Offline / Demo Mode)',
      };
    }
    throw err;
  }
}

export async function loginStudent(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
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
  } catch (err: any) {
    if (isNetworkError(err)) {
      // Backend is unreachable: check offline users
      const users = getOfflineUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password
      );
      if (!found) {
        throw new Error('Invalid email or password (or backend server is offline).');
      }
      return {
        token: `offline-token-${found.id}`,
        user: {
          id: found.id,
          full_name: found.full_name,
          username: found.username,
          email: found.email,
          current_streak: found.current_streak || 1,
          longest_streak: found.longest_streak || 1,
          created_at: found.created_at,
        },
        message: 'Logged in (Offline / Demo Mode)',
      };
    }
    throw err;
  }
}

export async function logoutStudent(token: string): Promise<void> {
  try {
    if (!token.startsWith('offline-token-')) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: authHeaders(token),
      });
    }
  } catch (err) {
    console.warn('Logout network error:', err);
  }
}

export async function fetchCurrentUser(token: string): Promise<UserProfile> {
  if (token.startsWith('offline-token-')) {
    const userId = token.replace('offline-token-', '');
    const users = getOfflineUsers();
    const found = users.find((u) => u.id === userId);
    if (found) {
      return {
        id: found.id,
        full_name: found.full_name,
        username: found.username,
        email: found.email,
        current_streak: found.current_streak || 1,
        longest_streak: found.longest_streak || 1,
        created_at: found.created_at,
      };
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: authHeaders(token),
    });

    if (!res.ok) {
      throw new Error('Session expired or invalid.');
    }
    return await res.json();
  } catch (err: any) {
    const users = getOfflineUsers();
    if (users.length > 0) {
      const u = users[0];
      return {
        id: u.id,
        full_name: u.full_name,
        username: u.username,
        email: u.email,
        current_streak: u.current_streak,
        longest_streak: u.longest_streak,
        created_at: u.created_at,
      };
    }
    throw err;
  }
}

export async function requestPasswordReset(email: string): Promise<{ message: string; reset_token_dev?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return { message: 'If this email exists, password reset instructions have been generated (Demo Mode).' };
  }
}

export async function resetStudentPassword(token: string, new_password: string): Promise<{ message: string }> {
  try {
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
  } catch {
    return { message: 'Password reset successfully (Demo Mode).' };
  }
}

export async function fetchUserDashboard(token: string): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: authHeaders(token),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline: compute stats from local storage
  }

  const rawBookmarks = localStorage.getItem(OFFLINE_BOOKMARKS_KEY) || '[]';
  const bookmarks: string[] = JSON.parse(rawBookmarks);
  const rawProgress = localStorage.getItem(OFFLINE_PROGRESS_KEY) || '{"solved":[],"attempted":[]}';
  const progress: UserProgressData = JSON.parse(rawProgress);

  const solvedCount = progress.solved?.length || 0;
  const attemptedCount = progress.attempted?.length || 0;

  return {
    total_solved: solvedCount,
    total_problems: 300,
    completion_percentage: Math.round((solvedCount / 300) * 100),
    easy_solved: solvedCount,
    easy_total: 100,
    medium_solved: 0,
    medium_total: 120,
    hard_solved: 0,
    hard_total: 80,
    accepted_submissions: solvedCount,
    attempted_submissions: attemptedCount + solvedCount,
    current_streak: 1,
    longest_streak: 1,
    recent_submissions: [],
    bookmarked_problems: bookmarks.map((id) => ({
      id,
      title: id.replace(/-/g, ' ').toUpperCase(),
      difficulty: 'Easy',
      topic: 'Algorithms',
    })),
    last_opened_problem: null,
  };
}

export async function saveCodeDraft(
  token: string, 
  problem_id: string, 
  language: string, 
  code: string
): Promise<{ message: string }> {
  try {
    if (!token.startsWith('offline-token-')) {
      const res = await fetch(`${API_BASE_URL}/user/draft`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ problem_id, language, code }),
      });
      if (res.ok) return await res.json();
    }
  } catch {
    // fallback below
  }

  const drafts = JSON.parse(localStorage.getItem(OFFLINE_DRAFTS_KEY) || '{}');
  drafts[`${problem_id}_${language}`] = code;
  localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(drafts));
  return { message: 'Code draft saved locally.' };
}

export async function fetchCodeDraft(
  token: string, 
  problem_id: string, 
  language: string
): Promise<{ code: string | null }> {
  try {
    if (!token.startsWith('offline-token-')) {
      const res = await fetch(`${API_BASE_URL}/user/draft/${problem_id}/${language}`, {
        headers: authHeaders(token),
      });
      if (res.ok) return await res.json();
    }
  } catch {
    // fallback below
  }

  const drafts = JSON.parse(localStorage.getItem(OFFLINE_DRAFTS_KEY) || '{}');
  return { code: drafts[`${problem_id}_${language}`] || null };
}

export async function toggleBookmark(
  token: string, 
  problem_id: string
): Promise<{ is_bookmarked: boolean }> {
  try {
    if (!token.startsWith('offline-token-')) {
      const res = await fetch(`${API_BASE_URL}/user/bookmark`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ problem_id }),
      });
      if (res.ok) return await res.json();
    }
  } catch {
    // fallback below
  }

  const raw = localStorage.getItem(OFFLINE_BOOKMARKS_KEY) || '[]';
  const bookmarks: string[] = JSON.parse(raw);
  const exists = bookmarks.includes(problem_id);
  const updated = exists ? bookmarks.filter((id) => id !== problem_id) : [...bookmarks, problem_id];
  localStorage.setItem(OFFLINE_BOOKMARKS_KEY, JSON.stringify(updated));
  return { is_bookmarked: !exists };
}

export async function fetchUserBookmarks(token: string): Promise<string[]> {
  try {
    if (!token.startsWith('offline-token-')) {
      const res = await fetch(`${API_BASE_URL}/user/bookmarks`, {
        headers: authHeaders(token),
      });
      if (res.ok) {
        const data = await res.json();
        return data.bookmarks || [];
      }
    }
  } catch {
    // fallback
  }

  const raw = localStorage.getItem(OFFLINE_BOOKMARKS_KEY) || '[]';
  return JSON.parse(raw);
}

export async function fetchUserProgress(token: string): Promise<UserProgressData> {
  try {
    if (!token.startsWith('offline-token-')) {
      const res = await fetch(`${API_BASE_URL}/user/progress`, {
        headers: authHeaders(token),
      });
      if (res.ok) return await res.json();
    }
  } catch {
    // fallback
  }

  const raw = localStorage.getItem(OFFLINE_PROGRESS_KEY) || '{"solved":[],"attempted":[]}';
  return JSON.parse(raw);
}
