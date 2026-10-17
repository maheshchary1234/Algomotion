import React from 'react';
import { LeaderboardUser } from '../../types/arena';
import { Trophy, Award, Flame, X, CheckCircle, Medal } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: LeaderboardUser[];
  userSolvedCount: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  users,
  userSolvedCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0B101E] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Coding Arena Leaderboard</h3>
              <p className="text-xs text-slate-400">Top competitive programmers and global rankings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-blue-950/30 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-[#0B101E] rounded-full flex items-center justify-center font-bold text-white">
                YOU
              </div>
            </div>
            <div>
              <span className="font-bold text-white text-sm">Your Status</span>
              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <span>Solved: <strong className="text-emerald-400">{userSolvedCount}</strong> problems</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> Active Streak
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Rating Points</span>
            <span className="font-mono font-bold text-base text-cyan-300">{userSolvedCount * 120 + 200} pts</span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Coder</th>
                <th className="py-2.5 px-3">Badge</th>
                <th className="py-2.5 px-3">Solved</th>
                <th className="py-2.5 px-3">Streak</th>
                <th className="py-2.5 px-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => {
                let medalColor = 'text-slate-400';
                if (u.rank === 1) medalColor = 'text-amber-400';
                else if (u.rank === 2) medalColor = 'text-slate-200';
                else if (u.rank === 3) medalColor = 'text-amber-600';

                return (
                  <tr key={u.rank} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 font-bold">
                      <span className={`flex items-center gap-1.5 ${medalColor}`}>
                        {u.rank <= 3 && <Medal className="w-3.5 h-3.5 fill-current" />}
                        #{u.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-white">
                      {u.username}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-purple-300">
                        {u.badge}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      {u.solved_count}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {u.streak_days}d
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-cyan-300">
                      {u.points.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
