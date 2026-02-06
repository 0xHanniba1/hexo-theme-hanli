(function () {
  var lightSheet = document.getElementById('theme-light');
  var darkSheet = document.getElementById('theme-dark');
  var toggleBtn = document.getElementById('topbar-theme-toggle');
  if (!toggleBtn) return;

  var sunIcon = toggleBtn.querySelector('.theme-icon-sun');
  var moonIcon = toggleBtn.querySelector('.theme-icon-moon');
  var saved = localStorage.getItem('theme') || 'light';

  function applyTheme(theme) {
    if (theme === 'dark') {
      lightSheet.disabled = true;
      darkSheet.disabled = false;
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      lightSheet.disabled = false;
      darkSheet.disabled = true;
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

  applyTheme(saved);

  toggleBtn.addEventListener('click', function () {
    var current = localStorage.getItem('theme') || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
})();
