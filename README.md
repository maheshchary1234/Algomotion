# AlgoMotion — Interactive Algorithm Visualizer

> **"See the Logic. Master the Algorithm."**

AlgoMotion is a modern, responsive, developer-focused web application designed to help computer science students, competitive programmers, and software engineers master algorithms and data structures through step-by-step execution, animated visualizations, and synchronized multi-language source-code highlighting.

---

## 🌟 Key Features

### 1. 🔄 Flagship Array Rotation Visualizer
- **Direction & Count**: Left and Right rotation with dynamic $k$ input.
- **Modulo Optimization**: Automatically simplifies $k > n$ via $k = k \pmod n$ with detailed mathematical step explanations.
- **Algorithm Switcher**: Compare the optimal **3-Reversal Algorithm** ($O(n)$ time, $O(1)$ auxiliary space) against standard **Brute-Force Shifting** ($O(n \times k)$).
- **Element Tracking**: Highlights active moving indices, swap pairs, and intermediate partition states.

### 2. ⚡ Bidirectional Trace Execution Engine
- **Deterministic Time-Travel**: Step forward and backward with guaranteed state restoration (not just step-number changes).
- **Playback Controls**: Play, Pause, Step Next (`→`), Step Previous (`←`), Reset (`R`), Seek Slider, and Speed Multipliers ($0.5\times$ to $4\times$).
- **Live Memory Inspector**: Real-time table of local variables with pulsating badges for changed values during the current step.
- **Human-Readable Explanations**: Simple language explanations explaining each operation, loop iteration, and pointer adjustment.

### 3. 💻 Dual-Language Code Editor (Python & Java)
- **Embedded Monaco Editor**: Full syntax highlighting, dark theme styling, minimap controls, and formatted source code.
- **Synchronized Line Highlighting**: Highlights the exact line executing in Python 3 or Java 21 in real time.
- **Actions**: Copy Code to clipboard and Reset to Example with one click.
- **Transparent Execution Architecture**: Clear labeling explaining deterministic trace playback vs code drafting.

### 4. 🌳 Recursion Visualizer & Tree Generator
- **Recursion Tree View**: Hierarchical branching tree with parent-child lines, arguments, and return value bubbling.
- **Call Stack Inspector**: Pushed activation records, stack depth counter, and unwinding notifications.
- **Supported Algorithms**:
  - **Factorial** (Linear recursion with base case detection)
  - **Fibonacci** (Binary branching recursion tree demonstrating overlapping subproblems)
  - **Recursive Array Sum** (Divide-and-conquer slice summation)
  - **Tower of Hanoi** (3 animated rods with colored disks and minimum move calculation: $2^n - 1$)

### 5. 📊 Sorting & Searching Visualizers
- **Sorting**: Bubble Sort (with early-exit $O(n)$ flag), Selection Sort, Insertion Sort, Merge Sort, Quick Sort (Lomuto partitioning), and Heap Sort (Max-Heapify).
- **Color-Coded Statuses**:
  - 🔵 Blue/Cyan: Unsorted
  - 🟡 Amber: Comparisons
  - 🔴 Rose: Swaps / Key Shifts
  - 🟣 Violet: Pivot / Partition element
  - 🟢 Emerald: Locked sorted position
- **Searching**: Linear Search, Iterative Binary Search with `low`, `mid`, `high` range pointers, unsorted warning, and one-click sort option.

### 6. 🧱 Interactive Data Structures Playground
- **Stack (LIFO)**: Push, Pop, Peek, IsEmpty, bounded capacity (7 items), and Top indicator.
- **Queue (FIFO)**: Enqueue, Dequeue, Front, bounded capacity, and Front/Rear indicators.
- **Linked Lists**: Singly & Doubly Linked Lists with:
  - Insert at Head ($O(1)$)
  - Insert at Tail
  - Delete by Value ($O(n)$)
  - Search Target
  - Traverse List with pointer transitions

### 7. ⏱️ Time & Space Complexity Analyzer
- **Complexity Breakdown**: Best, Average, Worst time complexity, Auxiliary Space, In-Place flag, and Stability.
- **Asymptotic Comparator**: Interactive $N$ slider ($10$ to $10,000+$) simulating theoretical operation counts across Big-O classes.

### 8. 🏆 Challenge Quizzes & Keyboard Accessibility
- **Quiz Modal**: Test your understanding with multiple-choice questions, instant feedback, explanations, and confetti celebrations.
- **Keyboard Shortcuts**:
  - `Space`: Play / Pause
  - `→`: Next Step
  - `←`: Previous Step
  - `R`: Reset to Beginning

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript 5.8, Vite 8.3
- **Styling**: Tailwind CSS 3.4 with custom glassmorphism, glowing accents, and dark/light mode
- **Code Editor**: `@monaco-editor/react` (Monaco Editor)
- **Animations**: Framer Motion & CSS hardware-accelerated transitions
- **Icons**: Lucide React
- **Confetti**: Canvas-Confetti
- **Testing**: Vitest 5.0 with automated algorithm validation

---

## 📂 Project Architecture

```
algomotion/
├── index.html                     # Entry HTML with SEO meta tags & Google Fonts (Inter, Fira Code)
├── package.json                   # Dependencies, scripts, and Vitest configuration
├── tailwind.config.js             # Custom color palette (navy, electric blue, violet, cyan)
├── tsconfig.app.json              # TypeScript bundler compiler options
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Root navigation & theme coordinator
│   ├── index.css                  # Tailwind directives & glassmorphic utilities
│   ├── types/
│   │   └── algorithm.ts           # ExecutionStep, AlgorithmDefinition, ComplexityInfo types
│   ├── engine/
│   │   └── traceEngine.ts         # Deterministic bidirectional TracePlayer
│   ├── algorithms/
│   │   ├── registry.ts            # Central catalog of all 16 algorithms
│   │   ├── arrays/
│   │   │   └── arrayRotation.ts   # Reversal & brute-force array rotation trace generator
│   │   ├── sorting/
│   │   │   ├── bubbleSort.ts
│   │   │   ├── selectionSort.ts
│   │   │   ├── insertionSort.ts
│   │   │   ├── mergeSort.ts
│   │   │   ├── quickSort.ts
│   │   │   └── heapSort.ts
│   │   ├── searching/
│   │   │   ├── linearSearch.ts
│   │   │   └── binarySearch.ts
│   │   ├── recursion/
│   │   │   ├── factorial.ts
│   │   │   ├── fibonacci.ts
│   │   │   ├── arraySum.ts
│   │   │   └── towerOfHanoi.ts
│   │   └── dataStructures/
│   │       ├── stack.ts
│   │       ├── queue.ts
│   │       └── linkedList.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── editor/
│   │   │   └── CodeEditorPanel.tsx
│   │   ├── execution/
│   │   │   ├── ExecutionControls.tsx
│   │   │   ├── VariablesInspector.tsx
│   │   │   └── ExplanationCard.tsx
│   │   ├── visualizers/
│   │   │   ├── ArrayRotationVisualizer.tsx
│   │   │   ├── SortingVisualizer.tsx
│   │   │   ├── SearchingVisualizer.tsx
│   │   │   ├── RecursionVisualizer.tsx
│   │   │   └── DataStructuresVisualizer.tsx
│   │   ├── complexity/
│   │   │   ├── ComplexityPanel.tsx
│   │   │   └── ComplexityComparator.tsx
│   │   └── quiz/
│   │       └── QuizModal.tsx
│   ├── hooks/
│   │   ├── useExecution.ts        # Execution manager hook with keyboard listeners
│   │   └── useTheme.ts            # Dark/light theme state with localStorage persistence
│   ├── pages/
│   │   ├── LandingPage.tsx        # Hero with animated array, categories, feature cards
│   │   ├── ExplorerPage.tsx       # Searchable & filterable algorithm library
│   │   ├── VisualizerPage.tsx     # 4-panel resizable workspace
│   │   ├── PlaygroundPage.tsx     # Direct data structures sandbox
│   │   └── ComplexityPage.tsx     # Asymptotic comparison lab
│   └── tests/
│       └── algorithms.test.ts     # Vitest automated test suite (22 unit tests)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended, tested on v24.x)
- npm (v9.0 or higher)

### Installation
```bash
# Clone or navigate to the repository directory
cd algomotion

# Install project dependencies
npm install
```

### Running Locally in Development
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Automated Unit Tests
```bash
npm run test
```
Runs the 22 automated Vitest tests covering:
- Array rotations (zero, standard, and oversized $k > n$ counts with modulo math)
- Sorting edge cases (duplicates, negative values, single-element, unsorted)
- Searching (found vs absent targets, binary search range checks)
- Recursion base cases and call stack depth
- Stack/Queue underflow and capacity limits
- Singly/Doubly Linked List operations
- Bidirectional state restoration in the TracePlayer

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### Preview Production Build Locally
```bash
npm run preview
```

---

## 🌐 Deployment Instructions

### Vercel
1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Netlify
1. Connect repository or run `netlify deploy --build`.
2. Build command: `npm run build`
3. Publish directory: `dist`

### Static Hosting / GitHub Pages
Add `base: './'` to `vite.config.ts` if deploying to a subdirectory, run `npm run build`, and deploy the contents of `dist/`.

---

## 📜 License
AlgoMotion is open-source educational software distributed under the MIT License.
"# Algomotion" 
