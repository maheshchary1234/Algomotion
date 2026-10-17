import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Compass, 
  Layers, 
  Cpu, 
  Sun, 
  Moon, 
  RotateCw, 
  GitFork, 
  Zap,
  User,
  Flame,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { Theme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

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
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    setIsDropdownOpen(false);
    await logout();
    onNavigate('home');
  };

  return (
    <>
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
              id="navbar-arena-tab"
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

            {isAuthenticated && (
              <button
                id="navbar-dashboard-tab"
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dashboard</span>
              </button>
            )}

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
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/50 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Array Rotation</span>
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

            {/* Authentication Controls */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2" ref={dropdownRef}>
                {/* Streak Badge */}
                <button
                  id="navbar-streak-badge"
                  onClick={() => onNavigate('dashboard')}
                  title={`Current daily streak: ${user.current_streak} days`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  <span>{user.current_streak}d</span>
                </button>

                {/* User Dropdown Trigger */}
                <div className="relative">
                  <button
                    id="navbar-user-menu-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-[11px] text-white">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1326] border border-slate-800 shadow-2xl py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-800/80">
                        <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                        <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                      </div>

                      <div className="py-1">
                        <button
                          id="dropdown-dashboard-btn"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigate('dashboard');
                          }}
                          className="w-full px-4 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors text-left"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Student Dashboard</span>
                        </button>

                        <button
                          id="dropdown-arena-btn"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onNavigate('arena');
                          }}
                          className="w-full px-4 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors text-left"
                        >
                          <Zap className="w-3.5 h-3.5 text-blue-400" />
                          <span>Coding Arena</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-800/80 pt-1">
                        <button
                          id="dropdown-logout-btn"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  Log In
                </button>
                <button
                  id="navbar-register-btn"
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-500/20 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1326] border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Confirm Sign Out</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to log out of AlgoMotion? Your saved drafts and progress will remain securely stored on your account.
            </p>
            <div className="flex gap-2">
              <button
                id="cancel-logout-btn"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-logout-btn"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
