/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 3: Shortest Path / Route Optimization Dashboard
 * Algorithms: Dijkstra's Algorithm, Bellman-Ford, A* Search
 */

(function () {
  let nodes = [];
  let edges = [];
  let startNode = 'A';
  let targetNode = 'F';
  let stepper = null;
  let canvas = null;
  let ctx = null;

  const metadata = {
    dijkstra: {
      name: "Dijkstra's Algorithm (Greedy Single-Source Shortest Path)",
      timeBest: "O((V + E) log V)",
      timeAvg: "O((V + E) log V)",
      timeWorst: "O(V²)",
      space: "O(V)",
      desc: "Greedy algorithm finding shortest paths from source to all vertices using non-negative edge weights.",
      howItWorks: "1. Assign tentative distance 0 to source, ∞ to all other nodes.<br>2. Select unvisited node with smallest distance.<br>3. For current node, consider unvisited neighbors and calculate tentative distance.<br>4. If calculated distance < current assigned distance, update it.<br>5. Mark current node as visited. Repeat until target or all nodes visited."
    },
    bellman: {
      name: "Bellman-Ford Algorithm (Dynamic Programming Relaxation)",
      timeBest: "O(E)",
      timeAvg: "O(V × E)",
      timeWorst: "O(V × E)",
      space: "O(V)",
      desc: "Finds shortest paths even with negative edge weights and detects negative weight cycles.",
      howItWorks: "1. Initialize dist[source] = 0 and dist[v] = ∞.<br>2. Relax all |E| edges |V| - 1 times: if dist[u] + w < dist[v], dist[v] = dist[u] + w.<br>3. Check for negative-weight cycles in an additional Vth pass.<br>Guarantees optimal paths on arbitrary weights without negative cycles."
    },
    astar: {
      name: "A* Search Algorithm (Heuristic Informed Best-First)",
      timeBest: "O(E)",
      timeAvg: "O(E)",
      timeWorst: "O(b^d)",
      space: "O(V)",
      desc: "Informed search algorithm using heuristic evaluation f(n) = g(n) + h(n) towards the target.",
      howItWorks: "1. g(n) = exact cost from start to node n.<br>2. h(n) = heuristic estimate (Euclidean distance on 2D plane) from n to target.<br>3. Expand node with minimal f(n) = g(n) + h(n).<br>Guarantees shortest path if h(n) is admissible (never overestimates true cost)."
    }
  };

  // Preset default graph
  function loadDefaultGraph() {
    nodes = [
      { id: 'A', x: 80,  y: 190, h: 0 },
      { id: 'B', x: 220, y: 80,  h: 0 },
      { id: 'C', x: 220, y: 300, h: 0 },
      { id: 'D', x: 380, y: 90,  h: 0 },
      { id: 'E', x: 380, y: 290, h: 0 },
      { id: 'F', x: 520, y: 190, h: 0 }
    ];

    // Compute Euclidean heuristic towards target 'F' (x:520, y:190)
    const targetPos = nodes.find(n => n.id === 'F');
    nodes.forEach(n => {
      const dx = targetPos.x - n.x;
      const dy = targetPos.y - n.y;
      n.h = Math.round(Math.hypot(dx, dy) / 25); // scaled heuristic
    });

    edges = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'E', weight: 8 },
      { from: 'C', to: 'D', weight: 10 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'F', weight: 3 }
    ];
  }

  // Dijkstra Step Generator
  function generateDijkstraSteps() {
    const history = [];
    const dist = {};
    const prev = {};
    const visited = new Set();
    const nodeIds = nodes.map(n => n.id);

    nodeIds.forEach(id => {
      dist[id] = Infinity;
      prev[id] = null;
    });
    dist[startNode] = 0;

    history.push({
      activeNode: null,
      highlightEdge: null,
      visited: [],
      dist: { ...dist },
      path: [],
      desc: `Dijkstra initialized with source node ${startNode}. dist[${startNode}] = 0, all others = ∞.`
    });

    while (visited.size < nodeIds.length) {
      // Find unvisited node with min distance
      let u = null;
      let minD = Infinity;
      nodeIds.forEach(id => {
        if (!visited.has(id) && dist[id] < minD) {
          minD = dist[id];
          u = id;
        }
      });

      if (u === null || minD === Infinity) break;

      visited.add(u);
      history.push({
        activeNode: u,
        highlightEdge: null,
        visited: Array.from(visited),
        dist: { ...dist },
        path: [],
        desc: `Selected unvisited node ${u} with minimum tentative distance ${dist[u]}.`
      });

      if (u === targetNode) break;

      // Relax neighbors
      const neighbors = edges.filter(e => e.from === u || e.to === u);
      neighbors.forEach(edge => {
        const v = edge.from === u ? edge.to : edge.from;
        if (!visited.has(v)) {
          const alt = dist[u] + edge.weight;
          history.push({
            activeNode: u,
            highlightEdge: { from: u, to: v },
            visited: Array.from(visited),
            dist: { ...dist },
            path: [],
            desc: `Inspecting edge (${u} ↔ ${v}, weight ${edge.weight}). Tentative distance = ${dist[u]} + ${edge.weight} = ${alt}.`
          });

          if (alt < dist[v]) {
            dist[v] = alt;
            prev[v] = u;
            history.push({
              activeNode: v,
              highlightEdge: { from: u, to: v },
              visited: Array.from(visited),
              dist: { ...dist },
              path: [],
              desc: `Relaxation: Updated dist[${v}] from ${dist[v] === Infinity ? '∞' : dist[v]} to ${alt} via ${u}.`
            });
          }
        }
      });
    }

    // Reconstruct path
    const finalPath = [];
    let curr = targetNode;
    while (curr) {
      finalPath.unshift(curr);
      curr = prev[curr];
    }

    history.push({
      activeNode: targetNode,
      highlightEdge: null,
      visited: Array.from(visited),
      dist: { ...dist },
      path: finalPath,
      desc: `Dijkstra completed! Shortest path from ${startNode} to ${targetNode}: ${finalPath.join(' → ')} with total cost = ${dist[targetNode]}.`
    });

    return history;
  }

  // Bellman-Ford Step Generator
  function generateBellmanSteps() {
    const history = [];
    const dist = {};
    const prev = {};
    const nodeIds = nodes.map(n => n.id);

    nodeIds.forEach(id => {
      dist[id] = Infinity;
      prev[id] = null;
    });
    dist[startNode] = 0;

    history.push({
      activeNode: null,
      highlightEdge: null,
      visited: [],
      dist: { ...dist },
      path: [],
      desc: `Bellman-Ford initialized: dist[${startNode}] = 0. Will perform ${nodeIds.length - 1} relaxation passes over all edges.`
    });

    // Expand edges to directed pairs for undirected representation
    const directedEdges = [];
    edges.forEach(e => {
      directedEdges.push({ u: e.from, v: e.to, w: e.weight });
      directedEdges.push({ u: e.to, v: e.from, w: e.weight });
    });

    for (let i = 1; i < nodeIds.length; i++) {
      let anyUpdate = false;
      history.push({
        activeNode: null,
        highlightEdge: null,
        visited: [],
        dist: { ...dist },
        path: [],
        desc: `--- Starting Relaxation Pass ${i} of ${nodeIds.length - 1} ---`
      });

      for (const e of directedEdges) {
        if (dist[e.u] !== Infinity && dist[e.u] + e.w < dist[e.v]) {
          const old = dist[e.v];
          dist[e.v] = dist[e.u] + e.w;
          prev[e.v] = e.u;
          anyUpdate = true;

          history.push({
            activeNode: e.v,
            highlightEdge: { from: e.u, to: e.v },
            visited: [],
            dist: { ...dist },
            path: [],
            desc: `Pass ${i}: Relaxed edge (${e.u} → ${e.v}). dist[${e.v}] updated from ${old === Infinity ? '∞' : old} to ${dist[e.v]}.`
          });
        }
      }
      if (!anyUpdate) {
        history.push({
          activeNode: null,
          highlightEdge: null,
          visited: [],
          dist: { ...dist },
          path: [],
          desc: `Early termination: No edges relaxed in pass ${i}. Optimal distances reached.`
        });
        break;
      }
    }

    // Reconstruct path
    const finalPath = [];
    let curr = targetNode;
    while (curr) {
      finalPath.unshift(curr);
      curr = prev[curr];
    }

    history.push({
      activeNode: targetNode,
      highlightEdge: null,
      visited: [],
      dist: { ...dist },
      path: finalPath,
      desc: `Bellman-Ford finished! Shortest path to ${targetNode}: ${finalPath.join(' → ')} (Total Cost: ${dist[targetNode]}).`
    });

    return history;
  }

  // A* Step Generator
  function generateAStarSteps() {
    const history = [];
    const gScore = {};
    const fScore = {};
    const prev = {};
    const openSet = new Set([startNode]);
    const closedSet = new Set();
    const nodeIds = nodes.map(n => n.id);

    nodeIds.forEach(id => {
      gScore[id] = Infinity;
      fScore[id] = Infinity;
      prev[id] = null;
    });

    const startH = nodes.find(n => n.id === startNode).h;
    gScore[startNode] = 0;
    fScore[startNode] = startH;

    history.push({
      activeNode: startNode,
      highlightEdge: null,
      visited: [],
      dist: { ...gScore },
      path: [],
      desc: `A* initialized. g(${startNode}) = 0, h(${startNode}) = ${startH}, f(${startNode}) = ${startH}.`
    });

    while (openSet.size > 0) {
      let current = null;
      let lowestF = Infinity;
      openSet.forEach(id => {
        if (fScore[id] < lowestF) {
          lowestF = fScore[id];
          current = id;
        }
      });

      if (current === targetNode) break;

      openSet.delete(current);
      closedSet.add(current);

      history.push({
        activeNode: current,
        highlightEdge: null,
        visited: Array.from(closedSet),
        dist: { ...gScore },
        path: [],
        desc: `A* expanding node ${current} with lowest f(n) = ${fScore[current]} [g=${gScore[current]}, h=${nodes.find(n => n.id === current).h}].`
      });

      const neighbors = edges.filter(e => e.from === current || e.to === current);
      neighbors.forEach(edge => {
        const neighbor = edge.from === current ? edge.to : edge.from;
        if (closedSet.has(neighbor)) return;

        const tentativeG = gScore[current] + edge.weight;
        if (tentativeG < gScore[neighbor]) {
          prev[neighbor] = current;
          gScore[neighbor] = tentativeG;
          const hVal = nodes.find(n => n.id === neighbor).h;
          fScore[neighbor] = tentativeG + hVal;
          openSet.add(neighbor);

          history.push({
            activeNode: neighbor,
            highlightEdge: { from: current, to: neighbor },
            visited: Array.from(closedSet),
            dist: { ...gScore },
            path: [],
            desc: `A* evaluated neighbor ${neighbor}: g=${tentativeG}, h=${hVal} → f=${fScore[neighbor]}. Added to Open Set.`
          });
        }
      });
    }

    const finalPath = [];
    let curr = targetNode;
    while (curr) {
      finalPath.unshift(curr);
      curr = prev[curr];
    }

    history.push({
      activeNode: targetNode,
      highlightEdge: null,
      visited: Array.from(closedSet),
      dist: { ...gScore },
      path: finalPath,
      desc: `A* Search arrived at target ${targetNode}! Path: ${finalPath.join(' → ')}, cost = ${gScore[targetNode]}.`
    });

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
      if (state.path && state.path.length > 1) {
        for (let i = 0; i < state.path.length - 1; i++) {
          if ((state.path[i] === u.id && state.path[i + 1] === v.id) ||
              (state.path[i] === v.id && state.path[i + 1] === u.id)) {
            edgeState = 'path';
          }
        }
      }

      CanvasUtils.drawEdge(ctx, u.x, u.y, v.x, v.y, edge.weight, edgeState, false);
    });

    // Draw Nodes
    nodes.forEach(node => {
      let nodeState = 'default';
      if (node.id === startNode) nodeState = 'start';
      else if (node.id === targetNode) nodeState = 'target';

      if (state.visited && state.visited.includes(node.id)) {
        nodeState = 'visited';
      }
      if (state.activeNode === node.id) {
        nodeState = 'active';
      }
      if (state.path && state.path.includes(node.id)) {
        nodeState = 'solution';
      }

      CanvasUtils.drawNode(ctx, node.x, node.y, node.id, nodeState, 22);

      // Draw heuristic label below node for A*
      if (node.h > 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(`h=${node.h}`, node.x, node.y + 32);
      }
    });
  }

  function renderDistTable(distMap) {
    const strip = document.getElementById('sp-dist-table');
    if (!strip) return;
    strip.innerHTML = '';

    nodes.forEach(n => {
      const cell = document.createElement('div');
      cell.className = 'dist-cell';
      const d = distMap[n.id];
      const displayD = d === Infinity ? '∞' : d;

      cell.innerHTML = `
        <div class="dist-node-name">Node ${n.id}</div>
        <div class="dist-node-val">${displayD}</div>
      `;
      strip.appendChild(cell);
    });
  }

  function updateDashboardInfo(algoKey) {
    const data = metadata[algoKey];
    if (!data) return;
    document.getElementById('sp-algo-title').textContent = data.name;
    document.getElementById('sp-best-time').textContent = data.timeBest;
    document.getElementById('sp-avg-time').textContent = data.timeAvg;
    document.getElementById('sp-worst-time').textContent = data.timeWorst;
    document.getElementById('sp-space-time').textContent = data.space;
    document.getElementById('sp-desc-text').textContent = data.desc;
    document.getElementById('sp-how-it-works').innerHTML = data.howItWorks;
  }

  function applyStep(step, currIdx, totalSteps) {
    drawGraph(step);
    renderDistTable(step.dist);

    document.getElementById('sp-step-msg').textContent = step.desc;
    document.getElementById('sp-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;
    document.getElementById('sp-visited-count').textContent = step.visited.length;
    const targetDist = step.dist[targetNode];
    document.getElementById('sp-target-dist').textContent = targetDist === Infinity ? '∞' : targetDist;

    if (step.path && step.path.length > 0) {
      window.soundEngine.successSound();
    } else {
      window.soundEngine.compareSound(100);
    }
  }

  function prepareAlgorithm(algoKey) {
    updateDashboardInfo(algoKey);
    let steps = [];
    if (algoKey === 'dijkstra') steps = generateDijkstraSteps();
    else if (algoKey === 'bellman') steps = generateBellmanSteps();
    else if (algoKey === 'astar') steps = generateAStarSteps();

    stepper.loadSteps(steps);
    if (steps.length > 0) applyStep(steps[0], 0, steps.length);
  }

  function initShortestPathDashboard() {
    canvas = document.getElementById('sp-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Fix Canvas DPI scaling
    canvas.width = canvas.parentElement.clientWidth || 640;
    canvas.height = 360;

    const algoSelect = document.getElementById('sp-algo-select');
    const startSelect = document.getElementById('sp-start-select');
    const targetSelect = document.getElementById('sp-target-select');
    const btnPlay = document.getElementById('sp-btn-play');
    const btnPause = document.getElementById('sp-btn-pause');
    const btnStep = document.getElementById('sp-btn-step');
    const btnPrev = document.getElementById('sp-btn-prev');
    const btnReset = document.getElementById('sp-btn-reset');
    const speedSlider = document.getElementById('sp-speed-slider');
    const speedBadge = document.getElementById('sp-speed-val');

    loadDefaultGraph();

    // Populate node dropdowns
    startSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    nodes.forEach(n => {
      startSelect.add(new Option(`Node ${n.id}`, n.id, n.id === startNode, n.id === startNode));
      targetSelect.add(new Option(`Node ${n.id}`, n.id, n.id === targetNode, n.id === targetNode));
    });

    startSelect.addEventListener('change', () => {
      startNode = startSelect.value;
      prepareAlgorithm(algoSelect.value);
    });

    targetSelect.addEventListener('change', () => {
      targetNode = targetSelect.value;
      prepareAlgorithm(algoSelect.value);
    });

    algoSelect.addEventListener('change', () => prepareAlgorithm(algoSelect.value));

    stepper = new StepController({
      onApplyStep: applyStep,
      onComplete: () => window.appState?.setStatus('done'),
      onStatusChange: (status) => {
        window.appState?.setStatus(status);
        btnPlay.disabled = (status === 'running');
        btnPause.disabled = (status !== 'running');
      }
    });

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

    // Resize handler
    window.addEventListener('resize', () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        drawGraph({ visited: [], dist: {}, path: [] });
      }
    });

    prepareAlgorithm(algoSelect.value);
  }

  window.initShortestPathDashboard = initShortestPathDashboard;
})();
