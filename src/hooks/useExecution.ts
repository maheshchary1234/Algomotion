import { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmDefinition, ExecutionStep } from '../types/algorithm';
import { TracePlayer, PlayerState } from '../engine/traceEngine';

export function useExecution(initialAlgorithm: AlgorithmDefinition, initialInputConfig?: any) {
  const [algorithm, setAlgorithm] = useState<AlgorithmDefinition>(initialAlgorithm);
  const [inputState, setInputState] = useState<any>(() => {
    if (initialInputConfig) return initialInputConfig;
    const cfg = initialAlgorithm.inputConfig;
    if (cfg.type === 'rotation_params') {
      return { array: cfg.defaultArray || [1, 2, 3, 4, 5], k: cfg.defaultK || 2, direction: cfg.defaultDirection || 'left', method: 'reversal' };
    }
    if (cfg.type === 'array_and_target') {
      return { array: cfg.defaultArray || [10, 20, 30, 40], target: cfg.defaultTarget || 30 };
    }
    if (cfg.type === 'single_number') {
      return { n: cfg.defaultN || 4 };
    }
    return { array: cfg.defaultArray || [64, 34, 25, 12, 22, 11, 90] };
  });

  const [playerState, setPlayerState] = useState<PlayerState>({
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    speedMs: 600,
    isComplete: false,
  });

  const playerRef = useRef<TracePlayer | null>(null);

  // Initialize TracePlayer instance
  useEffect(() => {
    playerRef.current = new TracePlayer((newState) => {
      setPlayerState(newState);
    }, 600);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Invalidate trace & generate new trace whenever algorithm or inputState changes
  const regenerateTrace = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const generatedSteps = algorithm.generateTrace(inputState);
      playerRef.current.loadTrace(generatedSteps);
    } catch (err) {
      console.error('Error generating trace:', err);
    }
  }, [algorithm, inputState]);

  useEffect(() => {
    regenerateTrace();
  }, [regenerateTrace]);

  // Player controls
  const handlePlay = useCallback(() => playerRef.current?.play(), []);
  const handlePause = useCallback(() => playerRef.current?.pause(), []);
  const handleTogglePlay = useCallback(() => playerRef.current?.togglePlay(), []);
  const handleNextStep = useCallback(() => playerRef.current?.nextStep(), []);
  const handlePrevStep = useCallback(() => playerRef.current?.prevStep(), []);
  const handleReset = useCallback(() => playerRef.current?.reset(), []);
  const handleJumpToStep = useCallback((idx: number) => playerRef.current?.jumpToStep(idx), []);
  const handleSpeedChange = useCallback((ms: number) => playerRef.current?.setSpeed(ms), []);

  // Change algorithm
  const changeAlgorithm = useCallback((newAlgo: AlgorithmDefinition) => {
    setAlgorithm(newAlgo);
    const cfg = newAlgo.inputConfig;
    if (cfg.type === 'rotation_params') {
      setInputState({ array: cfg.defaultArray || [1, 2, 3, 4, 5], k: cfg.defaultK || 2, direction: cfg.defaultDirection || 'left', method: 'reversal' });
    } else if (cfg.type === 'array_and_target') {
      setInputState({ array: cfg.defaultArray || [2, 5, 8, 12, 16, 23, 38], target: cfg.defaultTarget || 16 });
    } else if (cfg.type === 'single_number') {
      setInputState({ n: cfg.defaultN || 4 });
    } else {
      setInputState({ array: cfg.defaultArray || [64, 34, 25, 12, 22, 11, 90] });
    }
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused inside an input, textarea, or Monaco editor
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('.monaco-editor')
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextStep, handlePrevStep, handleReset]);

  const currentStep: ExecutionStep | null =
    playerState.steps.length > 0 && playerState.currentStepIndex < playerState.steps.length
      ? playerState.steps[playerState.currentStepIndex]
      : null;

  return {
    algorithm,
    changeAlgorithm,
    inputState,
    setInputState,
    playerState,
    currentStep,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleNextStep,
    handlePrevStep,
    handleReset,
    handleJumpToStep,
    handleSpeedChange,
    regenerateTrace,
  };
}
