import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Compass, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Play, 
  RotateCw, 
  Code2, 
  GitBranch, 
  CheckCircle2, 
  Sparkles,
  Search,
  Shuffle
} from 'lucide-react';
import { ALGORITHM_REGISTRY } from '../algorithms/registry';

interface LandingPageProps {
  onNavigate: (tab: string, algoId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Interactive sample array on Hero
  const [heroArray, setHeroArray] = useState<number[]>([42, 17, 89, 33, 65, 12, 78]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [comparingIdx, setComparingIdx] = useState<number | null>(null);

  // Auto-play subtle sorting demo on hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroArray(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * (next.length - 1));
        setActiveIdx(i);
        setComparingIdx(i + 1);
        if (next[i] > next[i + 1]) {
          const t = next[i];
          next[i] = next[i + 1];
          next[i + 1] = t;
        }
        return next;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const handleShuffleHero = () => {
    setHeroArray(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const categories = [
    {
      id: 'arrays',
      name: 'Arrays & Strings',
      count: 'Left & Right Rotations, Modulo Math',
      desc: 'Master in-place memory rotation and linear contiguous structures.',
      icon: RotateCw,
      gradient: 'from-blue-600 to-cyan-500',
      algoId: 'array-rotation',
    },
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      count: 'Bubble, Selection, Insertion, Merge, Quick, Heap',
      desc: 'Visualize comparisons, swaps, pivot selections, and partitioning.',
      icon: Activity,
      gradient: 'from-indigo-600 to-blue-500',
      algoId: 'bubble-sort',
    },
    {
      id: 'searching',
      name: 'Searching Algorithms',
      count: 'Linear, Iterative Binary, Recursive Binary',
      desc: 'Trace search bounds (low, mid, high) and logarithmic halving.',
      icon: Search,
      gradient: 'from-cyan-600 to-teal-500',
      algoId: 'binary-search',
    },
    {
      id: 'recursion',
      name: 'Recursion Trees',
      count: 'Factorial, Fibonacci, Array Sum, Hanoi',
      desc: 'Follow activation records on call stacks and unwinding returns.',
      icon: GitBranch,
      gradient: 'from-purple-600 to-indigo-500',
      algoId: 'fibonacci',
    },
    {
      id: 'data-structures',
      name: 'Data Structures Playground',
      count: 'Stack, Queue, Singly & Doubly Linked Lists',
      desc: 'Experiment with LIFO, FIFO, and dynamic pointer manipulation.',
      icon: Layers,
      gradient: 'from-emerald-600 to-cyan-500',
      algoId: 'stack-ds',
    },
  ];

  const features = [
    {
      title: 'Step-by-Step Bidirectional Time-Travel',
      desc: 'Step forward and backward with guaranteed state restoration. Never miss a single pointer shift or variable update.',
      icon: Play,
      border: 'border-blue-500/30',
    },
    {
      title: 'Dual-Language Code Highlighting',
      desc: 'Inspect equivalent Python 3 and Java 21 implementations with active source line synchronization during visualization.',
      icon: Code2,
      border: 'border-cyan-500/30',
    },
    {
      title: 'Rigorous Complexity Analysis',
      desc: 'Deep dive into theoretical Big-O curves, auxiliary space reasoning, in-place behavior, and stability verification.',
      icon: Cpu,
      border: 'border-purple-500/30',
    },
    {
      title: 'Interactive Data Structures',
      desc: 'Push and pop stacks, enqueue and dequeue queues, and rewrite node pointers in singly and doubly linked lists.',
      icon: Layers,
      border: 'border-emerald-500/30',
    },
  ];

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-6 sm:pt-12">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-md shadow-blue-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Visual Learning for Students & Engineers</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
          >
            Understand Algorithms, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              One Step at a Time.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed"
          >
            AlgoMotion bridges the gap between static theory and dynamic programming reality.
            Inspect variable memory, step through execution traces, and watch source code execute line-by-line in Python and Java.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('workspace')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all scale-100 hover:scale-105"
            >
              <Activity className="w-4 h-4" />
              <span>Start Visualizing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('arena')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Enter Coding Arena</span>
            </button>

            <button
              onClick={() => onNavigate('explorer')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all shadow-md"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Explore Algorithms</span>
            </button>
          </motion.div>

          {/* Interactive Hero Sample Array Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0B101E] to-[#070A11] border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">
                  Live Interactive Engine Demo
                </span>
              </div>
              <button
                onClick={handleShuffleHero}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 transition-colors"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle Demo</span>
              </button>
            </div>

            {/* Interactive Bars */}
            <div className="h-44 sm:h-52 flex items-end justify-center gap-2 sm:gap-4 py-2">
              {heroArray.map((val, idx) => {
                const isActive = activeIdx === idx;
                const isComparing = comparingIdx === idx;
                const heightPercent = Math.max(15, Math.round((val / 100) * 100));

                let barColor = 'bg-gradient-to-t from-blue-700 to-cyan-500 border-cyan-400';
                if (isActive) barColor = 'bg-gradient-to-t from-rose-700 to-red-500 border-rose-400 shadow-lg shadow-rose-500/40';
                if (isComparing) barColor = 'bg-gradient-to-t from-amber-600 to-yellow-400 border-yellow-300 shadow-md shadow-amber-500/30';

                return (
                  <div key={idx} className="flex-1 max-w-[55px] flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300">
                      {val}
                    </span>
                    <motion.div
                      layout
                      style={{ height: `${heightPercent}%` }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`w-full rounded-t-xl border-t border-x ${barColor}`}
                    />
                    <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Unsorted
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Comparing
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Swapping
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Algorithm Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Explore 16 built-in interactive modules spanning essential interview and academic curricula.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'data-structures') {
                    onNavigate('playground');
                  } else {
                    onNavigate('workspace', cat.algoId);
                  }
                }}
                className="group p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.gradient} p-0.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-[#0B101E] rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-mono text-blue-400 font-semibold mt-1">
                    {cat.count}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-cyan-400">
                  <span>Launch Visualizer</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/80 to-[#0B101E] border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineered for Deep Conceptual Learning
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every detail is designed to remove algorithmic abstraction and turn complex code execution into clear visual logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-slate-950/70 border ${feat.border} flex items-start gap-4`}
                >
                  <div className="p-3 rounded-xl bg-blue-600/10 text-cyan-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How AlgoMotion Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Three simple steps to unlock complete algorithmic comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-white">Choose Your Algorithm & Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select any sorting, searching, recursion tree, or array rotation algorithm. Use preloaded edge cases or type your own custom data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-white">Step Forward & Backward</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute with full time-travel capability. Every step highlights the exact executing line in Python or Java while updating local variables.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-mono font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-white">Master Big-O Complexity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze best, average, and worst-case mathematical curves. Test your knowledge with interactive algorithm challenges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
