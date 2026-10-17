import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ComplexityPage } from './pages/ComplexityPage';
import { ArenaPage } from './pages/ArenaPage';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('array-rotation');

  const handleNavigate = (tab: string, algoId?: string) => {
    if (algoId) {
      setSelectedAlgoId(algoId);
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
          <ArenaPage onOpenVisualizer={handleOpenVisualizerFromArena} />
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

export default App;
