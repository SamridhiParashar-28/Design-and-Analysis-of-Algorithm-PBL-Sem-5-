/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 4: Greedy Algorithms Dashboard
 * Algorithms: Huffman Coding, Fractional Knapsack, 0/1 Knapsack (Greedy vs Optimal)
 */

(function () {
  let activeTab = 'huffman'; // 'huffman' | 'fractional' | 'knapsack01'
  let stepper = null;

  // Metadata
  const metadata = {
    huffman: {
      name: "Huffman Coding (Greedy Data Compression)",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)",
      desc: "Lossless data compression algorithm assigning variable-length prefix codes based on character frequencies.",
      howItWorks: "1. Create leaf nodes for each character and insert into Min-Priority Queue.<br>2. Extract two nodes with lowest frequencies.<br>3. Create new internal node with sum of their frequencies as parent.<br>4. Re-insert parent into priority queue.<br>5. Repeat until 1 node remains (Huffman Tree root).<br>6. Assign '0' to left branch and '1' to right branch to generate prefix codes."
    },
    fractional: {
      name: "Fractional Knapsack (Greedy Strategy)",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(1)",
      desc: "Items can be broken into smaller fractions. Greedy approach by value-to-weight ratio yields PROVABLY OPTIMAL solution.",
      howItWorks: "1. Calculate ratio (value / weight) for each item.<br>2. Sort items descending by ratio.<br>3. Greedily take whole items as long as remaining capacity allows.<br>4. If current item exceeds capacity, take the exact fraction that fits.<br>Achieves maximum possible value."
    },
    knapsack01: {
      name: "0/1 Knapsack (Greedy Approximation vs DP)",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(1)",
      desc: "Demonstrates that pure Greedy heuristic FAILS on 0/1 Knapsack because items cannot be split.",
      howItWorks: "1. Greedy heuristic sorts items by value/weight ratio and takes what fits.<br>2. Counterexample shown: A greedy choice might take a small high-ratio item and prevent packing two slightly lower-ratio items that yield a much higher combined value!<br>3. This proves why 0/1 Knapsack requires Dynamic Programming (O(n×W)), unlike Fractional Knapsack."
    }
  };

  // --- HUFFMAN CODING IMPLEMENTATION ---
  class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }

  function generateHuffmanSteps(freqInput) {
    const history = [];
    // Parse frequencies e.g. "A:45, B:13, C:12, D:16, E:9, F:5"
    const pairs = freqInput.split(',').map(s => {
      const parts = s.trim().split(':');
      return { char: parts[0].trim(), freq: parseInt(parts[1], 10) || 1 };
    }).filter(p => p.char && !isNaN(p.freq));

    let nodes = pairs.map(p => new HuffmanNode(p.char, p.freq));
    nodes.sort((a, b) => a.freq - b.freq);

    history.push({
      forest: nodes.map(n => ({ char: n.char, freq: n.freq })),
      activeMerge: [],
      codes: {},
      avgLen: 0,
      desc: `Created ${nodes.length} leaf nodes and sorted into priority queue by frequency.`
    });

    let stepNum = 1;
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      const parent = new HuffmanNode(null, left.freq + right.freq, left, right);

      history.push({
        forest: nodes.map(n => ({ char: n.char || 'Internal', freq: n.freq })),
        activeMerge: [
          { char: left.char || 'Internal', freq: left.freq },
          { char: right.char || 'Internal', freq: right.freq },
          { char: 'Parent', freq: parent.freq }
        ],
        codes: {},
        avgLen: 0,
        desc: `Step ${stepNum++}: Extracted two lowest frequencies (${left.freq} & ${right.freq}). Merged into parent of frequency ${parent.freq}.`
      });

      nodes.push(parent);
    }

    const root = nodes[0];
    const codes = {};

    function assignCodes(node, code) {
      if (!node) return;
      if (node.char !== null) {
        codes[node.char] = code || '0';
        return;
      }
      assignCodes(node.left, code + '0');
      assignCodes(node.right, code + '1');
    }
    assignCodes(root, '');

    // Calculate weighted average code length
    let totalFreq = 0;
    let weightedBits = 0;
    pairs.forEach(p => {
      totalFreq += p.freq;
      weightedBits += p.freq * (codes[p.char]?.length || 0);
    });
    const avgLen = (weightedBits / totalFreq).toFixed(2);

    history.push({
      forest: [{ char: 'Root', freq: root.freq }],
      activeMerge: [],
      codes,
      avgLen,
      desc: `Huffman Tree complete! Binary prefix codes assigned. Average code length: ${avgLen} bits/char.`
    });

    return history;
  }

  // --- FRACTIONAL & 0/1 KNAPSACK IMPLEMENTATION ---
  function generateKnapsackSteps(items, capacity, isFractional = true) {
    const history = [];
    const sorted = items.map((it, idx) => ({
      id: idx + 1,
      name: it.name || `Item ${idx + 1}`,
      w: it.w,
      v: it.v,
      ratio: (it.v / it.w).toFixed(2)
    })).sort((a, b) => (b.v / b.w) - (a.v / a.w));

    let currentCap = capacity;
    let totalVal = 0;
    const taken = [];

    history.push({
      items: sorted.map(i => ({ ...i, status: 'unseen', fraction: 0 })),
      currentCap,
      totalVal,
      capacity,
      desc: `Knapsack initialized (Capacity = ${capacity}kg). Items sorted descending by Value/Weight ratio.`
    });

    for (let i = 0; i < sorted.length; i++) {
      const it = sorted[i];

      if (currentCap >= it.w) {
        currentCap -= it.w;
        totalVal += it.v;
        taken.push({ ...it, status: 'taken', fraction: 1 });

        history.push({
          items: sorted.map(orig => {
            const found = taken.find(t => t.id === orig.id);
            return found ? found : (orig.id === it.id ? { ...orig, status: 'taken', fraction: 1 } : { ...orig, status: 'unseen', fraction: 0 });
          }),
          currentCap,
          totalVal,
          capacity,
          desc: `Took 100% of ${it.name} (w: ${it.w}kg, v: $${it.v}). Remaining capacity: ${currentCap}kg.`
        });
      } else if (currentCap > 0) {
        if (isFractional) {
          const frac = (currentCap / it.w);
          const gainedVal = it.v * frac;
          totalVal += gainedVal;
          taken.push({ ...it, status: 'partial', fraction: frac });
          currentCap = 0;

          history.push({
            items: sorted.map(orig => {
              const found = taken.find(t => t.id === orig.id);
              return found ? found : (orig.id === it.id ? { ...orig, status: 'partial', fraction: frac } : { ...orig, status: 'unseen', fraction: 0 });
            }),
            currentCap,
            totalVal: Math.round(totalVal * 10) / 10,
            capacity,
            desc: `Took ${(frac * 100).toFixed(1)}% of ${it.name} (w: ${it.w}kg, v: $${it.v}). Capacity full!`
          });
        } else {
          // 0/1 Greedy skips items that don't fit
          taken.push({ ...it, status: 'rejected', fraction: 0 });
          history.push({
            items: sorted.map(orig => {
              const found = taken.find(t => t.id === orig.id);
              return found ? found : (orig.id === it.id ? { ...orig, status: 'rejected', fraction: 0 } : { ...orig, status: 'unseen', fraction: 0 });
            }),
            currentCap,
            totalVal,
            capacity,
            desc: `Item ${it.name} (w: ${it.w}kg) exceeds remaining capacity (${currentCap}kg) and CANNOT be split. Skipped!`
          });
        }
      } else {
        taken.push({ ...it, status: 'rejected', fraction: 0 });
      }
    }

    history.push({
      items: sorted.map(orig => {
        const found = taken.find(t => t.id === orig.id);
        return found ? found : { ...orig, status: 'rejected', fraction: 0 };
      }),
      currentCap,
      totalVal: Math.round(totalVal * 10) / 10,
      capacity,
      desc: `${isFractional ? 'Fractional Knapsack' : '0/1 Knapsack (Greedy)'} finished. Total packed value: $${Math.round(totalVal * 10) / 10}.`
    });

    return history;
  }

  // UI Renderers
  function renderHuffman(step) {
    const stage = document.getElementById('greedy-stage-huffman');
    const tableContainer = document.getElementById('huffman-codes-table');
    if (!stage) return;

    let html = `<div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; padding:1.5rem 0;">`;
    step.forest.forEach(f => {
      html += `
        <div style="background:var(--bg-elevated); border:1px solid var(--border-accent); border-radius:8px; padding:12px 18px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-dim);">${f.char || 'Internal'}</div>
          <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:700; color:var(--primary);">${f.freq}</div>
        </div>
      `;
    });
    html += `</div>`;
    stage.innerHTML = html;

    if (Object.keys(step.codes).length > 0) {
      let tableHtml = `
        <table class="data-table">
          <thead><tr><th>Char</th><th>Frequency</th><th>Binary Prefix Code</th><th>Bits</th></tr></thead>
          <tbody>
      `;
      for (const [char, code] of Object.entries(step.codes)) {
        tableHtml += `
          <tr>
            <td><strong>${char}</strong></td>
            <td>-</td>
            <td><code style="color:var(--accent-emerald); font-weight:bold;">${code}</code></td>
            <td>${code.length}</td>
          </tr>
        `;
      }
      tableHtml += `</tbody></table>`;
      tableContainer.innerHTML = tableHtml;
      document.getElementById('greedy-stat-extra').textContent = `${step.avgLen} bpc`;
    }
  }

  function renderKnapsack(step) {
    const itemsGrid = document.getElementById('knapsack-items-grid');
    const progress = document.getElementById('knapsack-progress-bar');
    const capLabel = document.getElementById('knapsack-cap-text');
    if (!itemsGrid) return;

    itemsGrid.innerHTML = '';
    step.items.forEach(it => {
      const card = document.createElement('div');
      card.className = `knapsack-item-card ${it.status}`;
      card.innerHTML = `
        <div style="font-size:0.8rem; font-weight:700; color:#fff;">${it.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin:4px 0;">W: ${it.w}kg | V: $${it.v}</div>
        <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--primary);">Ratio: ${it.ratio}</div>
        <div style="font-size:0.7rem; font-weight:700; margin-top:4px; color:${it.status === 'taken' ? '#10b981' : (it.status === 'partial' ? '#f59e0b' : '#94a3b8')};">
          ${it.status === 'taken' ? '100% Taken' : (it.status === 'partial' ? `${Math.round(it.fraction * 100)}% Taken` : (it.status === 'rejected' ? 'Skipped' : 'Pending'))}
        </div>
      `;
      itemsGrid.appendChild(card);
    });

    const used = step.capacity - step.currentCap;
    const percent = Math.min(100, (used / step.capacity) * 100);
    progress.style.width = `${percent}%`;
    capLabel.textContent = `${used.toFixed(1)} / ${step.capacity} kg (${percent.toFixed(0)}%)`;

    document.getElementById('greedy-total-val').textContent = `$${step.totalVal}`;
  }

  function updateDashboardInfo(key) {
    const data = metadata[key];
    if (!data) return;
    document.getElementById('greedy-algo-title').textContent = data.name;
    document.getElementById('greedy-best-time').textContent = data.timeBest;
    document.getElementById('greedy-avg-time').textContent = data.timeAvg;
    document.getElementById('greedy-worst-time').textContent = data.timeWorst;
    document.getElementById('greedy-space-time').textContent = data.space;
    document.getElementById('greedy-desc-text').textContent = data.desc;
    document.getElementById('greedy-how-it-works').innerHTML = data.howItWorks;
  }

  function applyStep(step, currIdx, totalSteps) {
    if (activeTab === 'huffman') renderHuffman(step);
    else renderKnapsack(step);

    document.getElementById('greedy-step-msg').textContent = step.desc;
    document.getElementById('greedy-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;
    window.soundEngine.compareSound(120);
  }

  function prepareAlgorithm(algoKey) {
    activeTab = algoKey;
    updateDashboardInfo(algoKey);

    const huffmanContainer = document.getElementById('greedy-huffman-section');
    const knapsackContainer = document.getElementById('greedy-knapsack-section');

    let steps = [];
    if (algoKey === 'huffman') {
      huffmanContainer.style.display = 'block';
      knapsackContainer.style.display = 'none';
      const input = document.getElementById('greedy-freq-input').value;
      steps = generateHuffmanSteps(input);
    } else {
      huffmanContainer.style.display = 'none';
      knapsackContainer.style.display = 'block';
      const defaultItems = [
        { name: "Laptop", w: 3, v: 120 },
        { name: "Camera", w: 2, v: 80 },
        { name: "Gold Bar", w: 5, v: 300 },
        { name: "Artwork", w: 4, v: 140 },
        { name: "Tablet", w: 1, v: 60 }
      ];
      const cap = parseInt(document.getElementById('knapsack-cap-input').value, 10) || 8;
      steps = generateKnapsackSteps(defaultItems, cap, algoKey === 'fractional');
    }

    stepper.loadSteps(steps);
    if (steps.length > 0) applyStep(steps[0], 0, steps.length);
  }

  function initGreedyDashboard() {
    const algoSelect = document.getElementById('greedy-algo-select');
    const btnPlay = document.getElementById('greedy-btn-play');
    const btnPause = document.getElementById('greedy-btn-pause');
    const btnStep = document.getElementById('greedy-btn-step');
    const btnPrev = document.getElementById('greedy-btn-prev');
    const btnReset = document.getElementById('greedy-btn-reset');
    const btnApply = document.getElementById('greedy-btn-apply');
    const speedSlider = document.getElementById('greedy-speed-slider');
    const speedBadge = document.getElementById('greedy-speed-val');

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
    btnApply.addEventListener('click', () => prepareAlgorithm(algoSelect.value));

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

  window.initGreedyDashboard = initGreedyDashboard;
})();
