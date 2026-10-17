export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemTopic = 
  | 'Arrays' 
  | 'Strings' 
  | 'Sorting' 
  | 'Searching' 
  | 'Recursion' 
  | 'Stacks' 
  | 'Queues' 
  | 'Linked Lists';

export type ArenaLanguage = 'python' | 'java';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemTestCase {
  id: string;
  input: string;
  expected_output: string;
  is_hidden?: boolean;
  explanation?: string;
}

export interface CodingProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  topic: ProblemTopic;
  tags: string[];
  visualizer_id?: string; // Links to AlgoMotion visualizer (e.g. 'array-rotation', 'binary-search', 'stack-ds')
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  examples: ProblemExample[];
  sample_test_cases: ProblemTestCase[];
  hidden_test_cases_count?: number;
  starter_code_python: string;
  starter_code_java: string;
  hints: string[];
  editorial: string;
}

export interface TestCaseResult {
  test_case_id: string;
  passed: boolean;
  input: string;
  expected_output: string;
  actual_output?: string;
  stdout?: string | null;
  stderr?: string | null;
  is_hidden?: boolean;
  execution_time_ms: number;
}

export interface ExecutionResponse {
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'Internal Error' | 'Finished';
  total_test_cases: number;
  passed_test_cases: number;
  execution_time_ms: number;
  memory_mb: number;
  compile_error?: string | null;
  runtime_error?: string | null;
  test_case_results: TestCaseResult[];
  message: string;
}

export interface SubmissionRecord {
  id: string;
  problem_id: string;
  problem_title: string;
  language: string;
  status: string;
  passed_test_cases: number;
  total_test_cases: number;
  execution_time_ms: number;
  timestamp: string;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  solved_count: number;
  points: number;
  streak_days: number;
  badge: string;
}
