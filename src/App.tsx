import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ComplexityPage } from './pages/ComplexityPage';
import { ArenaPage } from './pages/ArenaPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('array-rotation');
  const [selectedArenaProblemId, setSelectedArenaProblemId] = useState<string | null>(null);

  const handleNavigate = (tab: string, algoId?: string, problemId?: string) => {
    if (algoId) {
      setSelectedAlgoId(algoId);
    }
    if (problemId) {
      setSelectedArenaProblemId(problemId);
    } else if (tab !== 'arena') {
      setSelectedArenaProblemId(null);
    }

    // Protected route check for dashboard
    if (tab === 'dashboard' && !isAuthenticated) {
      setCurrentTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVisualizerFromArena = (visualizerId: string) => {
    handleNavigate('workspace', visualizerId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-slate-100 transition-colors dark:bg-[#070A11] dark:text-slate-100 light:bg-slate-50 light:text-slate-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'explorer' && (
          <ExplorerPage onSelectAlgorithm={(id) => handleNavigate('workspace', id)} />
        )}

        {currentTab === 'workspace' && (
          <VisualizerPage
            initialAlgoId={selectedAlgoId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'arena' && (
          <ArenaPage 
            onOpenVisualizer={handleOpenVisualizerFromArena} 
            initialProblemId={selectedArenaProblemId}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'playground' && (
          <PlaygroundPage />
        )}

        {currentTab === 'complexity' && (
          <ComplexityPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
