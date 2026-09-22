import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { repositoryRoot } from '../../scripts/skill-package.mjs';

const t = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));
const captureDirectory = join(repositoryRoot, '.impeccable/review');
mkdirSync(captureDirectory, { recursive: true });

test('the original subtle entrance preserves its endpoints and stays inside the artwork at all tested sizes', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const variant of [{ name: 'desktop', width: 1440, scale: '100%' }, { name: 'mobile', width: 390, scale: '100%' }, { name: 'large-text', width: 320, scale: '200%' }]) {
    await page.setViewportSize({ width: variant.width, height: 960 });
    await page.goto('./');
    await page.evaluate((scale) => { document.documentElement.style.fontSize = scale; }, variant.scale);
    await expect(page.locator('[data-replay], .replay, [data-motion-toggle]')).toHaveCount(0);
    await page.locator('.hero-art').scrollIntoViewIfNeeded();
    const samples = [];
    for (const time of [0, 650, 1300]) {
      const sample = await page.locator('.signal-lens').evaluate(async (lens, currentTime) => {
        const animation = lens.getAnimations().find((item) => item.animationName === 'lens-arrive');
        if (!animation) throw new Error('Subtle entrance animation is missing');
        animation.pause();
        animation.currentTime = currentTime;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const bounds = lens.closest('.hero-art').getBoundingClientRect();
        const escaped = [];
        for (const path of lens.querySelectorAll('.lens-strands path')) {
          const length = path.getTotalLength();
          const matrix = path.getScreenCTM();
          for (let step = 0; step <= 12; step += 1) {
            const point = path.getPointAtLength(length * step / 12).matrixTransform(matrix);
            if (point.x < bounds.left - 1 || point.x > bounds.right + 1 || point.y < bounds.top - 1 || point.y > bounds.bottom + 1 || point.x < -1 || point.x > innerWidth + 1) escaped.push({ x: point.x, y: point.y });
          }
        }
        const style = getComputedStyle(lens);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return { scale: Math.hypot(matrix.a, matrix.b), angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI, opacity: Number(style.opacity), escaped: escaped.slice(0, 4), timing: animation.effect.getTiming(), width: document.documentElement.scrollWidth, viewport: innerWidth };
      }, time);
      expect(sample.escaped).toEqual([]);
      expect(sample.timing.iterations).toBe(1);
      expect(sample.timing.duration).toBe(1300);
      expect(sample.width).toBeLessThanOrEqual(sample.viewport + 1);
      samples.push(sample);
      if ([0, 1300].includes(time) && variant.name !== 'large-text') {
        await page.locator('.hero').screenshot({ path: join(captureDirectory, `subtle-${variant.name}-${time}-${info.project.name}.png`), animations: 'allow' });
      }
    }
    expect(samples[0].scale).toBeCloseTo(.98, 3);
    expect(samples[2].scale).toBeCloseTo(1, 3);
    expect(samples[0].angle).toBeCloseTo(-14, 2);
    expect(samples[2].angle).toBeCloseTo(-9, 2);
    expect(samples[0].opacity).toBeCloseTo(.65, 2);
    expect(samples[2].opacity).toBe(1);
  }
});

test('the settled artwork does not restart on scrolling, theme changes, or page lifecycle events', async ({ page }) => {
  await page.addInitScript(() => { globalThis.IntersectionObserver = undefined; });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const lens = page.locator('.signal-lens');
  await lens.evaluate((element) => {
    globalThis.originalEntrance = element.getAnimations().find((item) => item.animationName === 'lens-arrive');
    globalThis.originalEntrance.finish();
  });
  await page.locator('#install').scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.getByRole('button', { name: t.darkTheme }).click();
  await page.evaluate(() => {
    dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  const state = await lens.evaluate((element) => {
    const animation = element.getAnimations().find((item) => item.animationName === 'lens-arrive');
    return { same: animation === globalThis.originalEntrance, state: animation.playState, time: animation.currentTime, infinite: document.getAnimations().some((item) => item.effect.getTiming().iterations === Infinity) };
  });
  expect(state).toEqual({ same: true, state: 'finished', time: 1300, infinite: false });
  await expect(page.locator('.lens-strands')).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-copy')).toHaveCSS('animation-name', 'none');
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('reduced motion and no JavaScript keep the original still artwork with no animation controls', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.signal-lens')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('[data-motion-toggle], [data-replay]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: t.copySkill })).toBeVisible();
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.locator('.hero-art')).toBeHidden();
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
  try {
    const noJs = await context.newPage();
    await noJs.goto('http://127.0.0.1:4178/humane/');
    await expect(noJs.locator('.signal-lens')).toHaveCSS('animation-name', 'none');
    await expect(noJs.locator('.signal-lens')).toBeVisible();
    await expect(noJs.getByRole('link', { name: t.download, exact: true })).toBeVisible();
  } finally { await context.close(); }
});

test('search metadata, agent links, canonical routes and FAQ fragments work in the built preview', async ({ page, request }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(t.title);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  const data = await page.locator('#site-schema').textContent();
  expect(JSON.parse(data)['@graph'].some((node) => node['@type'] === 'CreativeWork' && node.encodingFormat === 'text/markdown')).toBe(true);
  await expect(page.getByRole('link', { name: t.readSkill, exact: true })).toHaveAttribute('href', './downloads/humane.md');
  await expect(page.getByRole('link', { name: t.readMarkdown, exact: true })).toHaveAttribute('href', './index.md');
  for (const [path, type] of [['index.md', 'text/markdown'], ['llms.txt', 'text/plain'], ['downloads/humane.md', 'text/markdown']]) {
    const response = await request.get(new URL(path, page.url()).href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain(type);
    expect(response.headers()['x-robots-tag']).toBe('noindex');
    const head = await request.head(new URL(path, page.url()).href);
    expect(head.status()).toBe(200);
    expect(head.headers()['content-length']).toBe(response.headers()['content-length']);
    expect((await head.body()).length).toBe(0);
    if (path === 'index.md') expect(await response.text()).toContain(t.readingCoverage);
    if (path === 'downloads/humane.md') expect(await response.text()).toBe(readFileSync(join(repositoryRoot, 'skills/humane/SKILL.md'), 'utf8'));
  }
  const redirect = await request.get('http://127.0.0.1:4178/humane/index.html', { maxRedirects: 0 });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers().location).toBe('/humane/');
  const robots = await request.get('http://127.0.0.1:4178/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Disallow: /');
  await page.goto('./#question-2');
  await expect(page.locator('#question-2')).toHaveAttribute('open', '');
  await expect(page.locator('#question-2 summary')).toBeFocused();
});

test('unknown paths return a styled non-indexable 404 with a working home link', async ({ page }) => {
  const response = await page.goto('./missing-page');
  expect(response.status()).toBe(404);
  expect(response.headers()['x-robots-tag']).toBe('noindex');
  await expect(page).toHaveTitle('Page not found — Humane');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found.');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 241, 232)');
  await page.getByRole('link', { name: 'Return to Humane' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4178/humane/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(t.headline[0]);
});
