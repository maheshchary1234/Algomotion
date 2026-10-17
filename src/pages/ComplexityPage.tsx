import React from 'react';
import { ComplexityComparator } from '../components/complexity/ComplexityComparator';
import { Cpu, BookOpen, Layers, ShieldCheck } from 'lucide-react';

export const ComplexityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Cpu className="w-7 h-7 text-cyan-400" />
          Complexity Analysis Lab
        </h1>
        <p className="text-sm text-slate-400">
          Theoretical time complexity bounds, auxiliary memory consumption, stability classifications, and asymptotic scaling models.
        </p>
      </div>

      {/* Asymptotic Hierarchy Guide */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { notation: 'O(1)', name: 'Constant', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40', desc: 'Hash lookup, array index' },
          { notation: 'O(log n)', name: 'Logarithmic', color: 'text-teal-400 border-teal-800 bg-teal-950/40', desc: 'Binary search, heapify' },
          { notation: 'O(n)', name: 'Linear', color: 'text-blue-400 border-blue-800 bg-blue-950/40', desc: 'Linear search, array rotation' },
          { notation: 'O(n log n)', name: 'Linearithmic', color: 'text-indigo-400 border-indigo-800 bg-indigo-950/40', desc: 'Merge sort, heap sort' },
          { notation: 'O(n²)', name: 'Quadratic', color: 'text-amber-400 border-amber-800 bg-amber-950/40', desc: 'Bubble sort, selection sort' },
          { notation: 'O(2ⁿ)', name: 'Exponential', color: 'text-rose-400 border-rose-800 bg-rose-950/40', desc: 'Fibonacci recursion, Hanoi' },
        ].map((item) => (
          <div key={item.notation} className={`p-3 rounded-xl border flex flex-col gap-1 ${item.color}`}>
            <span className="font-mono font-bold text-sm">{item.notation}</span>
            <span className="font-semibold text-xs text-white">{item.name}</span>
            <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Main Interactive Comparator */}
      <ComplexityComparator />

      {/* Theoretical Grounding & Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-[#0B101E] border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Time Complexity: Theoretical Upper Bounds</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Big-O notation describes an asymptotic mathematical upper bound on the growth rate of algorithm steps as input size n approaches infinity.
            Algorithms in the same complexity class share identical asymptotic scaling, independent of CPU clock frequency or hardware variations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B101E] border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span>Auxiliary Space vs Total Space</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Auxiliary space refers to extra or temporary space allocated by the algorithm outside the input array itself.
            In-place algorithms like Reversal Array Rotation and Quick Sort operate directly within the given storage with O(1) or O(log n) extra memory.
          </p>
        </div>
      </div>
    </div>
  );
};
