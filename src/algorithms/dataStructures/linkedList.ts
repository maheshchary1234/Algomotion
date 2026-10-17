import { ExecutionStep } from '../../types/algorithm';

export interface LLNode {
  id: string;
  value: any;
  nextId?: string | null;
  prevId?: string | null;
  isHead?: boolean;
  isTail?: boolean;
  isCurrent?: boolean;
  isTarget?: boolean;
}

export type LLType = 'singly' | 'doubly';

export interface LLOperation {
  type: 'insert_head' | 'insert_tail' | 'insert_pos' | 'delete_val' | 'delete_pos' | 'search' | 'traverse';
  value?: any;
  position?: number;
}

export function generateLinkedListTrace(
  initialValues: number[] = [10, 20, 30],
  operation: LLOperation = { type: 'insert_head', value: 5 },
  listType: LLType = 'singly'
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  let nextNodeId = 1;

  interface InternalNode {
    id: string;
    val: number;
  }

  let nodes: InternalNode[] = initialValues.map(v => ({ id: `node-${nextNodeId++}`, val: v }));

  const buildLLSnapshot = (currentId?: string, targetId?: string): LLNode[] => {
    return nodes.map((node, idx) => ({
      id: node.id,
      value: node.val,
      nextId: idx < nodes.length - 1 ? nodes[idx + 1].id : null,
      prevId: listType === 'doubly' ? (idx > 0 ? nodes[idx - 1].id : null) : null,
      isHead: idx === 0,
      isTail: idx === nodes.length - 1,
      isCurrent: node.id === currentId,
      isTarget: node.id === targetId,
    }));
  };

  steps.push({
    stepIndex: steps.length,
    operation: 'init',
    linePython: 1,
    lineJava: 1,
    explanation: `Initial state: ${listType === 'doubly' ? 'Doubly' : 'Singly'} Linked List with ${nodes.length} nodes: [${nodes.map(n => n.val).join(' -> ')}].`,
    linkedListNodes: buildLLSnapshot(),
    variables: { size: nodes.length, head: nodes.length > 0 ? nodes[0].val : null, listType },
    changedVariables: ['head', 'size'],
  });

  const { type, value, position } = operation;

  if (type === 'insert_head') {
    const newVal = typeof value === 'number' ? value : 5;
    const newNode: InternalNode = { id: `node-${nextNodeId++}`, val: newVal };

    steps.push({
      stepIndex: steps.length,
      operation: 'create_node',
      linePython: 3,
      lineJava: 4,
      explanation: `Step 1: Created new Node(${newVal}).`,
      linkedListNodes: [
        { id: newNode.id, value: newNode.val, isCurrent: true, nextId: null, prevId: null },
        ...buildLLSnapshot(),
      ],
      variables: { action: 'INSERT_HEAD', newVal, step: 'Allocate node' },
    });

    steps.push({
      stepIndex: steps.length,
      operation: 'link_head',
      linePython: 4,
      lineJava: 5,
      explanation: `Step 2: Point newNode.next to current head (${nodes.length > 0 ? nodes[0].val : 'null'})${listType === 'doubly' && nodes.length > 0 ? ' and update old head.prev to newNode' : ''}.`,
      linkedListNodes: [
        {
          id: newNode.id,
          value: newNode.val,
          isHead: true,
          nextId: nodes.length > 0 ? nodes[0].id : null,
          prevId: null,
          isCurrent: true,
        },
        ...buildLLSnapshot(),
      ],
      variables: { action: 'INSERT_HEAD', newVal, step: 'Update pointers' },
    });

    nodes.unshift(newNode);

    steps.push({
      stepIndex: steps.length,
      operation: 'done',
      linePython: 5,
      lineJava: 6,
      explanation: `Step 3: Updated head pointer to newNode(${newVal}). Operation complete in O(1) time!`,
      linkedListNodes: buildLLSnapshot(newNode.id),
      variables: { size: nodes.length, head: newVal, timeComplexity: 'O(1)' },
      isComplete: true,
    });
  } else if (type === 'insert_tail') {
    const newVal = typeof value === 'number' ? value : 99;
    const newNode: InternalNode = { id: `node-${nextNodeId++}`, val: newVal };

    if (nodes.length === 0) {
      nodes.push(newNode);
      steps.push({
        stepIndex: steps.length,
        operation: 'done',
        linePython: 3,
        lineJava: 4,
        explanation: `List was empty. Inserted ${newVal} as head and tail.`,
        linkedListNodes: buildLLSnapshot(newNode.id),
        variables: { size: 1, head: newVal, tail: newVal },
        isComplete: true,
      });
    } else {
      // Traverse to tail
      for (let i = 0; i < nodes.length; i++) {
        steps.push({
          stepIndex: steps.length,
          operation: 'traverse',
          linePython: 5,
          lineJava: 6,
          explanation: `Traversing: current pointer is at node ${nodes[i].val} (index ${i}). ${i === nodes.length - 1 ? 'Found tail node!' : 'Moving to next.'}`,
          linkedListNodes: buildLLSnapshot(nodes[i].id),
          variables: { currentVal: nodes[i].val, index: i },
        });
      }

      const oldTail = nodes[nodes.length - 1];
      nodes.push(newNode);

      steps.push({
        stepIndex: steps.length,
        operation: 'link_tail',
        linePython: 7,
        lineJava: 8,
        explanation: `Attached newNode(${newVal}) to tail (${oldTail.val}.next = newNode)${listType === 'doubly' ? ' and newNode.prev = oldTail' : ''}.`,
        linkedListNodes: buildLLSnapshot(newNode.id),
        variables: { action: 'INSERT_TAIL', newVal, tail: newVal, size: nodes.length, timeComplexity: 'O(n) (or O(1) with tail pointer)' },
        isComplete: true,
      });
    }
  } else if (type === 'delete_val') {
    const targetVal = typeof value === 'number' ? value : 20;

    if (nodes.length === 0) {
      steps.push({
        stepIndex: steps.length,
        operation: 'error',
        linePython: 2,
        lineJava: 2,
        explanation: 'Cannot delete from an empty linked list.',
        linkedListNodes: [],
        variables: { error: 'Empty list' },
        isComplete: true,
      });
    } else if (nodes[0].val === targetVal) {
      const removed = nodes.shift()!;
      steps.push({
        stepIndex: steps.length,
        operation: 'delete_head',
        linePython: 4,
        lineJava: 5,
        explanation: `Target value ${targetVal} matches head! Updated head pointer to head.next (${nodes.length > 0 ? nodes[0].val : 'null'}).`,
        linkedListNodes: buildLLSnapshot(),
        variables: { deleted: targetVal, newHead: nodes.length > 0 ? nodes[0].val : null, size: nodes.length },
        isComplete: true,
      });
    } else {
      let found = false;
      for (let i = 0; i < nodes.length; i++) {
        const isMatch = nodes[i].val === targetVal;
        steps.push({
          stepIndex: steps.length,
          operation: 'search_delete',
          linePython: 6,
          lineJava: 7,
          explanation: `Checking node at index ${i} (value ${nodes[i].val}). ${isMatch ? 'Found matching node to delete!' : 'No match, advancing.'}`,
          linkedListNodes: buildLLSnapshot(nodes[i].id, isMatch ? nodes[i].id : undefined),
          variables: { index: i, val: nodes[i].val, targetVal },
        });

        if (isMatch) {
          const prevNode = nodes[i - 1];
          const nextNode = i < nodes.length - 1 ? nodes[i + 1] : null;

          steps.push({
            stepIndex: steps.length,
            operation: 'bypass_pointer',
            linePython: 8,
            lineJava: 9,
            explanation: `Bypassing deleted node: Updated prev (${prevNode.val}).next to next (${nextNode ? nextNode.val : 'null'})${listType === 'doubly' && nextNode ? ` and next.prev to prev (${prevNode.val})` : ''}.`,
            linkedListNodes: buildLLSnapshot(nodes[i].id, nodes[i].id),
            variables: { prev: prevNode.val, deleting: targetVal, next: nextNode ? nextNode.val : null },
          });

          nodes.splice(i, 1);
          found = true;
          break;
        }
      }

      if (found) {
        steps.push({
          stepIndex: steps.length,
          operation: 'done',
          linePython: 10,
          lineJava: 11,
          explanation: `Node with value ${targetVal} successfully unlinked and deleted! List size is now ${nodes.length}.`,
          linkedListNodes: buildLLSnapshot(),
          variables: { size: nodes.length, timeComplexity: 'O(n)' },
          isComplete: true,
        });
      } else {
        steps.push({
          stepIndex: steps.length,
          operation: 'not_found',
          linePython: 11,
          lineJava: 12,
          explanation: `Value ${targetVal} was not found in the linked list. No nodes were deleted.`,
          linkedListNodes: buildLLSnapshot(),
          variables: { targetVal, status: 'NOT_FOUND' },
          isComplete: true,
        });
      }
    }
  } else if (type === 'search') {
    const searchTarget = typeof value === 'number' ? value : 20;
    let found = false;

    for (let i = 0; i < nodes.length; i++) {
      const match = nodes[i].val === searchTarget;
      steps.push({
        stepIndex: steps.length,
        operation: 'search_step',
        linePython: 3,
        lineJava: 4,
        explanation: `Examining node ${i}: value is ${nodes[i].val}. Comparing with target ${searchTarget}. ${match ? 'Target MATCH!' : 'No match.'}`,
        linkedListNodes: buildLLSnapshot(nodes[i].id, match ? nodes[i].id : undefined),
        variables: { index: i, value: nodes[i].val, target: searchTarget },
      });

      if (match) {
        found = true;
        steps.push({
          stepIndex: steps.length,
          operation: 'done',
          linePython: 5,
          lineJava: 6,
          explanation: `FOUND: Value ${searchTarget} discovered at index ${i}!`,
          linkedListNodes: buildLLSnapshot(nodes[i].id, nodes[i].id),
          variables: { foundIndex: i, target: searchTarget, timeComplexity: 'O(n)' },
          isComplete: true,
        });
        break;
      }
    }

    if (!found) {
      steps.push({
        stepIndex: steps.length,
        operation: 'done',
        linePython: 7,
        lineJava: 8,
        explanation: `NOT FOUND: Reached end of linked list (null pointer). Value ${searchTarget} is not present.`,
        linkedListNodes: buildLLSnapshot(),
        variables: { target: searchTarget, found: false },
        isComplete: true,
      });
    }
  } else if (type === 'traverse') {
    for (let i = 0; i < nodes.length; i++) {
      steps.push({
        stepIndex: steps.length,
        operation: 'traverse_step',
        linePython: 3,
        lineJava: 4,
        explanation: `Visiting node at index ${i} with value ${nodes[i].val}. Next pointer -> ${i < nodes.length - 1 ? nodes[i + 1].val : 'null'}.`,
        linkedListNodes: buildLLSnapshot(nodes[i].id),
        variables: { index: i, value: nodes[i].val },
      });
    }

    steps.push({
      stepIndex: steps.length,
      operation: 'done',
      linePython: 6,
      lineJava: 7,
      explanation: `Traversal completed. Visited all ${nodes.length} nodes in sequence.`,
      linkedListNodes: buildLLSnapshot(),
      variables: { totalNodes: nodes.length, timeComplexity: 'O(n)' },
      isComplete: true,
    });
  }

  return steps;
}
