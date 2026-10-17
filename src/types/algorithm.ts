export type AlgorithmCategory = 
  | 'arrays'
  | 'sorting'
  | 'searching'
  | 'recursion'
  | 'data-structures';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type SupportedLanguage = 'python' | 'java';

export interface ComplexityInfo {
  timeBest: string;
  timeAverage?: string;
  timeWorst: string;
  spaceAuxiliary: string;
  timeExplanation: string;
  spaceExplanation: string;
  inPlace?: boolean;
  stability?: boolean;
}

export interface RecursionStackFrame {
  id: string;
  functionName: string;
  args: Record<string, any>;
  depth: number;
  parentId?: string;
  status: 'calling' | 'executing' | 'base_case' | 'returning' | 'returned';
  returnValue?: any;
  explanation?: string;
}

export interface RecursionTreeNode {
  id: string;
  name: string;
  argsString: string;
  depth: number;
  status: 'active' | 'completed' | 'base_case' | 'pending';
  returnValue?: any;
  children?: RecursionTreeNode[];
}

export interface ExecutionStep {
  stepIndex: number;
  operation: string; // e.g., 'compare', 'swap', 'pivot', 'insert', 'rotate', 'call', 'return', 'done'
  linePython?: number;
  lineJava?: number;
  explanation: string;
  
  // Array & sorting/searching state
  array?: number[];
  highlightIndices?: {
    comparing?: number[];
    swapping?: number[];
    sorted?: number[];
    pivot?: number;
    active?: number[];
    low?: number;
    mid?: number;
    high?: number;
    found?: number;
  };

  // Intermediate array rotation state
  rotationState?: {
    currentPhase: string;
    originalArray: number[];
    rotatedArray: number[];
    k: number;
    effectiveK: number;
    direction: 'left' | 'right';
    method: 'reversal' | 'brute-force';
    reversalSteps?: {
      description: string;
      range: [number, number];
      arraySnapshot: number[];
    }[];
  };

  // Recursion state
  callStack?: RecursionStackFrame[];
  treeSnapshot?: RecursionTreeNode;
  activeCallId?: string;

  // Data structure state
  stackItems?: { id: string; value: any; isTop?: boolean }[];
  queueItems?: { id: string; value: any; isFront?: boolean; isRear?: boolean }[];
  linkedListNodes?: {
    id: string;
    value: any;
    nextId?: string | null;
    prevId?: string | null;
    isHead?: boolean;
    isTail?: boolean;
    isCurrent?: boolean;
    isTarget?: boolean;
  }[];

  // Tower of Hanoi rods state
  hanoiRods?: {
    A: number[];
    B: number[];
    C: number[];
  };

  // Variable inspector
  variables: Record<string, any>;
  changedVariables?: string[];

  // Counters & Metrics
  comparisonsCount?: number;
  swapsCount?: number;
  operationsCount?: number;
  isComplete?: boolean;
}

export interface AlgorithmInputConfig {
  type: 'array' | 'array_and_target' | 'rotation_params' | 'single_number' | 'two_numbers' | 'ds_command';
  defaultArray?: number[];
  defaultTarget?: number;
  defaultK?: number;
  defaultDirection?: 'left' | 'right';
  defaultN?: number;
  minN?: number;
  maxN?: number;
  requiresSorted?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  slug: string;
  category: AlgorithmCategory;
  difficulty: DifficultyLevel;
  shortDescription: string;
  detailedDescription: string;
  pseudocode: string;
  codePython: string;
  codeJava: string;
  complexity: ComplexityInfo;
  inputConfig: AlgorithmInputConfig;
  generateTrace: (input: any) => ExecutionStep[];
  commonMistakes?: string[];
  quizQuestions?: QuizQuestion[];
}
