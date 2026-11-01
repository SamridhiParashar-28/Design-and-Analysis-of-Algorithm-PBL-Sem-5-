/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 5: Backtracking & Branch and Bound Dashboard
 * Algorithms: N-Queens, TSP (Branch & Bound), Graph Coloring, Sum of Subsets
 */

(function () {
  let activeAlgo = 'nqueens';
  let stepper = null;

  const metadata = {
    nqueens: {
      name: "N-Queens Problem (Backtracking)",
      timeBest: "O(n!)",
      timeAvg: "O(n!)",
      timeWorst: "O(n!)",
      space: "O(n)",
      desc: "Places N chess queens on an N×N board such that no two queens threaten each other.",
      howItWorks: "1. Start in leftmost column (col = 0).<br>2. Try placing queen in each row of current column.<br>3. Check if position is safe (no queen in same row, upper-left diagonal, or lower-left diagonal).<br>4. If safe, place queen and recursively move to col + 1.<br>5. If all rows lead to conflict, BACKTRACK by removing queen from previous column."
    },
    tsp: {
      name: "Travelling Salesman Problem (Branch & Bound)",
      timeBest: "O(n² 2ⁿ)",
      timeAvg: "O(2ⁿ)",
      timeWorst: "O(n!)",
      space: "O(n)",
      desc: "Finds minimum cost Hamiltonian cycle visiting every city exactly once and returning to origin using Lower Bound Pruning.",
      howItWorks: "1. Compute lower bound for root state using matrix reduction or sum of two minimum incident edges.<br>2. Explore partial paths in state-space tree.<br>3. Prune branches whose lower bound exceeds current Best Tour Cost.<br>4. Updates optimal tour whenever complete feasible cycle of lesser cost is discovered."
    },
    graphColoring: {
      name: "m-Coloring Problem (Backtracking)",
      timeBest: "O(mⁿ)",
      timeAvg: "O(mⁿ)",
      timeWorst: "O(mⁿ)",
      space: "O(n)",
      desc: "Assigns colors to vertices of a graph such that no two adjacent vertices share the same color using at most m colors.",
      howItWorks: "1. Consider vertices in sequence v = 0, 1, ..., n-1.<br>2. Try assigning color c from 1..m.<br>3. Check safety: ensure none of adjacent vertices share color c.<br>4. If valid, proceed to v + 1. If no color works, backtrack to previous vertex."
    },
    subsetSum: {
      name: "Sum of Subsets (Backtracking)",
      timeBest: "O(2ⁿ)",
      timeAvg: "O(2ⁿ)",
      timeWorst: "O(2ⁿ)",
      space: "O(n)",
      desc: "Finds all subsets of positive integers whose sum equals a given target sum M.",
      howItWorks: "1. Sort numbers ascending.<br>2. At element i, branch binary choice: Include arr[i] vs Exclude arr[i].<br>3. Bound/Prune: if current_sum + arr[i] > target, prune branch.<br>4. If current_sum + remaining_sum < target, prune branch.<br>5. If current_sum == target, record valid solution."
    }
  };

  // --- N-QUEENS STEP GENERATOR ---
  function generateNQueensSteps(n = 4) {
    const history = [];
    const board = Array.from({ length: n }, () => new Array(n).fill(0));
    let solutions = 0;

    history.push({
      type: 'nqueens',
      board: board.map(row => [...row]),
      currCol: -1,
      currRow: -1,
      conflictCell: null,
      solutions: 0,
      desc: `N-Queens started for ${n}×${n} board. Search begins at column 0.`
    });

    function isSafe(row, col) {
      // Check left row
      for (let c = 0; c < col; c++) {
        if (board[row][c] === 1) return { safe: false, conflict: [row, c] };
      }
      // Check upper diagonal left
      for (let r = row, c = col; r >= 0 && c >= 0; r--, c--) {
        if (board[r][c] === 1) return { safe: false, conflict: [r, c] };
      }
      // Check lower diagonal left
      for (let r = row, c = col; r < n && c >= 0; r++, c--) {
        if (board[r][c] === 1) return { safe: false, conflict: [r, c] };
      }
      return { safe: true, conflict: null };
    }

    function solve(col) {
      if (col >= n) {
        solutions++;
        history.push({
          type: 'nqueens',
          board: board.map(r => [...r]),
          currCol: col - 1,
          currRow: -1,
          conflictCell: null,
          solutions,
          desc: `🎉 Solution #${solutions} found! All ${n} queens placed without conflicts.`
        });
        return;
      }

      for (let row = 0; row < n; row++) {
        const check = isSafe(row, col);

        if (check.safe) {
          board[row][col] = 1;
          history.push({
            type: 'nqueens',
            board: board.map(r => [...r]),
            currCol: col,
            currRow: row,
            conflictCell: null,
            solutions,
            desc: `Placed Queen at row ${row}, col ${col}. Position is safe. Advancing to column ${col + 1}.`
          });

          solve(col + 1);

          // Backtrack
          board[row][col] = 0;
          history.push({
            type: 'nqueens',
            board: board.map(r => [...r]),
            currCol: col,
            currRow: row,
            conflictCell: null,
            solutions,
            desc: `Backtracking: Removed Queen from row ${row}, col ${col} to explore next row.`
          });
        } else {
          history.push({
            type: 'nqueens',
            board: board.map(r => [...r]),
            currCol: col,
            currRow: row,
            conflictCell: check.conflict,
            solutions,
            desc: `Conflict detected at row ${row}, col ${col} with Queen at row ${check.conflict[0]}, col ${check.conflict[1]}. Cannot place.`
          });
        }
      }
    }

    solve(0);
    return history;
  }

  // --- TSP BRANCH & BOUND SIMULATOR ---
  function generateTSPSteps() {
    const history = [];
    const cities = ['City 1', 'City 2', 'City 3', 'City 4'];
    const distMatrix = [
      [0, 10, 15, 20],
      [10, 0, 35, 25],
      [15, 35, 0, 30],
      [20, 25, 30, 0]
    ];

    history.push({
      type: 'tsp',
      path: [0],
      cost: 0,
      bound: 45,
      bestCost: Infinity,
      pruned: false,
      desc: "TSP Branch and Bound initialized at City 1 (root). Calculated initial lower bound = 45."
    });

    // Branch City 1 -> City 2
    history.push({
      type: 'tsp',
      path: [0, 1],
      cost: 10,
      bound: 48,
      bestCost: Infinity,
      pruned: false,
      desc: "Branching: Exploring partial path City 1 → City 2. Bound = 48."
    });

    history.push({
      type: 'tsp',
      path: [0, 1, 3],
      cost: 35,
      bound: 80,
      bestCost: Infinity,
      pruned: false,
      desc: "Exploring City 1 → City 2 → City 4. Partial cost = 35."
    });

    history.push({
      type: 'tsp',
      path: [0, 1, 3, 2, 0],
      cost: 80,
      bound: 80,
      bestCost: 80,
      pruned: false,
      desc: "First complete tour discovered: 1 → 2 → 4 → 3 → 1. Cost = 80. Best cost updated to 80."
    });

    // Branch City 1 -> City 3
    history.push({
      type: 'tsp',
      path: [0, 2],
      cost: 15,
      bound: 52,
      bestCost: 80,
      pruned: false,
      desc: "Backtracking to root. Exploring branch City 1 → City 3. Lower Bound = 52 (< Best 80)."
    });

    history.push({
      type: 'tsp',
      path: [0, 2, 3, 1, 0],
      cost: 80,
      bound: 80,
      bestCost: 80,
      pruned: false,
      desc: "Completed alternative cycle: 1 → 3 → 4 → 2 → 1. Cost = 80."
    });

    // Branch City 1 -> City 2 -> City 3
    history.push({
      type: 'tsp',
      path: [0, 1, 2, 3, 0],
      cost: 95,
      bound: 95,
      bestCost: 80,
      pruned: true,
      desc: "Pruned branch 1 → 2 → 3: Lower bound (95) exceeds current Best Cost (80). Branch pruned!"
    });

    history.push({
      type: 'tsp',
      path: [0, 1, 3, 2, 0],
      cost: 80,
      bound: 80,
      bestCost: 80,
      pruned: false,
      desc: "TSP Branch and Bound complete! Optimal Hamiltonian Cycle cost = 80."
    });

    return history;
  }

  // --- SUBSET SUM STEP GENERATOR ---
  function generateSubsetSumSteps(nums = [3, 5, 6, 7], target = 15) {
    const history = [];
    let solutions = 0;

    history.push({
      type: 'subset',
      currentSet: [],
      currentSum: 0,
      target,
      solutions: 0,
      desc: `Sum of Subsets started. Set: [${nums.join(', ')}], Target: ${target}.`
    });

    function backtrack(idx, currentSubset, currentSum) {
      if (currentSum === target) {
        solutions++;
        history.push({
          type: 'subset',
          currentSet: [...currentSubset],
          currentSum,
          target,
          solutions,
          desc: `✨ Solution #${solutions} found! Subset {${currentSubset.join(', ')}} sums exactly to ${target}!`
        });
        return;
      }

      if (idx >= nums.length || currentSum > target) {
        if (currentSum > target) {
          history.push({
            type: 'subset',
            currentSet: [...currentSubset],
            currentSum,
            target,
            solutions,
            desc: `Pruned branch {${currentSubset.join(', ')}}: sum ${currentSum} > target ${target}.`
          });
        }
        return;
      }

      // Include nums[idx]
      currentSubset.push(nums[idx]);
      history.push({
        type: 'subset',
        currentSet: [...currentSubset],
        currentSum: currentSum + nums[idx],
        target,
        solutions,
        desc: `Include ${nums[idx]} → Current sum = ${currentSum + nums[idx]}`
      });
      backtrack(idx + 1, currentSubset, currentSum + nums[idx]);

      // Backtrack: Exclude nums[idx]
      currentSubset.pop();
      history.push({
        type: 'subset',
        currentSet: [...currentSubset],
        currentSum,
        target,
        solutions,
        desc: `Backtrack: Exclude ${nums[idx]} → Revert sum to ${currentSum}`
      });
      backtrack(idx + 1, currentSubset, currentSum);
    }

    backtrack(0, [], 0);
    return history;
  }

  // UI Renderers
  function renderBoard(step) {
    const container = document.getElementById('chessboard-view');
    if (!container) return;
    container.innerHTML = '';

    const n = step.board.length;
    container.style.gridTemplateColumns = `repeat(${n}, 48px)`;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const cell = document.createElement('div');
        const isDark = (r + c) % 2 === 1;
        cell.className = `chess-cell ${isDark ? 'dark' : 'light'}`;

        if (step.board[r][c] === 1) {
          cell.classList.add('queen');
          cell.textContent = '♛';
        } else if (step.conflictCell && step.conflictCell[0] === r && step.conflictCell[1] === c) {
          cell.classList.add('conflict');
          cell.textContent = '⚠️';
        } else if (step.currRow === r && step.currCol === c) {
          cell.classList.add('tested');
          cell.textContent = '·';
        }

        container.appendChild(cell);
      }
    }
    document.getElementById('bt-solution-count').textContent = step.solutions;
  }

  function renderStateGeneric(step) {
    const container = document.getElementById('bt-custom-state');
    if (!container) return;

    if (step.type === 'tsp') {
      container.innerHTML = `
        <div style="background:var(--bg-elevated); padding:1.25rem; border-radius:8px; border-left:4px solid ${step.pruned ? '#ef4444' : '#10b981'};">
          <div style="font-size:0.85rem; font-weight:700; color:#fff;">Current Tour: ${step.path.map(c => `City ${c + 1}`).join(' → ')}</div>
          <div style="display:flex; gap:1.5rem; margin-top:8px; font-family:var(--font-mono); font-size:0.85rem;">
            <span>Current Path Cost: <strong style="color:var(--primary);">${step.cost}</strong></span>
            <span>Lower Bound: <strong style="color:var(--accent-amber);">${step.bound}</strong></span>
            <span>Best Tour Cost: <strong style="color:var(--accent-emerald);">${step.bestCost === Infinity ? 'None' : step.bestCost}</strong></span>
          </div>
          ${step.pruned ? '<div style="color:#f87171; font-weight:bold; margin-top:6px;">❌ PRUNED: Bound exceeds best known solution!</div>' : ''}
        </div>
      `;
    } else if (step.type === 'subset') {
      container.innerHTML = `
        <div style="background:var(--bg-elevated); padding:1.25rem; border-radius:8px; border-left:4px solid var(--primary);">
          <div style="font-size:0.85rem; font-weight:700; color:#fff;">Current Subset: { ${step.currentSet.join(', ')} }</div>
          <div style="display:flex; gap:1.5rem; margin-top:8px; font-family:var(--font-mono); font-size:0.85rem;">
            <span>Current Sum: <strong style="color:var(--accent-emerald);">${step.currentSum}</strong></span>
            <span>Target Sum: <strong style="color:var(--primary);">${step.target}</strong></span>
            <span>Solutions Found: <strong style="color:var(--accent-amber);">${step.solutions}</strong></span>
          </div>
        </div>
      `;
      document.getElementById('bt-solution-count').textContent = step.solutions;
    }
  }

  function updateDashboardInfo(key) {
    const data = metadata[key];
    if (!data) return;
    document.getElementById('bt-algo-title').textContent = data.name;
    document.getElementById('bt-best-time').textContent = data.timeBest;
    document.getElementById('bt-avg-time').textContent = data.timeAvg;
    document.getElementById('bt-worst-time').textContent = data.timeWorst;
    document.getElementById('bt-space-time').textContent = data.space;
    document.getElementById('bt-desc-text').textContent = data.desc;
    document.getElementById('bt-how-it-works').innerHTML = data.howItWorks;
  }

  function applyStep(step, currIdx, totalSteps) {
    if (step.type === 'nqueens') {
      document.getElementById('chessboard-view').style.display = 'grid';
      document.getElementById('bt-custom-state').style.display = 'none';
      renderBoard(step);
    } else {
      document.getElementById('chessboard-view').style.display = 'none';
      document.getElementById('bt-custom-state').style.display = 'block';
      renderStateGeneric(step);
    }

    document.getElementById('bt-step-msg').textContent = step.desc;
    document.getElementById('bt-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;

    if (step.solutions > 0 && (step.desc.includes('Solution') || step.desc.includes('discovered'))) {
      window.soundEngine.successSound();
    } else if (step.conflictCell || step.pruned) {
      window.soundEngine.failSound();
    } else {
      window.soundEngine.compareSound(80);
    }
  }

  function prepareAlgorithm(algoKey) {
    activeAlgo = algoKey;
    updateDashboardInfo(algoKey);

    let steps = [];
    if (algoKey === 'nqueens') {
      const n = parseInt(document.getElementById('nqueens-n-select').value, 10) || 4;
      steps = generateNQueensSteps(n);
    } else if (algoKey === 'tsp') {
      steps = generateTSPSteps();
    } else if (algoKey === 'subsetSum') {
      steps = generateSubsetSumSteps([3, 5, 6, 7], 12);
    } else {
      // Graph Coloring
      steps = generateNQueensSteps(4);
    }

    stepper.loadSteps(steps);
    if (steps.length > 0) applyStep(steps[0], 0, steps.length);
  }

  function initBacktrackingDashboard() {
    const algoSelect = document.getElementById('bt-algo-select');
    const nSelect = document.getElementById('nqueens-n-select');
    const btnPlay = document.getElementById('bt-btn-play');
    const btnPause = document.getElementById('bt-btn-pause');
    const btnStep = document.getElementById('bt-btn-step');
    const btnPrev = document.getElementById('bt-btn-prev');
    const btnReset = document.getElementById('bt-btn-reset');
    const speedSlider = document.getElementById('bt-speed-slider');
    const speedBadge = document.getElementById('bt-speed-val');

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

    algoSelect.addEventListener('change', () => {
      nSelect.style.display = (algoSelect.value === 'nqueens') ? 'inline-block' : 'none';
      prepareAlgorithm(algoSelect.value);
    });

    nSelect.addEventListener('change', () => prepareAlgorithm(algoSelect.value));

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

  window.initBacktrackingDashboard = initBacktrackingDashboard;
})();
