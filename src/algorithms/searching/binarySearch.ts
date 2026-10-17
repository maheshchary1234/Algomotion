import { ExecutionStep } from '../../types/algorithm';
import { SearchInput } from './linearSearch';

export function generateBinarySearchTrace(input: SearchInput): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let rawArr = input.array && input.array.length > 0 ? [...input.array] : [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = typeof input.target === 'number' ? input.target : 23;

  // Verify sorted status
  let isSorted = true;
  for (let i = 0; i < rawArr.length - 1; i++) {
    if (rawArr[i] > rawArr[i + 1]) {
      isSorted = false;
      break;
    }
  }

  const arr = [...rawArr];
  const n = arr.length;
  let comparisons = 0;

  if (!isSorted) {
    steps.push({
      stepIndex: steps.length,
      operation: 'unsorted_warning',
      linePython: 1,
      lineJava: 1,
      explanation: `WARNING: The input array is unsorted! Binary search fundamentally assumes elements are in non-decreasing order. Results may be incorrect unless the array is sorted.`,
      array: [...arr],
      highlightIndices: {},
      variables: { isSorted: false, target },
      changedVariables: ['isSorted'],
    });
  }

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Iterative Binary Search for target ${target} on array of size ${n}. Initial search bounds: low=0, high=${n - 1}.`,
    array: [...arr],
    highlightIndices: {
      low: 0,
      high: n - 1,
    },
    variables: { low: 0, high: n - 1, target, n, comparisons: 0 },
    changedVariables: ['low', 'high'],
    comparisonsCount: 0,
  });

  let low = 0;
  let high = n - 1;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];

    steps.push({
      stepIndex: steps.length,
      operation: 'calc_mid',
      linePython: 4,
      lineJava: 5,
      explanation: `Calculated middle index mid = floor((${low} + ${high}) / 2) = ${mid}. Middle element is arr[${mid}] = ${midVal}. Current search window spans ${high - low + 1} elements.`,
      array: [...arr],
      highlightIndices: {
        low,
        mid,
        high,
        active: Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
      },
      variables: { low, mid, high, midVal, target, comparisons },
      changedVariables: ['mid', 'midVal'],
      comparisonsCount: comparisons,
    });

    comparisons++;
    if (midVal === target) {
      foundIndex = mid;
      steps.push({
        stepIndex: steps.length,
        operation: 'match_found',
        linePython: 6,
        lineJava: 7,
        explanation: `MATCH: arr[${mid}] (${midVal}) == target (${target}). Target found in ${comparisons} comparisons!`,
        array: [...arr],
        highlightIndices: {
          mid,
          found: mid,
        },
        variables: { low, mid, high, foundIndex, status: 'FOUND', comparisons },
        changedVariables: ['foundIndex'],
        comparisonsCount: comparisons,
      });
      break;
    } else if (midVal < target) {
      steps.push({
        stepIndex: steps.length,
        operation: 'search_right',
        linePython: 8,
        lineJava: 9,
        explanation: `arr[${mid}] (${midVal}) < target (${target}). Target must be in the right half. Discarding left half; updating low = mid + 1 = ${mid + 1}.`,
        array: [...arr],
        highlightIndices: {
          low: mid + 1,
          high,
          active: Array.from({ length: Math.max(0, high - mid) }, (_, idx) => mid + 1 + idx),
        },
        variables: { oldLow: low, newLow: mid + 1, high, comparisons },
        changedVariables: ['low'],
        comparisonsCount: comparisons,
      });
      low = mid + 1;
    } else {
      steps.push({
        stepIndex: steps.length,
        operation: 'search_left',
        linePython: 10,
        lineJava: 11,
        explanation: `arr[${mid}] (${midVal}) > target (${target}). Target must be in the left half. Discarding right half; updating high = mid - 1 = ${mid - 1}.`,
        array: [...arr],
        highlightIndices: {
          low,
          high: mid - 1,
          active: Array.from({ length: Math.max(0, mid - low) }, (_, idx) => low + idx),
        },
        variables: { low, oldHigh: high, newHigh: mid - 1, comparisons },
        changedVariables: ['high'],
        comparisonsCount: comparisons,
      });
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      stepIndex: steps.length,
      operation: 'not_found',
      linePython: 12,
      lineJava: 13,
      explanation: `Search bounds crossed (low=${low} > high=${high}). Target ${target} is NOT present in the array. Returns -1. Total comparisons: ${comparisons}.`,
      array: [...arr],
      highlightIndices: {},
      variables: { low, high, foundIndex: -1, status: 'NOT_FOUND', comparisons },
      comparisonsCount: comparisons,
      isComplete: true,
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      operation: 'done',
      linePython: 13,
      lineJava: 14,
      explanation: `Binary Search completed in ${comparisons} comparisons (log₂(n) ~ ${Math.ceil(Math.log2(n))} steps).`,
      array: [...arr],
      highlightIndices: {
        found: foundIndex,
      },
      variables: {
        foundIndex,
        target,
        comparisons,
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1) auxiliary',
      },
      comparisonsCount: comparisons,
      isComplete: true,
    });
  }

  return steps;
}
