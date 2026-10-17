import { ExecutionStep } from '../../types/algorithm';

export function generateInsertionSortTrace(arrayInput: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = arrayInput && arrayInput.length > 0 ? [...arrayInput] : [12, 11, 13, 5, 6];
  const n = arr.length;
  let comparisons = 0;
  let shifts = 0;

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Insertion Sort on [${arr.join(', ')}]. Initially, prefix [arr[0]] = [${arr[0]}] is considered sorted.`,
    array: [...arr],
    highlightIndices: {
      sorted: [0],
    },
    variables: { n, comparisons: 0, shifts: 0 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      stepIndex: steps.length,
      operation: 'pick_key',
      linePython: 3,
      lineJava: 3,
      explanation: `Iteration ${i}: selected key = arr[${i}] (${key}). Inserting into sorted subarray arr[0..${i - 1}].`,
      array: [...arr],
      highlightIndices: {
        pivot: i,
        sorted: Array.from({ length: i }, (_, idx) => idx),
      },
      variables: { i, key, j, comparisons, shifts },
      changedVariables: ['i', 'key', 'j'],
      comparisonsCount: comparisons,
      swapsCount: shifts,
    });

    while (j >= 0) {
      comparisons++;
      const shouldShift = arr[j] > key;

      steps.push({
        stepIndex: steps.length,
        operation: 'compare',
        linePython: 5,
        lineJava: 5,
        explanation: `Comparing key (${key}) with arr[${j}] (${arr[j]}). ${shouldShift ? `arr[${j}] > key, shifting arr[${j}] right.` : `arr[${j}] <= key, found insertion position!`}`,
        array: [...arr],
        highlightIndices: {
          comparing: [j],
          pivot: i,
          sorted: Array.from({ length: i }, (_, idx) => idx),
        },
        variables: { i, j, key, 'arr[j]': arr[j], comparisons, shifts },
        changedVariables: ['comparisons'],
        comparisonsCount: comparisons,
        swapsCount: shifts,
      });

      if (shouldShift) {
        arr[j + 1] = arr[j];
        shifts++;

        steps.push({
          stepIndex: steps.length,
          operation: 'shift',
          linePython: 6,
          lineJava: 6,
          explanation: `Shifted arr[${j}] (${arr[j + 1]}) to index ${j + 1}.`,
          array: [...arr],
          highlightIndices: {
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, idx) => idx),
          },
          variables: { i, j, shiftedValue: arr[j + 1], shifts },
          changedVariables: ['shifts'],
          comparisonsCount: comparisons,
          swapsCount: shifts,
        });

        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;

    steps.push({
      stepIndex: steps.length,
      operation: 'insert_key',
      linePython: 8,
      lineJava: 8,
      explanation: `Inserted key (${key}) at position arr[${j + 1}]. Subarray arr[0..${i}] is now sorted.`,
      array: [...arr],
      highlightIndices: {
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        active: [j + 1],
      },
      variables: { i, insertedAt: j + 1, key, sortedPrefixLength: i + 1 },
      comparisonsCount: comparisons,
      swapsCount: shifts,
    });
  }

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 10,
    lineJava: 10,
    explanation: `Insertion Sort complete! Total comparisons: ${comparisons}, Total shifts: ${shifts}.`,
    array: [...arr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, idx) => idx),
    },
    variables: {
      finalArray: [...arr],
      comparisons,
      shifts,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
    },
    comparisonsCount: comparisons,
    swapsCount: shifts,
    isComplete: true,
  });

  return steps;
}
