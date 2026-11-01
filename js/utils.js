/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Shared Utilities: Animation Stepper, Audio FX, Graph Engine & Math Helpers
 */

// Web Audio API Sound Synthesizer for Educational Sonification
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  compareSound(val = 300) { this.playTone(200 + val * 4, 'triangle', 0.05, 0.03); }
  swapSound(val = 500) { this.playTone(150 + val * 3, 'square', 0.07, 0.04); }
  successSound() {
    this.playTone(523.25, 'sine', 0.1, 0.05); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.05), 90); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.06), 180); // G5
  }
  failSound() { this.playTone(180, 'sawtooth', 0.15, 0.05); }
}

window.soundEngine = new SoundEngine();

// Generic Animation Stepper & Queue Controller
class StepController {
  constructor({ onApplyStep, onComplete, onStatusChange }) {
    this.steps = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.speedMs = 400;
    this.timer = null;
    this.onApplyStep = onApplyStep || (() => {});
    this.onComplete = onComplete || (() => {});
    this.onStatusChange = onStatusChange || (() => {});
  }

  loadSteps(steps) {
    this.stop();
    this.steps = steps;
    this.currentIndex = -1;
    this.updateStatus('ready');
  }

  setSpeed(ms) {
    this.speedMs = ms;
    if (this.isPlaying) {
      clearInterval(this.timer);
      this.play();
    }
  }

  play() {
    if (this.currentIndex >= this.steps.length - 1) {
      this.currentIndex = -1; // restart if at end
    }
    this.isPlaying = true;
    this.updateStatus('running');
    this.timer = setInterval(() => {
      this.stepForward();
    }, this.speedMs);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.updateStatus('paused');
  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.timer = null;
    this.updateStatus('idle');
  }

  stepForward() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      const step = this.steps[this.currentIndex];
      this.onApplyStep(step, this.currentIndex, this.steps.length);
      if (this.currentIndex === this.steps.length - 1) {
        this.stop();
        this.updateStatus('done');
        this.onComplete();
      }
      return true;
    } else {
      this.stop();
      this.updateStatus('done');
      this.onComplete();
      return false;
    }
  }

  stepBackward() {
    if (this.currentIndex > 0) {
      this.pause();
      this.currentIndex--;
      const step = this.steps[this.currentIndex];
      this.onApplyStep(step, this.currentIndex, this.steps.length);
      return true;
    }
    return false;
  }

  reset() {
    this.stop();
    this.currentIndex = -1;
    if (this.steps.length > 0) {
      this.onApplyStep(this.steps[0], 0, this.steps.length);
    }
    this.updateStatus('ready');
  }

  updateStatus(status) {
    this.onStatusChange(status);
  }
}

// Data input helpers
const ArrayUtils = {
  generateRandom(size = 14, min = 10, max = 99) {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
  },

  parseCustomInput(str, defaultSize = 12) {
    if (!str || !str.trim()) return this.generateRandom(defaultSize);
    const parsed = str.split(/[\s,]+/)
      .map(item => parseInt(item.trim(), 10))
      .filter(n => !isNaN(n) && n > 0 && n <= 999);
    return parsed.length > 0 ? parsed : this.generateRandom(defaultSize);
  }
};

// Canvas drawing utilities for Graphs and Trees
const CanvasUtils = {
  drawNode(ctx, x, y, label, state = 'default', radius = 20) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    let fill = '#1e293b';
    let stroke = '#38bdf8';
    let textColor = '#f1f5f9';

    if (state === 'active') {
      fill = '#0284c7';
      stroke = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
    } else if (state === 'visited') {
      fill = '#164e63';
      stroke = '#22d3ee';
    } else if (state === 'processing') {
      fill = '#b45309';
      stroke = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;
    } else if (state === 'completed' || state === 'solution') {
      fill = '#065f46';
      stroke = '#34d399';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 15;
    } else if (state === 'start') {
      fill = '#4338ca';
      stroke = '#818cf8';
    } else if (state === 'target') {
      fill = '#9f1239';
      stroke = '#f43f5e';
    }

    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = stroke;
    ctx.stroke();

    // Text Label
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
    ctx.restore();
  },

  drawEdge(ctx, fromX, fromY, toX, toY, weight = null, state = 'default', isDirected = false) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);

    let stroke = '#334155';
    let width = 2;

    if (state === 'highlight') {
      stroke = '#fbbf24';
      width = 3.5;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
    } else if (state === 'path') {
      stroke = '#10b981';
      width = 4;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
    } else if (state === 'tree') {
      stroke = '#38bdf8';
      width = 3;
    }

    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();

    if (isDirected) {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const headlen = 10;
      const endX = toX - 20 * Math.cos(angle);
      const endY = toY - 20 * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.fillStyle = stroke;
      ctx.fill();
    }

    // Weight label
    if (weight !== null) {
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(midX, midY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(weight, midX, midY);
    }
    ctx.restore();
  }
};

window.StepController = StepController;
window.ArrayUtils = ArrayUtils;
window.CanvasUtils = CanvasUtils;
