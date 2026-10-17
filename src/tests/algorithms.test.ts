import { describe, it, expect } from 'vitest';
import { generateArrayRotationTrace } from '../algorithms/arrays/arrayRotation';
import { generateBubbleSortTrace } from '../algorithms/sorting/bubbleSort';
import { generateSelectionSortTrace } from '../algorithms/sorting/selectionSort';
import { generateInsertionSortTrace } from '../algorithms/sorting/insertionSort';
import { generateMergeSortTrace } from '../algorithms/sorting/mergeSort';
import { generateQuickSortTrace } from '../algorithms/sorting/quickSort';
import { generateHeapSortTrace } from '../algorithms/sorting/heapSort';
import { generateLinearSearchTrace } from '../algorithms/searching/linearSearch';
import { generateBinarySearchTrace } from '../algorithms/searching/binarySearch';
import { generateFactorialTrace } from '../algorithms/recursion/factorial';
import { generateFibonacciTrace } from '../algorithms/recursion/fibonacci';
import { generateTowerOfHanoiTrace } from '../algorithms/recursion/towerOfHanoi';
import { generateStackDemoTrace } from '../algorithms/dataStructures/stack';
import { generateQueueDemoTrace } from '../algorithms/dataStructures/queue';
import { generateLinkedListTrace } from '../algorithms/dataStructures/linkedList';
import { TracePlayer } from '../engine/traceEngine';

describe('1. Array Rotation Tests', () => {
  it('correctly rotates left with standard k', () => {
    const trace = generateArrayRotationTrace({
      array: [1, 2, 3, 4, 5],
      k: 2,
      direction: 'left',
      method: 'reversal',
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.array).toEqual([3, 4, 5, 1, 2]);
    expect(lastStep.isComplete).toBe(true);
  });

  it('correctly rotates right with standard k', () => {
    const trace = generateArrayRotationTrace({
      array: [1, 2, 3, 4, 5],
      k: 2,
      direction: 'right',
      method: 'reversal',
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.array).toEqual([4, 5, 1, 2, 3]);
  });

  it('handles oversized rotation count k > n with modulo optimization', () => {
    // Array size 5, k = 12 -> 12 % 5 = 2. Left rotation should yield [3, 4, 5, 1, 2]
    const trace = generateArrayRotationTrace({
      array: [1, 2, 3, 4, 5],
      k: 12,
      direction: 'left',
      method: 'reversal',
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.array).toEqual([3, 4, 5, 1, 2]);
    expect(trace[1].variables.effectiveK).toBe(2);
  });

  it('handles zero rotation count (k = 0)', () => {
    const trace = generateArrayRotationTrace({
      array: [1, 2, 3],
      k: 0,
      direction: 'left',
      method: 'reversal',
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.array).toEqual([1, 2, 3]);
  });

  it('handles empty array input gracefully', () => {
    const trace = generateArrayRotationTrace({
      array: [],
      k: 3,
      direction: 'left',
    });
    expect(trace[0].operation).toBe('error');
    expect(trace[0].isComplete).toBe(true);
  });
});

describe('2. Sorting Algorithms Tests', () => {
  const testInputs = [
    { name: 'random unsorted', array: [64, 34, 25, 12, 22, 11, 90] },
    { name: 'with negative numbers', array: [15, -4, 0, -12, 8, 3] },
    { name: 'with duplicate elements', array: [5, 2, 8, 5, 1, 2, 8] },
    { name: 'single element', array: [42] },
  ];

  it('Bubble Sort correctly sorts all test inputs', () => {
    for (const testCase of testInputs) {
      const trace = generateBubbleSortTrace(testCase.array);
      const finalArray = trace[trace.length - 1].array;
      const expected = [...testCase.array].sort((a, b) => a - b);
      expect(finalArray).toEqual(expected);
    }
  });

  it('Selection Sort correctly sorts all test inputs', () => {
    for (const testCase of testInputs) {
      const trace = generateSelectionSortTrace(testCase.array);
      const finalArray = trace[trace.length - 1].array;
      const expected = [...testCase.array].sort((a, b) => a - b);
      expect(finalArray).toEqual(expected);
    }
  });

  it('Insertion Sort correctly sorts all test inputs', () => {
    for (const testCase of testInputs) {
      const trace = generateInsertionSortTrace(testCase.array);
      const finalArray = trace[trace.length - 1].array;
      const expected = [...testCase.array].sort((a, b) => a - b);
      expect(finalArray).toEqual(expected);
    }
  });

  it('Merge Sort correctly sorts all test inputs', () => {
    for (const testCase of testInputs) {
      const trace = generateMergeSortTrace(testCase.array);
      const finalArray = trace[trace.length - 1].array;
      const expected = [...testCase.array].sort((a, b) => a - b);
      expect(finalArray).toEqual(expected);
    }
  });

  it('Quick Sort correctly sorts all test inputs', () => {
    for (const testCase of testInputs) {
      const trace = generateQuickSortTrace(testCase.array);
      const finalArray = trace[trace.length - 1].array;
      const expected = [...testCase.array].sort((a, b) => a - b);
      expect(finalArray).toEqual(expected);
    }
  });

  it('Heap Sort correctly sorts all test inputs', () => {
    for (const testCase of testInputs) {
      const trace = generateHeapSortTrace(testCase.array);
      const finalArray = trace[trace.length - 1].array;
      const expected = [...testCase.array].sort((a, b) => a - b);
      expect(finalArray).toEqual(expected);
    }
  });
});

describe('3. Searching Algorithms Tests', () => {
  it('Linear Search finds existing target', () => {
    const trace = generateLinearSearchTrace({
      array: [10, 20, 30, 40, 50],
      target: 30,
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.variables.foundIndex).toBe(2);
    expect(lastStep.variables.status).toBe('FOUND');
  });

  it('Linear Search reports not-found for absent target', () => {
    const trace = generateLinearSearchTrace({
      array: [10, 20, 30, 40],
      target: 99,
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.variables.foundIndex).toBe(-1);
    expect(lastStep.variables.status).toBe('NOT_FOUND');
  });

  it('Binary Search finds existing target in sorted array', () => {
    const trace = generateBinarySearchTrace({
      array: [2, 5, 8, 12, 16, 23, 38, 56],
      target: 23,
    });
    const lastStep = trace[trace.length - 1];
    expect(lastStep.variables.foundIndex).toBe(5);
  });

  it('Binary Search flags unsorted inputs with warning', () => {
    const trace = generateBinarySearchTrace({
      array: [50, 10, 30],
      target: 10,
    });
    expect(trace[0].operation).toBe('unsorted_warning');
  });
});

describe('4. Recursion Visualizer Tests', () => {
  it('Factorial calculates correct result and manages stack frames', () => {
    const trace = generateFactorialTrace(5);
    const lastStep = trace[trace.length - 1];
    expect(lastStep.variables.result).toBe(120);
    expect(lastStep.isComplete).toBe(true);
  });

  it('Fibonacci calculates correct recursive tree result', () => {
    const trace = generateFibonacciTrace(4);
    const lastStep = trace[trace.length - 1];
    expect(lastStep.variables.result).toBe(3); // fib(4) = 3
  });

  it('Tower of Hanoi solves 3 disks in exactly 2^3 - 1 = 7 moves', () => {
    const trace = generateTowerOfHanoiTrace(3);
    const lastStep = trace[trace.length - 1];
    expect(lastStep.variables.totalMoves).toBe(7);
    expect(lastStep.hanoiRods?.C).toEqual([3, 2, 1]);
    expect(lastStep.hanoiRods?.A).toEqual([]);
  });
});

describe('5. Data Structures Tests', () => {
  it('Stack handles Push, Pop, Peek, and prevents underflow', () => {
    const trace = generateStackDemoTrace([
      { type: 'push', value: 10 },
      { type: 'push', value: 20 },
      { type: 'peek' },
      { type: 'pop' },
      { type: 'pop' },
      { type: 'pop' }, // Underflow
    ]);

    const underflowStep = trace.find(s => s.operation === 'underflow');
    expect(underflowStep).toBeDefined();
    expect(underflowStep?.variables.error).toBe('Stack Underflow');
  });

  it('Queue handles Enqueue, Dequeue, and FIFO order', () => {
    const trace = generateQueueDemoTrace([
      { type: 'enqueue', value: 100 },
      { type: 'enqueue', value: 200 },
      { type: 'dequeue' },
    ]);
    const dequeueStep = trace.find(s => s.operation === 'dequeue');
    expect(dequeueStep?.variables.dequeued).toBe(100);
  });

  it('Linked List handles Head insertion, Tail insertion, and value deletion', () => {
    // 1. Insert Head
    const headTrace = generateLinkedListTrace([10, 20], { type: 'insert_head', value: 5 });
    const lastHead = headTrace[headTrace.length - 1];
    expect(lastHead.linkedListNodes?.[0].value).toBe(5);

    // 2. Delete
    const deleteTrace = generateLinkedListTrace([10, 20, 30], { type: 'delete_val', value: 20 });
    const lastDel = deleteTrace[deleteTrace.length - 1];
    expect(lastDel.linkedListNodes?.map(n => n.value)).toEqual([10, 30]);
  });
});

describe('6. Execution Engine Bidirectional Time Travel Tests', () => {
  it('TracePlayer supports next, prev, jump, and accurately restores state', () => {
    let capturedState: any = null;
    const player = new TracePlayer((st) => {
      capturedState = st;
    });

    const mockTrace = [
      { stepIndex: 0, operation: 'step0', explanation: 'Initial', variables: { val: 0 } },
      { stepIndex: 1, operation: 'step1', explanation: 'Step 1', variables: { val: 10 } },
      { stepIndex: 2, operation: 'step2', explanation: 'Step 2', variables: { val: 20 } },
    ];

    player.loadTrace(mockTrace as any);
    expect(capturedState.currentStepIndex).toBe(0);

    player.nextStep();
    expect(capturedState.currentStepIndex).toBe(1);
    expect(player.getCurrentStep()?.variables.val).toBe(10);

    player.nextStep();
    expect(capturedState.currentStepIndex).toBe(2);
    expect(player.getCurrentStep()?.variables.val).toBe(20);

    // Step back to index 1: state is restored
    player.prevStep();
    expect(capturedState.currentStepIndex).toBe(1);
    expect(player.getCurrentStep()?.variables.val).toBe(10);

    // Jump to index 0
    player.jumpToStep(0);
    expect(capturedState.currentStepIndex).toBe(0);
    expect(player.getCurrentStep()?.variables.val).toBe(0);

    player.destroy();
  });
});
