/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 2: Searching Algorithms Dashboard
 * Algorithms: Linear Search, Binary Search
 */

(function () {
  let array = [];
  let target = 42;
  let stepper = null;

  const metadata = {
    linear: {
      name: "Linear Search (Sequential Search)",
      timeBest: "O(1)",
      timeAvg: "O(n)",
      timeWorst: "O(n)",
      space: "O(1)",
      desc: "Sequentially checks each element of the list until a match is found or the whole list has been searched.",
      howItWorks: "1. Start from index 0.<br>2. Compare arr[i] with target.<br>3. If arr[i] == target, return index (successful search).<br>4. If end of array is reached without finding target, element is not present.<br>Does NOT require sorted input."
    },
    binary: {
      name: "Binary Search (Divide & Conquer Search)",
      timeBest: "O(1)",
      timeAvg: "O(log n)",
      timeWorst: "O(log n)",
      space: "O(1)",
      desc: "Efficient search that halves the search space at every step. REQUIRES SORTED ARRAY.",
      howItWorks: "1. Set low = 0, high = n-1.<br>2. Calculate mid = Math.floor((low + high) / 2).<br>3. If arr[mid] == target, element found!<br>4. If target < arr[mid], discard right half (high = mid - 1).<br>5. If target > arr[mid], discard left half (low = mid + 1).<br>6. Repeat until found or low > high."
    }
  };

  function generateLinearSteps(arr, targetVal) {
    const history = [];
    let comparisons = 0;
    let found = false;

    history.push({
      array: [...arr],
      checking: -1,
      low: -1, mid: -1, high: -1,
      eliminated: [],
      foundIdx: -1,
      comparisons: 0,
      desc: `Linear Search started for target = ${targetVal}. Checking elements sequentially from left to right.`
    });

    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      if (arr[i] === targetVal) {
        history.push({
          array: [...arr],
          checking: i,
          low: -1, mid: -1, high: -1,
          eliminated: [],
          foundIdx: i,
          comparisons,
          desc: `Match found! arr[${i}] = ${arr[i]} equals target ${targetVal} after ${comparisons} comparison(s).`
        });
        found = true;
        break;
      } else {
        history.push({
          array: [...arr],
          checking: i,
          low: -1, mid: -1, high: -1,
          eliminated: Array.from({ length: i + 1 }, (_, k) => k),
          foundIdx: -1,
          comparisons,
          desc: `Checking arr[${i}] (${arr[i]}) ≠ target (${targetVal}). Moving to next index.`
        });
      }
    }

    if (!found) {
      history.push({
        array: [...arr],
        checking: -1,
        low: -1, mid: -1, high: -1,
        eliminated: arr.map((_, i) => i),
        foundIdx: -1,
        comparisons,
        desc: `Target ${targetVal} not found in array after searching all ${arr.length} elements.`
      });
    }

    return history;
  }

  function generateBinarySteps(arr, targetVal) {
    const history = [];
    let comparisons = 0;
    let low = 0;
    let high = arr.length - 1;
    let found = false;
    const eliminated = new Set();

    history.push({
      array: [...arr],
      checking: -1,
      low, mid: -1, high,
      eliminated: [],
      foundIdx: -1,
      comparisons: 0,
      desc: `Binary Search started for target = ${targetVal}. Initial interval: [${low}..${high}].`
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      comparisons++;

      history.push({
        array: [...arr],
        checking: mid,
        low, mid, high,
        eliminated: Array.from(eliminated),
        foundIdx: -1,
        comparisons,
        desc: `Calculated mid = floor((${low} + ${high}) / 2) = ${mid}. Comparing arr[${mid}] (${arr[mid]}) with target ${targetVal}.`
      });

      if (arr[mid] === targetVal) {
        found = true;
        history.push({
          array: [...arr],
          checking: mid,
          low, mid, high,
          eliminated: Array.from(eliminated),
          foundIdx: mid,
          comparisons,
          desc: `Target ${targetVal} found at index ${mid}! Completed in ${comparisons} step(s).`
        });
        break;
      } else if (targetVal < arr[mid]) {
        // Discard right half
        for (let k = mid; k <= high; k++) eliminated.add(k);
        history.push({
          array: [...arr],
          checking: mid,
          low, mid, high,
          eliminated: Array.from(eliminated),
          foundIdx: -1,
          comparisons,
          desc: `Since target (${targetVal}) < arr[${mid}] (${arr[mid]}), discarding right half [${mid}..${high}]. Setting high = ${mid - 1}.`
        });
        high = mid - 1;
      } else {
        // Discard left half
        for (let k = low; k <= mid; k++) eliminated.add(k);
        history.push({
          array: [...arr],
          checking: mid,
          low, mid, high,
          eliminated: Array.from(eliminated),
          foundIdx: -1,
          comparisons,
          desc: `Since target (${targetVal}) > arr[${mid}] (${arr[mid]}), discarding left half [${low}..${mid}]. Setting low = ${mid + 1}.`
        });
        low = mid + 1;
      }
    }

    if (!found) {
      history.push({
        array: [...arr],
        checking: -1,
        low, mid: -1, high,
        eliminated: arr.map((_, i) => i),
        foundIdx: -1,
        comparisons,
        desc: `Interval exhausted (low > high). Target ${targetVal} does not exist in the array.`
      });
    }

    return history;
  }

  function renderSearchBoxes(container, state) {
    container.innerHTML = '';

    state.array.forEach((val, idx) => {
      const box = document.createElement('div');
      box.className = 'search-box';
      box.textContent = val;

      const idxLabel = document.createElement('span');
      idxLabel.className = 'box-idx';
      idxLabel.textContent = `[${idx}]`;
      box.appendChild(idxLabel);

      if (state.eliminated.includes(idx)) box.classList.add('eliminated');
      if (state.checking === idx) box.classList.add('checking');
      if (state.foundIdx === idx) box.classList.add('found');

      // Pointers for Binary Search
      if (state.low === idx) {
        const ptr = document.createElement('span');
        ptr.className = 'pointer-label pointer-low';
        ptr.textContent = 'LOW';
        box.appendChild(ptr);
      }
      if (state.mid === idx) {
        const ptr = document.createElement('span');
        ptr.className = 'pointer-label pointer-mid';
        ptr.textContent = 'MID';
        box.appendChild(ptr);
      }
      if (state.high === idx) {
        const ptr = document.createElement('span');
        ptr.className = 'pointer-label pointer-high';
        ptr.textContent = 'HIGH';
        box.appendChild(ptr);
      }

      container.appendChild(box);
    });
  }

  function updateDashboardInfo(algoKey) {
    const data = metadata[algoKey];
    if (!data) return;
    document.getElementById('search-algo-title').textContent = data.name;
    document.getElementById('search-best-time').textContent = data.timeBest;
    document.getElementById('search-avg-time').textContent = data.timeAvg;
    document.getElementById('search-worst-time').textContent = data.timeWorst;
    document.getElementById('search-space-time').textContent = data.space;
    document.getElementById('search-desc-text').textContent = data.desc;
    document.getElementById('search-how-it-works').innerHTML = data.howItWorks;
  }

  function applyStep(step, currIdx, totalSteps) {
    const container = document.getElementById('search-array-container');
    renderSearchBoxes(container, step);

    document.getElementById('search-comparisons-count').textContent = step.comparisons;
    document.getElementById('search-step-msg').textContent = step.desc;
    document.getElementById('search-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;

    if (step.foundIdx !== -1) {
      window.soundEngine.successSound();
    } else if (step.checking !== -1) {
      window.soundEngine.compareSound(step.array[step.checking] || 50);
    }
  }

  function prepareAlgorithm(algoKey) {
    updateDashboardInfo(algoKey);
    const isBinary = (algoKey === 'binary');

    // If binary search and array is unsorted, ensure user is informed or auto-sort
    const sortToggle = document.getElementById('search-sort-toggle');
    if (isBinary && sortToggle.checked) {
      array.sort((a, b) => a - b);
      document.getElementById('search-custom-input').value = array.join(', ');
    }

    const steps = isBinary ? generateBinarySteps(array, target) : generateLinearSteps(array, target);
    stepper.loadSteps(steps);
    if (steps.length > 0) {
      applyStep(steps[0], 0, steps.length);
    }
  }

  function initSearchingDashboard() {
    const container = document.getElementById('search-array-container');
    const algoSelect = document.getElementById('search-algo-select');
    const customInput = document.getElementById('search-custom-input');
    const targetInput = document.getElementById('search-target-input');
    const sortToggle = document.getElementById('search-sort-toggle');
    const btnRandom = document.getElementById('search-btn-random');
    const btnApply = document.getElementById('search-btn-apply');
    const btnPlay = document.getElementById('search-btn-play');
    const btnPause = document.getElementById('search-btn-pause');
    const btnStep = document.getElementById('search-btn-step');
    const btnPrev = document.getElementById('search-btn-prev');
    const btnReset = document.getElementById('search-btn-reset');
    const speedSlider = document.getElementById('search-speed-slider');
    const speedBadge = document.getElementById('search-speed-val');

    stepper = new StepController({
      onApplyStep: applyStep,
      onComplete: () => {
        window.appState?.setStatus('done');
      },
      onStatusChange: (status) => {
        window.appState?.setStatus(status);
        btnPlay.disabled = (status === 'running');
        btnPause.disabled = (status !== 'running');
      }
    });

    function randomizeData() {
      array = ArrayUtils.generateRandom(12, 10, 99);
      if (algoSelect.value === 'binary' || sortToggle.checked) {
        array.sort((a, b) => a - b);
      }
      // Pick random element or nearby
      target = Math.random() > 0.3 ? array[Math.floor(Math.random() * array.length)] : Math.floor(Math.random() * 90) + 10;
      targetInput.value = target;
      customInput.value = array.join(', ');
      prepareAlgorithm(algoSelect.value);
    }

    algoSelect.addEventListener('change', () => {
      if (algoSelect.value === 'binary') sortToggle.checked = true;
      prepareAlgorithm(algoSelect.value);
    });

    sortToggle.addEventListener('change', () => {
      if (sortToggle.checked) {
        array.sort((a, b) => a - b);
      } else {
        // shuffle
        array.sort(() => Math.random() - 0.5);
      }
      customInput.value = array.join(', ');
      prepareAlgorithm(algoSelect.value);
    });

    btnRandom.addEventListener('click', randomizeData);

    btnApply.addEventListener('click', () => {
      array = ArrayUtils.parseCustomInput(customInput.value, 12);
      target = parseInt(targetInput.value, 10) || array[0];
      if (sortToggle.checked) array.sort((a, b) => a - b);
      customInput.value = array.join(', ');
      prepareAlgorithm(algoSelect.value);
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

    randomizeData();
  }

  window.initSearchingDashboard = initSearchingDashboard;
})();
