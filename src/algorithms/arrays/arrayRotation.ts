import { ExecutionStep } from '../../types/algorithm';

export interface ArrayRotationInput {
  array: number[];
  k: number;
  direction: 'left' | 'right';
  method?: 'reversal' | 'brute-force';
}

export function generateArrayRotationTrace(input: ArrayRotationInput): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const rawArray = Array.isArray(input.array) ? [...input.array] : [1, 2, 3, 4, 5];
  const n = rawArray.length;
  const rawK = typeof input.k === 'number' ? input.k : 2;
  const direction = input.direction || 'left';
  const method = input.method || 'reversal';
  
  if (n === 0) {
    steps.push({
      stepIndex: 0,
      operation: 'error',
      explanation: 'Array is empty. Nothing to rotate.',
      array: [],
      variables: { n: 0, k: rawK, direction },
      isComplete: true,
    });
    return steps;
  }

  const effectiveK = rawK % n;

  // Initial step
  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting ${direction} rotation on array [${rawArray.join(', ')}] with k=${rawK}. Array size n=${n}.`,
    array: [...rawArray],
    highlightIndices: {
      active: [],
    },
    rotationState: {
      currentPhase: 'Initialization',
      originalArray: [...rawArray],
      rotatedArray: [...rawArray],
      k: rawK,
      effectiveK,
      direction,
      method,
    },
    variables: {
      n,
      k: rawK,
      effectiveK,
      direction,
      method,
    },
    changedVariables: ['n', 'k', 'direction'],
  });

  // Step 2: Modulo optimization explanation
  steps.push({
    stepIndex: steps.length,
    operation: 'modulo_optimization',
    linePython: 3,
    lineJava: 3,
    explanation: `Modulo Optimization: Rotating an array of size ${n} by ${rawK} is equivalent to rotating by effectiveK = ${rawK} % ${n} = ${effectiveK}. Full cycles of length ${n} return the array to its original order.`,
    array: [...rawArray],
    highlightIndices: {
      active: Array.from({ length: n }, (_, i) => i),
    },
    rotationState: {
      currentPhase: 'Modulo Calculation',
      originalArray: [...rawArray],
      rotatedArray: [...rawArray],
      k: rawK,
      effectiveK,
      direction,
      method,
    },
    variables: {
      n,
      k: rawK,
      effectiveK,
    },
    changedVariables: ['effectiveK'],
  });

  if (effectiveK === 0) {
    steps.push({
      stepIndex: steps.length,
      operation: 'done',
      linePython: 4,
      lineJava: 4,
      explanation: `Since effectiveK = 0, no elements need to move! The array remains unchanged.`,
      array: [...rawArray],
      highlightIndices: {
        sorted: Array.from({ length: n }, (_, i) => i),
      },
      rotationState: {
        currentPhase: 'Complete (No-op)',
        originalArray: [...rawArray],
        rotatedArray: [...rawArray],
        k: rawK,
        effectiveK,
        direction,
        method,
      },
      variables: { n, k: rawK, effectiveK },
      isComplete: true,
    });
    return steps;
  }

  const currentArr = [...rawArray];

  if (method === 'reversal') {
    // Reversal Algorithm (O(n) time, O(1) space)
    const reverseRange = (start: number, end: number, label: string, stepDesc: string, linePy: number, lineJv: number) => {
      steps.push({
        stepIndex: steps.length,
        operation: 'reversal_start',
        linePython: linePy,
        lineJava: lineJv,
        explanation: `${label}: Beginning reversal from index ${start} to ${end}. (${stepDesc})`,
        array: [...currentArr],
        highlightIndices: {
          active: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
        },
        rotationState: {
          currentPhase: label,
          originalArray: [...rawArray],
          rotatedArray: [...currentArr],
          k: rawK,
          effectiveK,
          direction,
          method: 'reversal',
        },
        variables: { start, end, range: `[${start}..${end}]` },
        changedVariables: ['start', 'end'],
      });

      let l = start;
      let r = end;
      let swaps = 0;
      while (l < r) {
        const temp = currentArr[l];
        currentArr[l] = currentArr[r];
        currentArr[r] = temp;
        swaps++;

        steps.push({
          stepIndex: steps.length,
          operation: 'swap',
          linePython: linePy + 2,
          lineJava: lineJv + 2,
          explanation: `Reversal swap: swapping arr[${l}] (${currentArr[r]}) and arr[${r}] (${currentArr[l]}).`,
          array: [...currentArr],
          highlightIndices: {
            swapping: [l, r],
            active: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
          },
          rotationState: {
            currentPhase: `${label} (Swapping)`,
            originalArray: [...rawArray],
            rotatedArray: [...currentArr],
            k: rawK,
            effectiveK,
            direction,
            method: 'reversal',
          },
          variables: { l, r, tempLeft: currentArr[l], tempRight: currentArr[r] },
          changedVariables: ['l', 'r'],
        });
        l++;
        r--;
      }

      steps.push({
        stepIndex: steps.length,
        operation: 'reversal_end',
        linePython: linePy + 4,
        lineJava: lineJv + 4,
        explanation: `${label} completed. Array is now [${currentArr.join(', ')}].`,
        array: [...currentArr],
        highlightIndices: {
          active: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
        },
        rotationState: {
          currentPhase: `${label} Complete`,
          originalArray: [...rawArray],
          rotatedArray: [...currentArr],
          k: rawK,
          effectiveK,
          direction,
          method: 'reversal',
        },
        variables: { start, end, state: [...currentArr] },
      });
    };

    if (direction === 'left') {
      // Left Rotation via 3 Reversals:
      // 1. Reverse arr[0 .. k-1]
      // 2. Reverse arr[k .. n-1]
      // 3. Reverse arr[0 .. n-1]
      reverseRange(0, effectiveK - 1, 'Phase 1: Reverse First k Elements', `arr[0..${effectiveK - 1}]`, 6, 8);
      reverseRange(effectiveK, n - 1, 'Phase 2: Reverse Remaining Elements', `arr[${effectiveK}..${n - 1}]`, 7, 9);
      reverseRange(0, n - 1, 'Phase 3: Reverse Entire Array', `arr[0..${n - 1}]`, 8, 10);
    } else {
      // Right Rotation via 3 Reversals:
      // 1. Reverse whole array arr[0 .. n-1]
      // 2. Reverse first k elements arr[0 .. k-1]
      // 3. Reverse remaining elements arr[k .. n-1]
      reverseRange(0, n - 1, 'Phase 1: Reverse Entire Array', `arr[0..${n - 1}]`, 6, 8);
      reverseRange(0, effectiveK - 1, 'Phase 2: Reverse First k Elements', `arr[0..${effectiveK - 1}]`, 7, 9);
      reverseRange(effectiveK, n - 1, 'Phase 3: Reverse Remaining Elements', `arr[${effectiveK}..${n - 1}]`, 8, 10);
    }
  } else {
    // Brute Force Shift O(n * k)
    for (let shift = 1; shift <= effectiveK; shift++) {
      steps.push({
        stepIndex: steps.length,
        operation: 'shift_start',
        linePython: 6,
        lineJava: 7,
        explanation: `Shift pass ${shift} of ${effectiveK}: Shifting elements one position to the ${direction}.`,
        array: [...currentArr],
        highlightIndices: {
          active: [direction === 'left' ? 0 : n - 1],
        },
        variables: { shift, effectiveK, direction },
        changedVariables: ['shift'],
      });

      if (direction === 'left') {
        const first = currentArr[0];
        for (let i = 0; i < n - 1; i++) {
          currentArr[i] = currentArr[i + 1];
          steps.push({
            stepIndex: steps.length,
            operation: 'shift_step',
            linePython: 9,
            lineJava: 10,
            explanation: `Shifted arr[${i + 1}] (${currentArr[i]}) into arr[${i}].`,
            array: [...currentArr],
            highlightIndices: {
              active: [i, i + 1],
            },
            variables: { shift, i, tempFirst: first },
          });
        }
        currentArr[n - 1] = first;
        steps.push({
          stepIndex: steps.length,
          operation: 'shift_end',
          linePython: 11,
          lineJava: 12,
          explanation: `Placed saved initial element ${first} at the end of the array.`,
          array: [...currentArr],
          highlightIndices: {
            active: [n - 1],
          },
          variables: { shift, placedAtEnd: first },
        });
      } else {
        const last = currentArr[n - 1];
        for (let i = n - 1; i > 0; i--) {
          currentArr[i] = currentArr[i - 1];
          steps.push({
            stepIndex: steps.length,
            operation: 'shift_step',
            linePython: 9,
            lineJava: 10,
            explanation: `Shifted arr[${i - 1}] (${currentArr[i]}) into arr[${i}].`,
            array: [...currentArr],
            highlightIndices: {
              active: [i - 1, i],
            },
            variables: { shift, i, tempLast: last },
          });
        }
        currentArr[0] = last;
        steps.push({
          stepIndex: steps.length,
          operation: 'shift_end',
          linePython: 11,
          lineJava: 12,
          explanation: `Placed saved last element ${last} at the beginning of the array.`,
          array: [...currentArr],
          highlightIndices: {
            active: [0],
          },
          variables: { shift, placedAtStart: last },
        });
      }
    }
  }

  // Final step
  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 14,
    lineJava: 15,
    explanation: `Array rotation complete! Result: [${currentArr.join(', ')}]. Original was [${rawArray.join(', ')}].`,
    array: [...currentArr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, i) => i),
    },
    rotationState: {
      currentPhase: 'Finished',
      originalArray: [...rawArray],
      rotatedArray: [...currentArr],
      k: rawK,
      effectiveK,
      direction,
      method,
    },
    variables: {
      result: [...currentArr],
      effectiveK,
      direction,
      timeComplexity: method === 'reversal' ? 'O(n)' : 'O(n × k)',
      spaceComplexity: 'O(1) auxiliary',
    },
    isComplete: true,
  });

  return steps;
}
