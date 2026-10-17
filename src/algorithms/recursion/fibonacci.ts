import { ExecutionStep, RecursionStackFrame, RecursionTreeNode } from '../../types/algorithm';

export function generateFibonacciTrace(nInput: number): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const n = Math.min(Math.max(0, typeof nInput === 'number' ? nInput : 4), 6); // sensible limit: 0 to 6 to keep tree clean

  const stack: RecursionStackFrame[] = [];
  let callCounter = 0;
  const treeNodesMap = new Map<string, RecursionTreeNode>();

  const getTreeSnapshot = (activeId: string): RecursionTreeNode => {
    const clone = (id: string): RecursionTreeNode | null => {
      const node = treeNodesMap.get(id);
      if (!node) return null;
      return {
        ...node,
        status: id === activeId ? 'active' : node.status,
        children: node.children ? node.children.map(c => clone(c.id)!).filter(Boolean) : undefined,
      };
    };
    return clone('node-0') || { id: 'root', name: `fib(${n})`, argsString: `n=${n}`, depth: 0, status: 'active' };
  };

  const recordStep = (
    op: string,
    linePy: number,
    lineJv: number,
    explanation: string,
    frameId: string,
    treeNodeId: string,
    vars: Record<string, any>
  ) => {
    steps.push({
      stepIndex: steps.length,
      operation: op,
      linePython: linePy,
      lineJava: lineJv,
      explanation,
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: frameId,
      treeSnapshot: getTreeSnapshot(treeNodeId),
      variables: { ...vars, stackDepth: stack.length },
    });
  };

  const fib = (num: number, parentTreeId?: string, isLeftChild: boolean = true): number => {
    const frameId = `frame-${callCounter++}`;
    const treeNodeId = parentTreeId ? `${parentTreeId}-${isLeftChild ? 'L' : 'R'}` : 'node-0';

    const treeNode: RecursionTreeNode = {
      id: treeNodeId,
      name: `fib(${num})`,
      argsString: `n=${num}`,
      depth: stack.length,
      status: 'active',
      children: [],
    };
    treeNodesMap.set(treeNodeId, treeNode);

    if (parentTreeId) {
      const parent = treeNodesMap.get(parentTreeId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(treeNode);
      }
    }

    const frame: RecursionStackFrame = {
      id: frameId,
      functionName: 'fibonacci',
      args: { n: num },
      depth: stack.length,
      status: 'calling',
    };
    stack.push(frame);

    recordStep(
      'call',
      1,
      2,
      `Called fibonacci(n=${num}). Pushed frame onto Call Stack.`,
      frameId,
      treeNodeId,
      { n: num, action: 'CALL' }
    );

    recordStep(
      'check_base_case',
      2,
      3,
      `Base case test: Is n (${num}) <= 1?`,
      frameId,
      treeNodeId,
      { n: num, isBaseCase: num <= 1 }
    );

    if (num <= 1) {
      frame.status = 'base_case';
      frame.returnValue = num;
      treeNode.status = 'base_case';
      treeNode.returnValue = num;

      recordStep(
        'base_case_hit',
        3,
        4,
        `BASE CASE REACHED: fibonacci(${num}) returns ${num}.`,
        frameId,
        treeNodeId,
        { n: num, returnValue: num }
      );

      recordStep(
        'return',
        3,
        4,
        `Returning ${num} from fibonacci(${num}). Popping frame.`,
        frameId,
        treeNodeId,
        { n: num, returnValue: num }
      );

      stack.pop();
      return num;
    }

    // Left child: fib(num - 1)
    recordStep(
      'branch_left',
      5,
      6,
      `Evaluating left branch: fib(${num - 1}).`,
      frameId,
      treeNodeId,
      { n: num, branch: 'LEFT', calling: num - 1 }
    );

    const left = fib(num - 1, treeNodeId, true);

    // Right child: fib(num - 2)
    recordStep(
      'branch_right',
      5,
      6,
      `Evaluating right branch: fib(${num - 2}). Left branch returned ${left}.`,
      frameId,
      treeNodeId,
      { n: num, branch: 'RIGHT', calling: num - 2, leftResult: left }
    );

    const right = fib(num - 2, treeNodeId, false);

    const sum = left + right;
    frame.returnValue = sum;
    frame.status = 'returning';
    treeNode.status = 'completed';
    treeNode.returnValue = sum;

    recordStep(
      'sum_branches',
      5,
      6,
      `Combining results: fib(${num}) = fib(${num - 1}) [${left}] + fib(${num - 2}) [${right}] = ${sum}.`,
      frameId,
      treeNodeId,
      { n: num, left, right, sum }
    );

    recordStep(
      'return',
      5,
      6,
      `Returning ${sum} from fibonacci(${num}).`,
      frameId,
      treeNodeId,
      { n: num, returnValue: sum }
    );

    stack.pop();
    return sum;
  };

  const finalRes = fib(n);

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 6,
    lineJava: 7,
    explanation: `Fibonacci recursion tree complete! fib(${n}) = ${finalRes}. Total recursive calls: ${callCounter}.`,
    callStack: [],
    treeSnapshot: getTreeSnapshot(''),
    variables: {
      n,
      result: finalRes,
      totalCalls: callCounter,
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n) max call stack depth',
    },
    isComplete: true,
  });

  return steps;
}
