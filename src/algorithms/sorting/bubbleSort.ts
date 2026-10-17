import { ExecutionStep } from '../../types/algorithm';

export function generateBubbleSortTrace(arrayInput: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = arrayInput && arrayInput.length > 0 ? [...arrayInput] : [64, 34, 25, 12, 22, 11, 90];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set<number>();

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Bubble Sort on array of size ${n}: [${arr.join(', ')}].`,
    array: [...arr],
    highlightIndices: {},
    variables: { n, comparisons: 0, swaps: 0 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    steps.push({
      stepIndex: steps.length,
      operation: 'pass_start',
      linePython: 3,
      lineJava: 4,
      explanation: `Pass ${i + 1} of ${n - 1}: comparing adjacent elements up to index ${n - i - 1}.`,
      array: [...arr],
      highlightIndices: {
        active: [0, n - i - 1],
        sorted: Array.from(sortedIndices),
      },
      variables: { i, 'n-i-1': n - i - 1, comparisons, swaps },
      changedVariables: ['i'],
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const needSwap = arr[j] > arr[j + 1];

      steps.push({
        stepIndex: steps.length,
        operation: 'compare',
        linePython: 5,
        lineJava: 6,
        explanation: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${needSwap ? 'arr[j] > arr[j+1], swap needed.' : 'In order, no swap.'}`,
        array: [...arr],
        highlightIndices: {
          comparing: [j, j + 1],
          sorted: Array.from(sortedIndices),
        },
        variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], comparisons, swaps },
        changedVariables: ['j', 'comparisons'],
        comparisonsCount: comparisons,
        swapsCount: swaps,
      });

      if (needSwap) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swappedInPass = true;

        steps.push({
          stepIndex: steps.length,
          operation: 'swap',
          linePython: 7,
          lineJava: 8,
          explanation: `Swapped arr[${j}] and arr[${j + 1}]. Array is now: [${arr.join(', ')}].`,
          array: [...arr],
          highlightIndices: {
            swapping: [j, j + 1],
            sorted: Array.from(sortedIndices),
          },
          variables: { i, j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], comparisons, swaps },
          changedVariables: ['swaps'],
          comparisonsCount: comparisons,
          swapsCount: swaps,
        });
      }
    }

    // After pass i, element at n - i - 1 is guaranteed in its final sorted position
    sortedIndices.add(n - i - 1);

    steps.push({
      stepIndex: steps.length,
      operation: 'element_placed',
      linePython: 9,
      lineJava: 11,
      explanation: `Element ${arr[n - i - 1]} at index ${n - i - 1} bubbled to its final sorted position!`,
      array: [...arr],
      highlightIndices: {
        sorted: Array.from(sortedIndices),
      },
      variables: { i, placedElement: arr[n - i - 1], sortedCount: sortedIndices.size },
      comparisonsCount: comparisons,
      swapsCount: swaps,
    });

    // Optimization: if no swap occurred in a pass, the array is already sorted
    if (!swappedInPass) {
      steps.push({
        stepIndex: steps.length,
        operation: 'early_exit',
        linePython: 11,
        lineJava: 13,
        explanation: `No swaps occurred in this pass. The array is fully sorted! Exiting early (Best-case O(n)).`,
        array: [...arr],
        highlightIndices: {
          sorted: Array.from({ length: n }, (_, idx) => idx),
        },
        variables: { earlyExit: true, comparisons, swaps },
        comparisonsCount: comparisons,
        swapsCount: swaps,
      });
      break;
    }
  }

  // All sorted
  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 13,
    lineJava: 15,
    explanation: `Bubble Sort finished! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
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
