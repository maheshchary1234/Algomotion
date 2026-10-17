import React from 'react';
import { 
  Activity, 
  Compass, 
  Layers, 
  Cpu, 
  Sun, 
  Moon, 
  RotateCw, 
  GitFork, 
  Zap
} from 'lucide-react';
import { Theme } from '../../hooks/useTheme';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, algoId?: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070A11]/90 backdrop-blur-md transition-colors dark:bg-[#070A11]/90 light:bg-white/95 light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0B101E] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white dark:text-white light:text-slate-900">
                Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Motion</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              See the Logic. Master the Algorithm.
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'home'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'explorer'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Explorer
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'workspace'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Workspace
          </button>

          <button
            onClick={() => onNavigate('arena')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'arena'
                ? 'bg-cyan-600/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Coding Arena</span>
          </button>

          <button
            onClick={() => onNavigate('playground')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'playground'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            DS Playground
          </button>

          <button
            onClick={() => onNavigate('complexity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'complexity'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Complexity Lab
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick jump to Array Rotation */}
          <button
            onClick={() => onNavigate('workspace', 'array-rotation')}
            title="Jump to Array Rotation Visualizer"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/50 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Array Rotation</span>
          </button>

          {/* Quick jump to Recursion Tree */}
          <button
            onClick={() => onNavigate('workspace', 'fibonacci')}
            title="Jump to Recursion Tree Visualizer"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-purple-400 bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/50 transition-colors"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Recursion Tree</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 border border-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Launch visualizer button */}
          <button
            onClick={() => onNavigate('workspace')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Launch</span>
          </button>
        </div>
      </div>
    </header>
  );
};
