/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 7: Graph Algorithms Dashboard
 * Algorithms: BFS, DFS, Prim's MST, Kruskal's MST, Cycle Detection, Bipartite Check
 */

(function () {
  let nodes = [];
  let edges = [];
  let stepper = null;
  let canvas = null;
  let ctx = null;

  const metadata = {
    bfs: {
      name: "Breadth-First Search (BFS)",
      timeBest: "O(V + E)",
      timeAvg: "O(V + E)",
      timeWorst: "O(V + E)",
      space: "O(V)",
      desc: "Level-order graph traversal using a FIFO Queue. Finds shortest path in unweighted graphs.",
      howItWorks: "1. Enqueue starting node and mark it visited.<br>2. While queue is not empty, dequeue node u.<br>3. Inspect all unvisited neighbors v of u.<br>4. Mark v as visited and enqueue v.<br>5. Repeats level by level."
    },
    dfs: {
      name: "Depth-First Search (DFS)",
      timeBest: "O(V + E)",
      timeAvg: "O(V + E)",
      timeWorst: "O(V + E)",
      space: "O(V)",
      desc: "Explores as deep as possible along each branch before backtracking using a LIFO Call Stack.",
      howItWorks: "1. Visit node u and mark it visited.<br>2. Recursively visit each unvisited neighbor v.<br>3. When no unvisited neighbor remains, backtrack to previous node.<br>4. Can be used for topological sorting, cycle detection, and connected components."
    },
    prims: {
      name: "Prim's Minimum Spanning Tree (MST)",
      timeBest: "O((V + E) log V)",
      timeAvg: "O(E log V)",
      timeWorst: "O(V²)",
      space: "O(V)",
      desc: "Greedy algorithm growing a single tree from arbitrary start vertex by adding minimum cut edge.",
      howItWorks: "1. Maintain tree vertex set S (initially {start}).<br>2. Greedily find minimum weight edge connecting vertex in S to vertex outside S.<br>3. Add edge and destination vertex to MST.<br>4. Repeat until all V vertices are included in tree."
    },
    kruskal: {
      name: "Kruskal's MST (Disjoint-Set / Union-Find)",
      timeBest: "O(E log E)",
      timeAvg: "O(E log V)",
      timeWorst: "O(E log E)",
      space: "O(V)",
      desc: "Sorts all edges ascending by weight and adds edges if they do not create a cycle (Disjoint-Set Union).",
      howItWorks: "1. Sort all edges in non-decreasing order of weight.<br>2. Initialize Disjoint Set: each vertex in its own set.<br>3. For each edge (u, v): check find(u) == find(v).<br>4. If different, union(u, v) and add edge to MST.<br>5. If same, discard edge (would create a cycle)."
    },
    bipartite: {
      name: "Bipartite Graph Verification (2-Coloring)",
      timeBest: "O(V + E)",
      timeAvg: "O(V + E)",
      timeWorst: "O(V + E)",
      space: "O(V)",
      desc: "Checks if vertices can be partitioned into two independent sets such that no two adjacent vertices share same color.",
      howItWorks: "1. Assign Color 1 to starting vertex.<br>2. For each adjacent neighbor, assign alternate Color 2.<br>3. If any adjacent neighbor already has the same color, graph is NOT bipartite (contains odd-length cycle).<br>4. If entire graph is 2-colored without conflict, it is Bipartite."
    }
  };

  function initDefaultGraph() {
    nodes = [
      { id: '1', x: 80,  y: 180, color: null },
      { id: '2', x: 200, y: 80,  color: null },
      { id: '3', x: 200, y: 280, color: null },
      { id: '4', x: 340, y: 80,  color: null },
      { id: '5', x: 340, y: 280, color: null },
      { id: '6', x: 470, y: 180, color: null }
    ];

    edges = [
      { from: '1', to: '2', weight: 4 },
      { from: '1', to: '3', weight: 2 },
      { from: '2', to: '4', weight: 5 },
      { from: '3', to: '5', weight: 7 },
      { from: '2', to: '3', weight: 1 },
      { from: '4', to: '5', weight: 3 },
      { from: '4', to: '6', weight: 6 },
      { from: '5', to: '6', weight: 4 }
    ];
  }

  // BFS Step Generator
  function generateBFSSteps() {
    const history = [];
    const visited = new Set();
    const queue = ['1'];
    visited.add('1');

    history.push({
      activeNode: '1',
      queue: ['1'],
      visited: ['1'],
      treeEdges: [],
      desc: "BFS initialized: Enqueued starting vertex 1."
    });

    const treeEdges = [];

    while (queue.length > 0) {
      const u = queue.shift();
      history.push({
        activeNode: u,
        queue: [...queue],
        visited: Array.from(visited),
        treeEdges: [...treeEdges],
        desc: `Dequeued vertex ${u}. Checking all adjacent unvisited neighbors.`
      });

      const neighbors = edges.filter(e => e.from === u || e.to === u);
      neighbors.forEach(edge => {
        const v = edge.from === u ? edge.to : edge.from;
        if (!visited.has(v)) {
          visited.add(v);
          queue.push(v);
          treeEdges.push({ from: u, to: v });

          history.push({
            activeNode: v,
            queue: [...queue],
            visited: Array.from(visited),
            treeEdges: [...treeEdges],
            desc: `Visited neighbor ${v} via edge (${u} ↔ ${v}). Added to FIFO Queue.`
          });
        }
      });
    }

    history.push({
      activeNode: null,
      queue: [],
      visited: Array.from(visited),
      treeEdges: [...treeEdges],
      desc: "BFS complete! All reachable vertices traversed in level order."
    });

    return history;
  }

  // DFS Step Generator
  function generateDFSSteps() {
    const history = [];
    const visited = new Set();
    const stack = [];
    const treeEdges = [];

    history.push({
      activeNode: '1',
      queue: ['1 (Call Stack)'],
      visited: [],
      treeEdges: [],
      desc: "DFS initialized: Invoking dfs(1)."
    });

    function dfs(u) {
      visited.add(u);
      stack.push(u);

      history.push({
        activeNode: u,
        queue: [...stack],
        visited: Array.from(visited),
        treeEdges: [...treeEdges],
        desc: `Pushed ${u} onto Call Stack. Exploring deep into graph.`
      });

      const neighbors = edges.filter(e => e.from === u || e.to === u);
      for (const edge of neighbors) {
        const v = edge.from === u ? edge.to : edge.from;
        if (!visited.has(v)) {
          treeEdges.push({ from: u, to: v });
          dfs(v);
        }
      }

      stack.pop();
      history.push({
        activeNode: u,
        queue: [...stack],
        visited: Array.from(visited),
        treeEdges: [...treeEdges],
        desc: `Backtracking from ${u}. Popped from Call Stack.`
      });
    }

    dfs('1');

    history.push({
      activeNode: null,
      queue: [],
      visited: Array.from(visited),
      treeEdges: [...treeEdges],
      desc: "DFS traversal complete!"
    });

    return history;
  }

  // Kruskal's MST Step Generator
  function generateKruskalSteps() {
    const history = [];
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const parent = {};
    nodes.forEach(n => parent[n.id] = n.id);

    function find(i) {
      if (parent[i] === i) return i;
      return parent[i] = find(parent[i]);
    }
    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
        return true;
      }
      return false;
    }

    const mstEdges = [];
    let totalWeight = 0;

    history.push({
      activeNode: null,
      highlightEdge: null,
      treeEdges: [],
      totalWeight: 0,
      queue: sortedEdges.map(e => `${e.from}-${e.to}(${e.weight})`),
      desc: "Kruskal's MST started. All edges sorted non-decreasing by weight."
    });

    sortedEdges.forEach(e => {
      const u = e.from;
      const v = e.to;
      const rootU = find(u);
      const rootV = find(v);

      if (rootU !== rootV) {
        union(u, v);
        mstEdges.push(e);
        totalWeight += e.weight;
        history.push({
          activeNode: null,
          highlightEdge: e,
          treeEdges: [...mstEdges],
          totalWeight,
          queue: [`Added edge ${u}-${v}`],
          desc: `Edge (${u} ↔ ${v}, weight ${e.weight}) connects distinct components {${rootU}} and {${rootV}}. Added to MST! Total weight = ${totalWeight}.`
        });
      } else {
        history.push({
          activeNode: null,
          highlightEdge: e,
          treeEdges: [...mstEdges],
          totalWeight,
          queue: [`Cycle rejected ${u}-${v}`],
          desc: `Cycle detected! Edge (${u} ↔ ${v}, weight ${e.weight}) rejected because both endpoints belong to component {${rootU}}.`
        });
      }
    });

    history.push({
      activeNode: null,
      highlightEdge: null,
      treeEdges: [...mstEdges],
      totalWeight,
      queue: [],
      desc: `Kruskal's MST complete! Minimum Spanning Tree weight = ${totalWeight} with ${mstEdges.length} edges.`
    });

    return history;
  }

  // Bipartite Check Step Generator
  function generateBipartiteSteps() {
    const history = [];
    const colorMap = {};
    nodes.forEach(n => colorMap[n.id] = null);

    const queue = ['1'];
    colorMap['1'] = 'Set A (Cyan)';

    history.push({
      activeNode: '1',
      colorMap: { ...colorMap },
      queue: ['1'],
      desc: "Bipartite check started: Assigned Node 1 to Set A (Cyan)."
    });

    let isBipartite = true;

    while (queue.length > 0 && isBipartite) {
      const u = queue.shift();
      const currColor = colorMap[u];
      const nextColor = currColor === 'Set A (Cyan)' ? 'Set B (Rose)' : 'Set A (Cyan)';

      const neighbors = edges.filter(e => e.from === u || e.to === u);
      for (const edge of neighbors) {
        const v = edge.from === u ? edge.to : edge.from;

        if (colorMap[v] === null) {
          colorMap[v] = nextColor;
          queue.push(v);
          history.push({
            activeNode: v,
            colorMap: { ...colorMap },
            queue: [...queue],
            desc: `Neighbor ${v} of ${u} colored with opposite set: ${nextColor}.`
          });
        } else if (colorMap[v] === currColor) {
          isBipartite = false;
          history.push({
            activeNode: v,
            colorMap: { ...colorMap },
            queue: [],
            desc: `⚠️ Monochromatic Conflict! Both Node ${u} and Node ${v} share ${currColor}. Graph contains an odd cycle and is NOT Bipartite!`
          });
          break;
        }
      }
    }

    if (isBipartite) {
      history.push({
        activeNode: null,
        colorMap: { ...colorMap },
        queue: [],
        desc: "Graph is Bipartite! All vertices partitioned into 2 independent sets without conflicts."
      });
    }

    return history;
  }

  // Draw Graph Canvas
  function drawGraph(state) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Edges
    edges.forEach(edge => {
      const u = nodes.find(n => n.id === edge.from);
      const v = nodes.find(n => n.id === edge.to);
      if (!u || !v) return;

      let edgeState = 'default';
      if (state.highlightEdge) {
        if ((state.highlightEdge.from === u.id && state.highlightEdge.to === v.id) ||
            (state.highlightEdge.from === v.id && state.highlightEdge.to === u.id)) {
          edgeState = 'highlight';
        }
      }
      if (state.treeEdges) {
        const inTree = state.treeEdges.some(te =>
          (te.from === u.id && te.to === v.id) || (te.from === v.id && te.to === u.id)
        );
        if (inTree) edgeState = 'path';
      }

      CanvasUtils.drawEdge(ctx, u.x, u.y, v.x, v.y, edge.weight, edgeState, false);
    });

    // Draw Nodes
    nodes.forEach(node => {
      let nodeState = 'default';
      if (state.visited && state.visited.includes(node.id)) nodeState = 'visited';
      if (state.activeNode === node.id) nodeState = 'active';

      // Custom coloring for Bipartite
      if (state.colorMap && state.colorMap[node.id]) {
        if (state.colorMap[node.id].includes('Cyan')) nodeState = 'visited';
        else nodeState = 'target';
      }

      CanvasUtils.drawNode(ctx, node.x, node.y, node.id, nodeState, 22);
    });
  }

  function renderQueue(items) {
    const box = document.getElementById('graph-queue-flow');
    if (!box) return;
    box.innerHTML = '';
    (items || []).forEach(it => {
      const b = document.createElement('span');
      b.className = 'flow-node-badge';
      b.textContent = it;
      box.appendChild(b);
    });
  }

  function updateDashboardInfo(key) {
    const data = metadata[key];
    if (!data) return;
    document.getElementById('graph-algo-title').textContent = data.name;
    document.getElementById('graph-best-time').textContent = data.timeBest;
    document.getElementById('graph-avg-time').textContent = data.timeAvg;
    document.getElementById('graph-worst-time').textContent = data.timeWorst;
    document.getElementById('graph-space-time').textContent = data.space;
    document.getElementById('graph-desc-text').textContent = data.desc;
    document.getElementById('graph-how-it-works').innerHTML = data.howItWorks;
  }

  function applyStep(step, currIdx, totalSteps) {
    drawGraph(step);
    renderQueue(step.queue);

    document.getElementById('graph-step-msg').textContent = step.desc;
    document.getElementById('graph-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;

    if (step.totalWeight !== undefined) {
      document.getElementById('graph-mst-weight').textContent = step.totalWeight;
    }

    if (step.desc.includes('complete') || step.desc.includes('Bipartite!')) {
      window.soundEngine.successSound();
    } else {
      window.soundEngine.compareSound(110);
    }
  }

  function prepareAlgorithm(algoKey) {
    updateDashboardInfo(algoKey);
    let steps = [];
    if (algoKey === 'bfs') steps = generateBFSSteps();
    else if (algoKey === 'dfs') steps = generateDFSSteps();
    else if (algoKey === 'kruskal' || algoKey === 'prims') steps = generateKruskalSteps();
    else if (algoKey === 'bipartite') steps = generateBipartiteSteps();

    stepper.loadSteps(steps);
    if (steps.length > 0) applyStep(steps[0], 0, steps.length);
  }

  function initGraphDashboard() {
    canvas = document.getElementById('graph-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 600;
    canvas.height = 340;

    initDefaultGraph();

    const algoSelect = document.getElementById('graph-algo-select');
    const btnPlay = document.getElementById('graph-btn-play');
    const btnPause = document.getElementById('graph-btn-pause');
    const btnStep = document.getElementById('graph-btn-step');
    const btnPrev = document.getElementById('graph-btn-prev');
    const btnReset = document.getElementById('graph-btn-reset');
    const speedSlider = document.getElementById('graph-speed-slider');
    const speedBadge = document.getElementById('graph-speed-val');

    stepper = new StepController({
      onApplyStep: applyStep,
      onComplete: () => window.appState?.setStatus('done'),
      onStatusChange: (status) => {
        window.appState?.setStatus(status);
        btnPlay.disabled = (status === 'running');
        btnPause.disabled = (status !== 'running');
      }
    });

    algoSelect.addEventListener('change', () => prepareAlgorithm(algoSelect.value));

    btnPlay.addEventListener('click', () => stepper.play());
    btnPause.addEventListener('click', () => stepper.pause());
    btnStep.addEventListener('click', () => stepper.stepForward());
    btnPrev.addEventListener('click', () => stepper.stepBackward());
    btnReset.addEventListener('click', () => stepper.reset());

    speedSlider.addEventListener('input', (e) => {
      const delay = parseInt(e.target.value, 10);
      stepper.setSpeed(delay);
      speedBadge.textContent = `${delay}ms`;
    });

    prepareAlgorithm(algoSelect.value);
  }

  window.initGraphDashboard = initGraphDashboard;
})();
