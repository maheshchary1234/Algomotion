import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Header
from app.schemas.arena import (
    RunCodeRequest,
    SubmitCodeRequest,
    ExecutionResponse,
    TestCaseModel,
    TestCaseResult,
    SubmissionRecord,
    LeaderboardUser
)
from app.services.sandbox import evaluate_solution, run_python_code, run_java_code

router = APIRouter(prefix="/api/arena", tags=["Coding Arena"])

# In-memory + persistent JSON storage for submissions and solved tracking
SUBMISSIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "submissions.json")

def load_submissions() -> List[Dict[str, Any]]:
    if os.path.exists(SUBMISSIONS_FILE):
        try:
            with open(SUBMISSIONS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_submission(sub: Dict[str, Any]):
    subs = load_submissions()
    subs.insert(0, sub)
    try:
        with open(SUBMISSIONS_FILE, "w", encoding="utf-8") as f:
            json.dump(subs[:100], f, indent=2) # Keep last 100
    except Exception as e:
        print("Failed to save submission:", e)

# Competitive Programming Problems Catalog
PROBLEMS_DATA = [
    {
        "id": "rotate-array",
        "slug": "rotate-array",
        "title": "Rotate Array by K Positions",
        "difficulty": "Medium",
        "topic": "Arrays",
        "tags": ["Arrays", "Two Pointers", "Reversal Algorithm"],
        "visualizer_id": "array-rotation",
        "description": "Given an integer array `nums` and an integer `k`, rotate the array to the right by `k` steps, where `k` is non-negative.\n\nYou must solve this in-place with $O(1)$ extra memory.",
        "input_format": "Line 1: An integer n representing array length.\nLine 2: n space-separated integers for nums.\nLine 3: An integer k.",
        "output_format": "Print the rotated array as space-separated integers on a single line.",
        "constraints": "1 <= nums.length <= 10^5\n-2^31 <= nums[i] <= 2^31 - 1\n0 <= k <= 10^5",
        "examples": [
            {
                "input": "7\n1 2 3 4 5 6 7\n3",
                "output": "5 6 7 1 2 3 4",
                "explanation": "rotate 1 steps to the right: [7,1,2,3,4,5,6]\nrotate 2 steps to the right: [6,7,1,2,3,4,5]\nrotate 3 steps to the right: [5,6,7,1,2,3,4]"
            },
            {
                "input": "4\n-1 -100 3 99\n2",
                "output": "3 99 -1 -100",
                "explanation": "rotate 1 steps to the right: [99,-1,-100,3]\nrotate 2 steps to the right: [3,99,-1,-100]"
            }
        ],
        "sample_test_cases": [
            {
                "id": "tc-1",
                "input": "7\n1 2 3 4 5 6 7\n3",
                "expected_output": "5 6 7 1 2 3 4",
                "is_hidden": False,
                "explanation": "Standard rotation"
            },
            {
                "id": "tc-2",
                "input": "4\n-1 -100 3 99\n2",
                "expected_output": "3 99 -1 -100",
                "is_hidden": False,
                "explanation": "Negative numbers"
            }
        ],
        "hidden_test_cases": [
            {
                "id": "tc-h1",
                "input": "5\n1 2 3 4 5\n12", # k > n (12 % 5 = 2) -> [4, 5, 1, 2, 3]
                "expected_output": "4 5 1 2 3",
                "is_hidden": True
            },
            {
                "id": "tc-h2",
                "input": "1\n99\n0",
                "expected_output": "99",
                "is_hidden": True
            },
            {
                "id": "tc-h3",
                "input": "6\n10 20 30 40 50 60\n6", # k == n -> same array
                "expected_output": "10 20 30 40 50 60",
                "is_hidden": True
            }
        ],
        "starter_code_python": """import sys

def rotate(nums, k):
    # Write your solution here
    n = len(nums)
    if n == 0: return nums
    k = k % n
    
    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1
            
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
    return nums

if __name__ == '__main__':
    lines = sys.stdin.read().split()
    if lines:
        n = int(lines[0])
        nums = [int(x) for x in lines[1:n+1]]
        k = int(lines[n+1])
        rotate(nums, k)
        print(" ".join(map(str, nums)))
""",
        "starter_code_java": """import java.util.*;

public class Solution {
    public static void rotate(int[] nums, int k) {
        int n = nums.length;
        if (n == 0) return;
        k = k % n;
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private static void reverse(int[] nums, int l, int r) {
        while (l < r) {
            int temp = nums[l];
            nums[l] = nums[r];
            nums[r] = temp;
            l++;
            r--;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            int k = sc.nextInt();
            rotate(nums, k);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) {
                sb.append(nums[i]).append(i == n - 1 ? "" : " ");
            }
            System.out.println(sb.toString());
        }
    }
}
""",
        "hints": [
            "Think about what happens if k > n. Can you use modulo arithmetic (k = k % n)?",
            "Could reversing the array help? What happens if you reverse the entire array first, then reverse the first k elements, then reverse the rest?",
            "Reversing takes O(n) total time and requires O(1) space."
        ],
        "editorial": "### Optimal Approach: The 3-Reversal In-Place Algorithm\n\nWhen we rotate an array of length $n$ by $k$ to the right, the last $k$ elements will come to the front, and the first $n-k$ elements move to the back.\n\n1. Reverse the entire array: elements in the front and back swap regions.\n2. Reverse the first $k$ elements: restores their original relative order.\n3. Reverse the remaining $n-k$ elements: restores their relative order.\n\n**Complexity:**\n- Time: $O(n)$ where each element is swapped at most twice.\n- Auxiliary Space: $O(1)$ strictly in-place."
    },
    {
        "id": "two-sum-sorted",
        "slug": "two-sum-sorted",
        "title": "Two Sum II - Input Array Is Sorted",
        "difficulty": "Easy",
        "topic": "Searching",
        "tags": ["Two Pointers", "Binary Search", "Arrays"],
        "visualizer_id": "binary-search",
        "description": "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\n\nReturn the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\n\nThe tests are generated such that there is exactly one solution. You may not use the same element twice.",
        "input_format": "Line 1: An integer n representing array length.\nLine 2: n space-separated integers for numbers.\nLine 3: An integer target.",
        "output_format": "Print the two 1-based indices separated by a space.",
        "constraints": "2 <= numbers.length <= 3 * 10^4\n-1000 <= numbers[i] <= 1000\nnumbers is sorted in non-decreasing order.",
        "examples": [
            {
                "input": "4\n2 7 11 15\n9",
                "output": "1 2",
                "explanation": "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2."
            },
            {
                "input": "3\n2 3 4\n6",
                "output": "1 3",
                "explanation": "The sum of 2 and 4 is 6. Therefore, index1 = 1, index2 = 3."
            }
        ],
        "sample_test_cases": [
            {
                "id": "tc-1",
                "input": "4\n2 7 11 15\n9",
                "expected_output": "1 2",
                "is_hidden": False
            },
            {
                "id": "tc-2",
                "input": "3\n2 3 4\n6",
                "expected_output": "1 3",
                "is_hidden": False
            }
        ],
        "hidden_test_cases": [
            {
                "id": "tc-h1",
                "input": "2\n-1 0\n-1",
                "expected_output": "1 2",
                "is_hidden": True
            },
            {
                "id": "tc-h2",
                "input": "5\n1 2 3 4 5\n8",
                "expected_output": "3 5",
                "is_hidden": True
            }
        ],
        "starter_code_python": """import sys

def two_sum(numbers, target):
    # Two pointer approach
    l = 0
    r = len(numbers) - 1
    while l < r:
        curr = numbers[l] + numbers[r]
        if curr == target:
            return [l + 1, r + 1]
        elif curr < target:
            l += 1
        else:
            r -= 1
    return []

if __name__ == '__main__':
    lines = sys.stdin.read().split()
    if lines:
        n = int(lines[0])
        nums = [int(x) for x in lines[1:n+1]]
        target = int(lines[n+1])
        res = two_sum(nums, target)
        print(f"{res[0]} {res[1]}")
""",
        "starter_code_java": """import java.util.*;

public class Solution {
    public static int[] twoSum(int[] numbers, int target) {
        int l = 0, r = numbers.length - 1;
        while (l < r) {
            int sum = numbers[l] + numbers[r];
            if (sum == target) return new int[]{l + 1, r + 1};
            else if (sum < target) l++;
            else r--;
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            int target = sc.nextInt();
            int[] res = twoSum(nums, target);
            System.out.println(res[0] + " " + res[1]);
        }
    }
}
""",
        "hints": [
            "Since the array is sorted, we can use two pointers: one at the start (left) and one at the end (right).",
            "If numbers[left] + numbers[right] < target, increment left to increase the sum. If greater, decrement right."
        ],
        "editorial": "### Two Pointer Technique on Sorted Arrays\n\nWith two pointers starting at opposite boundaries, each step moves either the left pointer forward or right pointer backward, inspecting each element at most once.\n\n- Time Complexity: $O(n)$\n- Space Complexity: $O(1)$"
    },
    {
        "id": "valid-parentheses",
        "slug": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "topic": "Stacks",
        "tags": ["Stack", "Strings"],
        "visualizer_id": "stack-ds",
        "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        "input_format": "A single line containing the string s.",
        "output_format": "Print 'true' if the bracket sequence is valid, otherwise print 'false'.",
        "constraints": "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
        "examples": [
            {
                "input": "()[]{}",
                "output": "true",
                "explanation": "Every bracket is closed cleanly in correct order."
            },
            {
                "input": "(]",
                "output": "false",
                "explanation": "Mismatched bracket type."
            }
        ],
        "sample_test_cases": [
            {
                "id": "tc-1",
                "input": "()[]{}",
                "expected_output": "true",
                "is_hidden": False
            },
            {
                "id": "tc-2",
                "input": "(]",
                "expected_output": "false",
                "is_hidden": False
            }
        ],
        "hidden_test_cases": [
            {
                "id": "tc-h1",
                "input": "([{}])",
                "expected_output": "true",
                "is_hidden": True
            },
            {
                "id": "tc-h2",
                "input": "(((((",
                "expected_output": "false",
                "is_hidden": True
            },
            {
                "id": "tc-h3",
                "input": "}",
                "expected_output": "false",
                "is_hidden": True
            }
        ],
        "starter_code_python": """import sys

def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    print("true" if is_valid(raw) else "false")
""",
        "starter_code_java": """import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLine()) {
            String s = sc.nextLine().trim();
            System.out.println(isValid(s) ? "true" : "false");
        }
    }
}
""",
        "hints": [
            "A stack is a Last-In, First-Out (LIFO) structure. The most recently opened bracket must be the first closed.",
            "Push opening brackets onto the stack. When encountering a closing bracket, check if it matches the top of the stack."
        ],
        "editorial": "### LIFO Stack Invariant\n\nBy pushing every opening bracket onto a stack and popping when matching corresponding closing brackets, we can check validity in a single pass.\n\n- Time: $O(n)$\n- Space: $O(n)$"
    },
    {
        "id": "fibonacci-number",
        "slug": "fibonacci-number",
        "title": "N-th Fibonacci Number",
        "difficulty": "Easy",
        "topic": "Recursion",
        "tags": ["Recursion", "Dynamic Programming", "Math"],
        "visualizer_id": "fibonacci",
        "description": "The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1:\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2) for n > 1.\n\nGiven an integer `n`, calculate `F(n)`.",
        "input_format": "A single integer n.",
        "output_format": "Print the integer F(n).",
        "constraints": "0 <= n <= 30",
        "examples": [
            {
                "input": "4",
                "output": "3",
                "explanation": "F(4) = F(3) + F(2) = 2 + 1 = 3."
            },
            {
                "input": "2",
                "output": "1",
                "explanation": "F(2) = F(1) + F(0) = 1 + 0 = 1."
            }
        ],
        "sample_test_cases": [
            { "id": "tc-1", "input": "4", "expected_output": "3", "is_hidden": False },
            { "id": "tc-2", "input": "2", "expected_output": "1", "is_hidden": False }
        ],
        "hidden_test_cases": [
            { "id": "tc-h1", "input": "0", "expected_output": "0", "is_hidden": True },
            { "id": "tc-h2", "input": "1", "expected_output": "1", "is_hidden": True },
            { "id": "tc-h3", "input": "10", "expected_output": "55", "is_hidden": True }
        ],
        "starter_code_python": """import sys

def fib(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

if __name__ == '__main__':
    raw = sys.stdin.read().strip()
    if raw:
        print(fib(int(raw)))
""",
        "starter_code_java": """import java.util.*;

public class Solution {
    public static int fib(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            System.out.println(fib(sc.nextInt()));
        }
    }
}
""",
        "hints": [
            "Recursive definition is F(n) = F(n-1) + F(n-2).",
            "To avoid exponential O(2^n) time, compute iteratively from bottom up or memoize."
        ],
        "editorial": "### Recursion vs Dynamic Programming\n\nWhile the definition is naturally recursive, naive recursion duplicates subproblems exponentially. Iteration yields $O(n)$ time with $O(1)$ auxiliary space."
    },
    {
        "id": "kth-largest-element",
        "slug": "kth-largest-element",
        "title": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "topic": "Sorting",
        "tags": ["Heap", "Quickselect", "Sorting"],
        "visualizer_id": "heap-sort",
        "description": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in sorted order, not the `k`th distinct element.",
        "input_format": "Line 1: An integer n representing array length.\nLine 2: n space-separated integers for nums.\nLine 3: An integer k.",
        "output_format": "Print the kth largest integer.",
        "constraints": "1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
        "examples": [
            {
                "input": "6\n3 2 1 5 6 4\n2",
                "output": "5",
                "explanation": "Sorted in descending order: [6, 5, 4, 3, 2, 1]. The 2nd largest is 5."
            }
        ],
        "sample_test_cases": [
            { "id": "tc-1", "input": "6\n3 2 1 5 6 4\n2", "expected_output": "5", "is_hidden": False }
        ],
        "hidden_test_cases": [
            { "id": "tc-h1", "input": "9\n3 2 3 1 2 4 5 5 6\n4", "expected_output": "4", "is_hidden": True },
            { "id": "tc-h2", "input": "1\n100\n1", "expected_output": "100", "is_hidden": True }
        ],
        "starter_code_python": """import sys
import heapq

def find_kth_largest(nums, k):
    # Min-heap of size k
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

if __name__ == '__main__':
    lines = sys.stdin.read().split()
    if lines:
        n = int(lines[0])
        nums = [int(x) for x in lines[1:n+1]]
        k = int(lines[n+1])
        print(find_kth_largest(nums, k))
""",
        "starter_code_java": """import java.util.*;

public class Solution {
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int num : nums) {
            pq.offer(num);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
            int k = sc.nextInt();
            System.out.println(findKthLargest(nums, k));
        }
    }
}
""",
        "hints": [
            "A min-heap of size k keeps the k largest elements seen so far at the top.",
            "Alternatively, Quickselect partitioning can achieve O(n) average time."
        ],
        "editorial": "### Min-Heap Solution\n\nMaintaining a min-heap of capacity $k$ ensures operations take $O(n \\log k)$ time and $O(k)$ auxiliary space."
    },
    {
        "id": "reverse-linked-list",
        "slug": "reverse-linked-list",
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "topic": "Linked Lists",
        "tags": ["Linked List", "Recursion", "Pointers"],
        "visualizer_id": "linked-list-ds",
        "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list values.",
        "input_format": "Line 1: An integer n representing number of nodes.\nLine 2: n space-separated integers for node values.",
        "output_format": "Print the reversed values separated by a space.",
        "constraints": "0 <= n <= 5000\n-5000 <= Node.val <= 5000",
        "examples": [
            { "input": "5\n1 2 3 4 5", "output": "5 4 3 2 1", "explanation": "[1->2->3->4->5] becomes [5->4->3->2->1]." }
        ],
        "sample_test_cases": [
            { "id": "tc-1", "input": "5\n1 2 3 4 5", "expected_output": "5 4 3 2 1", "is_hidden": False }
        ],
        "hidden_test_cases": [
            { "id": "tc-h1", "input": "2\n1 2", "expected_output": "2 1", "is_hidden": True },
            { "id": "tc-h2", "input": "1\n42", "expected_output": "42", "is_hidden": True },
            { "id": "tc-h3", "input": "0\n", "expected_output": "", "is_hidden": True }
        ],
        "starter_code_python": """import sys

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

if __name__ == '__main__':
    lines = sys.stdin.read().split()
    if not lines or int(lines[0]) == 0:
        print("")
    else:
        n = int(lines[0])
        vals = [int(x) for x in lines[1:n+1]]
        # Build list
        dummy = ListNode(0)
        curr = dummy
        for v in vals:
            curr.next = ListNode(v)
            curr = curr.next
        rev = reverse_list(dummy.next)
        res = []
        while rev:
            res.append(str(rev.val))
            rev = rev.next
        print(" ".join(res))
""",
        "starter_code_java": """import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Solution {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            if (n == 0) {
                System.out.println("");
                return;
            }
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            for (int i = 0; i < n; i++) {
                curr.next = new ListNode(sc.nextInt());
                curr = curr.next;
            }
            ListNode rev = reverseList(dummy.next);
            StringBuilder sb = new StringBuilder();
            while (rev != null) {
                sb.append(rev.val).append(rev.next != null ? " " : "");
                rev = rev.next;
            }
            System.out.println(sb.toString());
        }
    }
}
""",
        "hints": [
            "Use three pointers: `prev`, `curr`, and `next`.",
            "In each step, record `next = curr.next`, point `curr.next = prev`, then shift `prev = curr` and `curr = next`."
        ],
        "editorial": "### In-Place Pointer Reversal\n\nTraversing the list once and redirecting `next` pointers achieves $O(n)$ time and $O(1)$ auxiliary space."
    }
]

# Seed Leaderboard
LEADERBOARD_DATA: List[LeaderboardUser] = [
    LeaderboardUser(rank=1, username="algorithm_ninja", solved_count=18, points=2450, streak_days=14, badge="Grandmaster"),
    LeaderboardUser(rank=2, username="binary_wizard", solved_count=16, points=2180, streak_days=9, badge="Master"),
    LeaderboardUser(rank=3, username="code_dynamo", solved_count=15, points=1950, streak_days=7, badge="Master"),
    LeaderboardUser(rank=4, username="stack_overflow_fan", solved_count=12, points=1620, streak_days=5, badge="Expert"),
    LeaderboardUser(rank=5, username="pointer_chaser", solved_count=10, points=1340, streak_days=4, badge="Expert"),
    LeaderboardUser(rank=6, username="recursion_guru", solved_count=8, points=1080, streak_days=3, badge="Specialist"),
    LeaderboardUser(rank=7, username="big_o_pro", solved_count=6, points=850, streak_days=2, badge="Pupil"),
]

# Load and validate imported 300-question bank
BANK_JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "question_bank_300.json")
if os.path.exists(BANK_JSON_PATH):
    try:
        with open(BANK_JSON_PATH, "r", encoding="utf-8") as f:
            bank_questions = json.load(f)
            existing_ids = set(p["id"] for p in PROBLEMS_DATA)
            existing_slugs = set(p["slug"] for p in PROBLEMS_DATA)
            for bq in bank_questions:
                # Validate duplicate IDs and slugs before importing, do not overwrite existing questions
                if bq["id"] not in existing_ids and bq["slug"] not in existing_slugs:
                    PROBLEMS_DATA.append(bq)
                    existing_ids.add(bq["id"])
                    existing_slugs.add(bq["slug"])
    except Exception as e:
        print("Failed to load question bank 300:", e)

@router.get("/problems")
def get_problems():
    """List all problems with summary metadata."""
    summary = []
    for p in PROBLEMS_DATA:
        summary.append({
            "id": p["id"],
            "slug": p["slug"],
            "title": p["title"],
            "difficulty": p["difficulty"],
            "topic": p["topic"],
            "tags": p["tags"],
            "visualizer_id": p.get("visualizer_id"),
            "short_description": p["description"].split("\n")[0],
            "total_test_cases": len(p.get("sample_test_cases", [])) + len(p.get("hidden_test_cases", [])),
            "is_draft": p.get("is_draft", False),
            "test_cases_status": p.get("test_cases_status", "Verified")
        })
    return {"problems": summary}

@router.get("/problems/{problem_id}")
def get_problem_details(problem_id: str):
    """Get full details for a problem (hiding hidden test case inputs/outputs)."""
    for p in PROBLEMS_DATA:
        if p["id"] == problem_id or p["slug"] == problem_id:
            # Mask hidden test cases from public API
            safe_p = dict(p)
            safe_p["hidden_test_cases_count"] = len(p["hidden_test_cases"])
            safe_p.pop("hidden_test_cases", None)
            return safe_p
    raise HTTPException(status_code=404, detail="Problem not found")

@router.post("/run", response_model=ExecutionResponse)
def run_code(req: RunCodeRequest):
    """
    Evaluates code against sample test cases or custom input.
    """
    # Find problem
    prob = None
    for p in PROBLEMS_DATA:
        if p["id"] == req.problem_id or p["slug"] == req.problem_id:
            prob = p
            break
            
    if not prob:
        raise HTTPException(status_code=404, detail="Problem not found")

    if req.custom_input is not None and req.custom_input.strip() != "":
        # Run against custom test case
        custom_tc = [
            TestCaseModel(
                id="custom-1",
                input=req.custom_input,
                expected_output="", # no expected output for custom run
                is_hidden=False
            )
        ]
        if req.language.lower() in ("python", "python3", "py"):
            success, stdout, stderr, time_ms, timed_out = run_python_code(req.code, req.custom_input)
            is_compile_err = False
        else:
            success, stdout, stderr, time_ms, timed_out, is_compile_err = run_java_code(req.code, req.custom_input)

        status = "Finished"
        if timed_out: status = "Time Limit Exceeded"
        elif is_compile_err: status = "Compilation Error"
        elif not success: status = "Runtime Error"

        return ExecutionResponse(
            status=status,
            total_test_cases=1,
            passed_test_cases=1 if success else 0,
            execution_time_ms=time_ms,
            memory_mb=12.5,
            compile_error=stderr if is_compile_err else None,
            runtime_error=stderr if not success and not is_compile_err else None,
            test_case_results=[
                TestCaseResult(
                    test_case_id="custom-1",
                    passed=success,
                    input=req.custom_input,
                    expected_output="",
                    actual_output=stdout,
                    stdout=stdout,
                    stderr=stderr,
                    execution_time_ms=time_ms
                )
            ],
            message="Custom input executed."
        )

    # Evaluate sample test cases
    if len(prob.get("sample_test_cases", [])) == 0:
        return ExecutionResponse(
            status="Finished",
            total_test_cases=0,
            passed_test_cases=0,
            execution_time_ms=0,
            memory_mb=0,
            test_case_results=[],
            message="Draft question: Sample test cases are pending verification. Enter custom input to run and test your code."
        )

    sample_cases = [TestCaseModel(**tc) for tc in prob["sample_test_cases"]]
    return evaluate_solution(req.language, req.code, sample_cases)

@router.post("/submit", response_model=ExecutionResponse)
def submit_solution(req: SubmitCodeRequest, authorization: Optional[str] = Header(None)):
    """
    Evaluates code against all sample AND hidden test cases.
    Never marks Accepted unless ALL cases pass.
    Saves progress and submissions to user account if authenticated.
    """
    prob = None
    for p in PROBLEMS_DATA:
        if p["id"] == req.problem_id or p["slug"] == req.problem_id:
            prob = p
            break

    if not prob:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Combine sample and hidden test cases
    all_cases = [TestCaseModel(**tc) for tc in prob.get("sample_test_cases", [])] + \
                [TestCaseModel(**tc) for tc in prob.get("hidden_test_cases", [])]

    # For draft questions with no verified test cases, do not claim Accepted
    if prob.get("is_draft") or len(all_cases) == 0:
        return ExecutionResponse(
            status="Draft Question",
            total_test_cases=0,
            passed_test_cases=0,
            execution_time_ms=0,
            memory_mb=0,
            test_case_results=[],
            message="Draft Question: Official test cases are currently pending verification. Solutions cannot be claimed as Accepted without actual test execution. Use Run Code with custom inputs to practice and test your logic."
        )

    result = evaluate_solution(req.language, req.code, all_cases)

    # Record global submission
    record = {
        "id": f"sub-{uuid.uuid4().hex[:8]}",
        "problem_id": prob["id"],
        "problem_title": prob["title"],
        "language": req.language,
        "status": result.status,
        "passed_test_cases": result.passed_test_cases,
        "total_test_cases": result.total_test_cases,
        "execution_time_ms": result.execution_time_ms,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }
    save_submission(record)

    # If user is authenticated, save persistent progress to database
    from app.services.auth_service import get_current_user_optional, mark_problem_progress, record_user_submission
    user = get_current_user_optional(authorization)
    if user:
        is_accepted = (result.status == "Accepted")
        mark_problem_progress(user["id"], prob["id"], is_accepted)
        record_user_submission(
            user["id"],
            prob["id"],
            prob["title"],
            req.language,
            result.status,
            result.passed_test_cases,
            result.total_test_cases,
            result.execution_time_ms
        )

    return result

@router.get("/submissions")
def get_submissions(problem_id: Optional[str] = None):
    """Get submission history."""
    subs = load_submissions()
    if problem_id:
        subs = [s for s in subs if s.get("problem_id") == problem_id]
    return {"submissions": subs}

@router.get("/leaderboard")
def get_leaderboard():
    """Get competitive programming leaderboard."""
    return {"leaderboard": LEADERBOARD_DATA}
