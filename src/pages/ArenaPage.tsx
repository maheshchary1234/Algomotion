import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Editor from '@monaco-editor/react';
import { 
  CodingProblem, 
  ArenaLanguage, 
  ExecutionResponse, 
  SubmissionRecord, 
  LeaderboardUser 
} from '../types/arena';
import { ARENA_PROBLEMS, getProblemById } from '../arena/problems';
import { 
  checkBackendHealth, 
  executeRunCode, 
  executeSubmitSolution, 
  fetchSubmissions, 
  fetchLeaderboard 
} from '../arena/api';
import { ProblemCard } from '../components/arena/ProblemCard';
import { ProblemDescription } from '../components/arena/ProblemDescription';
import { TestCasePanel } from '../components/arena/TestCasePanel';
import { OutputConsole } from '../components/arena/OutputConsole';
import { LeaderboardModal } from '../components/arena/LeaderboardModal';
import { 
  Swords, 
  Play, 
  Send, 
  RotateCcw, 
  Search, 
  Trophy, 
  CheckCircle2, 
  Bookmark, 
  Flame, 
  ArrowLeft, 
  Server, 
  ServerOff, 
  Filter,
  Sparkles,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface ArenaPageProps {
  onOpenVisualizer: (visualizerId: string) => void;
}

export const ArenaPage: React.FC<ArenaPageProps> = ({ onOpenVisualizer }) => {
  // Navigation / View state
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');

  // Backend state
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(false);

  // User persistence state
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('algomotion-arena-solved');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('algomotion-arena-bookmarks');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Workspace state
  const [language, setLanguage] = useState<ArenaLanguage>('python');
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResponse | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  // Leaderboard modal state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);

  // Check backend health on mount
  const verifyBackend = async () => {
    setIsCheckingBackend(true);
    const health = await checkBackendHealth();
    setIsBackendConnected(health.isAvailable);
    setIsCheckingBackend(false);
  };

  useEffect(() => {
    verifyBackend();
    fetchLeaderboard().then(users => {
      if (users.length > 0) setLeaderboardUsers(users);
    });
  }, []);

  // Sync active problem & load starter code or saved draft
  useEffect(() => {
    if (!selectedProblemId) return;
    const prob = getProblemById(selectedProblemId);
    if (!prob) return;

    // Load saved draft or starter code
    const draftKey = `algomotion-draft-${prob.id}-${language}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setCode(savedDraft);
    } else {
      setCode(language === 'python' ? prob.starter_code_python : prob.starter_code_java);
    }

    // Set sample input for custom test case
    if (prob.sample_test_cases.length > 0) {
      setCustomInput(prob.sample_test_cases[0].input);
    }

    // Load submissions for this problem
    fetchSubmissions(prob.id).then(subs => setSubmissions(subs));
    setExecutionResult(null);
  }, [selectedProblemId, language]);

  // Persist code drafts on change
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    if (selectedProblemId) {
      localStorage.setItem(`algomotion-draft-${selectedProblemId}-${language}`, val);
    }
  };

  const handleResetCode = () => {
    if (!selectedProblemId) return;
    const prob = getProblemById(selectedProblemId);
    if (!prob) return;
    const starter = language === 'python' ? prob.starter_code_python : prob.starter_code_java;
    setCode(starter);
    localStorage.removeItem(`algomotion-draft-${selectedProblemId}-${language}`);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('algomotion-arena-bookmarks', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleRunCode = async () => {
    if (!selectedProblemId) return;
    setIsRunning(true);
    try {
      const resp = await executeRunCode(
        selectedProblemId,
        language,
        code,
        isCustomSelected ? customInput : undefined
      );
      setExecutionResult(resp);
    } catch (err: any) {
      setExecutionResult({
        status: 'Internal Error',
        total_test_cases: 0,
        passed_test_cases: 0,
        execution_time_ms: 0,
        memory_mb: 0,
        runtime_error: err.message || 'Execution failed',
        test_case_results: [],
        message: 'Failed to communicate with sandbox execution service.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedProblemId) return;
    setIsRunning(true);
    try {
      const resp = await executeSubmitSolution(selectedProblemId, language, code);
      setExecutionResult(resp);

      // Refresh submissions
      const updatedSubs = await fetchSubmissions(selectedProblemId);
      setSubmissions(updatedSubs);

      // If accepted on ALL test cases
      if (resp.status === 'Accepted') {
        setSolvedProblemIds(prev => {
          const next = new Set(prev);
          next.add(selectedProblemId);
          localStorage.setItem('algomotion-arena-solved', JSON.stringify(Array.from(next)));
          return next;
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setExecutionResult({
        status: 'Internal Error',
        total_test_cases: 0,
        passed_test_cases: 0,
        execution_time_ms: 0,
        memory_mb: 0,
        runtime_error: err.message || 'Submission failed',
        test_case_results: [],
        message: 'Could not connect to sandbox execution engine.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Filter problems for directory view
  const filteredProblems = ARENA_PROBLEMS.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;

    const matchesTopic =
      selectedTopic === 'all' || p.topic === selectedTopic;

    let matchesStatus = true;
    if (statusFilter === 'solved') matchesStatus = solvedProblemIds.has(p.id);
    else if (statusFilter === 'unsolved') matchesStatus = !solvedProblemIds.has(p.id);
    else if (statusFilter === 'bookmarked') matchesStatus = bookmarkedIds.has(p.id);

    return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
  });

  const activeProblem = selectedProblemId ? getProblemById(selectedProblemId) : null;

  // Daily Challenge Problem
  const dailyProblem = ARENA_PROBLEMS[0]; // Rotate Array

  // If in Workspace Mode (solving a problem)
  if (activeProblem) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
        {/* Workspace Sub-header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0B101E] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProblemId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Problems</span>
            </button>

            <span className="text-slate-600">|</span>

            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span>{activeProblem.title}</span>
              {solvedProblemIds.has(activeProblem.id) && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            {/* Backend Health indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border ${
              isBackendConnected
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}>
              {isBackendConnected ? (
                <>
                  <Server className="w-3 h-3 text-emerald-400" />
                  <span>Sandbox Active (port 8000)</span>
                </>
              ) : (
                <>
                  <ServerOff className="w-3 h-3 text-amber-400" />
                  <span>Backend Offline</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLanguage('python')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  language === 'python' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python 3.11
              </button>
              <button
                onClick={() => setLanguage('java')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  language === 'java' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Java 25
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={handleResetCode}
              title="Reset code to starter template"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Run Code */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>

            {/* Submit Solution */}
            <button
              onClick={handleSubmitSolution}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Evaluating...' : 'Submit Solution'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[720px]">
          {/* Left Column: Problem Description, Hints, Editorial, Submissions (5 cols) */}
          <div className="lg:col-span-5 h-[720px]">
            <ProblemDescription
              problem={activeProblem}
              submissions={submissions}
              onOpenVisualizer={onOpenVisualizer}
            />
          </div>

          {/* Right Column: Code Editor + Test Cases & Output Console (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 h-[720px]">
            {/* Top: Monaco Code Editor */}
            <div className="h-[430px] rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden shadow-xl relative">
              <Editor
                height="100%"
                language={language === 'python' ? 'python' : 'java'}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 13,
                  fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>

            {/* Bottom: Testcase Panel & Output Console Tabs */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[260px]">
              <TestCasePanel
                sampleTestCases={activeProblem.sample_test_cases}
                customInput={customInput}
                onCustomInputChange={setCustomInput}
                selectedCaseIndex={selectedCaseIndex}
                onSelectCaseIndex={setSelectedCaseIndex}
                isCustomSelected={isCustomSelected}
                onSelectCustom={setIsCustomSelected}
              />

              <OutputConsole
                result={executionResult}
                isLoading={isRunning}
                isBackendConnected={isBackendConnected}
                onRetryConnection={verifyBackend}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise: Problem Directory & Platform Overview
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Swords className="w-8 h-8 text-cyan-400" />
            AlgoMotion Coding Arena
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Solve competitive programming challenges in Python & Java with sandboxed automated test evaluations.
          </p>
        </div>

        {/* Global Stats & Leaderboard Launcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 hover:bg-amber-900/60 transition-colors shadow-md"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          {/* Backend Status indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border ${
            isBackendConnected
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
            <span>{isBackendConnected ? 'Execution Sandbox Online' : 'Sandbox Offline'}</span>
          </div>
        </div>
      </div>

      {/* Featured Daily Challenge Banner */}
      {dailyProblem && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-purple-950/60 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Daily Challenge
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {dailyProblem.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {dailyProblem.topic}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {dailyProblem.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl line-clamp-2 leading-relaxed">
              {dailyProblem.description}
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 w-full md:w-auto">
            {dailyProblem.visualizer_id && (
              <button
                onClick={() => onOpenVisualizer(dailyProblem.visualizer_id!)}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900/60 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Visualize First</span>
              </button>
            )}

            <button
              onClick={() => setSelectedProblemId(dailyProblem.id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition-all"
            >
              <span>Solve Today's Challenge</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'unsolved', 'solved', 'bookmarked'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === d ? 'bg-slate-800 text-cyan-300 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d === 'all' ? 'All' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            No coding challenges found matching your filters.
          </div>
        ) : (
          filteredProblems.map((prob) => (
            <ProblemCard
              key={prob.id}
              problem={prob}
              isSolved={solvedProblemIds.has(prob.id)}
              isBookmarked={bookmarkedIds.has(prob.id)}
              onSelect={setSelectedProblemId}
              onToggleBookmark={toggleBookmark}
              onOpenVisualizer={onOpenVisualizer}
            />
          ))
        )}
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        users={leaderboardUsers}
        userSolvedCount={solvedProblemIds.size}
      />
    </div>
  );
};
