import React, { useState, useEffect } from 'react';
import { 
  AlgorithmDefinition, 
  SupportedLanguage 
} from '../types/algorithm';
import { ALGORITHM_REGISTRY, getAlgorithmById } from '../algorithms/registry';
import { useExecution } from '../hooks/useExecution';
import { ExecutionControls } from '../components/execution/ExecutionControls';
import { VariablesInspector } from '../components/execution/VariablesInspector';
import { ExplanationCard } from '../components/execution/ExplanationCard';
import { CodeEditorPanel } from '../components/editor/CodeEditorPanel';
import { ComplexityPanel } from '../components/complexity/ComplexityPanel';
import { ArrayRotationVisualizer } from '../components/visualizers/ArrayRotationVisualizer';
import { SortingVisualizer } from '../components/visualizers/SortingVisualizer';
import { SearchingVisualizer } from '../components/visualizers/SearchingVisualizer';
import { RecursionVisualizer } from '../components/visualizers/RecursionVisualizer';
import { DataStructuresVisualizer } from '../components/visualizers/DataStructuresVisualizer';
import { QuizModal } from '../components/quiz/QuizModal';
import { 
  Award, 
  RotateCcw, 
  Share2, 
  Sliders, 
  Maximize2, 
  Columns, 
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface VisualizerPageProps {
  initialAlgoId?: string;
  onNavigate: (tab: string, algoId?: string) => void;
}

export const VisualizerPage: React.FC<VisualizerPageProps> = ({
  initialAlgoId = 'array-rotation',
  onNavigate,
}) => {
  const initialAlgo = getAlgorithmById(initialAlgoId) || ALGORITHM_REGISTRY[0];
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'canvas' | 'code' | 'details'>('canvas');

  // Custom execution hook
  const {
    algorithm,
    changeAlgorithm,
    inputState,
    setInputState,
    playerState,
    currentStep,
    handlePlay,
    handlePause,
    handleNextStep,
    handlePrevStep,
    handleReset,
    handleJumpToStep,
    handleSpeedChange,
  } = useExecution(initialAlgo);

  // Sync if initialAlgoId prop changes from navigation
  useEffect(() => {
    if (initialAlgoId && initialAlgoId !== algorithm.id) {
      const match = getAlgorithmById(initialAlgoId);
      if (match) changeAlgorithm(match);
    }
  }, [initialAlgoId, changeAlgorithm, algorithm.id]);

  // Handler for sorting visualizer array mutations
  const handleGenerateRandomArray = () => {
    const randomArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    setInputState({ ...inputState, array: randomArray });
  };

  const handleCustomArray = (newArr: number[]) => {
    setInputState({ ...inputState, array: newArr });
  };

  const handleSortArray = () => {
    const sorted = [...(inputState.array || [])].sort((a, b) => a - b);
    setInputState({ ...inputState, array: sorted });
  };

  // Specific visualizer renderer
  const renderVisualizerCanvas = () => {
    if (algorithm.id === 'array-rotation') {
      return (
        <ArrayRotationVisualizer
          currentStep={currentStep}
          direction={inputState.direction || 'left'}
          k={inputState.k ?? 3}
          method={inputState.method || 'reversal'}
          onDirectionChange={(d) => setInputState({ ...inputState, direction: d })}
          onKChange={(k) => setInputState({ ...inputState, k })}
          onMethodChange={(m) => setInputState({ ...inputState, method: m })}
        />
      );
    }

    if (algorithm.category === 'sorting') {
      return (
        <SortingVisualizer
          currentStep={currentStep}
          onGenerateRandom={handleGenerateRandomArray}
          onCustomArray={handleCustomArray}
        />
      );
    }

    if (algorithm.category === 'searching') {
      return (
        <SearchingVisualizer
          currentStep={currentStep}
          target={inputState.target ?? 23}
          onTargetChange={(t) => setInputState({ ...inputState, target: t })}
          onSortArray={handleSortArray}
          isBinarySearch={algorithm.id.includes('binary')}
        />
      );
    }

    if (algorithm.category === 'recursion') {
      return (
        <RecursionVisualizer
          currentStep={currentStep}
          algoId={algorithm.id}
        />
      );
    }

    if (algorithm.category === 'data-structures') {
      const dsType = algorithm.id.includes('stack')
        ? 'stack'
        : algorithm.id.includes('queue')
        ? 'queue'
        : 'linked-list';

      return (
        <DataStructuresVisualizer
          currentStep={currentStep}
          dsType={dsType}
          onExecuteCommand={(cmd) => {
            if (dsType === 'linked-list') {
              setInputState({
                initial: [10, 20, 30],
                operation: cmd,
                listType: cmd.listType || 'singly',
              });
            } else {
              setInputState({
                commands: [{ type: cmd.type, value: cmd.value }],
              });
            }
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
      {/* Workspace Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B101E] border border-slate-800 shadow-xl">
        {/* Algorithm Dropdown & Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={algorithm.id}
              onChange={(e) => {
                const found = getAlgorithmById(e.target.value);
                if (found) changeAlgorithm(found);
              }}
              className="appearance-none px-4 py-2 pr-9 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-white font-bold text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {ALGORITHM_REGISTRY.map((a) => (
                <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                  {a.name} ({a.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              algorithm.difficulty === 'Easy'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : algorithm.difficulty === 'Medium'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-rose-950 text-rose-300 border-rose-800'
            }`}>
              {algorithm.difficulty}
            </span>
            <span className="text-xs text-slate-400 max-w-sm truncate">
              {algorithm.shortDescription}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Challenge & Quiz Button */}
          <button
            onClick={() => setShowQuizModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900/60 transition-colors shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Challenge Quiz</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Only on screens narrower than md: 768px) */}
      <div className="flex md:hidden items-center justify-around bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setMobileActiveTab('canvas')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            mobileActiveTab === 'canvas' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          Visualization
        </button>
        <button
          onClick={() => setMobileActiveTab('code')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            mobileActiveTab === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileActiveTab('details')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
            mobileActiveTab === 'details' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          Details & Scope
        </button>
      </div>

      {/* Main 4-Panel Resizable / Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch min-h-[640px]">
        {/* Panel 1: Code Editor (Desktop 5 columns) */}
        <div className={`md:col-span-5 h-[620px] ${mobileActiveTab === 'code' ? 'block' : 'hidden md:block'}`}>
          <CodeEditorPanel
            language={language}
            onLanguageChange={setLanguage}
            codePython={algorithm.codePython}
            codeJava={algorithm.codeJava}
            currentLinePython={currentStep?.linePython}
            currentLineJava={currentStep?.lineJava}
          />
        </div>

        {/* Panel 2: Visualization Canvas + Controls (Desktop 7 columns) */}
        <div className={`md:col-span-7 flex flex-col gap-4 ${mobileActiveTab === 'canvas' ? 'block' : 'hidden md:flex'}`}>
          {/* Visualizer Canvas */}
          <div className="flex-1 min-h-[420px] rounded-2xl bg-[#090D16] border border-slate-800 p-4 shadow-xl">
            {renderVisualizerCanvas()}
          </div>

          {/* Execution Controls Panel */}
          <ExecutionControls
            currentStepIndex={playerState.currentStepIndex}
            totalSteps={playerState.steps.length}
            isPlaying={playerState.isPlaying}
            speedMs={playerState.speedMs}
            onPlay={handlePlay}
            onPause={handlePause}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            onJumpToStep={handleJumpToStep}
          />

          {/* Step Explanation Card */}
          <ExplanationCard currentStep={currentStep} />
        </div>
      </div>

      {/* Panel 3 & 4: Execution Details, Live Variables & Complexity Analysis */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-5 ${mobileActiveTab === 'details' ? 'block' : 'hidden md:grid'}`}>
        {/* Live Variables Inspector */}
        <div className="lg:col-span-5 h-[280px]">
          <VariablesInspector
            variables={currentStep?.variables || {}}
            changedVariables={currentStep?.changedVariables}
            operation={currentStep?.operation}
            isComplete={currentStep?.isComplete}
          />
        </div>

        {/* Complexity Metadata Card */}
        <div className="lg:col-span-7">
          <ComplexityPanel complexity={algorithm.complexity} />
        </div>
      </div>

      {/* Challenge Quiz Modal */}
      <QuizModal
        algorithmName={algorithm.name}
        questions={algorithm.quizQuestions}
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
      />
    </div>
  );
};
