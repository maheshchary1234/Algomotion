import { ExecutionStep } from '../../types/algorithm';

export function generateMergeSortTrace(arrayInput: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = arrayInput && arrayInput.length > 0 ? [...arrayInput] : [38, 27, 43, 3, 9, 82, 10];
  const n = arr.length;
  let comparisons = 0;
  let writes = 0;

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Merge Sort on array of size ${n}: [${arr.join(', ')}].`,
    array: [...arr],
    highlightIndices: {},
    variables: { n, comparisons: 0, writes: 0 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  const merge = (left: number, mid: number, right: number) => {
    steps.push({
      stepIndex: steps.length,
      operation: 'merge_start',
      linePython: 10,
      lineJava: 11,
      explanation: `Merging sorted subarrays: Left arr[${left}..${mid}] and Right arr[${mid + 1}..${right}].`,
      array: [...arr],
      highlightIndices: {
        active: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        low: left,
        mid,
        high: right,
      },
      variables: { left, mid, right, leftSubarray: arr.slice(left, mid + 1), rightSubarray: arr.slice(mid + 1, right + 1) },
      comparisonsCount: comparisons,
      swapsCount: writes,
    });

    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      const pickLeft = leftArr[i] <= rightArr[j];

      steps.push({
        stepIndex: steps.length,
        operation: 'compare',
        linePython: 14,
        lineJava: 16,
        explanation: `Comparing left element ${leftArr[i]} with right element ${rightArr[j]}. Picking ${pickLeft ? leftArr[i] : rightArr[j]}.`,
        array: [...arr],
        highlightIndices: {
          comparing: [left + i, mid + 1 + j],
          active: [k],
        },
        variables: { leftVal: leftArr[i], rightVal: rightArr[j], k, comparisons, writes },
        changedVariables: ['comparisons'],
        comparisonsCount: comparisons,
        swapsCount: writes,
      });

      if (pickLeft) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      writes++;

      steps.push({
        stepIndex: steps.length,
        operation: 'write',
        linePython: 16,
        lineJava: 18,
        explanation: `Wrote ${arr[k]} into position ${k}.`,
        array: [...arr],
        highlightIndices: {
          active: [k],
        },
        variables: { k, 'arr[k]': arr[k], writes },
        changedVariables: ['writes'],
        comparisonsCount: comparisons,
        swapsCount: writes,
      });

      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      writes++;
      steps.push({
        stepIndex: steps.length,
        operation: 'copy_remaining',
        linePython: 19,
        lineJava: 22,
        explanation: `Copying remaining left element ${leftArr[i]} into position ${k}.`,
        array: [...arr],
        highlightIndices: {
          active: [k],
        },
        variables: { k, 'arr[k]': arr[k], writes },
        comparisonsCount: comparisons,
        swapsCount: writes,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      writes++;
      steps.push({
        stepIndex: steps.length,
        operation: 'copy_remaining',
        linePython: 22,
        lineJava: 26,
        explanation: `Copying remaining right element ${rightArr[j]} into position ${k}.`,
        array: [...arr],
        highlightIndices: {
          active: [k],
        },
        variables: { k, 'arr[k]': arr[k], writes },
        comparisonsCount: comparisons,
        swapsCount: writes,
      });
      j++;
      k++;
    }

    steps.push({
      stepIndex: steps.length,
      operation: 'merge_end',
      linePython: 24,
      lineJava: 29,
      explanation: `Subarray arr[${left}..${right}] merged and sorted: [${arr.slice(left, right + 1).join(', ')}].`,
      array: [...arr],
      highlightIndices: {
        sorted: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      },
      variables: { left, right, mergedSection: arr.slice(left, right + 1) },
      comparisonsCount: comparisons,
      swapsCount: writes,
    });
  };

  const mergeSortHelper = (left: number, right: number) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push({
      stepIndex: steps.length,
      operation: 'divide',
      linePython: 4,
      lineJava: 5,
      explanation: `Dividing range arr[${left}..${right}] at mid=${mid}. Left: arr[${left}..${mid}], Right: arr[${mid + 1}..${right}].`,
      array: [...arr],
      highlightIndices: {
        active: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        low: left,
        mid,
        high: right,
      },
      variables: { left, mid, right },
      changedVariables: ['left', 'mid', 'right'],
      comparisonsCount: comparisons,
      swapsCount: writes,
    });

    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  };

  mergeSortHelper(0, n - 1);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 7,
    lineJava: 8,
    explanation: `Merge Sort complete! Array fully sorted. Total comparisons: ${comparisons}, Array writes: ${writes}.`,
    array: [...arr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, idx) => idx),
    },
    variables: {
      finalArray: [...arr],
      comparisons,
      writes,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n) auxiliary',
    },
    comparisonsCount: comparisons,
    swapsCount: writes,
    isComplete: true,
  });

  return steps;
}
