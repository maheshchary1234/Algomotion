import { ExecutionStep, RecursionStackFrame, RecursionTreeNode } from '../../types/algorithm';

export function generateArraySumTrace(inputArray?: number[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const arr = inputArray && inputArray.length > 0 ? inputArray.slice(0, 5) : [2, 4, 6, 8];
  const n = arr.length;

  const stack: RecursionStackFrame[] = [];
  let callCounter = 0;
  const memoReturns = new Map<string, any>();

  const buildTree = (callId: string, depth: number, idx: number, activeId: string): RecursionTreeNode => {
    const isAct = callId === activeId;
    const res = memoReturns.get(callId);
    return {
      id: callId,
      name: `sum(idx=${idx})`,
      argsString: idx < n ? `val=${arr[idx]}` : 'end',
      depth,
      status: res !== undefined ? (idx >= n ? 'base_case' : 'completed') : (isAct ? 'active' : 'pending'),
      returnValue: res,
      children: idx < n ? [buildTree(`${callId}-child`, depth + 1, idx + 1, activeId)] : undefined,
    };
  };

  const recordStep = (
    op: string,
    linePy: number,
    lineJv: number,
    explanation: string,
    activeFrameId: string,
    vars: Record<string, any>,
    currIdx: number
  ) => {
    steps.push({
      stepIndex: steps.length,
      operation: op,
      linePython: linePy,
      lineJava: lineJv,
      explanation,
      array: [...arr],
      highlightIndices: {
        active: currIdx < n ? [currIdx] : [],
      },
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: activeFrameId,
      treeSnapshot: buildTree('call-0', 0, 0, activeFrameId),
      variables: { ...vars, stackDepth: stack.length },
    });
  };

  const sumRecursive = (idx: number, parentId?: string): number => {
    const frameId = `frame-${callCounter++}`;
    const frame: RecursionStackFrame = {
      id: frameId,
      functionName: 'arraySum',
      args: { index: idx, element: idx < n ? arr[idx] : null },
      depth: stack.length,
      parentId,
      status: 'calling',
    };
    stack.push(frame);

    recordStep('call', 1, 2, `Called arraySum(index=${idx}).`, frameId, { index: idx, value: idx < n ? arr[idx] : 'N/A' }, idx);

    if (idx >= n) {
      frame.status = 'base_case';
      frame.returnValue = 0;
      memoReturns.set('call-0' + '-child'.repeat(idx), 0);

      recordStep('base_case', 2, 3, `BASE CASE: index (${idx}) == array length (${n}). Return 0.`, frameId, { index: idx, returnValue: 0 }, idx);
      recordStep('return', 3, 4, `Returning 0 from arraySum(index=${idx}).`, frameId, { returnValue: 0 }, idx);

      stack.pop();
      return 0;
    }

    recordStep('recurse', 4, 5, `Recursive step: arr[${idx}] (${arr[idx]}) + arraySum(index=${idx + 1}).`, frameId, { currentVal: arr[idx], nextIndex: idx + 1 }, idx);

    const subSum = sumRecursive(idx + 1, frameId);
    const total = arr[idx] + subSum;

    frame.returnValue = total;
    frame.status = 'returning';
    memoReturns.set('call-0' + '-child'.repeat(idx), total);

    recordStep('compute', 5, 6, `Computed arr[${idx}] (${arr[idx]}) + subSum (${subSum}) = ${total}.`, frameId, { index: idx, currentVal: arr[idx], subSum, total }, idx);
    recordStep('return', 5, 6, `Returning ${total} from arraySum(index=${idx}).`, frameId, { returnValue: total }, idx);

    stack.pop();
    return total;
  };

  const finalSum = sumRecursive(0);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 6,
    lineJava: 7,
    explanation: `Array Sum recursion complete! Total Sum: ${finalSum}. Array: [${arr.join(', ')}].`,
    array: [...arr],
    highlightIndices: {
      sorted: Array.from({ length: n }, (_, i) => i),
    },
    callStack: [],
    treeSnapshot: buildTree('call-0', 0, 0, ''),
    variables: { totalSum: finalSum, arrayLength: n, timeComplexity: 'O(n)', spaceComplexity: 'O(n) call stack' },
    isComplete: true,
  });

  return steps;
}
