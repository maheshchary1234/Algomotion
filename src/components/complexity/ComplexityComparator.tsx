import React, { useState } from 'react';
import { ALGORITHM_REGISTRY } from '../../algorithms/registry';
import { Cpu, Calculator, Zap, ArrowRight } from 'lucide-react';

export const ComplexityComparator: React.FC = () => {
  const [inputSize, setInputSize] = useState<number>(1000);
  const [selectedCategory, setSelectedCategory] = useState<string>('sorting');

  const algorithms = ALGORITHM_REGISTRY.filter(
    a => selectedCategory === 'all' || a.category === selectedCategory
  );

  // Theoretical operations calculation based on Big-O formula
  const computeTheoreticalOps = (complexityStr: string, n: number): string => {
    if (complexityStr.includes('O(1)')) return '1';
    if (complexityStr.includes('O(log n)')) return `${Math.round(Math.log2(n))}`;
    if (complexityStr.includes('O(n log n)')) return `${Math.round(n * Math.log2(n)).toLocaleString()}`;
    if (complexityStr.includes('O(n²)')) return `${Math.round(n * n).toLocaleString()}`;
    if (complexityStr.includes('O(2ⁿ)')) return n <= 25 ? `${Math.pow(2, n).toLocaleString()}` : 'Overflow (>10⁷)';
    if (complexityStr.includes('O(n)')) return `${n.toLocaleString()}`;
    return '—';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Input Size Simulator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/40 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              Algorithm Complexity & Growth Comparator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulate theoretical operation counts across different input sizes $N$ to understand asymptotic scalability.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {['all', 'sorting', 'searching', 'arrays', 'recursion'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Input Size Slider */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-300">Input Size (N):</span>
            <span className="px-3 py-1 rounded-lg bg-blue-950 border border-blue-800 text-cyan-300 font-mono font-bold text-sm">
              N = {inputSize.toLocaleString()}
            </span>
          </div>

          <div className="flex-1 w-full max-w-md flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500">10</span>
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={inputSize}
              onChange={(e) => setInputSize(parseInt(e.target.value, 10))}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[10px] font-mono text-slate-500">10,000</span>
          </div>

          <div className="flex gap-1.5">
            {[10, 100, 1000, 5000].map((preset) => (
              <button
                key={preset}
                onClick={() => setInputSize(preset)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  inputSize === preset
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B101E] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Algorithm</th>
                <th className="py-3.5 px-3 font-semibold">Category</th>
                <th className="py-3.5 px-3 font-semibold">Best Time</th>
                <th className="py-3.5 px-3 font-semibold">Average Time</th>
                <th className="py-3.5 px-3 font-semibold">Worst Time</th>
                <th className="py-3.5 px-3 font-semibold">Aux Space</th>
                <th className="py-3.5 px-3 font-semibold text-cyan-300">Worst Ops for N={inputSize.toLocaleString()}</th>
                <th className="py-3.5 px-3 font-semibold">In-Place</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {algorithms.map((algo) => {
                const worstOps = computeTheoreticalOps(algo.complexity.timeWorst, inputSize);

                return (
                  <tr key={algo.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{algo.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 capitalize font-sans">
                      {algo.category}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 font-semibold">
                      {algo.complexity.timeBest}
                    </td>
                    <td className="py-3.5 px-3 text-blue-400 font-semibold">
                      {algo.complexity.timeAverage || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-amber-400 font-semibold">
                      {algo.complexity.timeWorst}
                    </td>
                    <td className="py-3.5 px-3 text-purple-400 font-semibold">
                      {algo.complexity.spaceAuxiliary}
                    </td>
                    <td className="py-3.5 px-3 text-cyan-300 font-bold bg-cyan-950/20">
                      ~ {worstOps}
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        algo.complexity.inPlace ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {algo.complexity.inPlace ? 'Yes' : 'No'}
                      </span>
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
