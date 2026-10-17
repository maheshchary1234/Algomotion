import { ExecutionStep } from '../../types/algorithm';

export function generateSelectionSortTrace(arrayInput: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = arrayInput && arrayInput.length > 0 ? [...arrayInput] : [64, 25, 12, 22, 11];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set<number>();

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Selection Sort on array of size ${n}: [${arr.join(', ')}].`,
    array: [...arr],
    highlightIndices: {},
    variables: { n, comparisons: 0, swaps: 0 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      stepIndex: steps.length,
      operation: 'outer_loop',
      linePython: 3,
      lineJava: 3,
      explanation: `Iteration ${i + 1}: looking for minimum element in unsorted range arr[${i}..${n - 1}]. Initial min assumed at index ${i} (${arr[i]}).`,
      array: [...arr],
      highlightIndices: {
        pivot: minIdx,
        sorted: Array.from(sortedIndices),
        active: [i],
      },
      variables: { i, minIdx, currentMin: arr[minIdx], comparisons, swaps },
      changedVariables: ['i', 'minIdx'],
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const isNewMin = arr[j] < arr[minIdx];

      steps.push({
        stepIndex: steps.length,
        operation: 'compare',
        linePython: 5,
        lineJava: 5,
        explanation: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}). ${isNewMin ? 'Found smaller element!' : 'Not smaller.'}`,
        array: [...arr],
        highlightIndices: {
          comparing: [j, minIdx],
          pivot: minIdx,
          sorted: Array.from(sortedIndices),
        },
        variables: { i, j, minIdx, 'arr[j]': arr[j], currentMin: arr[minIdx], comparisons, swaps },
        changedVariables: ['j', 'comparisons'],
        comparisonsCount: comparisons,
        swapsCount: swaps,
      });

      if (isNewMin) {
        minIdx = j;
        steps.push({
          stepIndex: steps.length,
          operation: 'new_min',
          linePython: 6,
          lineJava: 6,
          explanation: `Updated minimum index to ${minIdx} (value ${arr[minIdx]}).`,
          array: [...arr],
          highlightIndices: {
            pivot: minIdx,
            sorted: Array.from(sortedIndices),
          },
          variables: { i, minIdx, currentMin: arr[minIdx] },
          changedVariables: ['minIdx'],
          comparisonsCount: comparisons,
          swapsCount: swaps,
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      swaps++;

      steps.push({
        stepIndex: steps.length,
        operation: 'swap',
        linePython: 8,
        lineJava: 8,
        explanation: `Swapping found minimum ${arr[i]} (from index ${minIdx}) with element at index ${i} (${temp}).`,
        array: [...arr],
        highlightIndices: {
          swapping: [i, minIdx],
          sorted: Array.from(sortedIndices),
        },
        variables: { i, minIdx, swappedWith: temp, comparisons, swaps },
        changedVariables: ['swaps'],
        comparisonsCount: comparisons,
        swapsCount: swaps,
      });
    }

    sortedIndices.add(i);

    steps.push({
      stepIndex: steps.length,
      operation: 'element_placed',
      linePython: 9,
      lineJava: 9,
      explanation: `Index ${i} (${arr[i]}) is now sorted in its final position.`,
      array: [...arr],
      highlightIndices: {
        sorted: Array.from(sortedIndices),
      },
      variables: { i, sortedCount: sortedIndices.size },
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });
  }

  sortedIndices.add(n - 1);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 11,
    lineJava: 11,
    explanation: `Selection Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    array: [...arr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, idx) => idx),
    },
    variables: {
      finalArray: [...arr],
      comparisons,
      swaps,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
    },
    comparisonsCount: comparisons,
    swapsCount: swaps,
    isComplete: true,
  });

  return steps;
}
