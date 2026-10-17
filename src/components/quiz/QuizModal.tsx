import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types/algorithm';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, X } from 'lucide-react';

interface QuizModalProps {
  algorithmName: string;
  questions?: QuizQuestion[];
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  algorithmName,
  questions = [],
  isOpen,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  // Fallback default questions if algorithm has none specified
  const effectiveQuestions: QuizQuestion[] = questions.length > 0 ? questions : [
    {
      id: 'default-1',
      question: `What is the primary benefit of understanding ${algorithmName} step-by-step?`,
      options: [
        'It allows predicting edge cases, space constraints, and runtime behavior.',
        'It makes code run faster without needing compiler optimization.',
        'It eliminates the need for unit testing.',
        'It guarantees O(1) space complexity on all inputs.',
      ],
      correctIndex: 0,
      explanation: 'Step-by-step visualization illuminates loop invariants, state transitions, and memory allocation patterns.',
    },
    {
      id: 'default-2',
      question: `Which case dictates the worst-case asymptotic upper bound of ${algorithmName}?`,
      options: [
        'An empty array input.',
        'The input arrangement that triggers the maximum number of operations.',
        'Running on a 64-bit architecture.',
        'Executing on a multi-threaded CPU.',
      ],
      correctIndex: 1,
      explanation: 'Worst-case time complexity O(f(n)) analyzes the maximum operations required across all valid inputs of size n.',
    },
  ];

  const currentQ = effectiveQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < effectiveQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#0B101E] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Algorithm Challenge & Quiz</h3>
              <p className="text-[11px] text-slate-400">Testing your mastery of {algorithmName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isFinished ? (
            <div className="flex flex-col gap-4">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Question {currentIdx + 1} of {effectiveQuestions.length}</span>
                <span>Score: {score} / {effectiveQuestions.length}</span>
              </div>

              {/* Question Text */}
              <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((option, idx) => {
                  let optStyle = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200';

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (idx === selectedOption) {
                      optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation on Answer */}
              {isAnswered && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mt-2">
                  <strong className="text-cyan-400">Explanation: </strong>
                  {currentQ.explanation}
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30"
                >
                  {currentIdx < effectiveQuestions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              )}
            </div>
          ) : (
            /* Finished Score Screen */
            <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0B101E] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-white">Challenge Completed!</h4>
              <p className="text-xs text-slate-400">
                You scored <strong className="text-emerald-400 font-mono text-sm">{score}</strong> out of {effectiveQuestions.length}!
              </p>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
