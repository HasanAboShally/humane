import assert from 'node:assert/strict';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { discoveryFiles, identity, questionId, searchMetadata, serializeJsonLd, validateSiteUrl } from '../site/discovery.mjs';
import { renderPage } from '../site/page.mjs';
import { buildSite } from '../scripts/build-site.mjs';
import { repositoryRoot } from '../scripts/skill-package.mjs';

const t = JSON.parse(readFileSync(join(repositoryRoot, 'site/content.json'), 'utf8'));

test('search and social metadata identify the actual skill with consistent project and custom-domain URLs', () => {
  for (const siteUrl of ['https://hasanaboshally.github.io/humane/', 'https://example.test/', 'https://example.test/nested/preview/']) {
    const html = renderPage({ t, skill: '', root: repositoryRoot, siteUrl });
    assert.match(t.title, /Humane.*Agent Skill/);
    assert.ok(t.title.length <= 70 && t.description.length <= 180);
    assert.equal((html.match(/<title>/g) || []).length, 1);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.equal(canonical, siteUrl);
    for (const [key, value] of [['og:url', siteUrl], ['og:site_name', 'Humane'], ['og:title', t.title], ['twitter:title', t.title], ['og:image:type', 'image/png'], ['og:image', new URL('assets/social.png', siteUrl).href], ['twitter:image', new URL('assets/social.png', siteUrl).href]]) {
      assert.equal((html.match(new RegExp(`(?:name|property)="${key}"`, 'g')) || []).length, 1);
      assert.ok(html.includes(`="${key}" content="${value}"`));
    }
    const data = JSON.parse(html.match(/<script id="site-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const graph = data['@graph'];
    const work = graph.find((node) => node['@type'] === 'CreativeWork');
    assert.equal(work.name, 'Humane Agent Skill');
    assert.equal(work.description, t.intro);
    assert.equal(work.encodingFormat, 'text/markdown');
    assert.equal(work.license, new URL('downloads/LICENSE.txt', siteUrl).href);
    assert.equal(work.url, new URL('downloads/humane.md', siteUrl).href);
    assert.equal(graph.find((node) => node['@type'] === 'Person').name, identity.author);
    assert.ok(graph.every((node) => node['@id'].startsWith(siteUrl)));
    assert.doesNotMatch(JSON.stringify(data), /aggregateRating|ratingValue|SoftwareApplication|offers|priceCurrency|dateModified/);
  }
});

test('JSON-LD retains text exactly while preventing script termination', () => {
  const attack = '</script><script>alert("not executable")</script>&\u2028\u2029';
  const data = searchMetadata({ t: { ...t, intro: attack, title: attack }, siteUrl: 'https://example.test/humane/' });
  const encoded = serializeJsonLd(data);
  assert.doesNotMatch(encoded, /[<>&\u2028\u2029]/);
  assert.deepEqual(JSON.parse(encoded), data);
});

test('Markdown exports retain the actual examples, caveats, installation limits, and stable source links', () => {
  const siteUrl = 'https://example.test/humane/';
  const files = discoveryFiles({ t, siteUrl });
  const markdown = files.get('index.md');
  const index = files.get('llms.txt');
  assert.ok(t.footerLegal.includes(identity.author));
  const html = renderPage({ t, skill: '', root: repositoryRoot, siteUrl });
  assert.doesNotMatch(html + markdown + index + readFileSync(join(repositoryRoot, 'README.md'), 'utf8'), /not affiliated|similarly named/i);
  for (const value of [t.intro, t.demoDisclosure, t.privateHint, t.costNote, t.footerLegal, t.readingLead, t.readingCondition, t.readingNext, t.readingCoverage, t.writingLead, t.writingCondition, t.writingNext, t.writingCoverage]) {
    assert.ok(markdown.includes(value));
  }
  for (const mode of ['reading', 'writing']) {
    for (const source of t[`${mode}Sources`]) {
      assert.ok(markdown.includes(source.body));
      assert.ok(markdown.includes(`${siteUrl}#${mode}-${source.id}`));
    }
  }
  t.faqs.forEach(([question, answer], position) => {
    assert.ok(markdown.includes(question) && markdown.includes(answer));
    assert.ok(markdown.includes(`${siteUrl}#${questionId(position)}`));
    assert.ok(index.includes(answer));
  });
  assert.ok(index.includes(`${siteUrl}index.md`));
  assert.ok(index.includes(`${siteUrl}downloads/humane.md`));
  assert.ok(index.includes(t.heroAvailability) && index.includes(t.demoDisclosure));
  assert.doesNotMatch(markdown + index, /smoke-results|\/Users\/|node_modules|\.env|ignore (?:all|previous) instructions/i);
});

test('crawl readiness is opt-in, has no invented timestamps, and preview rebuilding removes a stale sitemap', async () => {
  const siteUrl = 'https://example.test/humane/';
  const output = join(repositoryRoot, 'dist/test-discovery');
  try {
    const preview = discoveryFiles({ t, siteUrl });
    assert.match(preview.get('robots.txt'), /User-agent: \*\nDisallow: \/\n/);
    assert.match(preview.get('robots.txt'), /https:\/\/example.test\/robots.txt/);
    assert.ok(!preview.has('sitemap.xml'));
    await buildSite({ siteUrl, output, indexable: true });
    assert.match(readFileSync(join(output, 'index.html'), 'utf8'), /content="index, follow, max-image-preview:large"/);
    const sitemap = readFileSync(join(output, 'sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes(`<loc>${siteUrl}</loc>`));
    assert.doesNotMatch(sitemap, /lastmod|priority|changefreq|downloads|index.md|llms.txt/);
    assert.match(readFileSync(join(output, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/example.test\/humane\/sitemap.xml/);
    assert.match(readFileSync(join(output, '404.html'), 'utf8'), /content="noindex, nofollow"/);
    await buildSite({ siteUrl, output });
    assert.ok(!existsSync(join(output, 'sitemap.xml')));
    assert.match(readFileSync(join(output, 'index.html'), 'utf8'), /content="noindex, nofollow"/);
  } finally { rmSync(output, { recursive: true, force: true }); }
});

test('site URL and indexing configuration fail closed', () => {
  for (const url of ['ftp://example.test/', 'https://user:secret@example.test/', 'https://example.test/?x=1', 'https://example.test/#x', 'https://example.test/path']) {
    assert.throws(() => validateSiteUrl(url));
  }
  assert.throws(() => validateSiteUrl('https://example.test/', 'false'), /boolean/);
  assert.throws(() => validateSiteUrl('http://example.test/', true), /HTTPS/);
  assert.throws(() => validateSiteUrl('https://localhost/', true), /HTTPS/);
  assert.throws(() => renderPage({ t, skill: '', root: repositoryRoot, siteUrl: 'http://127.0.0.1/', indexable: true }), /HTTPS/);
});
