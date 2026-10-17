import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bookmark, 
  Code2, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Calendar, 
  User, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Loader2,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserDashboard } from '../auth/api';
import { DashboardStats } from '../types/auth';

interface DashboardPageProps {
  onNavigate: (tab: string, algoId?: string, problemId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStats = async () => {
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchUserDashboard(token);
      setStats(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load progress data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#070A11]">
        <div className="bg-[#0D1326] border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <User className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Student Dashboard</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please log in or register to access your personalized learning metrics, saved drafts, and streaks.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800 hover:bg-cyan-900/50 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070A11] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1427] via-[#0E1B38] to-[#0A182F] border border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#070A11] rounded-[14px] flex items-center justify-center font-bold text-2xl text-cyan-400">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user?.full_name}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium">
                    @{user?.username}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}</span>
                  <span>•</span>
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadStats}
                disabled={isLoading}
                title="Refresh stats"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
              <button
                id="dashboard-continue-practicing-top-btn"
                onClick={() => {
                  if (stats?.last_opened_problem) {
                    onNavigate('arena', undefined, stats.last_opened_problem.problem_id);
                  } else {
                    onNavigate('arena');
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Practicing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && !stats && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm">Fetching student progress from database...</p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {errorMessage}
          </div>
        )}

        {stats && (
          <>
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Daily Streak Card */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Daily Streak
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
                    {stats.current_streak}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    day{stats.current_streak === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Longest record: <span className="text-slate-300 font-semibold">{stats.longest_streak} days</span>
                </p>
              </div>

              {/* Total Solved Card */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Solved Problems
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {stats.total_solved}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    / {stats.total_problems}
                  </span>
                </div>
                <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${stats.completion_percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  <span className="text-cyan-400 font-semibold">{stats.completion_percentage}%</span> total completion
                </p>
              </div>

              {/* Submissions Ratio */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Accepted Submissions
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {stats.accepted_submissions}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    / {stats.attempted_submissions} attempts
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Acceptance rate:{' '}
                  <span className="text-purple-400 font-semibold">
                    {stats.attempted_submissions > 0 
                      ? Math.round((stats.accepted_submissions / stats.attempted_submissions) * 100) 
                      : 0}%
                  </span>
                </p>
              </div>

              {/* Bookmarks Count */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Bookmarked
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-cyan-400 tracking-tight">
                    {stats.bookmarked_problems.length}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    saved for later
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Quick access from this dashboard
                </p>
              </div>

            </div>

            {/* Difficulty Breakdown & Last Opened Problem Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Difficulty Breakdown (1 Col) */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      Difficulty Breakdown
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Easy */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-emerald-400">Easy</span>
                        <span className="text-slate-400">
                          {stats.easy_solved} <span className="text-slate-600">/</span> {stats.easy_total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${stats.easy_total > 0 ? (stats.easy_solved / stats.easy_total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Medium */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-amber-400">Medium</span>
                        <span className="text-slate-400">
                          {stats.medium_solved} <span className="text-slate-600">/</span> {stats.medium_total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${stats.medium_total > 0 ? (stats.medium_solved / stats.medium_total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Hard */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-rose-400">Hard</span>
                        <span className="text-slate-400">
                          {stats.hard_solved} <span className="text-slate-600">/</span> {stats.hard_total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${stats.hard_total > 0 ? (stats.hard_solved / stats.hard_total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Overall Mastery</span>
                  <span className="font-bold text-white">{stats.completion_percentage}% Complete</span>
                </div>
              </div>

              {/* Last Opened Problem & Saved Code (2 Cols) */}
              <div className="lg:col-span-2 rounded-2xl bg-[#0D1326] border border-slate-800/80 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-blue-400" />
                      Last Active Workspace & Saved Code
                    </h3>
                    {stats.last_opened_problem && (
                      <span className="text-[11px] text-slate-500">
                        Autosaved in database
                      </span>
                    )}
                  </div>

                  {stats.last_opened_problem ? (
                    <div>
                      <div className="flex items-center justify-between mb-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white">
                              {stats.last_opened_problem.title}
                            </span>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                              stats.last_opened_problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              stats.last_opened_problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {stats.last_opened_problem.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Topic: {stats.last_opened_problem.topic} • Language: <span className="font-mono text-cyan-400 uppercase">{stats.last_opened_problem.language}</span>
                          </p>
                        </div>

                        <button
                          id="dashboard-resume-problem-btn"
                          onClick={() => onNavigate('arena', undefined, stats.last_opened_problem?.problem_id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/25 shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume Solving</span>
                        </button>
                      </div>

                      {/* Code Draft Snippet */}
                      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090D18]">
                        <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                          <span>solution.{stats.last_opened_problem.language === 'python' ? 'py' : 'java'} (Cloud Draft)</span>
                          <span className="text-[10px] text-emerald-400">Synced ✓</span>
                        </div>
                        <pre className="p-3 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto leading-relaxed">
                          {stats.last_opened_problem.saved_code || '# No custom draft saved yet. Default starter code ready.'}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-slate-800/60">
                      <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-300">No active workspace recorded yet</p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        Jump into the Coding Arena to start solving competitive programming questions.
                      </p>
                      <button
                        id="dashboard-start-first-problem-btn"
                        onClick={() => onNavigate('arena')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start First Problem</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Recent Submissions & Bookmarks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Submissions */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Recent Submissions
                  </h3>
                  <span className="text-xs text-slate-500">
                    Latest {stats.recent_submissions.length} attempts
                  </span>
                </div>

                {stats.recent_submissions.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.recent_submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-slate-700 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {sub.problem_title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-cyan-400 uppercase">{sub.language}</span> • {sub.passed_test_cases}/{sub.total_test_cases} test cases • {sub.execution_time_ms}ms
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            sub.status === 'Accepted'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No submissions recorded yet. Run tests and submit your solution in the Arena!
                  </div>
                )}
              </div>

              {/* Bookmarked Problems */}
              <div className="rounded-2xl bg-[#0D1326] border border-slate-800/80 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-cyan-400" />
                    Bookmarked Problems
                  </h3>
                  <span className="text-xs text-slate-500">
                    {stats.bookmarked_problems.length} saved
                  </span>
                </div>

                {stats.bookmarked_problems.length > 0 ? (
                  <div className="space-y-2.5">
                    {stats.bookmarked_problems.map((prob) => (
                      <div
                        key={prob.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-slate-700 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {prob.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Topic: {prob.topic}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {prob.difficulty}
                          </span>
                          <button
                            id={`dashboard-open-bookmark-${prob.id}`}
                            onClick={() => onNavigate('arena', undefined, prob.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                            title="Open in Coding Arena"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No bookmarked problems. Click the bookmark icon next to any problem in the Arena to save it here!
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};
