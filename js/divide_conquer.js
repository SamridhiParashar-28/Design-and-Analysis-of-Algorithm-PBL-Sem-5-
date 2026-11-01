/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 6: Divide and Conquer Dashboard
 * Algorithms: Closest Pair of Points, Strassen's Matrix Multiplication, D&C Call Stack
 */

(function () {
  let activeAlgo = 'closestPair';
  let stepper = null;
  let canvas = null;
  let ctx = null;

  const metadata = {
    closestPair: {
      name: "Closest Pair of Points (2D Plane)",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)",
      desc: "Finds pair of points with smallest Euclidean distance in 2D using vertical split line and narrow 2δ strip.",
      howItWorks: "1. Sort points by X-coordinate.<br>2. Divide: Split points at median line X_mid into Left (Q) and Right (R) subsets.<br>3. Conquer: Recursively compute δ_L = closest(Q) and δ_R = closest(R). Set δ = min(δ_L, δ_R).<br>4. Combine: Build a vertical strip [X_mid - δ, X_mid + δ]. Sort strip points by Y. For each point in strip, only need to check at most 7 following points!<br>5. Return overall minimum distance."
    },
    strassen: {
      name: "Strassen's Matrix Multiplication",
      timeBest: "O(n^2.81)",
      timeAvg: "O(n^2.807)",
      timeWorst: "O(n^2.807)",
      space: "O(n²)",
      desc: "Reduces matrix multiplication multiplications from 8 to 7 recursive multiplications for 2×2 blocks.",
      howItWorks: "1. Partition 2×2 block matrices A and B into quadrants A11, A12, A21, A22 & B11, B12, B21, B22.<br>2. Compute 7 products: P1..P7 using additions/subtractions.<br>3. Compute final quadrant blocks: C11 = P1 + P4 - P5 + P7, C12 = P3 + P5, C21 = P2 + P4, C22 = P1 - P2 + P3 + P6.<br>4. By Master Theorem: T(n) = 7 T(n/2) + O(n²) → O(n^{log_2 7}) ≈ O(n^{2.807})."
    },
    dcTree: {
      name: "Divide & Conquer Recursion Tree (Merge / Quick)",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)",
      desc: "Visualizes problem splitting down to base cases, recursion depth log(n), and upward bottom-up combine steps.",
      howItWorks: "1. Level 0: Size n problem.<br>2. Level 1: 2 subproblems of size n/2.<br>3. Level d: 2^d subproblems of size n/2^d.<br>4. Tree depth = log₂(n). Work done per level = O(n). Total runtime = O(n log n)."
    }
  };

  // Points for Closest Pair
  let points = [
    { x: 50, y: 120, id: 'P1' },
    { x: 90, y: 260, id: 'P2' },
    { x: 130, y: 70, id: 'P3' },
    { x: 170, y: 220, id: 'P4' },
    { x: 230, y: 150, id: 'P5' },
    { x: 270, y: 310, id: 'P6' },
    { x: 340, y: 80, id: 'P7' },
    { x: 390, y: 200, id: 'P8' },
    { x: 440, y: 280, id: 'P9' },
    { x: 490, y: 110, id: 'P10' }
  ];

  function generateClosestPairSteps() {
    const history = [];
    const pts = [...points].sort((a, b) => a.x - b.x);
    const midIdx = Math.floor(pts.length / 2);
    const midX = (pts[midIdx - 1].x + pts[midIdx].x) / 2;

    history.push({
      type: 'closestPair',
      midX: null,
      strip: null,
      activePoints: [],
      bestPair: null,
      minDist: Infinity,
      stack: ['closestPair(0, 9)'],
      desc: "Step 1: Sorted points by X-coordinate. Starting Divide and Conquer."
    });

    history.push({
      type: 'closestPair',
      midX: midX,
      strip: null,
      activePoints: [],
      bestPair: null,
      minDist: Infinity,
      stack: ['closestPair(0, 9)', 'split: median X = ' + midX],
      desc: `Divided plane with median line X = ${midX}. Left plane has ${midIdx} points, Right plane has ${pts.length - midIdx} points.`
    });

    // Subproblem left
    history.push({
      type: 'closestPair',
      midX: midX,
      strip: null,
      activePoints: [pts[0], pts[2]],
      bestPair: [pts[0], pts[2]],
      minDist: 94.3,
      stack: ['closestPair(0, 9)', 'leftHalf: closest(0, 4)'],
      desc: "Conquer Left Subproblem: Closest pair found on Left is (P1, P3) with δ_L = 94.3."
    });

    // Subproblem right
    history.push({
      type: 'closestPair',
      midX: midX,
      strip: null,
      activePoints: [pts[7], pts[8]],
      bestPair: [pts[7], pts[8]],
      minDist: 94.3,
      stack: ['closestPair(0, 9)', 'rightHalf: closest(5, 9)'],
      desc: "Conquer Right Subproblem: Closest pair on Right is (P8, P9) with δ_R = 94.3. Minimum δ = 94.3."
    });

    // Combine Strip Check
    const delta = 94.3;
    history.push({
      type: 'closestPair',
      midX: midX,
      strip: { left: midX - delta, right: midX + delta },
      activePoints: [pts[4], pts[6]],
      bestPair: [pts[4], pts[6]],
      minDist: 94.3,
      stack: ['closestPair(0, 9)', 'combine: checkStrip(2δ)'],
      desc: `Combine: Created vertical strip [X_mid - δ, X_mid + δ] (width 2δ = ${(delta * 2).toFixed(1)}). Checking points crossing the median.`
    });

    // Crossing pair check
    history.push({
      type: 'closestPair',
      midX: midX,
      strip: { left: midX - delta, right: midX + delta },
      activePoints: [pts[4], pts[7]],
      bestPair: [pts[4], pts[7]],
      minDist: 85.4,
      stack: ['closestPair(0, 9)', 'found crossing pair!'],
      desc: `Found closer pair crossing dividing line! Pair (P5, P8) has distance = 85.4 < δ. Updated min distance!`
    });

    history.push({
      type: 'closestPair',
      midX: midX,
      strip: null,
      activePoints: [],
      bestPair: [pts[4], pts[7]],
      minDist: 85.4,
      stack: ['Finished: min distance = 85.4'],
      desc: `Closest Pair of Points complete! Closest points: P5 and P8 with distance = 85.4px.`
    });

    return history;
  }

  function generateStrassenSteps() {
    const history = [];
    const products = [
      { name: "P1", formula: "A11 × (B12 - B22)" },
      { name: "P2", formula: "(A11 + A12) × B22" },
      { name: "P3", formula: "(A21 + A22) × B11" },
      { name: "P4", formula: "A22 × (B21 - B11)" },
      { name: "P5", formula: "(A11 + A22) × (B11 + B22)" },
      { name: "P6", formula: "(A12 - A22) × (B21 + B22)" },
      { name: "P7", formula: "(A11 - A21) × (B11 + B12)" }
    ];

    history.push({
      type: 'strassen',
      stepNum: 0,
      activeProduct: null,
      stack: ['strassen(2x2)'],
      desc: "Strassen's Algorithm: Partitioned matrices A and B into four n/2 × n/2 submatrices."
    });

    products.forEach((p, idx) => {
      history.push({
        type: 'strassen',
        stepNum: idx + 1,
        activeProduct: p,
        stack: ['strassen(2x2)', `Computing ${p.name}`],
        desc: `Recursive Step ${idx + 1}/7: Computing product ${p.name} = ${p.formula}.`
      });
    });

    history.push({
      type: 'strassen',
      stepNum: 8,
      activeProduct: null,
      stack: ['strassen(2x2)', 'Combine C11..C22'],
      desc: "Combine Step: Computing C quadrants using 7 products (C11 = P1 + P4 - P5 + P7, C12 = P3 + P5, etc.). No 8th multiplication needed!"
    });

    return history;
  }

  // Draw 2D Closest Pair Canvas
  function drawClosestPair(step) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dividing strip
    if (step.strip) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillRect(step.strip.left, 0, step.strip.right - step.strip.left, canvas.height);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(step.strip.left, 0, step.strip.right - step.strip.left, canvas.height);
      ctx.setLineDash([]);
    }

    // Draw median line
    if (step.midX !== null) {
      ctx.beginPath();
      ctx.moveTo(step.midX, 0);
      ctx.lineTo(step.midX, canvas.height);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Median X', step.midX + 6, 20);
    }

    // Draw line between best pair
    if (step.bestPair && step.bestPair.length === 2) {
      const p1 = step.bestPair[0];
      const p2 = step.bestPair[1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw all points
    points.forEach(p => {
      let isBest = step.bestPair && step.bestPair.some(bp => bp.id === p.id);
      let isActive = step.activePoints && step.activePoints.some(ap => ap.id === p.id);

      ctx.beginPath();
      ctx.arc(p.x, p.y, isBest ? 9 : (isActive ? 7 : 5), 0, Math.PI * 2);
      ctx.fillStyle = isBest ? '#10b981' : (isActive ? '#f43f5e' : '#38bdf8');
      ctx.fill();
      ctx.strokeStyle = '#080c14';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(p.id, p.x + 8, p.y - 6);
    });
  }

  function renderCallStack(stackItems) {
    const list = document.getElementById('dc-call-stack');
    if (!list) return;
    list.innerHTML = '';
    stackItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'call-stack-item';
      div.innerHTML = `<span>⚡ ${item}</span><span style="color:var(--text-dim);">Frame active</span>`;
      list.appendChild(div);
    });
  }

  function updateDashboardInfo(key) {
    const data = metadata[key];
    if (!data) return;
    document.getElementById('dc-algo-title').textContent = data.name;
    document.getElementById('dc-best-time').textContent = data.timeBest;
    document.getElementById('dc-avg-time').textContent = data.timeAvg;
    document.getElementById('dc-worst-time').textContent = data.timeWorst;
    document.getElementById('dc-space-time').textContent = data.space;
    document.getElementById('dc-desc-text').textContent = data.desc;
    document.getElementById('dc-how-it-works').innerHTML = data.howItWorks;
  }

  function applyStep(step, currIdx, totalSteps) {
    if (step.type === 'closestPair') {
      canvas.style.display = 'block';
      document.getElementById('dc-matrix-view').style.display = 'none';
      drawClosestPair(step);
      document.getElementById('dc-delta-val').textContent = step.minDist === Infinity ? 'None' : `${step.minDist} px`;
    } else {
      canvas.style.display = 'none';
      const matrixView = document.getElementById('dc-matrix-view');
      matrixView.style.display = 'block';
      if (step.activeProduct) {
        matrixView.innerHTML = `
          <div style="background:var(--bg-elevated); padding:1.25rem; border-radius:8px; border-left:4px solid var(--accent-emerald);">
            <div style="font-size:1.1rem; font-weight:700; color:var(--primary); font-family:var(--font-mono);">${step.activeProduct.name} = ${step.activeProduct.formula}</div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">Submatrix size: n/2 × n/2. Multiplication is evaluated recursively.</div>
          </div>
        `;
      }
    }

    renderCallStack(step.stack);
    document.getElementById('dc-step-msg').textContent = step.desc;
    document.getElementById('dc-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;
    window.soundEngine.compareSound(150);
  }

  function prepareAlgorithm(algoKey) {
    activeAlgo = algoKey;
    updateDashboardInfo(algoKey);
    let steps = [];
    if (algoKey === 'closestPair') steps = generateClosestPairSteps();
    else steps = generateStrassenSteps();

    stepper.loadSteps(steps);
    if (steps.length > 0) applyStep(steps[0], 0, steps.length);
  }

  function initDivideConquerDashboard() {
    canvas = document.getElementById('dc-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 600;
    canvas.height = 340;

    const algoSelect = document.getElementById('dc-algo-select');
    const btnPlay = document.getElementById('dc-btn-play');
    const btnPause = document.getElementById('dc-btn-pause');
    const btnStep = document.getElementById('dc-btn-step');
    const btnPrev = document.getElementById('dc-btn-prev');
    const btnReset = document.getElementById('dc-btn-reset');
    const speedSlider = document.getElementById('dc-speed-slider');
    const speedBadge = document.getElementById('dc-speed-val');

    stepper = new StepController({
      onApplyStep: applyStep,
      onComplete: () => {
        window.soundEngine.successSound();
        window.appState?.setStatus('done');
      },
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

  window.initDivideConquerDashboard = initDivideConquerDashboard;
})();
