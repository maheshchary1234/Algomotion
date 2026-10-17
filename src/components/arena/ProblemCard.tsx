import React from 'react';
import { CodingProblem } from '../../types/arena';
import { CheckCircle2, Bookmark, BookmarkCheck, ArrowRight, Eye, Sparkles } from 'lucide-react';

interface ProblemCardProps {
  problem: CodingProblem;
  isSolved: boolean;
  isBookmarked: boolean;
  onSelect: (id: string) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onOpenVisualizer?: (visualizerId: string, e: React.MouseEvent) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  isSolved,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  onOpenVisualizer,
}) => {
  const diffBadgeColor =
    problem.difficulty === 'Easy'
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
      : problem.difficulty === 'Medium'
      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
      : 'bg-rose-950/80 text-rose-300 border-rose-800';

  return (
    <div
      onClick={() => onSelect(problem.id)}
      className="p-5 rounded-2xl bg-[#0B101E] border border-slate-800 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${diffBadgeColor}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-400 font-medium font-sans">
              {problem.topic}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isSolved && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved</span>
              </span>
            )}
            <button
              onClick={(e) => onToggleBookmark(problem.id, e)}
              className="p-1 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
          <span>{problem.title}</span>
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {problem.visualizer_id ? (
          <button
            onClick={(e) => onOpenVisualizer && onOpenVisualizer(problem.visualizer_id!, e)}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
            title="Open algorithm logic in AlgoMotion visualizer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Visualizer</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-500">Competitive Core</span>
        )}

        <div className="flex items-center gap-1 text-slate-300 group-hover:text-white font-semibold">
          <span>Solve</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
