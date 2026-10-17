import { ExecutionStep } from '../../types/algorithm';

export interface StackCommand {
  type: 'push' | 'pop' | 'peek' | 'isEmpty';
  value?: any;
}

export function generateStackDemoTrace(commands?: StackCommand[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const defaultCommands: StackCommand[] = [
    { type: 'push', value: 10 },
    { type: 'push', value: 25 },
    { type: 'push', value: 40 },
    { type: 'peek' },
    { type: 'pop' },
    { type: 'push', value: 99 },
    { type: 'isEmpty' },
  ];

  const cmds = commands && commands.length > 0 ? commands : defaultCommands;
  const items: number[] = [];
  const MAX_CAPACITY = 7;

  const getStackItems = (topHighlight: boolean = false) => {
    return items.map((val, idx) => ({
      id: `item-${idx}-${val}`,
      value: val,
      isTop: idx === items.length - 1,
    }));
  };

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: 'Initialized empty Stack (LIFO: Last-In, First-Out). Maximum capacity is 7 elements.',
    stackItems: [],
    variables: { size: 0, isEmpty: true, top: null, capacity: MAX_CAPACITY },
    changedVariables: ['size'],
  });

  for (let cIdx = 0; cIdx < cmds.length; cIdx++) {
    const cmd = cmds[cIdx];

    if (cmd.type === 'push') {
      const val = typeof cmd.value === 'number' ? cmd.value : Math.floor(Math.random() * 90) + 10;
      if (items.length >= MAX_CAPACITY) {
        steps.push({
          stepIndex: steps.length,
          operation: 'overflow',
          linePython: 5,
          lineJava: 6,
          explanation: `Stack Overflow Error! Cannot push ${val} because stack is at maximum capacity (${MAX_CAPACITY}).`,
          stackItems: getStackItems(),
          variables: { error: 'Stack Overflow', attemptedVal: val, size: items.length },
        });
      } else {
        items.push(val);
        steps.push({
          stepIndex: steps.length,
          operation: 'push',
          linePython: 4,
          lineJava: 5,
          explanation: `PUSH(${val}): Added ${val} to top of stack. New top is ${val}. Size: ${items.length}.`,
          stackItems: getStackItems(),
          variables: { action: 'PUSH', pushed: val, top: val, size: items.length },
          changedVariables: ['top', 'size'],
        });
      }
    } else if (cmd.type === 'pop') {
      if (items.length === 0) {
        steps.push({
          stepIndex: steps.length,
          operation: 'underflow',
          linePython: 8,
          lineJava: 9,
          explanation: 'Stack Underflow Error! Cannot pop from an empty stack.',
          stackItems: [],
          variables: { error: 'Stack Underflow', size: 0 },
        });
      } else {
        const popped = items.pop()!;
        steps.push({
          stepIndex: steps.length,
          operation: 'pop',
          linePython: 9,
          lineJava: 10,
          explanation: `POP(): Removed top element ${popped} from stack. New top is ${items.length > 0 ? items[items.length - 1] : 'None'}. Size: ${items.length}.`,
          stackItems: getStackItems(),
          variables: { action: 'POP', popped, top: items.length > 0 ? items[items.length - 1] : null, size: items.length },
          changedVariables: ['top', 'size'],
        });
      }
    } else if (cmd.type === 'peek') {
      const topVal = items.length > 0 ? items[items.length - 1] : null;
      steps.push({
        stepIndex: steps.length,
        operation: 'peek',
        linePython: 12,
        lineJava: 13,
        explanation: `PEEK(): Inspected top element without removing it. Top element is ${topVal !== null ? topVal : 'None (Stack empty)'}.`,
        stackItems: getStackItems(),
        variables: { action: 'PEEK', top: topVal, size: items.length },
      });
    } else if (cmd.type === 'isEmpty') {
      const empty = items.length === 0;
      steps.push({
        stepIndex: steps.length,
        operation: 'isEmpty',
        linePython: 14,
        lineJava: 15,
        explanation: `IS_EMPTY(): Checked whether stack contains elements. Result: ${empty} (Size: ${items.length}).`,
        stackItems: getStackItems(),
        variables: { action: 'IS_EMPTY', isEmpty: empty, size: items.length },
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 16,
    lineJava: 17,
    explanation: `Stack operations completed. Final size: ${items.length}.`,
    stackItems: getStackItems(),
    variables: { size: items.length, top: items.length > 0 ? items[items.length - 1] : null },
    isComplete: true,
  });

  return steps;
}
