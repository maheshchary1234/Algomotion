import { Zap, Heart, Terminal, BookOpen, Code2, MessageSquare, Compass } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, algoId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A11] text-slate-400 py-12 transition-colors dark:bg-[#070A11] light:bg-slate-50 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0B101E] rounded-[6px] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-white text-base">AlgoMotion</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              "See the Logic. Master the Algorithm." An interactive visual learning environment designed for computer science students, competitive programmers, and software engineers.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>16 Built-in Algorithms & DS</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Algorithm Suites
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('workspace', 'array-rotation')} 
                  className="hover:text-blue-400 transition-colors"
                >
                  Array Rotation (Modulo & Reversal)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workspace', 'bubble-sort')} 
                  className="hover:text-blue-400 transition-colors"
                >
                  Sorting Visualizers (Bubble, Quick, Merge)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workspace', 'binary-search')} 
                  className="hover:text-blue-400 transition-colors"
                >
                  Searching (Linear & Binary)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workspace', 'fibonacci')} 
                  className="hover:text-blue-400 transition-colors"
                >
                  Recursion Trees & Call Stacks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('playground')} 
                  className="hover:text-blue-400 transition-colors"
                >
                  Stack, Queue & Linked Lists
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Learning Lab
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('complexity')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Time & Space Complexity Analyzer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('workspace', 'tower-of-hanoi')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Tower of Hanoi Visualizer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('explorer')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  All 16 Algorithms Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 mb-2.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Keyboard Shortcuts
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center text-slate-400">
                <span>Play / Pause</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Space</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Next Step</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">→</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Previous Step</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">←</kbd>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Reset Execution</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">R</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} AlgoMotion. Engineered with precision for computer science learners worldwide.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub</span>
            </a>
            <button onClick={() => onNavigate('explorer')} className="flex items-center gap-1 hover:text-white transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Documentation</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
