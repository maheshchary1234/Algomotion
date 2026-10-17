import { AlgorithmDefinition } from '../types/algorithm';
import { generateArrayRotationTrace } from './arrays/arrayRotation';
import { generateBubbleSortTrace } from './sorting/bubbleSort';
import { generateSelectionSortTrace } from './sorting/selectionSort';
import { generateInsertionSortTrace } from './sorting/insertionSort';
import { generateMergeSortTrace } from './sorting/mergeSort';
import { generateQuickSortTrace } from './sorting/quickSort';
import { generateHeapSortTrace } from './sorting/heapSort';
import { generateLinearSearchTrace } from './searching/linearSearch';
import { generateBinarySearchTrace } from './searching/binarySearch';
import { generateFactorialTrace } from './recursion/factorial';
import { generateFibonacciTrace } from './recursion/fibonacci';
import { generateArraySumTrace } from './recursion/arraySum';
import { generateTowerOfHanoiTrace } from './recursion/towerOfHanoi';
import { generateStackDemoTrace } from './dataStructures/stack';
import { generateQueueDemoTrace } from './dataStructures/queue';
import { generateLinkedListTrace } from './dataStructures/linkedList';

export const ALGORITHM_REGISTRY: AlgorithmDefinition[] = [
  // 1. Array Rotation
  {
    id: 'array-rotation',
    name: 'Array Rotation',
    slug: 'array-rotation',
    category: 'arrays',
    difficulty: 'Easy',
    shortDescription: 'Rotate an array left or right by k positions using the optimal 3-reversal algorithm or shifting.',
    detailedDescription: 'Array rotation shifts all elements circularly by k positions. While shifting takes O(n × k) time, the 3-reversal method achieves O(n) time and O(1) auxiliary space in-place by reversing partitions and the entire array.',
    pseudocode: `function rotate(arr, k, direction):
    n = length(arr)
    k = k % n // Modulo optimization
    if direction == "left":
        reverse(arr, 0, k - 1)
        reverse(arr, k, n - 1)
        reverse(arr, 0, n - 1)
    else: // right
        reverse(arr, 0, n - 1)
        reverse(arr, 0, k - 1)
        reverse(arr, k, n - 1)`,
    codePython: `def rotate_array(arr, k, direction="left"):
    n = len(arr)
    if n == 0: return arr
    k = k % n  # Modulo optimization
    if k == 0: return arr
    
    def reverse(start, end):
        while start < end:
            arr[start], arr[end] = arr[end], arr[start]
            start += 1
            end -= 1
            
    if direction == "left":
        reverse(0, k - 1)
        reverse(k, n - 1)
        reverse(0, n - 1)
    else:
        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)
    return arr`,
    codeJava: `public class ArrayRotation {
    public static void rotate(int[] arr, int k, String direction) {
        int n = arr.length;
        if (n == 0) return;
        k = k % n; // Modulo optimization
        if (k == 0) return;

        if ("left".equalsIgnoreCase(direction)) {
            reverse(arr, 0, k - 1);
            reverse(arr, k, n - 1);
            reverse(arr, 0, n - 1);
        } else {
            reverse(arr, 0, n - 1);
            reverse(arr, 0, k - 1);
            reverse(arr, k, n - 1);
        }
    }

    private static void reverse(int[] arr, int start, int end) {
        while (start < end) {
            int temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
            start++;
            end--;
        }
    }
}`,
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'The reversal algorithm traverses each element exactly twice during the three reversals, leading to 2n operations = O(n).',
      spaceExplanation: 'All reversals occur in-place via pointer swapping with only a few primitive integer variables.',
      inPlace: true,
    },
    inputConfig: {
      type: 'rotation_params',
      defaultArray: [1, 2, 3, 4, 5, 6, 7],
      defaultK: 3,
      defaultDirection: 'left',
    },
    generateTrace: (input) => generateArrayRotationTrace(input),
    commonMistakes: [
      'Forgetting the modulo step (k = k % n), causing out-of-bounds or unnecessary redundant full rotations when k > n.',
      'Allocating a secondary array of size n, which turns O(1) space into O(n) space.',
      'Applying the reversals in the wrong sequence for right rotation vs left rotation.',
    ],
    quizQuestions: [
      {
        id: 'ar-q1',
        question: 'What is the effective rotation count when rotating an array of size 5 by k = 17?',
        options: ['17', '2', '3', '5'],
        correctIndex: 1,
        explanation: 'Because 17 % 5 = 2, rotating 17 times is mathematically identical to rotating 2 times.',
      },
      {
        id: 'ar-q2',
        question: 'What is the auxiliary space complexity of the 3-reversal algorithm?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(k)'],
        correctIndex: 2,
        explanation: 'The reversal algorithm swaps elements directly in place without creating extra arrays.',
      },
    ],
  },

  // 2. Bubble Sort
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    slug: 'bubble-sort',
    category: 'sorting',
    difficulty: 'Easy',
    shortDescription: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if out of order.',
    detailedDescription: 'Bubble Sort is a simple comparison-based sorting algorithm. In each pass, the largest unsorted element "bubbles" up to its correct final position at the end of the array. An early-exit flag allows O(n) best-case time if already sorted.',
    pseudocode: `procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 0 to n - 2 do
            if A[i] > A[i + 1] then
                swap(A[i], A[i + 1])
                swapped := true
        n := n - 1
    until not swapped`,
    codePython: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # If no elements were swapped, array is sorted
        if not swapped:
            break
    return arr`,
    codeJava: `public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n²)',
      timeWorst: 'O(n²)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'Takes O(n) when array is already sorted (detecting 0 swaps on first pass). On average and worst case, compares n(n-1)/2 pairs.',
      spaceExplanation: 'Operates directly in place with only a temporary swap variable.',
      inPlace: true,
      stability: true,
    },
    inputConfig: {
      type: 'array',
      defaultArray: [64, 34, 25, 12, 22, 11, 90],
    },
    generateTrace: (input) => generateBubbleSortTrace(input.array),
    commonMistakes: [
      'Iterating through the entire array up to n - 1 on every pass without subtracting i.',
      'Omitting the boolean swapped flag, losing the O(n) best-case early termination.',
    ],
    quizQuestions: [
      {
        id: 'bs-q1',
        question: 'What is the best-case time complexity of optimized Bubble Sort with an early-exit flag?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'If the array is already sorted, pass 1 executes n - 1 comparisons, makes 0 swaps, and immediately exits.',
      },
    ],
  },

  // 3. Selection Sort
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    slug: 'selection-sort',
    category: 'sorting',
    difficulty: 'Easy',
    shortDescription: 'Divides the list into sorted and unsorted parts, repeatedly finding the minimum from unsorted part.',
    detailedDescription: 'Selection Sort works by maintaining a sorted prefix. In each iteration, it scans the entire remaining unsorted section to find the minimum element, and swaps it into the beginning of the unsorted segment.',
    pseudocode: `procedure selectionSort(A : list of sortable items)
    n := length(A)
    for i := 0 to n - 2 do
        minIdx := i
        for j := i + 1 to n - 1 do
            if A[j] < A[minIdx] then
                minIdx := j
        if minIdx != i then
            swap(A[i], A[minIdx])`,
    codePython: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    codeJava: `public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }
}`,
    complexity: {
      timeBest: 'O(n²)',
      timeAverage: 'O(n²)',
      timeWorst: 'O(n²)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'Always scans the entire unsorted partition regardless of initial array ordering, making exactly n(n-1)/2 comparisons.',
      spaceExplanation: 'Only needs indices i, j, minIdx and a swap temporary variable.',
      inPlace: true,
      stability: false,
    },
    inputConfig: {
      type: 'array',
      defaultArray: [64, 25, 12, 22, 11],
    },
    generateTrace: (input) => generateSelectionSortTrace(input.array),
    commonMistakes: [
      'Assuming Selection Sort is O(n) for already sorted arrays (it still checks all pairs).',
      'Thinking Selection Sort is stable; swapping over long distances can reorder duplicate values.',
    ],
  },

  // 4. Insertion Sort
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    slug: 'insertion-sort',
    category: 'sorting',
    difficulty: 'Easy',
    shortDescription: 'Builds the final sorted array one item at a time by inserting each element into its proper position.',
    detailedDescription: 'Insertion Sort is intuitive and highly efficient for small or nearly sorted arrays. It iterates through the array, picking each key and shifting greater elements right to make room.',
    pseudocode: `procedure insertionSort(A : list of sortable items)
    for i := 1 to length(A) - 1 do
        key := A[i]
        j := i - 1
        while j >= 0 and A[j] > key do
            A[j + 1] := A[j]
            j := j - 1
        A[j + 1] := key`,
    codePython: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    codeJava: `public class InsertionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n²)',
      timeWorst: 'O(n²)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'When already sorted, the inner while loop terminates on the very first comparison, requiring only n - 1 comparisons.',
      spaceExplanation: 'Shifts elements in-place with a single key variable.',
      inPlace: true,
      stability: true,
    },
    inputConfig: {
      type: 'array',
      defaultArray: [12, 11, 13, 5, 6],
    },
    generateTrace: (input) => generateInsertionSortTrace(input.array),
  },

  // 5. Merge Sort
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    slug: 'merge-sort',
    category: 'sorting',
    difficulty: 'Medium',
    shortDescription: 'Divide-and-conquer algorithm that recursively splits arrays and merges sorted halves.',
    detailedDescription: 'Merge Sort divides the array into two halves, recursively sorts them, and merges the two sorted halves back together in linear time. It provides a guaranteed O(n log n) running time across all cases.',
    pseudocode: `function mergeSort(arr, l, r):
    if l < r:
        mid = (l + r) / 2
        mergeSort(arr, l, mid)
        mergeSort(arr, mid + 1, r)
        merge(arr, l, mid, r)`,
    codePython: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
        
        merge_sort(L)
        merge_sort(R)
        
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
            
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
            
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
    return arr`,
    codeJava: `public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int mid = l + (r - l) / 2;
            sort(arr, l, mid);
            sort(arr, mid + 1, r);
            merge(arr, l, mid, r);
        }
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int[] left = java.util.Arrays.copyOfRange(arr, l, m + 1);
        int[] right = java.util.Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else arr[k++] = right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}`,
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n log n)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'The recursion tree has log₂(n) levels, and merging across all subarrays at each level takes linear O(n) work.',
      spaceExplanation: 'Requires temporary auxiliary storage to hold left and right subarrays during merging.',
      inPlace: false,
      stability: true,
    },
    inputConfig: {
      type: 'array',
      defaultArray: [38, 27, 43, 3, 9, 82, 10],
    },
    generateTrace: (input) => generateMergeSortTrace(input.array),
  },

  // 6. Quick Sort
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    slug: 'quick-sort',
    category: 'sorting',
    difficulty: 'Medium',
    shortDescription: 'Picks a pivot and partitions array elements into smaller and larger partitions.',
    detailedDescription: 'Quick Sort is a highly practical in-place sorting algorithm. It selects a pivot, reorganizes the array so elements smaller than the pivot are placed before it and greater elements after it, then recurses on the partitions.',
    pseudocode: `function quickSort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)`,
    codePython: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    codeJava: `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
}`,
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n²)',
      spaceAuxiliary: 'O(log n)',
      timeExplanation: 'Average time is O(n log n) with balanced partitions. Worst case O(n²) occurs when the pivot consistently produces completely unbalanced partitions (e.g. sorted array with last element as pivot).',
      spaceExplanation: 'Recursive call stack frames require O(log n) auxiliary space on average.',
      inPlace: true,
      stability: false,
    },
    inputConfig: {
      type: 'array',
      defaultArray: [10, 80, 30, 90, 40, 50, 70],
    },
    generateTrace: (input) => generateQuickSortTrace(input.array),
  },

  // 7. Heap Sort
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    slug: 'heap-sort',
    category: 'sorting',
    difficulty: 'Hard',
    shortDescription: 'Builds a Max-Heap and repeatedly extracts the maximum root element to the end.',
    detailedDescription: 'Heap Sort leverages the binary heap data structure. It transforms the array into a max-heap in O(n) time, then repeatedly swaps the root with the last unsorted element and heapifies the reduced heap.',
    pseudocode: `function heapSort(arr):
    buildMaxHeap(arr)
    for i = n - 1 down to 1:
        swap(arr[0], arr[i])
        heapify(arr, i, 0)`,
    codePython: `def heap_sort(arr):
    n = len(arr)
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    codeJava: `public class HeapSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            heapify(arr, n, largest);
        }
    }
}`,
    complexity: {
      timeBest: 'O(n log n)',
      timeAverage: 'O(n log n)',
      timeWorst: 'O(n log n)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'Building the heap takes O(n) time, and each of the n extractions takes O(log n) heapify steps, giving a strict O(n log n) upper bound.',
      spaceExplanation: 'Performs all swaps directly in place inside the original array.',
      inPlace: true,
      stability: false,
    },
    inputConfig: {
      type: 'array',
      defaultArray: [12, 11, 13, 5, 6, 7],
    },
    generateTrace: (input) => generateHeapSortTrace(input.array),
  },

  // 8. Linear Search
  {
    id: 'linear-search',
    name: 'Linear Search',
    slug: 'linear-search',
    category: 'searching',
    difficulty: 'Easy',
    shortDescription: 'Sequentially checks each element of the list until a match is found or end is reached.',
    detailedDescription: 'Linear Search works on any list regardless of whether it is sorted or unsorted. It compares the target with every element starting at index 0 until finding the target or reaching the end.',
    pseudocode: `function linearSearch(arr, target):
    for i = 0 to length(arr) - 1:
        if arr[i] == target:
            return i
    return -1`,
    codePython: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    codeJava: `public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`,
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'Best case O(1) occurs when the target is at index 0. Average and worst case require checking up to n elements.',
      spaceExplanation: 'Uses only a single iteration index variable.',
      inPlace: true,
    },
    inputConfig: {
      type: 'array_and_target',
      defaultArray: [14, 33, 27, 10, 35, 19, 42, 44],
      defaultTarget: 35,
    },
    generateTrace: (input) => generateLinearSearchTrace(input),
  },

  // 9. Binary Search
  {
    id: 'binary-search',
    name: 'Binary Search',
    slug: 'binary-search',
    category: 'searching',
    difficulty: 'Easy',
    shortDescription: 'Search a sorted array by repeatedly dividing the search interval in half.',
    detailedDescription: 'Binary Search is an optimal searching algorithm for sorted arrays. By comparing the target with the middle element, it eliminates half of the remaining search space in each step, achieving logarithmic O(log n) time.',
    pseudocode: `function binarySearch(arr, target):
    low = 0, high = length(arr) - 1
    while low <= high:
        mid = (low + high) / 2
        if arr[mid] == target: return mid
        else if arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
    codePython: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    codeJava: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n)',
      spaceAuxiliary: 'O(1)',
      timeExplanation: 'With each step the search space is divided by 2. Halving n elements requires at most ⌈log₂(n)⌉ steps.',
      spaceExplanation: 'Iterative binary search uses only pointers low, high, and mid.',
      inPlace: true,
    },
    inputConfig: {
      type: 'array_and_target',
      defaultArray: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
      defaultTarget: 23,
      requiresSorted: true,
    },
    generateTrace: (input) => generateBinarySearchTrace(input),
  },

  // 10. Factorial (Recursion)
  {
    id: 'factorial',
    name: 'Factorial',
    slug: 'factorial',
    category: 'recursion',
    difficulty: 'Easy',
    shortDescription: 'Calculates n! = n × (n - 1)! recursively, showing call stack growth and unwinding.',
    detailedDescription: 'Factorial is the foundational demonstration of recursive programming. It illustrates how function calls pause, build up activation records on the call stack until hitting the base case (n <= 1), and then unwind as return values bubble up.',
    pseudocode: `function factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    codePython: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    codeJava: `public class Factorial {
    public static long factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
}`,
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'Requires exactly n recursive calls, each performing one constant-time multiplication.',
      spaceExplanation: 'The call stack grows to depth n + 1 before unwinding.',
    },
    inputConfig: {
      type: 'single_number',
      defaultN: 5,
      minN: 0,
      maxN: 7,
    },
    generateTrace: (input) => generateFactorialTrace(input.n),
  },

  // 11. Fibonacci (Recursion)
  {
    id: 'fibonacci',
    name: 'Fibonacci Tree',
    slug: 'fibonacci',
    category: 'recursion',
    difficulty: 'Medium',
    shortDescription: 'Generates the recursive branching tree for F(n) = F(n-1) + F(n-2).',
    detailedDescription: 'Naive recursive Fibonacci demonstrates binary recursion where each call generates two children calls. This results in an exponential call tree with 2^n operations and repeated overlapping subproblems.',
    pseudocode: `function fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
    codePython: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
    codeJava: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(2ⁿ)',
      timeWorst: 'O(2ⁿ)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'Branching factor of 2 at each depth creates roughly 2^n total function calls (Golden ratio ~ 1.618^n).',
      spaceExplanation: 'Maximum stack depth is equal to n along the deepest left branch.',
    },
    inputConfig: {
      type: 'single_number',
      defaultN: 4,
      minN: 0,
      maxN: 5,
    },
    generateTrace: (input) => generateFibonacciTrace(input.n),
  },

  // 12. Array Sum (Recursion)
  {
    id: 'array-sum-recursion',
    name: 'Recursive Array Sum',
    slug: 'array-sum-recursion',
    category: 'recursion',
    difficulty: 'Easy',
    shortDescription: 'Recursively sums elements of an array slice: arr[idx] + sum(idx + 1).',
    detailedDescription: 'Demonstrates dividing an array problem into head + tail. The base case occurs when index reaches the array length, returning 0.',
    pseudocode: `function arraySum(arr, idx):
    if idx >= length(arr): return 0
    return arr[idx] + arraySum(arr, idx + 1)`,
    codePython: `def array_sum(arr, idx=0):
    if idx >= len(arr):
        return 0
    return arr[idx] + array_sum(arr, idx + 1)`,
    codeJava: `public class ArraySum {
    public static int sum(int[] arr, int idx) {
        if (idx >= arr.length) {
            return 0;
        }
        return arr[idx] + sum(arr, idx + 1);
    }
}`,
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'Makes one recursive call per array element.',
      spaceExplanation: 'The call stack grows to depth n + 1.',
    },
    inputConfig: {
      type: 'array',
      defaultArray: [3, 7, 2, 8],
    },
    generateTrace: (input) => generateArraySumTrace(input.array),
  },

  // 13. Tower of Hanoi (Recursion)
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    slug: 'tower-of-hanoi',
    category: 'recursion',
    difficulty: 'Medium',
    shortDescription: 'Classic puzzle moving N disks between 3 rods with recursive subproblems.',
    detailedDescription: 'The Tower of Hanoi solves moving n disks from source rod to destination rod using an auxiliary rod. It recursively moves n - 1 disks to auxiliary, places disk n onto destination, and moves n - 1 disks from auxiliary to destination.',
    pseudocode: `function solveHanoi(n, source, target, aux):
    if n == 1:
        moveDisk(source, target)
        return
    solveHanoi(n - 1, source, aux, target)
    moveDisk(source, target)
    solveHanoi(n - 1, aux, target, source)`,
    codePython: `def solve_hanoi(n, source, target, aux):
    if n == 1:
        print(f"Move disk 1 from {source} to {target}")
        return
    solve_hanoi(n - 1, source, aux, target)
    print(f"Move disk {n} from {source} to {target}")
    solve_hanoi(n - 1, aux, target, source)`,
    codeJava: `public class TowerOfHanoi {
    public static void solve(int n, char from, char to, char aux) {
        if (n == 1) {
            System.out.println("Move disk 1 from " + from + " to " + to);
            return;
        }
        solve(n - 1, from, aux, to);
        System.out.println("Move disk " + n + " from " + from + " to " + to);
        solve(n - 1, aux, to, from);
    }
}`,
    complexity: {
      timeBest: 'O(2ⁿ)',
      timeAverage: 'O(2ⁿ)',
      timeWorst: 'O(2ⁿ)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'The recurrence relation T(n) = 2T(n-1) + 1 yields exactly 2^n - 1 moves.',
      spaceExplanation: 'Call stack depth is bounded by n.',
    },
    inputConfig: {
      type: 'single_number',
      defaultN: 3,
      minN: 1,
      maxN: 4,
    },
    generateTrace: (input) => generateTowerOfHanoiTrace(input.n),
  },

  // 14. Stack (Data Structure)
  {
    id: 'stack-ds',
    name: 'Stack (LIFO)',
    slug: 'stack-ds',
    category: 'data-structures',
    difficulty: 'Easy',
    shortDescription: 'Last-In, First-Out linear data structure supporting Push, Pop, Peek, and IsEmpty.',
    detailedDescription: 'A Stack restricts additions and deletions to a single end called the top. It powers function call stacks, undo/redo mechanisms, and bracket validation.',
    pseudocode: `class Stack:
    push(val) -> adds val to top
    pop() -> removes and returns top
    peek() -> returns top without removing
    isEmpty() -> checks if size == 0`,
    codePython: `class Stack:
    def __init__(self):
        self.items = []
        
    def push(self, val):
        self.items.append(val)
        
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("pop from empty stack")
        
    def peek(self):
        return self.items[-1] if not self.is_empty() else None
        
    def is_empty(self):
        return len(self.items) == 0`,
    codeJava: `import java.util.EmptyStackException;

public class MyStack<T> {
    private java.util.ArrayList<T> list = new java.util.ArrayList<>();

    public void push(T val) {
        list.add(val);
    }

    public T pop() {
        if (isEmpty()) throw new EmptyStackException();
        return list.remove(list.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new EmptyStackException();
        return list.get(list.size() - 1);
    }

    public boolean isEmpty() {
        return list.isEmpty();
    }
}`,
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'Push, Pop, Peek, and IsEmpty all execute in strict O(1) constant time.',
      spaceExplanation: 'Stores n elements in memory.',
    },
    inputConfig: {
      type: 'ds_command',
    },
    generateTrace: (input) => generateStackDemoTrace(input?.commands),
  },

  // 15. Queue (Data Structure)
  {
    id: 'queue-ds',
    name: 'Queue (FIFO)',
    slug: 'queue-ds',
    category: 'data-structures',
    difficulty: 'Easy',
    shortDescription: 'First-In, First-Out linear data structure supporting Enqueue, Dequeue, and Front.',
    detailedDescription: 'A Queue maintains order where the earliest element added is the first to be removed. It powers job scheduling, print queues, and breadth-first search (BFS).',
    pseudocode: `class Queue:
    enqueue(val) -> inserts val at rear
    dequeue() -> removes and returns front
    front() -> inspects front item
    isEmpty() -> checks if size == 0`,
    codePython: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
        
    def enqueue(self, val):
        self.items.append(val)
        
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
        raise IndexError("dequeue from empty queue")
        
    def front(self):
        return self.items[0] if not self.is_empty() else None
        
    def is_empty(self):
        return len(self.items) == 0`,
    codeJava: `import java.util.LinkedList;
import java.util.NoSuchElementException;

public class MyQueue<T> {
    private LinkedList<T> list = new LinkedList<>();

    public void enqueue(T val) {
        list.addLast(val);
    }

    public T dequeue() {
        if (isEmpty()) throw new NoSuchElementException();
        return list.removeFirst();
    }

    public T front() {
        if (isEmpty()) throw new NoSuchElementException();
        return list.getFirst();
    }

    public boolean isEmpty() {
        return list.isEmpty();
    }
}`,
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'Enqueue, Dequeue, and Front run in O(1) constant time when using a linked list or circular buffer.',
      spaceExplanation: 'Allocates memory proportional to the number of buffered items.',
    },
    inputConfig: {
      type: 'ds_command',
    },
    generateTrace: (input) => generateQueueDemoTrace(input?.commands),
  },

  // 16. Linked List (Data Structure)
  {
    id: 'linked-list-ds',
    name: 'Linked List',
    slug: 'linked-list-ds',
    category: 'data-structures',
    difficulty: 'Medium',
    shortDescription: 'Nodes with values and pointers supporting Singly and Doubly linked operations.',
    detailedDescription: 'A Linked List is a dynamic data structure where each node stores a value and references (next/previous) to neighboring nodes. Insertion/deletion at head is O(1), while searching is O(n).',
    pseudocode: `class Node:
    val, next, prev
class LinkedList:
    insertHead(val)
    insertTail(val)
    delete(val)
    search(val)`,
    codePython: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        
    def insert_head(self, val):
        new_node = Node(val)
        new_node.next = self.head
        if self.head:
            self.head.prev = new_node
        self.head = new_node
        
    def delete(self, val):
        curr = self.head
        while curr:
            if curr.val == val:
                if curr.prev: curr.prev.next = curr.next
                else: self.head = curr.next
                if curr.next: curr.next.prev = curr.prev
                return True
            curr = curr.next
        return False`,
    codeJava: `public class DoublyLinkedList {
    static class Node {
        int val;
        Node next, prev;
        Node(int val) { this.val = val; }
    }

    private Node head;

    public void insertHead(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        if (head != null) head.prev = newNode;
        head = newNode;
    }

    public boolean delete(int val) {
        Node curr = head;
        while (curr != null) {
            if (curr.val == val) {
                if (curr.prev != null) curr.prev.next = curr.next;
                else head = curr.next;
                if (curr.next != null) curr.next.prev = curr.prev;
                return true;
            }
            curr = curr.next;
        }
        return false;
    }
}`,
    complexity: {
      timeBest: 'O(1) (Head insert/delete)',
      timeAverage: 'O(n) (Search / arbitrary delete)',
      timeWorst: 'O(n)',
      spaceAuxiliary: 'O(n)',
      timeExplanation: 'Head operations only adjust pointers in O(1). Finding a value requires traversing the list in O(n).',
      spaceExplanation: 'Each node requires memory for the value plus pointer references.',
    },
    inputConfig: {
      type: 'ds_command',
    },
    generateTrace: (input) => generateLinkedListTrace(input?.initial, input?.operation, input?.listType),
  },
];

export const getAlgorithmById = (id: string): AlgorithmDefinition | undefined => {
  return ALGORITHM_REGISTRY.find(a => a.id === id || a.slug === id);
};

export const getAlgorithmsByCategory = (category: string): AlgorithmDefinition[] => {
  if (category === 'all') return ALGORITHM_REGISTRY;
  return ALGORITHM_REGISTRY.filter(a => a.category === category);
};
