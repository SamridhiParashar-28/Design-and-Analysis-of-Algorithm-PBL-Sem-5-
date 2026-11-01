/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 1: Sorting Algorithms Dashboard
 * Algorithms: Bubble, Selection, Insertion, Counting, Merge, Quick, Heap Sort
 */

(function () {
  let array = [];
  let steps = [];
  let stepper = null;

  const metadata = {
    bubble: {
      name: "Bubble Sort",
      timeBest: "O(n)",
      timeAvg: "O(n²)",
      timeWorst: "O(n²)",
      space: "O(1)",
      desc: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      howItWorks: "1. Iterate from index 0 to n-1.<br>2. Compare elements at i and i+1.<br>3. If arr[i] > arr[i+1], swap them.<br>4. Repeat n passes; after each pass, the largest remaining element bubbles to its final position."
    },
    selection: {
      name: "Selection Sort",
      timeBest: "O(n²)",
      timeAvg: "O(n²)",
      timeWorst: "O(n²)",
      space: "O(1)",
      desc: "Divides input into sorted and unsorted regions, repeatedly selecting the minimum unsorted element.",
      howItWorks: "1. Find the minimum element in unsorted subarray [i..n-1].<br>2. Swap it with the element at index i.<br>3. Move the boundary between sorted and unsorted subarrays one element to the right."
    },
    insertion: {
      name: "Insertion Sort",
      timeBest: "O(n)",
      timeAvg: "O(n²)",
      timeWorst: "O(n²)",
      space: "O(1)",
      desc: "Builds sorted array one element at a time by shifting larger elements right and inserting current key.",
      howItWorks: "1. Pick next element (key = arr[i]).<br>2. Compare key with sorted subarray to its left.<br>3. Shift elements greater than key one position ahead.<br>4. Insert key into correct position."
    },
    counting: {
      name: "Counting Sort",
      timeBest: "O(n + k)",
      timeAvg: "O(n + k)",
      timeWorst: "O(n + k)",
      space: "O(k)",
      desc: "Non-comparison integer sorting algorithm that counts occurrences of each distinct key.",
      howItWorks: "1. Find the maximum value k in the input array.<br>2. Create count array of size k+1 initialized to 0.<br>3. Store count of each element.<br>4. Reconstruct original array in sorted order from counts."
    },
    merge: {
      name: "Merge Sort",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(n)",
      desc: "Classic Divide and Conquer algorithm that divides array into two halves, sorts them, and merges them.",
      howItWorks: "1. Divide: Split array into left and right halves recursively until subarrays have 1 element.<br>2. Conquer: Recursively sort left and right subarrays.<br>3. Combine: Merge the two sorted halves into one sorted array."
    },
    quick: {
      name: "Quick Sort (Lomuto Partition)",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n²)",
      space: "O(log n)",
      desc: "Picks a pivot element and partitions array so elements smaller are on left, larger on right.",
      howItWorks: "1. Pick pivot (last element).<br>2. Partition: rearrange array so elements < pivot precede it and elements > pivot follow it.<br>3. Recursively apply Quick Sort to subarrays before and after pivot."
    },
    heap: {
      name: "Heap Sort",
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "O(1)",
      desc: "Builds a max-heap from the input data, repeatedly extracts maximum element and restores heap property.",
      howItWorks: "1. Build Max-Heap from input array.<br>2. Swap root (largest element) with last element.<br>3. Reduce heap size by 1 and heapify the root.<br>4. Repeat until heap size is 1."
    }
  };

  // Step Generators
  function generateBubbleSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const history = [];
    let comparisons = 0, swaps = 0;

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: "Initial unsorted array loaded." });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        history.push({
          array: [...a],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          pivot: -1,
          comparisons,
          swaps,
          desc: `Comparing arr[${j}] (${a[j]}) and arr[${j + 1}] (${a[j + 1]})`
        });

        if (a[j] > a[j + 1]) {
          swaps++;
          const temp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = temp;
          swapped = true;
          history.push({
            array: [...a],
            comparing: [],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            pivot: -1,
            comparisons,
            swaps,
            desc: `Swapped arr[${j}] (${a[j]}) with arr[${j + 1}] (${a[j + 1]})`
          });
        }
      }
      history.push({
        array: [...a],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
        pivot: -1,
        comparisons,
        swaps,
        desc: `Element ${a[n - 1 - i]} is now placed in its sorted position.`
      });
      if (!swapped) break;
    }

    history.push({
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: a.map((_, i) => i),
      pivot: -1,
      comparisons,
      swaps,
      desc: "Sorting complete! Array is sorted."
    });
    return history;
  }

  function generateSelectionSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const history = [];
    let comparisons = 0, swaps = 0;

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: "Initial state." });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      history.push({
        array: [...a],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        pivot: minIdx,
        comparisons,
        swaps,
        desc: `Starting pass ${i + 1}: assuming minimum element is at index ${minIdx} (${a[minIdx]})`
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        history.push({
          array: [...a],
          comparing: [j, minIdx],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          pivot: minIdx,
          comparisons,
          swaps,
          desc: `Checking if arr[${j}] (${a[j]}) < current min arr[${minIdx}] (${a[minIdx]})`
        });

        if (a[j] < a[minIdx]) {
          minIdx = j;
          history.push({
            array: [...a],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: i }, (_, k) => k),
            pivot: minIdx,
            comparisons,
            swaps,
            desc: `Found new minimum element: ${a[minIdx]} at index ${minIdx}`
          });
        }
      }

      if (minIdx !== i) {
        swaps++;
        const temp = a[i];
        a[i] = a[minIdx];
        a[minIdx] = temp;
        history.push({
          array: [...a],
          comparing: [],
          swapping: [i, minIdx],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          pivot: -1,
          comparisons,
          swaps,
          desc: `Swapped minimum element ${a[i]} to index ${i}`
        });
      } else {
        history.push({
          array: [...a],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          pivot: -1,
          comparisons,
          swaps,
          desc: `Element at index ${i} (${a[i]}) already in correct position.`
        });
      }
    }

    history.push({
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: a.map((_, i) => i),
      pivot: -1,
      comparisons,
      swaps,
      desc: "Selection Sort complete!"
    });
    return history;
  }

  function generateInsertionSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const history = [];
    let comparisons = 0, swaps = 0;

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [0], pivot: -1, comparisons, swaps, desc: "Initial state: element at 0 is trivially sorted." });

    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      history.push({
        array: [...a],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        pivot: i,
        comparisons,
        swaps,
        desc: `Extracting key ${key} at index ${i} to insert into sorted prefix.`
      });

      while (j >= 0) {
        comparisons++;
        history.push({
          array: [...a],
          comparing: [j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          pivot: i,
          comparisons,
          swaps,
          desc: `Comparing key (${key}) with arr[${j}] (${a[j]})`
        });

        if (a[j] > key) {
          swaps++;
          a[j + 1] = a[j];
          history.push({
            array: [...a],
            comparing: [],
            swapping: [j, j + 1],
            sorted: [],
            pivot: -1,
            comparisons,
            swaps,
            desc: `Shifted arr[${j}] (${a[j]}) to index ${j + 1}`
          });
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
      history.push({
        array: [...a],
        comparing: [],
        swapping: [j + 1],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        pivot: -1,
        comparisons,
        swaps,
        desc: `Inserted key ${key} at position ${j + 1}`
      });
    }

    history.push({
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: a.map((_, i) => i),
      pivot: -1,
      comparisons,
      swaps,
      desc: "Insertion Sort complete!"
    });
    return history;
  }

  function generateCountingSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const history = [];
    let comparisons = 0, swaps = 0;

    const max = Math.max(...a);
    const count = new Array(max + 1).fill(0);

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: `Counting Sort started. Max element found: ${max}` });

    for (let i = 0; i < n; i++) {
      count[a[i]]++;
      history.push({
        array: [...a],
        comparing: [i],
        swapping: [],
        sorted: [],
        pivot: -1,
        comparisons,
        swaps,
        desc: `Element arr[${i}] = ${a[i]}: incremented count[${a[i]}] to ${count[a[i]]}`
      });
    }

    let writeIdx = 0;
    for (let val = 0; val <= max; val++) {
      while (count[val] > 0) {
        a[writeIdx] = val;
        count[val]--;
        swaps++;
        history.push({
          array: [...a],
          comparing: [],
          swapping: [writeIdx],
          sorted: Array.from({ length: writeIdx + 1 }, (_, k) => k),
          pivot: -1,
          comparisons,
          swaps,
          desc: `Writing value ${val} back into array at index ${writeIdx}`
        });
        writeIdx++;
      }
    }

    history.push({
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: a.map((_, i) => i),
      pivot: -1,
      comparisons,
      swaps,
      desc: "Counting Sort complete!"
    });
    return history;
  }

  function generateMergeSteps(arr) {
    const a = [...arr];
    const history = [];
    let comparisons = 0, swaps = 0;

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: "Merge Sort starting. Dividing problem recursively." });

    function mergeSortHelper(l, r) {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      mergeSortHelper(l, m);
      mergeSortHelper(m + 1, r);
      merge(l, m, r);
    }

    function merge(l, m, r) {
      const leftPart = a.slice(l, m + 1);
      const rightPart = a.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      history.push({
        array: [...a],
        comparing: [l, r],
        swapping: [],
        sorted: [],
        pivot: m,
        comparisons,
        swaps,
        desc: `Merging subarrays [${l}..${m}] and [${m + 1}..${r}]`
      });

      while (i < leftPart.length && j < rightPart.length) {
        comparisons++;
        if (leftPart[i] <= rightPart[j]) {
          a[k] = leftPart[i];
          i++;
        } else {
          a[k] = rightPart[j];
          j++;
        }
        swaps++;
        history.push({
          array: [...a],
          comparing: [k],
          swapping: [k],
          sorted: [],
          pivot: -1,
          comparisons,
          swaps,
          desc: `Placed ${a[k]} at position ${k}`
        });
        k++;
      }

      while (i < leftPart.length) {
        a[k] = leftPart[i];
        swaps++;
        i++;
        k++;
        history.push({ array: [...a], comparing: [], swapping: [k - 1], sorted: [], pivot: -1, comparisons, swaps, desc: `Flushed left element ${a[k - 1]} to index ${k - 1}` });
      }

      while (j < rightPart.length) {
        a[k] = rightPart[j];
        swaps++;
        j++;
        k++;
        history.push({ array: [...a], comparing: [], swapping: [k - 1], sorted: [], pivot: -1, comparisons, swaps, desc: `Flushed right element ${a[k - 1]} to index ${k - 1}` });
      }
    }

    mergeSortHelper(0, a.length - 1);
    history.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), pivot: -1, comparisons, swaps, desc: "Merge Sort complete!" });
    return history;
  }

  function generateQuickSteps(arr) {
    const a = [...arr];
    const history = [];
    let comparisons = 0, swaps = 0;

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: "Quick Sort starting (Lomuto Partition)." });

    function quickSortHelper(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    }

    function partition(low, high) {
      const pivotVal = a[high];
      let i = low - 1;
      history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: high, comparisons, swaps, desc: `Chosen pivot arr[${high}] = ${pivotVal}` });

      for (let j = low; j < high; j++) {
        comparisons++;
        history.push({ array: [...a], comparing: [j, high], swapping: [], sorted: [], pivot: high, comparisons, swaps, desc: `Comparing arr[${j}] (${a[j]}) with pivot (${pivotVal})` });

        if (a[j] < pivotVal) {
          i++;
          swaps++;
          const temp = a[i];
          a[i] = a[j];
          a[j] = temp;
          history.push({ array: [...a], comparing: [], swapping: [i, j], sorted: [], pivot: high, comparisons, swaps, desc: `Swapped arr[${i}] and arr[${j}]` });
        }
      }

      swaps++;
      const temp = a[i + 1];
      a[i + 1] = a[high];
      a[high] = temp;
      history.push({ array: [...a], comparing: [], swapping: [i + 1, high], sorted: [i + 1], pivot: -1, comparisons, swaps, desc: `Placed pivot ${a[i + 1]} at final partitioned index ${i + 1}` });
      return i + 1;
    }

    quickSortHelper(0, a.length - 1);
    history.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), pivot: -1, comparisons, swaps, desc: "Quick Sort complete!" });
    return history;
  }

  function generateHeapSteps(arr) {
    const a = [...arr];
    const n = a.length;
    const history = [];
    let comparisons = 0, swaps = 0;

    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: "Heap Sort started: building Max Heap." });

    function heapify(length, rootIdx) {
      let largest = rootIdx;
      const left = 2 * rootIdx + 1;
      const right = 2 * rootIdx + 2;

      if (left < length) {
        comparisons++;
        if (a[left] > a[largest]) largest = left;
      }
      if (right < length) {
        comparisons++;
        if (a[right] > a[largest]) largest = right;
      }

      if (largest !== rootIdx) {
        swaps++;
        const temp = a[rootIdx];
        a[rootIdx] = a[largest];
        a[largest] = temp;
        history.push({
          array: [...a],
          comparing: [],
          swapping: [rootIdx, largest],
          sorted: [],
          pivot: rootIdx,
          comparisons,
          swaps,
          desc: `Heapify: swapped root ${a[rootIdx]} with child ${a[largest]}`
        });
        heapify(length, largest);
      }
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }
    history.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, comparisons, swaps, desc: "Max Heap successfully constructed." });

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      swaps++;
      const temp = a[0];
      a[0] = a[i];
      a[i] = temp;
      history.push({
        array: [...a],
        comparing: [],
        swapping: [0, i],
        sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
        pivot: -1,
        comparisons,
        swaps,
        desc: `Extracted max element ${a[i]} to sorted position ${i}`
      });
      heapify(i, 0);
    }

    history.push({ array: [...a], comparing: [], swapping: [], sorted: a.map((_, i) => i), pivot: -1, comparisons, swaps, desc: "Heap Sort complete!" });
    return history;
  }

  // UI DOM Render
  function renderBars(container, state) {
    container.innerHTML = '';
    const maxVal = Math.max(...state.array, 100);

    state.array.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'array-bar';
      const heightPercent = Math.max(12, (val / maxVal) * 90);
      bar.style.height = `${heightPercent}%`;

      if (state.swapping.includes(idx)) bar.classList.add('swapping');
      else if (state.comparing.includes(idx)) bar.classList.add('comparing');
      else if (state.pivot === idx) bar.classList.add('pivot');
      else if (state.sorted.includes(idx)) bar.classList.add('sorted');

      const valLabel = document.createElement('span');
      valLabel.className = 'bar-val';
      valLabel.textContent = val;
      bar.appendChild(valLabel);

      container.appendChild(bar);
    });
  }

  function updateDashboardInfo(algoKey) {
    const data = metadata[algoKey];
    if (!data) return;

    document.getElementById('sort-algo-title').textContent = data.name;
    document.getElementById('sort-best-time').textContent = data.timeBest;
    document.getElementById('sort-avg-time').textContent = data.timeAvg;
    document.getElementById('sort-worst-time').textContent = data.timeWorst;
    document.getElementById('sort-space-time').textContent = data.space;
    document.getElementById('sort-desc-text').textContent = data.desc;
    document.getElementById('sort-how-it-works').innerHTML = data.howItWorks;
  }

  function prepareAlgorithm(algoKey) {
    updateDashboardInfo(algoKey);
    switch (algoKey) {
      case 'bubble': steps = generateBubbleSteps(array); break;
      case 'selection': steps = generateSelectionSteps(array); break;
      case 'insertion': steps = generateInsertionSteps(array); break;
      case 'counting': steps = generateCountingSteps(array); break;
      case 'merge': steps = generateMergeSteps(array); break;
      case 'quick': steps = generateQuickSteps(array); break;
      case 'heap': steps = generateHeapSteps(array); break;
      default: steps = generateBubbleSteps(array);
    }
    stepper.loadSteps(steps);
    if (steps.length > 0) {
      applyStep(steps[0], 0, steps.length);
    }
  }

  function applyStep(step, currIdx, totalSteps) {
    const container = document.getElementById('sorting-bars');
    renderBars(container, step);

    document.getElementById('sort-comparisons-count').textContent = step.comparisons;
    document.getElementById('sort-swaps-count').textContent = step.swaps;
    document.getElementById('sort-step-msg').textContent = step.desc;
    document.getElementById('sort-progress-badge').textContent = `Step ${currIdx + 1} / ${totalSteps}`;

    if (step.swapping.length > 0) window.soundEngine.swapSound(step.array[step.swapping[0]] || 40);
    else if (step.comparing.length > 0) window.soundEngine.compareSound(step.array[step.comparing[0]] || 40);
  }

  // Initialization
  function initSortingDashboard() {
    const container = document.getElementById('sorting-bars');
    const algoSelect = document.getElementById('sort-algo-select');
    const customInput = document.getElementById('sort-custom-input');
    const btnRandom = document.getElementById('sort-btn-random');
    const btnApply = document.getElementById('sort-btn-apply');
    const btnPlay = document.getElementById('sort-btn-play');
    const btnPause = document.getElementById('sort-btn-pause');
    const btnStep = document.getElementById('sort-btn-step');
    const btnPrev = document.getElementById('sort-btn-prev');
    const btnReset = document.getElementById('sort-btn-reset');
    const speedSlider = document.getElementById('sort-speed-slider');
    const speedBadge = document.getElementById('sort-speed-val');

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

    function randomizeData() {
      array = ArrayUtils.generateRandom(14, 15, 95);
      customInput.value = array.join(', ');
      prepareAlgorithm(algoSelect.value);
    }

    algoSelect.addEventListener('change', () => prepareAlgorithm(algoSelect.value));
    btnRandom.addEventListener('click', randomizeData);

    btnApply.addEventListener('click', () => {
      array = ArrayUtils.parseCustomInput(customInput.value, 14);
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

  window.initSortingDashboard = initSortingDashboard;
})();
