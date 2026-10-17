import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  HardDrive, 
  Activity, 
  ArrowRight, 
  Sparkles,
  History,
  Tag
} from 'lucide-react';
import { ALGORITHM_REGISTRY } from '../algorithms/registry';
import { AlgorithmDefinition, AlgorithmCategory, DifficultyLevel } from '../types/algorithm';

interface ExplorerPageProps {
  onSelectAlgorithm: (algoId: string) => void;
}

export const ExplorerPage: React.FC<ExplorerPageProps> = ({ onSelectAlgorithm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [recentAlgoIds, setRecentAlgoIds] = useState<string[]>([]);

  // Load recently viewed algorithms from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('algomotion-recent-algos');
      if (stored) {
        setRecentAlgoIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse recent algorithms:', e);
    }
  }, []);

  const handleCardClick = (id: string) => {
    // Save to recents
    try {
      const updated = [id, ...recentAlgoIds.filter(i => i !== id)].slice(0, 5);
      setRecentAlgoIds(updated);
      localStorage.setItem('algomotion-recent-algos', JSON.stringify(updated));
    } catch (e) {}

    onSelectAlgorithm(id);
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'arrays', label: 'Arrays & Strings' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'searching', label: 'Searching' },
    { id: 'recursion', label: 'Recursion' },
    { id: 'data-structures', label: 'Data Structures' },
  ];

  const difficulties: { id: string; label: string }[] = [
    { id: 'all', label: 'All Difficulties' },
    { id: 'Easy', label: 'Easy' },
    { id: 'Medium', label: 'Medium' },
    { id: 'Hard', label: 'Hard' },
  ];

  // Filtering
  const filteredAlgorithms = ALGORITHM_REGISTRY.filter((algo) => {
    const matchesSearch =
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || algo.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'all' || algo.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Recent algorithms resolution
  const recentAlgorithms = recentAlgoIds
    .map(id => ALGORITHM_REGISTRY.find(a => a.id === id))
    .filter(Boolean) as AlgorithmDefinition[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Algorithm Explorer
        </h1>
        <p className="text-sm text-slate-400">
          Discover, filter, and inspect {ALGORITHM_REGISTRY.length} interactive algorithm simulations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, category, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown / Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {difficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === d.id
                    ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed Algorithms Shelf */}
      {recentAlgorithms.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recently Viewed Algorithms</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {recentAlgorithms.map((algo) => (
              <button
                key={`recent-${algo.id}`}
                onClick={() => handleCardClick(algo.id)}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 text-left transition-all"
              >
                <div className="text-xs font-bold text-white truncate">{algo.name}</div>
                <div className="text-[10px] text-slate-400 capitalize mt-0.5">{algo.category}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            No algorithms found matching your search and filter criteria. Try adjusting your filters.
          </div>
        ) : (
          filteredAlgorithms.map((algo) => {
            const diffColor =
              algo.difficulty === 'Easy'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : algo.difficulty === 'Medium'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-rose-950 text-rose-300 border-rose-800';

            return (
              <div
                key={algo.id}
                className="p-6 rounded-2xl bg-[#0B101E] border border-slate-800 hover:border-blue-500/40 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  {/* Category and Difficulty Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                      {algo.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${diffColor}`}>
                      {algo.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {algo.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {algo.shortDescription}
                  </p>

                  {/* Complexities Badges */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400">Time:</span>
                      <span className="font-bold text-amber-300">{algo.complexity.timeWorst}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <HardDrive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="text-slate-400">Space:</span>
                      <span className="font-bold text-purple-300">{algo.complexity.spaceAuxiliary}</span>
                    </div>
                  </div>
                </div>

                {/* Visualize Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleCardClick(algo.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-blue-600 border border-slate-700/80 hover:border-blue-500 transition-all shadow-md group-hover:shadow-blue-600/30"
                  >
                    <Activity className="w-4 h-4 text-cyan-400 group-hover:text-white" />
                    <span>Visualize Algorithm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
