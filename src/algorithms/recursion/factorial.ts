import { ExecutionStep, RecursionStackFrame, RecursionTreeNode } from '../../types/algorithm';

export function generateFactorialTrace(nInput: number): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const n = Math.min(Math.max(0, typeof nInput === 'number' ? nInput : 4), 8); // sensible limit: 0 to 8

  const stack: RecursionStackFrame[] = [];
  let callCounter = 0;

  // Build tree representation helper
  const buildTree = (callId: string, depth: number, currentVal: number, activeId: string, memo: Map<string, any>): RecursionTreeNode => {
    const isAct = callId === activeId;
    const res = memo.get(callId);
    return {
      id: callId,
      name: `factorial(${currentVal})`,
      argsString: `n=${currentVal}`,
      depth,
      status: res !== undefined ? (currentVal <= 1 ? 'base_case' : 'completed') : (isAct ? 'active' : 'pending'),
      returnValue: res,
      children: currentVal > 1 ? [
        buildTree(`${callId}-child`, depth + 1, currentVal - 1, activeId, memo)
      ] : undefined,
    };
  };

  const memoReturns = new Map<string, any>();

  const recordStep = (
    op: string,
    linePy: number,
    lineJv: number,
    explanation: string,
    activeFrameId: string,
    vars: Record<string, any>
  ) => {
    steps.push({
      stepIndex: steps.length,
      operation: op,
      linePython: linePy,
      lineJava: lineJv,
      explanation,
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: activeFrameId,
      treeSnapshot: buildTree('call-0', 0, n, activeFrameId, memoReturns),
      variables: { ...vars, stackDepth: stack.length },
    });
  };

  const factorial = (num: number, parentId?: string): number => {
    const frameId = `frame-${callCounter++}`;
    const frame: RecursionStackFrame = {
      id: frameId,
      functionName: 'factorial',
      args: { n: num },
      depth: stack.length,
      parentId,
      status: 'calling',
    };
    stack.push(frame);

    recordStep(
      'call',
      1,
      2,
      `Called factorial(n=${num}). Pushed frame onto Call Stack (Depth: ${stack.length}).`,
      frameId,
      { n: num, action: 'CALL' }
    );

    recordStep(
      'check_base_case',
      2,
      3,
      `Evaluating base case condition: Is n (${num}) <= 1?`,
      frameId,
      { n: num, isBaseCase: num <= 1 }
    );

    if (num <= 1) {
      frame.status = 'base_case';
      frame.returnValue = 1;
      memoReturns.set('call-0' + '-child'.repeat(n - num), 1);

      recordStep(
        'base_case_hit',
        3,
        4,
        `BASE CASE REACHED: factorial(${num}) returns 1 immediately without further recursion!`,
        frameId,
        { n: num, returnValue: 1 }
      );

      frame.status = 'returning';
      recordStep(
        'return',
        3,
        4,
        `Unwinding: factorial(${num}) returning 1 to caller. Popping frame from Call Stack.`,
        frameId,
        { n: num, returnValue: 1 }
      );

      stack.pop();
      return 1;
    }

    recordStep(
      'recursive_call_prep',
      5,
      6,
      `Recursive Case: factorial(${num}) requires result of factorial(${num - 1}). Initiating sub-call.`,
      frameId,
      { n: num, nextN: num - 1 }
    );

    const subResult = factorial(num - 1, frameId);
    const result = num * subResult;

    frame.returnValue = result;
    frame.status = 'returning';
    memoReturns.set('call-0' + '-child'.repeat(n - num), result);

    recordStep(
      'compute_return',
      5,
      6,
      `Calculated factorial(${num}) = ${num} × factorial(${num - 1}) (${subResult}) = ${result}.`,
      frameId,
      { n: num, subResult, result }
    );

    recordStep(
      'return',
      5,
      6,
      `Returning ${result} from factorial(${num}). Popping frame.`,
      frameId,
      { n: num, returnValue: result }
    );

    stack.pop();
    return result;
  };

  const finalAns = factorial(n);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 6,
    lineJava: 7,
    explanation: `Recursion complete! Result: factorial(${n}) = ${finalAns}. Maximum stack depth was ${n + 1}.`,
    callStack: [],
    treeSnapshot: buildTree('call-0', 0, n, '', memoReturns),
    variables: {
      n,
      result: finalAns,
      maxDepth: n + 1,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n) call stack',
    },
    isComplete: true,
  });

  return steps;
}
