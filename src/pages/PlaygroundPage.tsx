import React, { useState } from 'react';
import { DataStructuresVisualizer } from '../components/visualizers/DataStructuresVisualizer';
import { generateStackDemoTrace } from '../algorithms/dataStructures/stack';
import { generateQueueDemoTrace } from '../algorithms/dataStructures/queue';
import { generateLinkedListTrace, LLType } from '../algorithms/dataStructures/linkedList';
import { Layers, ArrowRight, Play, Info } from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
  const [activeDS, setActiveDS] = useState<'stack' | 'queue' | 'linked-list'>('stack');
  const [listType, setListType] = useState<LLType>('singly');

  // Track manual state for DS operations
  const [stackItems, setStackItems] = useState<number[]>([10, 25, 40]);
  const [queueItems, setQueueItems] = useState<number[]>([15, 30, 45]);
  const [llNodes, setLlNodes] = useState<number[]>([10, 20, 30]);
  const [lastMessage, setLastMessage] = useState<string>('Ready for interaction.');

  const handleExecuteCommand = (cmd: any) => {
    if (activeDS === 'stack') {
      if (cmd.type === 'push') {
        if (stackItems.length >= 7) {
          setLastMessage('Stack Overflow! Maximum capacity (7) reached.');
          return;
        }
        setStackItems(prev => [...prev, cmd.value]);
        setLastMessage(`PUSH(${cmd.value}): Added ${cmd.value} to top of stack.`);
      } else if (cmd.type === 'pop') {
        if (stackItems.length === 0) {
          setLastMessage('Stack Underflow! Cannot pop from empty stack.');
          return;
        }
        const popped = stackItems[stackItems.length - 1];
        setStackItems(prev => prev.slice(0, prev.length - 1));
        setLastMessage(`POP(): Removed top element ${popped}.`);
      } else if (cmd.type === 'peek') {
        const top = stackItems.length > 0 ? stackItems[stackItems.length - 1] : 'None';
        setLastMessage(`PEEK(): Top element is ${top}.`);
      } else if (cmd.type === 'isEmpty') {
        setLastMessage(`IS_EMPTY(): ${stackItems.length === 0} (Size: ${stackItems.length})`);
      }
    } else if (activeDS === 'queue') {
      if (cmd.type === 'enqueue') {
        if (queueItems.length >= 7) {
          setLastMessage('Queue Full! Maximum capacity (7) reached.');
          return;
        }
        setQueueItems(prev => [...prev, cmd.value]);
        setLastMessage(`ENQUEUE(${cmd.value}): Added ${cmd.value} at Rear.`);
      } else if (cmd.type === 'dequeue') {
        if (queueItems.length === 0) {
          setLastMessage('Queue Underflow! Cannot dequeue from empty queue.');
          return;
        }
        const front = queueItems[0];
        setQueueItems(prev => prev.slice(1));
        setLastMessage(`DEQUEUE(): Removed front element ${front}.`);
      } else if (cmd.type === 'front') {
        const front = queueItems.length > 0 ? queueItems[0] : 'None';
        setLastMessage(`FRONT(): Element at front is ${front}.`);
      }
    } else if (activeDS === 'linked-list') {
      if (cmd.listType) setListType(cmd.listType);
      if (cmd.type === 'insert_head') {
        setLlNodes(prev => [cmd.value, ...prev]);
        setLastMessage(`INSERT HEAD: Inserted node(${cmd.value}) at beginning in O(1) time.`);
      } else if (cmd.type === 'insert_tail') {
        setLlNodes(prev => [...prev, cmd.value]);
        setLastMessage(`INSERT TAIL: Appended node(${cmd.value}) at end.`);
      } else if (cmd.type === 'delete_val') {
        const idx = llNodes.indexOf(cmd.value);
        if (idx !== -1) {
          setLlNodes(prev => prev.filter((_, i) => i !== idx));
          setLastMessage(`DELETE: Unlinked and removed node with value ${cmd.value}.`);
        } else {
          setLastMessage(`DELETE: Node with value ${cmd.value} was not found.`);
        }
      } else if (cmd.type === 'search') {
        const idx = llNodes.indexOf(cmd.value);
        setLastMessage(idx !== -1 ? `FOUND: Value ${cmd.value} found at index ${idx}.` : `NOT FOUND: Value ${cmd.value} not present.`);
      } else if (cmd.type === 'traverse') {
        setLastMessage(`TRAVERSE: Traversed all ${llNodes.length} nodes: [${llNodes.join(' -> ')}].`);
      }
    }
  };

  // Synthesize currentStep representation for the visualizer
  const currentStep = {
    stepIndex: 0,
    operation: 'active',
    explanation: lastMessage,
    variables: { size: activeDS === 'stack' ? stackItems.length : activeDS === 'queue' ? queueItems.length : llNodes.length },
    stackItems: stackItems.map((val, idx) => ({ id: `s-${idx}`, value: val, isTop: idx === stackItems.length - 1 })),
    queueItems: queueItems.map((val, idx) => ({ id: `q-${idx}`, value: val, isFront: idx === 0, isRear: idx === queueItems.length - 1 })),
    linkedListNodes: llNodes.map((val, idx) => ({
      id: `ll-${idx}`,
      value: val,
      isHead: idx === 0,
      isTail: idx === llNodes.length - 1,
      nextId: idx < llNodes.length - 1 ? `ll-${idx + 1}` : null,
      prevId: listType === 'doubly' && idx > 0 ? `ll-${idx - 1}` : null,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-cyan-400" />
          Interactive Data Structures Playground
        </h1>
        <p className="text-sm text-slate-400">
          Hands-on sandbox for Stacks, Queues, Singly Linked Lists, and Doubly Linked Lists with real pointer manipulation.
        </p>
      </div>

      {/* DS Switcher Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0B101E] border border-slate-800 w-fit">
        <button
          onClick={() => { setActiveDS('stack'); setLastMessage('Switched to Stack sandbox.'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDS === 'stack' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Stack (LIFO)
        </button>
        <button
          onClick={() => { setActiveDS('queue'); setLastMessage('Switched to Queue sandbox.'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDS === 'queue' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Queue (FIFO)
        </button>
        <button
          onClick={() => { setActiveDS('linked-list'); setLastMessage('Switched to Linked List sandbox.'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeDS === 'linked-list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Linked Lists (Singly & Doubly)
        </button>
      </div>

      {/* Main Sandbox Canvas & Controls */}
      <div className="p-6 rounded-2xl bg-[#0B101E] border border-slate-800 shadow-xl flex flex-col gap-4 min-h-[500px]">
        <DataStructuresVisualizer
          currentStep={currentStep as any}
          dsType={activeDS}
          onExecuteCommand={handleExecuteCommand}
        />

        {/* Message Log readout */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{lastMessage}</span>
        </div>
      </div>
    </div>
  );
};
