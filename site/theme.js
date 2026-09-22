(() => {
  const root = document.documentElement;
  root.dataset.theme = 'light';
  try {
    const saved = localStorage.getItem('humane-appearance');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch { /* Storage is optional; keep the light default. */ }
  root.dataset.resolvedTheme = root.dataset.theme;
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', root.dataset.theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', root.dataset.theme === 'dark' ? '#11281f' : '#eef1e8');
})();
