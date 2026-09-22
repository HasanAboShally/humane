import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parseDocument } from 'yaml';
import { buildSite } from '../scripts/build-site.mjs';
import { repositoryRoot } from '../scripts/skill-package.mjs';
import { escape, renderPage } from '../site/page.mjs';

test('one content file names the originals directly and removes unused locale scaffolding', () => {
  const content = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));
  assert.equal(content.readingSourceHeading, 'Example documents');
  assert.equal(content.writingSourceHeading, 'Original notes');
  assert.equal(content.readingSources.length, 3);
  assert.equal(content.writingSources.length, 1);
  assert.equal(content.faqs.length, 3);
  assert.match(content.demoDisclosure, /Fictional examples/);
  assert.match(content.privateHint, /optional installer uses Node\.js and Git/);
  assert.match(content.privateHint, /No GitHub sign-in is required/);
  assert.doesNotMatch(content.privateHint, /repository access|repository is private/i);
  assert.equal(content.careItems, undefined);
  assert.equal(content.language, undefined);
  assert.ok(!existsSync(join(repositoryRoot, 'site/i18n/ar.json')));
  assert.ok(!existsSync(join(repositoryRoot, 'site/i18n/en.json')));
  const styles = readFileSync(join(repositoryRoot, 'site/styles.css'), 'utf8');
  assert.doesNotMatch(styles, /noto-arabic|Noto Sans Arabic|\[lang=ar\]|\[dir=rtl\]|\.language-link/);
  const manifest = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8'));
  assert.equal(manifest.devDependencies['@fontsource-variable/noto-sans-arabic'], undefined);
});

test('the hero keeps product identity, a short reading budget, and honest licensing context', () => {
  const content = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));
  assert.match(content.intro, /free Agent Skill/);
  assert.ok(content.intro.trim().split(/\s+/u).length <= 35);
  assert.equal(content.heroLicense, 'MIT open-source license');
  assert.match(content.heroAvailability, /Experimental/);
  assert.ok(content.heroAvailability.includes(JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8')).version));
  assert.match(content.description, /Agent Skill/);
  assert.match(content.description, /MIT-licensed and experimental/);
  assert.doesNotMatch(JSON.stringify(content), /private preview|private repository|repository is private/i);
  const html = renderPage({ t: content, skill: '', root: repositoryRoot, siteUrl: 'http://127.0.0.1:4178/humane/' });
  assert.match(html, /name="color-scheme" content="light"/);
  assert.ok(html.includes(`<a href="./downloads/LICENSE.txt">${escape(content.heroLicense)}</a>`));
  const styles = readFileSync(join(repositoryRoot, 'site/styles.css'), 'utf8');
  assert.doesNotMatch(styles, /prefers-color-scheme/);
});

test('the header exposes the canonical repository link without depending on JavaScript', () => {
  const content = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));
  const html = renderPage({ t: content, skill: '', root: repositoryRoot, siteUrl: 'http://127.0.0.1:4178/humane/' });
  const header = html.match(/<header class="site-header">([\s\S]*?)<\/header>/)[1];
  const link = header.match(/<a class="text-link header-github"[^>]*>[\s\S]*?<\/a>/)[0];
  assert.ok(link.includes('href="https://github.com/HasanAboShally/humane"'));
  assert.ok(link.includes(`aria-label="${escape(content.repoLink)}"`));
  assert.ok(link.includes(escape(content.githubNav)));
  assert.match(link, /aria-hidden="true" focusable="false" data-icon="arrow-up-right"/);
  assert.doesNotMatch(link, /js-only|target=/);
});

test('the document desk retains complete source text, first-open originals, and citation targets', () => {
  const content = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));
  const html = renderPage({ t: content, skill: '', root: repositoryRoot, siteUrl: 'http://127.0.0.1:4178/humane/' });
  assert.equal((html.match(/class="example-desk"/g) || []).length, 1);
  assert.equal((html.match(/class="result-sheet"/g) || []).length, 2);
  for (const [mode, sources] of [['reading', content.readingSources], ['writing', content.writingSources]]) {
    for (const [index, source] of sources.entries()) {
      assert.ok(html.includes(`<details class="source-card" id="${mode}-${source.id}"${index === 0 ? ' open' : ''}>`));
      assert.ok(html.includes(`<p>${escape(source.body)}</p>`));
      assert.ok(html.includes(`href="#${mode}-${source.id}" data-source-link`));
    }
    assert.ok(html.includes(`id="${mode}-result" tabindex="-1" data-result`));
  }
  assert.ok(html.includes(escape(content.readingCoverage)));
  assert.ok(html.includes(escape(content.writingCoverage)));
});

test('Pages can only be published by an explicitly enabled manual invocation', () => {
  const document = parseDocument(readFileSync(join(repositoryRoot, '.github/workflows/pages.yml'), 'utf8'));
  assert.deepEqual(document.errors, []);
  const flow = document.toJS();
  assert.deepEqual(Object.keys(flow.on), ['workflow_dispatch']);
  assert.equal(flow.on.workflow_dispatch.inputs.publish.default, false);
  for (const job of Object.values(flow.jobs)) {
    assert.match(job.if, /inputs\.publish/);
    assert.match(job.if, /HUMANE_PAGES_ENABLED == 'true'/);
  }
  assert.deepEqual(flow.permissions, { contents: 'read' });
  assert.deepEqual(flow.jobs.build.permissions, { contents: 'read', pages: 'read' });
  assert.equal(flow.jobs.build.steps.find((step) => step.uses?.startsWith('actions/checkout')).with['persist-credentials'], false);
  const build = flow.jobs.build.steps.find((step) => step.run === 'npm run build:site');
  assert.equal(build.env.HUMANE_SITE_INDEXABLE, 'true');
  assert.equal(build.env.HUMANE_SITE_URL, '${{ steps.pages.outputs.base_url }}/');
  assert.equal(flow.jobs.build.steps.find((step) => step.uses?.startsWith('actions/upload-pages-artifact')).with.path, 'dist/site');
  assert.equal(flow.jobs.deploy.needs, 'build');
  assert.deepEqual(flow.jobs.deploy.permissions, { contents: 'read', pages: 'write', 'id-token': 'write' });
});

test('static output excludes private notes, tests, repository metadata, and dependency folders', async () => {
  const output = join(repositoryRoot, 'dist/test-site');
  try {
    await buildSite({ output });
    assert.deepEqual(readdirSync(output).sort(), ['.nojekyll', '404.html', 'assets', 'downloads', 'index.html', 'index.md', 'llms.txt', 'robots.txt']);
    assert.ok(!existsSync(join(output, 'ar')));
    assert.ok(!existsSync(join(output, 'assets/noto-arabic.woff2')));
    const html = readFileSync(join(output, 'index.html'), 'utf8');
    assert.match(html, /seed 7fdba6bf/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /href="\.\/downloads\/humane.zip"/);
    assert.doesNotMatch(html, /Replay animation|data-replay|class="replay/);
    assert.doesNotMatch(html, /src="https?:\/\/|hreflang=|lang="ar"|language-link|care-section/);
    assert.deepEqual(readFileSync(join(output, 'downloads/humane.md')), readFileSync(join(repositoryRoot, 'skills/humane/SKILL.md')));
    assert.ok(readFileSync(join(output, 'assets/social.png')).length < 300000);
  } finally { rmSync(output, { recursive: true, force: true }); }
});

test('website builder refuses destinations outside dist and symbolic-link ancestors', async () => {
  await assert.rejects(() => buildSite({ output: repositoryRoot }), /child.*dist/);
  const external = mkdtempSync(join(tmpdir(), 'humane-external-'));
  const link = join(repositoryRoot, 'dist/blocked-site-link');
  try {
    symlinkSync(external, link, 'dir');
    await assert.rejects(() => buildSite({ output: join(link, 'site') }), /symbolic links/);
    assert.deepEqual(readdirSync(external), []);
  } finally {
    rmSync(link, { force: true });
    rmSync(external, { recursive: true, force: true });
  }
});
