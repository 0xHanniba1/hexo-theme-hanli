(function () {
  var root = document.documentElement;
  var body = document.body;
  var panel = document.getElementById('tweaks');
  var trigger = document.getElementById('tweaks-trigger');
  var closeBtn = document.getElementById('tweaks-close');
  if (!panel || !trigger) return;

  var ACCENTS = {
    gold: { accent: '#d4b483', soft: '#e8d0a0' },
    jade: { accent: '#6ea3a0', soft: '#98c7c4' },
    seal: { accent: '#c0553e', soft: '#d97b66' }
  };
  var DEFAULTS = { accent: 'gold', texture: 'dots' };

  function load() {
    try {
      var raw = localStorage.getItem('tweaks');
      return raw ? Object.assign({}, DEFAULTS, JSON.parse(raw)) : Object.assign({}, DEFAULTS);
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }
  function save(state) {
    try { localStorage.setItem('tweaks', JSON.stringify(state)); } catch (e) {}
  }

  function apply(state) {
    if (state.accent && ACCENTS[state.accent]) {
      root.style.setProperty('--accent', ACCENTS[state.accent].accent);
      root.style.setProperty('--accent-soft', ACCENTS[state.accent].soft);
    }
    body.dataset.hero = 'plain';
    body.dataset.texture = state.texture || 'dots';
    syncButtons(state);
  }

  function syncButtons(state) {
    panel.querySelectorAll('.tw-opts').forEach(function (row) {
      var key = row.dataset.key;
      row.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('on', b.dataset.v === state[key]);
      });
    });
  }

  var state = load();
  apply(state);

  panel.querySelectorAll('.tw-opts').forEach(function (row) {
    row.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      state[row.dataset.key] = btn.dataset.v;
      save(state);
      apply(state);
    });
  });

  function toggle() { panel.classList.toggle('open'); }
  function close() { panel.classList.remove('open'); }

  trigger.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || trigger.contains(e.target)) return;
    close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });
})();
