import { ExecutionStep, RecursionStackFrame, RecursionTreeNode } from '../../types/algorithm';

export function generateTowerOfHanoiTrace(disksInput: number): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const n = Math.min(Math.max(1, typeof disksInput === 'number' ? disksInput : 3), 4); // 1 to 4 disks

  const rods: { A: number[]; B: number[]; C: number[] } = {
    A: Array.from({ length: n }, (_, i) => n - i), // e.g. [3, 2, 1] for 3 disks
    B: [],
    C: [],
  };

  const stack: RecursionStackFrame[] = [];
  let moveCount = 0;
  let callCounter = 0;

  const cloneRods = () => ({
    A: [...rods.A],
    B: [...rods.B],
    C: [...rods.C],
  });

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Starting Tower of Hanoi with ${n} disks. Goal: Move all disks from Rod A to Rod C obeying Hanoi rules (never place a larger disk on top of a smaller disk). Minimum moves = 2^${n} - 1 = ${Math.pow(2, n) - 1}.`,
    hanoiRods: cloneRods(),
    callStack: [],
    variables: { totalDisks: n, moves: 0, minMoves: Math.pow(2, n) - 1 },
    comparisonsCount: 0,
    swapsCount: 0,
  });

  const hanoi = (count: number, fromRod: 'A' | 'B' | 'C', toRod: 'A' | 'B' | 'C', auxRod: 'A' | 'B' | 'C', parentId?: string) => {
    const frameId = `hanoi-${callCounter++}`;
    const frame: RecursionStackFrame = {
      id: frameId,
      functionName: 'solveHanoi',
      args: { n: count, from: fromRod, to: toRod, aux: auxRod },
      depth: stack.length,
      parentId,
      status: 'calling',
    };
    stack.push(frame);

    steps.push({
      stepIndex: steps.length,
      operation: 'call',
      linePython: 1,
      lineJava: 2,
      explanation: `Called solveHanoi(n=${count}, from=${fromRod}, to=${toRod}, aux=${auxRod}). Stack depth: ${stack.length}.`,
      hanoiRods: cloneRods(),
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: frameId,
      variables: { n: count, from: fromRod, to: toRod, aux: auxRod, moves: moveCount },
    });

    if (count === 1) {
      // Base case: move single disk
      const disk = rods[fromRod].pop()!;
      rods[toRod].push(disk);
      moveCount++;
      frame.status = 'base_case';

      steps.push({
        stepIndex: steps.length,
        operation: 'move_disk',
        linePython: 3,
        lineJava: 4,
        explanation: `BASE CASE (n=1): Move disk ${disk} directly from Rod ${fromRod} to Rod ${toRod}. (Move #${moveCount})`,
        hanoiRods: cloneRods(),
        callStack: JSON.parse(JSON.stringify(stack)),
        activeCallId: frameId,
        variables: { diskMoved: disk, from: fromRod, to: toRod, moveNumber: moveCount },
        changedVariables: ['moves'],
        swapsCount: moveCount,
      });

      stack.pop();
      return;
    }

    // Step 1: Move n - 1 disks from 'from' to 'aux' using 'to'
    steps.push({
      stepIndex: steps.length,
      operation: 'subproblem_1',
      linePython: 5,
      lineJava: 6,
      explanation: `Step 1 of 3: Recursively move top ${count - 1} disks from Rod ${fromRod} to auxiliary Rod ${auxRod}.`,
      hanoiRods: cloneRods(),
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: frameId,
      variables: { subproblem: `Move ${count - 1} disks ${fromRod} -> ${auxRod}` },
    });

    hanoi(count - 1, fromRod, auxRod, toRod, frameId);

    // Step 2: Move the nth disk directly from 'from' to 'to'
    const disk = rods[fromRod].pop()!;
    rods[toRod].push(disk);
    moveCount++;

    steps.push({
      stepIndex: steps.length,
      operation: 'move_disk',
      linePython: 6,
      lineJava: 7,
      explanation: `Step 2 of 3: Move largest disk ${disk} of this subproblem from Rod ${fromRod} to target Rod ${toRod}. (Move #${moveCount})`,
      hanoiRods: cloneRods(),
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: frameId,
      variables: { diskMoved: disk, from: fromRod, to: toRod, moveNumber: moveCount },
      changedVariables: ['moves'],
      swapsCount: moveCount,
    });

    // Step 3: Move n - 1 disks from 'aux' to 'to' using 'from'
    steps.push({
      stepIndex: steps.length,
      operation: 'subproblem_3',
      linePython: 7,
      lineJava: 8,
      explanation: `Step 3 of 3: Recursively move remaining ${count - 1} disks from auxiliary Rod ${auxRod} onto target Rod ${toRod}.`,
      hanoiRods: cloneRods(),
      callStack: JSON.parse(JSON.stringify(stack)),
      activeCallId: frameId,
      variables: { subproblem: `Move ${count - 1} disks ${auxRod} -> ${toRod}` },
    });

    hanoi(count - 1, auxRod, toRod, fromRod, frameId);

    stack.pop();
  };

  hanoi(n, 'A', 'C', 'B');

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 8,
    lineJava: 9,
    explanation: `Tower of Hanoi solved in ${moveCount} moves! All disks transferred successfully to Rod C.`,
    hanoiRods: cloneRods(),
    callStack: [],
    variables: {
      totalDisks: n,
      totalMoves: moveCount,
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n) recursion stack',
    },
    swapsCount: moveCount,
    isComplete: true,
  });

  return steps;
}
