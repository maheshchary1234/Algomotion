import { ExecutionStep } from '../../types/algorithm';

export function generateQuickSortTrace(arrayInput: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = arrayInput && arrayInput.length > 0 ? [...arrayInput] : [10, 80, 30, 90, 40, 50, 70];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedPivots = new Set<number>();

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Quick Sort on array of size ${n}: [${arr.join(', ')}].`,
    array: [...arr],
    highlightIndices: {},
    variables: { n, comparisons: 0, swaps: 0 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      stepIndex: steps.length,
      operation: 'choose_pivot',
      linePython: 8,
      lineJava: 9,
      explanation: `Chosen pivot: arr[${high}] = ${pivot}. Partitioning subarray arr[${low}..${high}].`,
      array: [...arr],
      highlightIndices: {
        pivot: high,
        active: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
        sorted: Array.from(sortedPivots),
      },
      variables: { low, high, pivot, i, comparisons, swaps },
      changedVariables: ['pivot', 'i'],
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const isSmallerOrEqual = arr[j] <= pivot;

      steps.push({
        stepIndex: steps.length,
        operation: 'compare',
        linePython: 11,
        lineJava: 12,
        explanation: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}). ${isSmallerOrEqual ? `arr[${j}] <= pivot, advance boundary i and swap.` : `arr[${j}] > pivot, continue.`}`,
        array: [...arr],
        highlightIndices: {
          comparing: [j],
          pivot: high,
          active: i >= low ? [i] : [],
          sorted: Array.from(sortedPivots),
        },
        variables: { j, 'arr[j]': arr[j], pivot, i, comparisons, swaps },
        changedVariables: ['j', 'comparisons'],
        comparisonsCount: comparisons,
        swapsCount: swaps,
      });

      if (isSmallerOrEqual) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          swaps++;

          steps.push({
            stepIndex: steps.length,
            operation: 'swap',
            linePython: 13,
            lineJava: 14,
            explanation: `Swapped arr[${i}] (${arr[j]}) with arr[${j}] (${arr[i]}). Smaller elements placed in left partition.`,
            array: [...arr],
            highlightIndices: {
              swapping: [i, j],
              pivot: high,
              sorted: Array.from(sortedPivots),
            },
            variables: { i, j, pivot, comparisons, swaps },
            changedVariables: ['swaps', 'i'],
            comparisonsCount: comparisons,
            swapsCount: swaps,
          });
        }
      }
    }

    // Place pivot at i + 1
    const pIdx = i + 1;
    const temp = arr[pIdx];
    arr[pIdx] = arr[high];
    arr[high] = temp;
    swaps++;
    sortedPivots.add(pIdx);

    steps.push({
      stepIndex: steps.length,
      operation: 'pivot_placed',
      linePython: 15,
      lineJava: 17,
      explanation: `Placed pivot ${pivot} into its sorted position at index ${pIdx}. All elements to the left are <= ${pivot}, all to the right are >= ${pivot}.`,
      array: [...arr],
      highlightIndices: {
        pivot: pIdx,
        sorted: Array.from(sortedPivots),
      },
      variables: { pivotIndex: pIdx, pivotValue: pivot, comparisons, swaps },
      changedVariables: ['pivotIndex', 'swaps'],
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    return pIdx;
  };

  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sortedPivots.add(low);
    }
  };

  quickSortHelper(0, n - 1);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 5,
    lineJava: 6,
    explanation: `Quick Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    array: [...arr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, idx) => idx),
    },
    variables: {
      finalArray: [...arr],
      comparisons,
      swaps,
      timeComplexity: 'O(n log n) average, O(n²) worst',
      spaceComplexity: 'O(log n) stack space',
    },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    isComplete: true,
  });

  return steps;
}
