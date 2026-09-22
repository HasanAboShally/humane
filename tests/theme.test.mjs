import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { repositoryRoot } from '../scripts/skill-package.mjs';

const source = readFileSync(join(repositoryRoot, 'site/theme.js'), 'utf8');
const bootstrap = (saved, unavailable = false) => {
  const root = { dataset: {} };
  const metadata = {};
  runInNewContext(source, {
    document: {
      documentElement: root,
      querySelector: (selector) => ({ setAttribute: (name, value) => {
        assert.equal(name, 'content');
        metadata[selector] = value;
      } }),
    },
    localStorage: {
      getItem: (key) => {
        assert.equal(key, 'humane-appearance');
        if (unavailable) throw new Error('Storage unavailable');
        return saved;
      },
      setItem: () => { assert.fail('The default must not overwrite a saved choice'); },
    },
    matchMedia: () => { assert.fail('The site default must not depend on the OS theme'); },
  });
  return { root, metadata };
};

test('early appearance restores only explicit light or dark, otherwise defaults to light', () => {
  for (const saved of [null, '', 'system', 'sepia', 'LIGHT', 'light', 'dark']) {
    const expected = saved === 'dark' ? 'dark' : 'light';
    const { root, metadata } = bootstrap(saved);
    assert.equal(root.dataset.theme, expected);
    assert.equal(root.dataset.resolvedTheme, expected);
    assert.equal(metadata['meta[name="color-scheme"]'], expected);
    assert.equal(metadata['meta[name="theme-color"]'], expected === 'dark' ? '#11281f' : '#eef1e8');
  }
});

test('an unavailable preference store keeps the light bootstrap and browser chrome', () => {
  const { root, metadata } = bootstrap(null, true);
  assert.equal(root.dataset.theme, 'light');
  assert.equal(root.dataset.resolvedTheme, 'light');
  assert.equal(metadata['meta[name="color-scheme"]'], 'light');
  assert.equal(metadata['meta[name="theme-color"]'], '#eef1e8');
});
