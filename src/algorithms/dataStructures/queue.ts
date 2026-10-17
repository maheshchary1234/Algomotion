import { ExecutionStep } from '../../types/algorithm';

export interface QueueCommand {
  type: 'enqueue' | 'dequeue' | 'front' | 'isEmpty';
  value?: any;
}

export function generateQueueDemoTrace(commands?: QueueCommand[]): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const defaultCommands: QueueCommand[] = [
    { type: 'enqueue', value: 15 },
    { type: 'enqueue', value: 30 },
    { type: 'enqueue', value: 45 },
    { type: 'front' },
    { type: 'dequeue' },
    { type: 'enqueue', value: 60 },
    { type: 'dequeue' },
  ];

  const cmds = commands && commands.length > 0 ? commands : defaultCommands;
  const items: number[] = [];
  const MAX_CAPACITY = 7;

  const getQueueItems = () => {
    return items.map((val, idx) => ({
      id: `queue-${idx}-${val}`,
      value: val,
      isFront: idx === 0,
      isRear: idx === items.length - 1,
    }));
  };

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: 'Initialized empty Queue (FIFO: First-In, First-Out). Elements enter at Rear and exit from Front. Max capacity: 7.',
    queueItems: [],
    variables: { size: 0, isEmpty: true, front: null, rear: null, capacity: MAX_CAPACITY },
    changedVariables: ['size'],
  });

  for (let cIdx = 0; cIdx < cmds.length; cIdx++) {
    const cmd = cmds[cIdx];

    if (cmd.type === 'enqueue') {
      const val = typeof cmd.value === 'number' ? cmd.value : Math.floor(Math.random() * 90) + 10;
      if (items.length >= MAX_CAPACITY) {
        steps.push({
          stepIndex: steps.length,
          operation: 'overflow',
          linePython: 5,
          lineJava: 6,
          explanation: `Queue Full Error! Cannot enqueue ${val} because queue is at capacity (${MAX_CAPACITY}).`,
          queueItems: getQueueItems(),
          variables: { error: 'Queue Overflow', attemptedVal: val, size: items.length },
        });
      } else {
        items.push(val);
        steps.push({
          stepIndex: steps.length,
          operation: 'enqueue',
          linePython: 4,
          lineJava: 5,
          explanation: `ENQUEUE(${val}): Added ${val} to Rear of the queue. Front is ${items[0]}, Rear is ${val}. Size: ${items.length}.`,
          queueItems: getQueueItems(),
          variables: { action: 'ENQUEUE', enqueued: val, front: items[0], rear: val, size: items.length },
          changedVariables: ['rear', 'size'],
        });
      }
    } else if (cmd.type === 'dequeue') {
      if (items.length === 0) {
        steps.push({
          stepIndex: steps.length,
          operation: 'underflow',
          linePython: 8,
          lineJava: 9,
          explanation: 'Queue Underflow Error! Cannot dequeue from an empty queue.',
          queueItems: [],
          variables: { error: 'Queue Underflow', size: 0 },
        });
      } else {
        const dequeued = items.shift()!;
        steps.push({
          stepIndex: steps.length,
          operation: 'dequeue',
          linePython: 9,
          lineJava: 10,
          explanation: `DEQUEUE(): Removed ${dequeued} from Front of the queue. New front is ${items.length > 0 ? items[0] : 'None'}. Size: ${items.length}.`,
          queueItems: getQueueItems(),
          variables: { action: 'DEQUEUE', dequeued, front: items.length > 0 ? items[0] : null, rear: items.length > 0 ? items[items.length - 1] : null, size: items.length },
          changedVariables: ['front', 'size'],
        });
      }
    } else if (cmd.type === 'front') {
      const frontVal = items.length > 0 ? items[0] : null;
      steps.push({
        stepIndex: steps.length,
        operation: 'front',
        linePython: 12,
        lineJava: 13,
        explanation: `FRONT(): Inspected element at head of queue: ${frontVal !== null ? frontVal : 'Queue is empty'}.`,
        queueItems: getQueueItems(),
        variables: { action: 'FRONT', front: frontVal, size: items.length },
      });
    } else if (cmd.type === 'isEmpty') {
      const empty = items.length === 0;
      steps.push({
        stepIndex: steps.length,
        operation: 'isEmpty',
        linePython: 14,
        lineJava: 15,
        explanation: `IS_EMPTY(): Checked queue occupancy. Result: ${empty} (Size: ${items.length}).`,
        queueItems: getQueueItems(),
        variables: { action: 'IS_EMPTY', isEmpty: empty, size: items.length },
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    operation: 'done',
    linePython: 16,
    lineJava: 17,
    explanation: `Queue demo completed. Final size: ${items.length}.`,
    queueItems: getQueueItems(),
    variables: { size: items.length, front: items.length > 0 ? items[0] : null, rear: items.length > 0 ? items[items.length - 1] : null },
    isComplete: true,
  });

  return steps;
}
