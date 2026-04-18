(function () {
  var root = document.documentElement;
  var inkBtn = document.getElementById('themeInk');
  var paperBtn = document.getElementById('themePaper');
  if (!inkBtn || !paperBtn) return;

  function current() {
    var t = localStorage.getItem('theme');
    return t === 'paper' ? 'paper' : 'ink';
  }

  function apply(theme) {
    theme = theme === 'paper' ? 'paper' : 'ink';
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    inkBtn.setAttribute('aria-pressed', theme === 'ink' ? 'true' : 'false');
    paperBtn.setAttribute('aria-pressed', theme === 'paper' ? 'true' : 'false');
  }

  apply(current());

  inkBtn.addEventListener('click', function () { apply('ink'); });
  paperBtn.addEventListener('click', function () { apply('paper'); });
})();
