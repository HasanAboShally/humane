(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const updateTheme = () => {
    const theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = theme;
    root.dataset.resolvedTheme = theme;
    themeButton?.setAttribute('aria-label', theme === 'dark' ? themeButton.dataset.lightLabel : themeButton.dataset.darkLabel);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#11281f' : '#eef1e8');
  };
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.resolvedTheme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('humane-appearance', root.dataset.theme); } catch { /* Works without storage. */ }
    updateTheme();
  });
  updateTheme();

  const picker = document.querySelector('.example-picker');
  const tabs = [...document.querySelectorAll('[data-example]')];
  const selectExample = (tab, focus = false) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      item.classList.toggle('is-active', selected);
      const panel = document.getElementById(`${item.dataset.example}-panel`);
      panel.hidden = !selected;
      panel.setAttribute('role', 'tabpanel');
      panel.tabIndex = 0;
    });
    if (focus) tab.focus();
  };
  picker?.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${tab.dataset.example}-panel`);
    tab.addEventListener('click', () => selectExample(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectExample(tabs[next], true); }
    });
  });
  if (tabs[0]) selectExample(tabs[0]);

  const revealTarget = (target) => {
    if (!target?.matches('.source-card, .faq, [data-source-link], [data-result]')) return;
    const panel = target.closest('.example-panel');
    const tab = tabs.find((item) => panel?.id === `${item.dataset.example}-panel`);
    if (tab) selectExample(tab);
    const isDisclosure = target.matches('.source-card, .faq');
    if (isDisclosure) target.open = true;
    const focusTarget = isDisclosure ? target.querySelector('summary') : target;
    focusTarget?.focus({ preventScroll: true });
    target.scrollIntoView({ block: isDisclosure ? 'start' : 'center' });
  };
  document.querySelectorAll('[data-source-link], [data-source-return]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (link.hasAttribute('data-source-link') && target?.matches('.source-card')) {
        target.open = true;
        target.querySelector('[data-source-return]')?.setAttribute('href', `#${link.id}`);
      }
      // Re-selecting the current fragment does not emit hashchange.
      if (link.hash === location.hash) {
        event.preventDefault();
        revealTarget(target);
      }
    });
  });
  const revealFragment = () => revealTarget(document.getElementById(location.hash.slice(1)));
  addEventListener('hashchange', revealFragment);
  revealFragment();

  const live = document.getElementById('copy-status');
  let notificationTimer;
  let newestCopy = 0;
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copy);
      if (!target || button.getAttribute('aria-busy') === 'true') return;
      const request = ++newestCopy;
      const initialFocus = document.activeElement;
      const text = 'value' in target ? target.value : target.textContent;
      clearTimeout(notificationTimer);
      live.textContent = '';
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('aria-busy', 'true');
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        if (request !== newestCopy) return;
        live.textContent = button.dataset.copyNotice || document.body.dataset.copyNotice;
      } catch {
        if (request !== newestCopy) return;
        if (document.activeElement === initialFocus || document.activeElement === button) {
          const details = target.closest('details');
          if (details) details.open = true;
          target.focus();
          if (typeof target.select === 'function') target.select();
          else {
            const range = document.createRange();
            range.selectNodeContents(target);
            const selection = getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
          live.textContent = document.body.dataset.copyFailed;
        } else {
          // A delayed permission result must not pull the reader back after they move on.
          live.textContent = button.dataset.copyFailureHint;
        }
      } finally {
        button.removeAttribute('aria-disabled');
        button.removeAttribute('aria-busy');
        if (request === newestCopy) notificationTimer = setTimeout(() => { live.textContent = ''; }, 9000);
      }
    });
  });

  root.classList.add('js');
})();
