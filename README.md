# Algorithm Visualizer – Complete DAA Lab Suite

> An educational, interactive multi-dashboard web application designed for students and educators in **Design and Analysis of Algorithms (DAA)**. Explore, step through, and analyze every fundamental algorithm with real-time animations, complexity telemetry, and mathematical proofs.

---

## 🚀 Quick Start

### Option 1: Double-Click Launcher (Windows)
Simply double-click **`start.bat`** in the project root directory. It will instantly launch the application in your default web browser.

### Option 2: Direct File Open
Open **`index.html`** in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).  
*No server, Node.js, Python, or framework installation required—pure Vanilla JavaScript!*

---

## 📌 Syllabus & Algorithm Coverage

This application implements **8 dedicated dashboards** matching the university DAA lab syllabus:

| # | Dashboard | Algorithms Included | Visual Highlights |
|---|---|---|---|
| **1** | **Sorting Algorithms** | Bubble Sort, Selection Sort, Insertion Sort, Counting Sort, Merge Sort, Quick Sort (Lomuto), Heap Sort | Interactive array input, comparing/swapping element highlights, comparisons & swaps telemetry, live Big O metrics. |
| **2** | **Searching Algorithms** | Linear Search, Binary Search | Dynamic element boxes with pointers (`LOW`, `MID`, `HIGH`), eliminated region masking, prerequisite sorted-array toggle, complexity comparison table. |
| **3** | **Shortest Path & Route Optimization** | Dijkstra's Algorithm, Bellman-Ford, A* Search | Interactive graph canvas, real-time distance relaxation table, Euclidean heuristic visualization, optimal path glowing. |
| **4** | **Greedy Algorithms** | Huffman Coding, Fractional Knapsack, 0/1 Knapsack (Greedy vs DP) | Interactive tree merging, binary prefix codes table, value-to-weight ratio ordering, capacity bar fill animation. |
| **5** | **Backtracking & Branch and Bound** | N-Queens Problem, Travelling Salesman Problem (TSP), Sum of Subsets | Interactive chessboard (4×4 to 6×6), conflict line highlighting, state-space tree pruning based on lower bounds, solution counter. |
| **6** | **Divide and Conquer** | Closest Pair of Points (2D Plane), Strassen's Matrix Multiplication | 2D canvas with median divider line and $2\delta$ strip checking, 7 product equations breakdown, active recursive call stack. |
| **7** | **Graph Algorithms** | BFS, DFS, Kruskal's MST (Disjoint-Set Union-Find), Prim's MST, Bipartite Verification (2-Coloring) | Graph node traversal, real-time FIFO Queue and LIFO Call Stack flow, cycle detection, bipartite odd-cycle conflict detection. |
| **8** | **Complexity & Theory Lab** | Asymptotic Growth Notations ($O, \Omega, \Theta$), Master Theorem Solver, P vs NP vs NP-Complete | Interactive plotted curves ($O(1), O(\log n), O(n), O(n \log n), O(n^2), O(2^n)$), Master Theorem calculator for $T(n) = aT(n/b) + \Theta(n^k \log^p n)$, Karp reduction charts. |

---

## 🛠️ Features & Controls

- **Unified Navigation:** Persistent left sidebar allowing zero-reload transitions between all 8 modules.
- **Full Execution Controls:**
  - `Play / Pause` (Spacebar)
  - `Step Forward` (Right Arrow)
  - `Step Backward` (Left Arrow)
  - `Reset` (`R` key)
  - `Speed Slider` (30ms to 1500ms delay)
- **Custom Input:** Input comma-separated numbers, adjust target values, or generate randomized data on the fly.
- **Educational Sonification:** Web Audio API sound synthesis produces distinct frequencies for element comparisons, swaps, backtracking, and solution milestones (toggleable with `M` or the speaker button).
- **Expandable Theory Panels:** Expand "How it Works" on any dashboard to inspect algorithmic steps, edge cases, and best/average/worst space-time complexities.

---

## 📁 Project Structure

```
├── index.html               # Main single-page application structure
├── start.bat                # Windows double-click instant launcher
├── README.md                # Comprehensive documentation & syllabus guide
├── IMPLEMENTATIONS.md       # Implementation history & prompt-by-prompt changelog
│
├── css/
│   ├── style.css            # Dark glassmorphic design system, sidebar & header
│   └── dashboards.css       # Visualizer components: bars, graphs, boards, canvas
│
└── js/
    ├── utils.js             # Sound engine, StepController, canvas drawing helpers
    ├── sorting.js           # 7 sorting algorithms with step generator
    ├── searching.js         # Linear & binary search with pointers
    ├── shortest_path.js     # Dijkstra, Bellman-Ford, and A* on editable graph
    ├── greedy.js            # Huffman tree generator & Knapsack visualizer
    ├── backtracking.js      # N-Queens, TSP branch & bound, Sum of Subsets
    ├── divide_conquer.js    # Closest pair 2D canvas & Strassen breakdown
    ├── graph_algorithms.js  # BFS, DFS, MST, cycle & bipartite detection
    ├── complexity_theory.js # Growth curves plotter & Master Theorem solver
    └── app.js               # State routing, shortcuts, and global initialization
```

---

## 💡 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Space</kbd> | Toggle Play / Pause |
| <kbd>→</kbd> | Step Forward (one comparison / expansion) |
| <kbd>←</kbd> | Step Backward |
| <kbd>R</kbd> | Reset current visualization |
| <kbd>M</kbd> | Mute / Unmute educational audio feedback |

---

## 🔮 Future Improvement Ideas

1. **3D Graph Layouts:** WebGL-assisted force-directed 3D graph visualizations for massive graph datasets.
2. **Dynamic Programming Matrix Suite:** Dedicated visualization for Floyd-Warshall, Matrix Chain Multiplication, and Longest Common Subsequence (LCS).
3. **Step Export & Replay:** Export animation steps as JSON or GIF recordings for classroom presentations.
4. **Code Execution Sandbox:** Side-by-side editable pseudocode editor highlighting active line numbers during execution.
