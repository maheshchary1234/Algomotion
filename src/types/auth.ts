export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  current_streak: number;
  longest_streak: number;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  message: string;
}

export interface RecentSubmissionItem {
  id: string;
  problem_id: string;
  problem_title: string;
  language: string;
  status: string;
  passed_test_cases: number;
  total_test_cases: number;
  execution_time_ms: number;
  created_at: string;
}

export interface BookmarkedProblemItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface LastOpenedProblem {
  problem_id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  language: string;
  saved_code: string | null;
  updated_at: string;
}

export interface DashboardStats {
  total_solved: number;
  total_problems: number;
  completion_percentage: number;
  easy_solved: number;
  easy_total: number;
  medium_solved: number;
  medium_total: number;
  hard_solved: number;
  hard_total: number;
  accepted_submissions: number;
  attempted_submissions: number;
  current_streak: number;
  longest_streak: number;
  recent_submissions: RecentSubmissionItem[];
  bookmarked_problems: BookmarkedProblemItem[];
  last_opened_problem: LastOpenedProblem | null;
}

export interface UserProgressData {
  solved: string[];
  attempted: string[];
}
