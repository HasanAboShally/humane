import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unzipSync } from 'fflate';
import { repositoryRoot } from '../../scripts/skill-package.mjs';

const english = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));
const instruction = readFileSync(join(repositoryRoot, 'skills/humane/SKILL.md'), 'utf8');
const setAppearance = async (page, appearance) => {
  if (await page.locator('html').getAttribute('data-resolved-theme') !== appearance) {
    await page.getByRole('button', { name: appearance === 'dark' ? english.darkTheme : english.lightTheme, exact: true }).click();
  }
  await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', appearance);
  await expect(page.locator('body')).toHaveCSS('background-color', appearance === 'dark' ? 'rgb(17, 40, 31)' : 'rgb(238, 241, 232)');
};

const assertFits = async (page) => {
  const result = await page.evaluate(() => {
    const width = innerWidth;
    const escapes = [];
    for (const element of document.querySelectorAll('h1,h2,h3,p,summary,label,pre')) {
      if (!element.checkVisibility()) continue;
      const range = document.createRange();
      range.selectNodeContents(element);
      for (const rect of range.getClientRects()) {
        if (rect.width && (rect.left < -1 || rect.right > width + 1)) {
          escapes.push({ tag: element.tagName, text: element.textContent.slice(0, 60), left: rect.left, right: rect.right });
          break;
        }
      }
    }
    return { documentWidth: document.documentElement.scrollWidth, viewport: width, escapes };
  });
  expect(result.documentWidth).toBeLessThanOrEqual(result.viewport + 1);
  expect(result.escapes).toEqual([]);
};

const assertPaperFits = async (page) => {
  const escapes = await page.evaluate(() => {
    const escaped = [];
    for (const element of document.querySelectorAll('.source-card summary,.source-card>p,.source-return,.output-side h3,.output-side p,.output-side .source-link')) {
      if (!element.checkVisibility()) continue;
      const paper = element.closest('.source-card,.output-side').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      if ([...range.getClientRects()].some((rect) => rect.width && (rect.left < paper.left - 1 || rect.right > paper.right + 1 || rect.top < paper.top - 1 || rect.bottom > paper.bottom + 1))) {
        escaped.push(element.textContent.slice(0, 80));
      }
    }
    return escaped;
  });
  expect(escapes).toEqual([]);
};

test('desktop and mobile are readable in both themes with no accessibility scan findings', async ({ page }, info) => {
  test.setTimeout(60000);
  const errors = [];
  const badResponses = [];
  const outside = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.status() >= 400) badResponses.push(response.url()); });
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4178/')) outside.push(request.url()); });
  const captureDirectory = join(repositoryRoot, '.impeccable/review');
  mkdirSync(captureDirectory, { recursive: true });
  for (const variant of [
    { name: 'desktop', width: 1440, height: 960, color: 'light' },
    { name: 'mobile', width: 390, height: 844, color: 'light' },
    { name: 'desktop-dark', width: 1440, height: 960, color: 'dark' },
    { name: 'mobile-dark', width: 390, height: 844, color: 'dark' },
  ]) {
    await page.setViewportSize({ width: variant.width, height: variant.height });
    await page.emulateMedia({ colorScheme: variant.color, reducedMotion: 'reduce' });
    await page.goto('./');
    await setAppearance(page, variant.color);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(english.headline[0]);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    expect(await page.evaluate(() => document.fonts.check('550 20px Manrope'))).toBe(true);
    // Capture the painted frame before measuring inherited colors, especially in WebKit.
    await page.screenshot({ path: join(captureDirectory, `${variant.name}${info.project.name === 'webkit' ? '-webkit' : ''}.png`), fullPage: true, animations: 'disabled' });
    await assertFits(page);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    for (const mode of ['reading', 'writing']) {
      await page.locator(`#${mode}-tab`).click();
      const panel = page.locator(`#${mode}-panel`);
      await expect(panel.locator('.source-card').first()).toHaveAttribute('open', '');
      await expect(panel.locator('.source-card').first().locator('p')).toBeVisible();
      await expect(panel.locator('.output-side')).toHaveCSS('transform', 'none');
      await assertFits(page);
      await assertPaperFits(page);
      const scan = await new AxeBuilder({ page }).include('#difference').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(scan.violations).toEqual([]);
      await page.locator('.example-desk').screenshot({ path: join(captureDirectory, `desk-${variant.name}-${mode}-${info.project.name}.png`), animations: 'disabled' });
    }
  }
  expect(errors).toEqual([]);
  expect(badResponses).toEqual([]);
  expect(outside).toEqual([]);
});

test('expanded originals and result pages reflow inside their sheets at narrow widths and doubled text', async ({ page }, info) => {
  for (const variant of [{ name: 'narrow', width: 320, scale: '100%' }, { name: 'large-text', width: 320, scale: '200%' }, { name: 'tablet-large-text', width: 768, scale: '200%' }]) {
    for (const colorScheme of ['light', 'dark']) {
      await page.setViewportSize({ width: variant.width, height: 850 });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('./');
      await setAppearance(page, colorScheme);
      await page.evaluate((scale) => { document.documentElement.style.fontSize = scale; }, variant.scale);
      await page.evaluate(() => document.fonts.ready);
      for (const id of ['reading-finance', 'reading-status']) {
        const summary = page.locator(`#${id} summary`);
        await summary.focus();
        await page.keyboard.press('Enter');
        await expect(page.locator(`#${id}`)).toHaveAttribute('open', '');
        await expect(summary).toBeFocused();
      }
      await assertFits(page);
      await assertPaperFits(page);
      const lastSource = page.locator('#reading-status [data-source-return]');
      await lastSource.scrollIntoViewIfNeeded();
      await expect(lastSource).toBeInViewport();
      await lastSource.click();
      await expect(page.locator('#reading-result')).toBeFocused();
      await page.getByRole('tab', { name: english.writingTab }).click();
      await expect(page.locator('#writing-notes p')).toHaveText(english.writingSources[0].body);
      await assertFits(page);
      await assertPaperFits(page);
      if (variant.name === 'tablet-large-text' && colorScheme === 'dark') {
        await page.locator('.example-desk').screenshot({ path: join(repositoryRoot, '.impeccable/review', `desk-expanded-${info.project.name}.png`), animations: 'disabled' });
      }
    }
  }
});

test('forced colors keep real document boundaries and remove decorative paper layers', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('./');
  for (const selector of ['#reading-panel .source-stack', '#reading-panel .result-sheet']) {
    expect(await page.locator(selector).evaluate((element) => getComputedStyle(element, '::before').display)).toBe('none');
  }
  await expect(page.locator('#reading-plan')).toHaveCSS('border-top-style', 'solid');
  await expect(page.locator('#reading-result')).toHaveCSS('box-shadow', 'none');
  await expect(page.locator('#reading-plan p')).toHaveText(english.readingSources[0].body);
  await assertPaperFits(page);
});

test('dark paper has distinct desk, front, and backing tones without losing text contrast', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('./');
  await setAppearance(page, 'dark');
  await page.screenshot({ animations: 'disabled' });
  for (const mode of ['reading', 'writing']) {
    await page.locator(`#${mode}-tab`).click();
    const colors = await page.locator(`#${mode}-panel`).evaluate((panel) => {
      const luminance = (color) => {
        const [r, g, b] = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
          const channel = value / 255;
          return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
        });
        return .2126 * r + .7152 * g + .0722 * b;
      };
      const contrast = (first, second) => (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
      const desk = luminance(getComputedStyle(panel.closest('.example-desk')).backgroundColor);
      return [['.source-card', '.source-stack'], ['.output-side', '.result-sheet']].map(([selector, wrapper]) => {
        const element = panel.querySelector(selector);
        const style = getComputedStyle(element);
        const paper = luminance(style.backgroundColor);
        const backing = luminance(getComputedStyle(panel.querySelector(wrapper), '::before').backgroundColor);
        const text = [...element.querySelectorAll('h3,p,strong,a')].map((item) => contrast(luminance(getComputedStyle(item).color), paper));
        return { paper, desk, deskContrast: contrast(paper, desk), backingContrast: contrast(paper, backing), text, shadow: style.boxShadow };
      });
    });
    for (const sheet of colors) {
      // These surface thresholds guard the intended material separation, not a WCAG requirement.
      expect(sheet.paper).toBeGreaterThan(sheet.desk);
      expect(sheet.deskContrast).toBeGreaterThan(1.4);
      expect(sheet.backingContrast).toBeGreaterThan(1.8);
      expect(Math.min(...sheet.text)).toBeGreaterThanOrEqual(4.5);
      expect(sheet.shadow).not.toBe('none');
    }
  }
});

test('narrow layouts retain a visible backing edge below both types of paper', async ({ page }) => {
  for (const variant of [{ width: 390, scale: '100%' }, { width: 320, scale: '200%' }]) {
    await page.setViewportSize({ width: variant.width, height: 850 });
    await page.goto('./');
    await setAppearance(page, 'dark');
    await page.evaluate((scale) => { document.documentElement.style.fontSize = scale; }, variant.scale);
    for (const mode of ['reading', 'writing']) {
      await page.locator(`#${mode}-tab`).click();
      for (const selector of ['.source-stack', '.result-sheet']) {
        const exposure = await page.locator(`#${mode}-panel ${selector}`).evaluate((element) => {
          const back = getComputedStyle(element, '::before');
          const shift = new DOMMatrixReadOnly(back.transform).m42;
          const bottom = element.getBoundingClientRect().bottom - parseFloat(back.bottom) + shift;
          const front = element.querySelector('.source-card:last-child,.output-side').getBoundingClientRect();
          return bottom - front.bottom;
        });
        expect(exposure).toBeGreaterThanOrEqual(4);
        expect(exposure).toBeLessThanOrEqual(12);
      }
      await assertFits(page);
      await assertPaperFits(page);
    }
  }
});

test('the page names the example documents and explains what Humane actually is', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.hero-intro')).toHaveText(english.intro);
  await expect(page.locator('.hero-intro')).toContainText('free Agent Skill');
  await expect(page.locator('.hero-license')).toContainText(english.heroAvailability);
  await expect(page.locator('.private-hint')).toHaveText(english.privateHint);
  await expect(page.locator('.site-footer').getByRole('link', { name: english.repoLink, exact: true })).toHaveAttribute('href', 'https://github.com/HasanAboShally/humane');
  await expect(page.locator('.hero-license a')).toHaveText('MIT open-source license');
  await expect(page.locator('.hero-license a')).toHaveAttribute('href', './downloads/LICENSE.txt');
  await expect(page.getByRole('heading', { name: 'Example documents', exact: true })).toBeVisible();
  await expect(page.locator('.demo-disclosure')).toHaveText(english.demoDisclosure);
  await expect(page.locator('main > section')).toHaveCount(4);
  await expect(page.locator('.care-section, .bridge, .language-link')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'What comes in', exact: true })).toHaveCount(0);
  await page.getByRole('tab', { name: english.writingTab }).click();
  await expect(page.getByRole('heading', { name: 'Original notes', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: english.writingTitle, exact: true })).toBeVisible();
});

test('the GitHub header link stays visible and keyboard reachable across themes, mobile, and enlarged text', async ({ page, browserName }) => {
  // macOS WebKit uses Option-Tab to include links and buttons in its native focus cycle.
  const tabModifier = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+' : '';
  for (const variant of [{ width: 1440, scale: '100%' }, { width: 390, scale: '100%' }, { width: 320, scale: '100%' }, { width: 320, scale: '200%' }]) {
    await page.setViewportSize({ width: variant.width, height: 850 });
    for (const appearance of ['light', 'dark']) {
      await page.goto('./');
      await setAppearance(page, appearance);
      await page.evaluate((scale) => { document.documentElement.style.fontSize = scale; }, variant.scale);
      const link = page.getByRole('banner').getByRole('link', { name: english.repoLink, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toBeInViewport();
      await expect(link).toContainText(english.githubNav);
      await expect(link).toHaveAttribute('href', 'https://github.com/HasanAboShally/humane');
      const bounds = await link.boundingBox();
      expect(bounds.width).toBeGreaterThanOrEqual(44);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      await link.focus();
      await page.keyboard.press(`${tabModifier}Tab`);
      await expect(page.locator('.theme-toggle')).toBeFocused();
      await page.keyboard.press(`${tabModifier}Shift+Tab`);
      await expect(link).toBeFocused();
      await expect(link).toHaveCSS('outline-style', 'solid');
      await expect(link).toHaveCSS('outline-width', '2px');
      await assertFits(page);
    }
  }
});

test('the GitHub header link navigates natively with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 850 } });
  try {
    const page = await context.newPage();
    // Test the anchor without contacting GitHub or depending on a logged-in account.
    await page.route('https://github.com/HasanAboShally/humane', (route) => route.fulfill({ contentType: 'text/html', body: '<h1>Repository destination</h1>' }));
    await page.goto('http://127.0.0.1:4178/humane/');
    const link = page.getByRole('banner').getByRole('link', { name: english.repoLink, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toBeInViewport();
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('https://github.com/HasanAboShally/humane');
    await expect(page.getByRole('heading', { name: 'Repository destination' })).toBeVisible();
  } finally { await context.close(); }
});

test('removed locale routes and assets are not served by the English-only preview', async ({ page, request }) => {
  await page.goto('./');
  await expect(page.locator('[hreflang], [lang="ar"], [dir="rtl"]')).toHaveCount(0);
  for (const path of ['ar/', 'assets/noto-arabic.woff2']) {
    const response = await request.get(new URL(path, page.url()).href);
    expect(response.status()).toBe(404);
  }
});

test('tabs, source links, and direct source fragments work from the keyboard', async ({ page }) => {
  await page.goto('./');
  const reader = page.getByRole('tab', { name: english.readingTab });
  const writer = page.getByRole('tab', { name: english.writingTab });
  await reader.focus();
  await page.keyboard.press('ArrowRight');
  await expect(writer).toBeFocused();
  await expect(writer).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: english.writingTitle, exact: true })).toBeVisible();
  await page.keyboard.press('Home');
  await expect(reader).toHaveAttribute('aria-selected', 'true');
  await page.locator('.output-side [href="#reading-finance"]').first().click();
  await expect(page.locator('#reading-finance')).toHaveAttribute('open', '');
  await expect(page.locator('#reading-finance summary')).toBeFocused();
  await page.goto('./#writing-notes');
  await expect(writer).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#writing-notes')).toHaveAttribute('open', '');
  await expect(page.locator('#writing-notes summary')).toBeFocused();
});

test('copy feedback keeps focus and the instructions match the installed skill', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text) => { globalThis.copiedText = text; } }, configurable: true });
  });
  await page.goto('./#install');
  const command = page.getByRole('button', { name: english.copyCommand, exact: true });
  await command.focus();
  await page.keyboard.press('Enter');
  await expect(command).toBeFocused();
  await expect(page.getByRole('status')).toHaveText(english.copyNotice);
  expect(await page.evaluate(() => globalThis.copiedText)).toBe('npx skills add HasanAboShally/humane');
  await page.getByRole('button', { name: english.copySkill, exact: true }).click();
  expect(await page.evaluate(() => globalThis.copiedText)).toBe(instruction);
  await expect(page.getByRole('status')).toHaveText(english.copyInstructionsNotice);
});

test('source inspection returns to the exact reference, including repeated fragment visits', async ({ page }) => {
  await page.goto('./');
  const reference = page.locator('.output-side [href="#reading-finance"]').last();
  const source = page.locator('#reading-finance');
  await reference.click();
  await expect(source.locator('summary')).toBeFocused();
  await source.locator('summary').click();
  await expect(source).not.toHaveAttribute('open', '');
  // The URL still names this source, so a second click cannot rely on hashchange.
  await reference.click();
  await expect(source).toHaveAttribute('open', '');
  await expect(source.locator('summary')).toBeFocused();
  await source.getByRole('link', { name: english.backToExample }).click();
  await expect(reference).toBeFocused();
  await expect(reference).toBeInViewport();
  await page.goto('./#writing-notes');
  await page.locator('#writing-notes [data-source-return]').click();
  await expect(page.locator('#writing-result')).toBeFocused();
  await expect(page.getByRole('tab', { name: english.writingTab })).toHaveAttribute('aria-selected', 'true');
});

test('install command wraps fully at 320px with doubled text and stays manually selectable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Denied'); } }, configurable: true });
  });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.goto('./');
    await setAppearance(page, colorScheme);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const command = page.locator('#install-command');
    await expect(command).toHaveText('npx skills add HasanAboShally/humane');
    const bounds = await command.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const parent = element.getBoundingClientRect();
      return { client: element.clientWidth, scroll: element.scrollWidth, inside: [...range.getClientRects()].every((rect) => rect.left >= parent.left - 1 && rect.right <= parent.right + 1) };
    });
    expect(bounds.scroll).toBeLessThanOrEqual(bounds.client + 1);
    expect(bounds.inside).toBe(true);
    await page.getByRole('button', { name: english.copyCommand, exact: true }).click();
    await expect(command).toBeFocused();
    expect(await page.evaluate(() => getSelection().toString())).toBe('npx skills add HasanAboShally/humane');
  }
});

test('a delayed clipboard failure does not steal focus after the reader moves on', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => new Promise((resolve, reject) => { globalThis.failCopy = reject; }) }, configurable: true });
  });
  await page.goto('./');
  const button = page.getByRole('button', { name: english.copySkill, exact: true });
  await button.click();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await page.locator('.theme-toggle').focus();
  await page.evaluate(() => globalThis.failCopy(new Error('Denied')));
  await expect(page.getByRole('status')).toHaveText(english.copyInstructionsFailed);
  await expect(page.locator('.theme-toggle')).toBeFocused();
  await expect(page.locator('#manual-instructions')).not.toHaveAttribute('open', '');
  await expect(button).not.toHaveAttribute('aria-busy', 'true');
});

test('an older clipboard result cannot overwrite newer copy feedback', async ({ page }) => {
  await page.addInitScript(() => {
    let calls = 0;
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => ++calls === 1 ? new Promise((resolve, reject) => { globalThis.failFirst = reject; }) : Promise.resolve() }, configurable: true });
  });
  await page.goto('./');
  const first = page.getByRole('button', { name: english.copyCommand, exact: true });
  await first.click();
  await page.getByRole('button', { name: english.copySkill, exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(english.copyInstructionsNotice);
  await page.evaluate(() => globalThis.failFirst(new Error('Late denial')));
  await expect(first).not.toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status')).toHaveText(english.copyInstructionsNotice);
  await expect(page.locator('#manual-instructions')).not.toHaveAttribute('open', '');
});

test('clipboard rejection reveals selectable text instead of a false success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Denied'); } }, configurable: true });
  });
  await page.goto('./#install');
  await page.getByRole('button', { name: english.copySkill, exact: true }).click();
  await expect(page.locator('#manual-instructions')).toHaveAttribute('open', '');
  await expect(page.locator('#skill-text')).toBeFocused();
  await expect(page.getByRole('status')).toHaveText(english.copyFailed);
  expect(await page.locator('#skill-text').evaluate((field) => field.selectionEnd - field.selectionStart)).toBe(instruction.length);
});

test('download is the real minimal skill archive under the project subpath', async ({ page, request }) => {
  await page.goto('./');
  const href = await page.getByRole('link', { name: english.download, exact: true }).getAttribute('href');
  const url = new URL(href, page.url()).href;
  const response = await request.get(url);
  expect(response.ok()).toBe(true);
  const entries = unzipSync(await response.body());
  expect(Object.keys(entries).sort()).toEqual(['humane/LICENSE', 'humane/SKILL.md']);
  expect(Buffer.from(entries['humane/SKILL.md']).toString()).toBe(instruction);
});

test('a fresh visit stays light despite dark system settings or later system changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 241, 232)');
  await expect(page.getByRole('button', { name: english.darkTheme })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('humane-appearance'))).toBe(null);
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', 'light');
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#eef1e8');
  }
});

test('an explicit appearance choice survives reload and opposing system settings', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./');
  for (const appearance of ['dark', 'light']) {
    await setAppearance(page, appearance);
    expect(await page.evaluate(() => localStorage.getItem('humane-appearance'))).toBe(appearance);
    await page.emulateMedia({ colorScheme: appearance === 'dark' ? 'light' : 'dark' });
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', appearance);
    await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', appearance);
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', appearance);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', appearance === 'dark' ? '#11281f' : '#eef1e8');
  }
});

test('saved appearances are restored before the main enhancement script', async ({ browser }) => {
  for (const appearance of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: appearance === 'dark' ? 'light' : 'dark' });
    try {
      const page = await context.newPage();
      await page.addInitScript((value) => localStorage.setItem('humane-appearance', value), appearance);
      await page.route('**/assets/main.js', (route) => route.abort());
      await page.goto('http://127.0.0.1:4178/humane/');
      await expect(page.locator('html')).not.toHaveClass(/\bjs\b/);
      await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', appearance);
      await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', appearance);
      await expect(page.locator('body')).toHaveCSS('background-color', appearance === 'dark' ? 'rgb(17, 40, 31)' : 'rgb(238, 241, 232)');
    } finally { await context.close(); }
  }
});

test('light default and manual theme switching work even with denied storage', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Denied'); };
    Storage.prototype.setItem = () => { throw new Error('Denied'); };
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 241, 232)');
  await page.getByRole('button', { name: english.darkTheme }).click();
  await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', 'dark');
  await expect(page.getByRole('button', { name: english.lightTheme })).toBeVisible();
  expect(await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(17, 40, 31)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-resolved-theme', 'light');
});

test('320px and 200% text retain all content and actions in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.goto('./');
    await setAppearance(page, colorScheme);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.evaluate(() => document.fonts.ready);
    await assertFits(page);
    const captureName = colorScheme === 'light' ? 'large-text.png' : 'large-text-dark.png';
    await page.screenshot({ path: join(repositoryRoot, '.impeccable/review', captureName), fullPage: true, animations: 'disabled' });
    for (const selector of ['.hero-actions .button', '[data-copy="install-command"]', '[data-copy="skill-text"]', '.download-button']) {
      const control = page.locator(selector);
      await control.scrollIntoViewIfNeeded();
      await expect(control).toBeInViewport();
    }
  }
});

test('core examples and downloads work with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4178/humane/');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 241, 232)');
  await expect(page.locator('.hero-intro')).toContainText('free Agent Skill');
  await expect(page.locator('.hero-license')).toContainText('MIT open-source license');
  await expect(page.getByRole('heading', { name: english.readingTitle, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: english.writingTitle, exact: true })).toBeVisible();
  await expect(page.locator('#reading-plan p')).toHaveText(english.readingSources[0].body);
  await expect(page.locator('#writing-notes p')).toHaveText(english.writingSources[0].body);
  await page.locator('#reading-finance summary').click();
  await expect(page.locator('#reading-finance p')).toHaveText(english.readingSources[1].body);
  await assertPaperFits(page);
  await expect(page.getByRole('link', { name: english.download, exact: true })).toBeVisible();
  await page.getByText(english.viewSkill, { exact: true }).click();
  await expect(page.locator('#skill-text')).toBeVisible();
  await context.close();
});
