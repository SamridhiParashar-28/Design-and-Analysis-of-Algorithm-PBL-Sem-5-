/**
 * ALGORITHM VISUALIZER – COMPLETE DAA LAB SUITE
 * Master Application State & View Routing Engine
 */

(function () {
  const views = [
    { id: 'sorting', title: 'Sorting Algorithms', badge: 'Module 1' },
    { id: 'searching', title: 'Searching Algorithms', badge: 'Module 2' },
    { id: 'shortest-path', title: 'Shortest Path / Route Optimization', badge: 'Module 3' },
    { id: 'greedy', title: 'Greedy Algorithms', badge: 'Module 4' },
    { id: 'backtracking', title: 'Backtracking & Branch and Bound', badge: 'Module 5' },
    { id: 'divide-conquer', title: 'Divide and Conquer', badge: 'Module 6' },
    { id: 'graph-algorithms', title: 'Graph Algorithms', badge: 'Module 7' },
    { id: 'complexity-theory', title: 'Complexity & Theory Lab', badge: 'Module 8' }
  ];

  let currentViewId = 'sorting';

  class AppState {
    constructor() {
      this.status = 'idle'; // 'idle' | 'running' | 'paused' | 'done'
    }

    setStatus(newStatus) {
      this.status = newStatus;
      const badge = document.getElementById('global-status-badge');
      const text = document.getElementById('global-status-text');
      if (!badge || !text) return;

      badge.className = `status-badge ${newStatus}`;
      if (newStatus === 'idle') text.textContent = 'Ready';
      else if (newStatus === 'running') text.textContent = 'Running';
      else if (newStatus === 'paused') text.textContent = 'Paused';
      else if (newStatus === 'done') text.textContent = 'Completed';
    }
  }

  window.appState = new AppState();

  function switchView(targetId) {
    const target = views.find(v => v.id === targetId) || views[0];
    currentViewId = target.id;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.target === target.id);
    });

    // Update sections visibility
    document.querySelectorAll('.dashboard-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `section-${target.id}`);
    });

    // Update Header Breadcrumb
    document.getElementById('header-active-module').textContent = target.badge;
    document.getElementById('header-active-title').textContent = target.title;

    // Reset status
    window.appState.setStatus('idle');

    // Close mobile sidebar if open
    document.getElementById('sidebar')?.classList.remove('open');
    window.location.hash = target.id;
  }

  function setupGlobalEvents() {
    // Nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.target;
        switchView(targetId);
      });
    });

    // Mobile sidebar toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    mobileBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });

    // Fullscreen toggle
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Audio sound toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn?.addEventListener('click', () => {
      window.soundEngine.enabled = !window.soundEngine.enabled;
      soundBtn.classList.toggle('active', window.soundEngine.enabled);
      soundBtn.title = window.soundEngine.enabled ? 'Sound Effects Enabled' : 'Sound Effects Muted';
    });

    // Expandable Educational Panel Accordions
    document.querySelectorAll('.edu-header').forEach(header => {
      header.addEventListener('click', () => {
        const panel = header.closest('.edu-panel');
        panel?.classList.toggle('expanded');
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        // Trigger active dashboard play/pause
        const activePlay = document.querySelector(`.dashboard-section.active .btn-play`);
        const activePause = document.querySelector(`.dashboard-section.active .btn-pause`);
        if (window.appState.status === 'running') {
          activePause?.click();
        } else {
          activePlay?.click();
        }
      } else if (e.code === 'ArrowRight') {
        document.querySelector(`.dashboard-section.active .btn-step`)?.click();
      } else if (e.code === 'ArrowLeft') {
        document.querySelector(`.dashboard-section.active .btn-prev`)?.click();
      } else if (e.key === 'r' || e.key === 'R') {
        document.querySelector(`.dashboard-section.active .btn-reset`)?.click();
      } else if (e.key === 'm' || e.key === 'M') {
        soundBtn?.click();
      }
    });

    // Handle hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash && views.some(v => v.id === hash)) {
      switchView(hash);
    } else {
      switchView('sorting');
    }
  }

  // Application Entry Point
  window.addEventListener('DOMContentLoaded', () => {
    setupGlobalEvents();

    // Initialize all dashboards
    if (window.initSortingDashboard) window.initSortingDashboard();
    if (window.initSearchingDashboard) window.initSearchingDashboard();
    if (window.initShortestPathDashboard) window.initShortestPathDashboard();
    if (window.initGreedyDashboard) window.initGreedyDashboard();
    if (window.initBacktrackingDashboard) window.initBacktrackingDashboard();
    if (window.initDivideConquerDashboard) window.initDivideConquerDashboard();
    if (window.initGraphDashboard) window.initGraphDashboard();
    if (window.initComplexityDashboard) window.initComplexityDashboard();
  });
})();
