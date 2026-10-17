import { ExecutionStep } from '../../types/algorithm';

export function generateHeapSortTrace(arrayInput: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = arrayInput && arrayInput.length > 0 ? [...arrayInput] : [12, 11, 13, 5, 6, 7];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set<number>();

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Heap Sort on array of size ${n}: [${arr.join(', ')}].`,
    array: [...arr],
    highlightIndices: {},
    variables: { n, comparisons: 0, swaps: 0 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  const heapify = (size: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      stepIndex: steps.length,
      operation: 'heapify_start',
      linePython: 8,
      lineJava: 9,
      explanation: `Heapifying subtree rooted at index ${i} (${arr[i]}). Left child: ${left < size ? `${arr[left]} (idx ${left})` : 'none'}, Right child: ${right < size ? `${arr[right]} (idx ${right})` : 'none'}.`,
      array: [...arr],
      highlightIndices: {
        pivot: i,
        active: [left, right].filter(idx => idx < size),
        sorted: Array.from(sortedIndices),
      },
      variables: { root: i, left, right, heapSize: size, comparisons, swaps },
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    if (left < size) {
      comparisons++;
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      swaps++;

      steps.push({
        stepIndex: steps.length,
        operation: 'swap',
        linePython: 15,
        lineJava: 16,
        explanation: `Subtree violation: child arr[${largest}] (${arr[i]}) > parent arr[${i}] (${temp}). Swapping to restore Max-Heap property.`,
        array: [...arr],
        highlightIndices: {
          swapping: [i, largest],
          sorted: Array.from(sortedIndices),
        },
        variables: { swappedRoot: i, largestChild: largest, comparisons, swaps },
        changedVariables: ['swaps'],
        comparisonsCount: comparisons,
        swapsCount: swaps,
      });

      heapify(size, largest);
    }
  };

  // 1. Build Max Heap
  steps.push({
    stepIndex: steps.length,
    operation: 'build_heap_phase',
    linePython: 3,
    lineJava: 4,
    explanation: `Phase 1: Building initial Max-Heap from non-leaf nodes downwards (indices ${Math.floor(n / 2) - 1} down to 0).`,
    array: [...arr],
    highlightIndices: {},
    variables: { phase: 'Build Max-Heap' },
    comparisonsCount: comparisons,
    swapsCount: swaps,
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    stepIndex: steps.length,
    operation: 'heap_built',
    linePython: 5,
    lineJava: 6,
    explanation: `Max-Heap constructed! Root element arr[0] (${arr[0]}) is the maximum element.`,
    array: [...arr],
    highlightIndices: {
      pivot: 0,
    },
    variables: { maxElement: arr[0] },
    comparisonsCount: comparisons,
    swapsCount: swaps,
  });

  // 2. Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap root with end
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    swaps++;
    sortedIndices.add(i);

    steps.push({
      stepIndex: steps.length,
      operation: 'extract_max',
      linePython: 19,
      lineJava: 21,
      explanation: `Phase 2: Swapping current max (root ${arr[i]}) with last heap element arr[${i}] (${arr[0]}). Element ${arr[i]} is now locked into sorted position.`,
      array: [...arr],
      highlightIndices: {
        swapping: [0, i],
        sorted: Array.from(sortedIndices),
      },
      variables: { extractedMax: arr[i], lockedIndex: i, newHeapSize: i, comparisons, swaps },
      changedVariables: ['swaps'],
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    heapify(i, 0);
  }

  sortedIndices.add(0);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 22,
    lineJava: 24,
    explanation: `Heap Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    array: [...arr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, idx) => idx),
    },
    variables: {
      finalArray: [...arr],
      comparisons,
      swaps,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1) auxiliary (in-place)',
    },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    isComplete: true,
  });

  return steps;
}
