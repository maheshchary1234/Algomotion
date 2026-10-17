import { ExecutionStep } from '../../types/algorithm';

export interface SearchInput {
  array: number[];
  target: number;
}

export function generateLinearSearchTrace(input: SearchInput): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = input.array && input.array.length > 0 ? [...input.array] : [14, 33, 27, 10, 35, 19, 42, 44];
  const target = typeof input.target === 'number' ? input.target : 35;
  const n = arr.length;
  let comparisons = 0;

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Linear Search on array of size ${n}. Searching for target value: ${target}.`,
    array: [...arr],
    highlightIndices: {},
    variables: { target, n, comparisons: 0 },
    comparisonsCount: 0,
  });

  let foundIndex = -1;

  for (let i = 0; i < n; i++) {
    comparisons++;
    const isMatch = arr[i] === target;

    steps.push({
      stepIndex: steps.length,
      operation: 'compare',
      linePython: 3,
      lineJava: 3,
      explanation: `Step ${i + 1}: Examining index ${i} with value ${arr[i]}. Comparing with target ${target}. ${isMatch ? 'Match found!' : 'No match, continue.'}`,
      array: [...arr],
      highlightIndices: {
        comparing: [i],
        found: isMatch ? i : undefined,
      },
      variables: { i, 'arr[i]': arr[i], target, comparisons },
      changedVariables: ['i', 'comparisons'],
      comparisonsCount: comparisons,
    });

    if (isMatch) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== -1) {
    steps.push({
      stepIndex: steps.length,
      operation: 'found',
      linePython: 5,
      lineJava: 5,
      explanation: `SUCCESS: Target ${target} found at index ${foundIndex}! Completed in ${comparisons} comparisons.`,
      array: [...arr],
      highlightIndices: {
        found: foundIndex,
      },
      variables: { foundIndex, target, totalComparisons: comparisons, status: 'FOUND' },
      comparisonsCount: comparisons,
      isComplete: true,
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      operation: 'not_found',
      linePython: 7,
      lineJava: 7,
      explanation: `NOT FOUND: Target ${target} is not present in the array. Checked all ${n} elements (${comparisons} comparisons). Returns -1.`,
      array: [...arr],
      highlightIndices: {},
      variables: { foundIndex: -1, target, totalComparisons: comparisons, status: 'NOT_FOUND' },
      comparisonsCount: comparisons,
      isComplete: true,
    });
  }

  return steps;
}
