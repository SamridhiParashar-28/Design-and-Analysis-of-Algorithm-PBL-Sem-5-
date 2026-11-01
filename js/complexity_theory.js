/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Module 8: Complexity & Theory Dashboard
 * Asymptotic Notations Plot, Master Theorem Solver, P vs NP Guide & Reductions
 */

(function () {
  let canvas = null;
  let ctx = null;

  // Active Curves to draw on canvas
  const curves = {
    c1: { name: 'O(1) - Constant', color: '#10b981', fn: (n) => 20, enabled: true },
    clog: { name: 'O(log n) - Logarithmic', color: '#06b6d4', fn: (n) => Math.log2(n) * 18, enabled: true },
    cn: { name: 'O(n) - Linear', color: '#38bdf8', fn: (n) => n * 2.2, enabled: true },
    cnlog: { name: 'O(n log n) - Linearithmic', color: '#fbbf24', fn: (n) => n * Math.log2(n) * 0.7, enabled: true },
    cn2: { name: 'O(n²) - Quadratic', color: '#f97316', fn: (n) => (n * n) * 0.045, enabled: true },
    c2n: { name: 'O(2ⁿ) - Exponential', color: '#ef4444', fn: (n) => Math.pow(2, n * 0.12) * 5, enabled: true }
  };

  // Draw Asymptotic Growth Curves
  function drawCurves() {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = step; x < w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = step; y < h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, h - 30);
    ctx.lineTo(w - 20, h - 30);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('Operations / Time T(n)', 45, 25);
    ctx.fillText('Input Size (n) →', w - 110, h - 12);

    // Plot each curve
    for (const [key, curve] of Object.entries(curves)) {
      if (!curve.enabled) continue;

      ctx.beginPath();
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = 2.5;

      let first = true;
      for (let n = 1; n <= 100; n += 1) {
        const plotX = 40 + (n / 100) * (w - 70);
        const plotY = (h - 30) - curve.fn(n);
        if (plotY < 10) break; // Don't overflow top

        if (first) {
          ctx.moveTo(plotX, plotY);
          first = false;
        } else {
          ctx.lineTo(plotX, plotY);
        }
      }
      ctx.stroke();
    }
  }

  // Master Theorem Solver Engine
  // T(n) = a T(n/b) + Theta(n^k * log^p n)
  function solveMasterTheorem(a, b, k, p) {
    if (a < 1 || b <= 1) {
      return {
        error: true,
        msg: "Master Theorem requires a ≥ 1 and b > 1."
      };
    }

    const logba = Math.log(a) / Math.log(b);
    const logbaRounded = Math.round(logba * 1000) / 1000;
    const eps = 0.0001;

    let resCase = "";
    let finalComplexity = "";
    let explanation = "";

    if (logba > k + eps) {
      // Case 1: log_b(a) > k
      resCase = "Case 1: Tree-heavy (leaves dominate)";
      finalComplexity = `Θ(n^{log_${b}(${a})}) = Θ(n^{${logbaRounded}})`;
      explanation = `Since log_b(a) = log_${b}(${a}) ≈ ${logbaRounded} > k (${k}), the work is dominated by the leaves of the recursion tree.`;
    } else if (Math.abs(logba - k) <= eps) {
      // Case 2: log_b(a) == k
      resCase = "Case 2: Balanced work across all levels";
      if (p > -1) {
        finalComplexity = `Θ(n^{${k}} log^{${p + 1}} n)`;
        explanation = `Since log_${b}(${a}) = k = ${k} and p (${p}) > -1, work is evenly distributed across all log_b(n) levels.`;
      } else if (p === -1) {
        finalComplexity = `Θ(n^{${k}} log(log n))`;
        explanation = `Critical boundary case p = -1. Complexity involves double logarithm.`;
      } else {
        finalComplexity = `Θ(n^{${k}})`;
        explanation = `When p < -1, the highest order term dominates.`;
      }
    } else {
      // Case 3: log_b(a) < k
      resCase = "Case 3: Root-heavy (divide/combine dominates)";
      finalComplexity = `Θ(n^{${k}} log^{${p}} n)`;
      explanation = `Since log_b(a) ≈ ${logbaRounded} < k (${k}) and regularity condition a f(n/b) ≤ c f(n) holds for c < 1, the work is dominated by the root level combine step.`;
    }

    return {
      error: false,
      logba: logbaRounded,
      resCase,
      finalComplexity,
      explanation
    };
  }

  function handleMasterCalculate() {
    const a = parseFloat(document.getElementById('mt-a-input').value) || 2;
    const b = parseFloat(document.getElementById('mt-b-input').value) || 2;
    const k = parseFloat(document.getElementById('mt-k-input').value) || 1;
    const p = parseFloat(document.getElementById('mt-p-input').value) || 0;

    const result = solveMasterTheorem(a, b, k, p);
    const card = document.getElementById('mt-result-card');

    if (result.error) {
      card.innerHTML = `<div style="color:#ef4444; font-weight:bold;">${result.msg}</div>`;
      return;
    }

    card.innerHTML = `
      <div style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; font-weight:700;">${result.resCase}</div>
      <div style="font-family:var(--font-mono); font-size:1.4rem; font-weight:700; color:var(--primary); margin:6px 0;">${result.finalComplexity}</div>
      <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">${result.explanation}</div>
      <div style="margin-top:10px; font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-amber);">
        log_${b}(${a}) = ${result.logba} vs k = ${k}
      </div>
    `;
    window.soundEngine.compareSound(200);
  }

  function initComplexityDashboard() {
    canvas = document.getElementById('theory-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 640;
    canvas.height = 340;

    // Toggle checkboxes for curves
    const toggles = document.querySelectorAll('.curve-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const key = e.target.dataset.curve;
        if (curves[key]) {
          curves[key].enabled = e.target.checked;
          drawCurves();
        }
      });
    });

    document.getElementById('mt-calc-btn')?.addEventListener('click', handleMasterCalculate);

    drawCurves();
    handleMasterCalculate();
  }

  window.initComplexityDashboard = initComplexityDashboard;
})();
