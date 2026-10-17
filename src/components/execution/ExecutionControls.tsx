import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Gauge, 
  FastForward,
  Keyboard
} from 'lucide-react';

interface ExecutionControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speedMs: number;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  onJumpToStep: (stepIndex: number) => void;
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speedMs,
  onPlay,
  onPause,
  onNextStep,
  onPrevStep,
  onReset,
  onSpeedChange,
  onJumpToStep,
}) => {
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  // Speed options mapping: speedMs to label
  const speedOptions = [
    { label: '0.5x', ms: 1200 },
    { label: '1x', ms: 600 },
    { label: '1.5x', ms: 400 },
    { label: '2x', ms: 250 },
    { label: '4x', ms: 120 },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#0B101E]/95 border border-slate-800 shadow-xl backdrop-blur-md">
      {/* Progress Bar & Step Slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Step {totalSteps > 0 ? currentStepIndex + 1 : 0} of {totalSteps}
          </span>
          <span className="text-[11px] font-semibold text-cyan-400">
            {Math.round(progressPercent)}%
          </span>
        </div>

        {/* Seekable Range Slider */}
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-cyan-400 transition-colors"
        />
      </div>

      {/* Primary Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset to beginning (R)"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex <= 0}
            title="Previous Step (←)"
            className={`p-2.5 rounded-xl border transition-colors ${
              currentStepIndex <= 0
                ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-600/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 ring-1 ring-blue-400'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={onNextStep}
            disabled={totalSteps === 0 || currentStepIndex >= totalSteps - 1}
            title="Next Step (→)"
            className={`p-2.5 rounded-xl border transition-colors ${
              totalSteps === 0 || currentStepIndex >= totalSteps - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speed Multiplier */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {speedOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onSpeedChange(opt.ms)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                speedMs === opt.ms
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
