import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lensMarkup, markMarkup } from './artwork.mjs';
import { identity, questionId, robotsDirective, searchMetadata, serializeJsonLd, validateSiteUrl } from './discovery.mjs';

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export function renderPage({ t, skill, root, siteUrl, indexable = false }) {
  const e = escape;
  siteUrl = validateSiteUrl(siteUrl, indexable).href;
  const prefix = './';
  const imageUrl = new URL('assets/social.png', siteUrl).href;
  const imageAlt = `${identity.name} — ${t.headline.join(' ')}`;
  const icon = (name, className = '') => readFileSync(join(root, 'node_modules/lucide-static/icons', `${name}.svg`), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '').replace('<svg', `<svg aria-hidden="true" focusable="false" data-icon="${name}"`)
    .replace(/class="[^"]*"/, `class="icon ${className}"`).replace('stroke-width="2"', 'stroke-width="1.6"');
  const sources = (items, mode) => items.map((source, index) => `<details class="source-card" id="${mode}-${source.id}"${index === 0 ? ' open' : ''}><summary><span>${icon('file-text')}<span><strong>${e(source.title)}</strong><span class="source-date">${e(source.meta)}</span></span></span>${icon('plus', 'disclosure-icon')}</summary><p>${e(source.body)}</p><a class="source-return" href="#${mode}-result" data-source-return>${icon('corner-down-left', 'directional')}${e(t.backToExample)}</a></details>`).join('');
  let referenceNumber = 0;
  const link = (id, label) => `<a class="source-link" id="reference-${++referenceNumber}" href="#${id}" data-source-link>${e(label)}${icon('arrow-up-right', 'directional')}</a>`;
  const panel = (mode, writing) => `<section class="example-panel" id="${mode}-panel" aria-labelledby="${mode}-tab">
    <div class="input-side"><h3>${e(writing ? t.writingSourceHeading : t.readingSourceHeading)}</h3><p class="source-hint">${e(t.sourceHint)}</p><div class="source-stack">${sources(writing ? t.writingSources : t.readingSources, mode)}</div><div class="example-request"><span>${e(t.requestLabel)}</span><p>${e(writing ? t.writingRequest : t.readingRequest)}</p></div></div>
    <div class="result-sheet"><span class="example-flow" aria-hidden="true">${icon('arrow-right')}</span><article class="output-side" id="${mode}-result" tabindex="-1" data-result aria-labelledby="${mode}-result-title"><div class="paper-content"><h3 id="${mode}-result-title">${e(writing ? t.writingTitle : t.readingTitle)}</h3><p class="output-lead">${e(writing ? t.writingLead : t.readingLead)}</p><p>${e(writing ? t.writingCondition : t.readingCondition)}</p><div class="source-links">${writing ? link('writing-notes', t.notesLink) : link('reading-plan', t.planLink) + link('reading-finance', t.financeLink)}</div><p class="output-next">${e(writing ? t.writingNext : t.readingNext)}</p>${writing ? '' : `<div class="source-links">${link('reading-finance', t.financeLink)}${link('reading-status', t.statusLink)}</div>`}</div><p class="coverage">${e(writing ? t.writingCoverage : t.readingCoverage)}</p></article></div>
  </section>`;

  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(t.title)}</title><meta name="description" content="${e(t.description)}">
  <meta name="robots" content="${robotsDirective(indexable)}"><meta name="theme-color" content="#eef1e8">
  <meta name="color-scheme" content="light"><meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="author" content="${e(identity.author)}">
  <link rel="canonical" href="${e(siteUrl)}">
  <link rel="alternate" type="text/markdown" href="${prefix}index.md" title="${e(t.readMarkdown)}">
  <meta property="og:type" content="website"><meta property="og:title" content="${e(t.title)}"><meta property="og:description" content="${e(t.description)}">
  <meta property="og:url" content="${e(siteUrl)}"><meta property="og:site_name" content="Humane"><meta property="og:locale" content="en_US">
  <meta property="og:image" content="${e(imageUrl)}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(t.title)}"><meta name="twitter:description" content="${e(t.description)}"><meta name="twitter:image" content="${e(imageUrl)}"><meta name="twitter:image:alt" content="${e(imageAlt)}">
  <script id="site-schema" type="application/ld+json">${serializeJsonLd(searchMetadata({ t, siteUrl }))}</script>
  <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${prefix}assets/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <script src="${prefix}assets/theme.js"></script>
  <link rel="stylesheet" href="${prefix}assets/styles.css"><script src="${prefix}assets/main.js" defer></script>
</head>
<body data-copy-notice="${e(t.copyNotice)}" data-copy-failed="${e(t.copyFailed)}">
<!-- THESIS: An optical instrument for human attention, not a dashboard of AI promises.
OWN-WORLD: Pale mineral green, pine ink, open Manrope lettering, fine continuous strands, quiet rounded controls. The dark counterpart is deep pine, never neon.
STORY: Recognize document overload, inspect a real illustrative handoff, take the small skill into an existing assistant.
FIRST VIEWPORT: Left-aligned two-line statement and clear action; a large open band of threads on the right. A low, readable navigation bar. No metrics or fake app chrome.
FORM: Grounded direction 3, optical comparison bench; seed 7fdba6bf. Code-first explicitly delegated. Repeated reading becomes one legible picture.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->
<a class="skip-link" href="#main">${e(t.skip)}</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="./" aria-label="Humane" translate="no">${markMarkup}<span>humane</span></a><nav aria-label="${e(t.navigation)}"><a class="nav-example" href="#difference">${e(t.exampleNav)}</a><a class="nav-install" href="#install">${e(t.installNav)}${icon('arrow-up-right', 'directional')}</a></nav><div class="header-tools"><a class="text-link header-github" href="${e(identity.repository)}" aria-label="${e(t.repoLink)}" title="${e(t.repoLink)}">${e(t.githubNav)}${icon('arrow-up-right', 'directional')}</a><button class="icon-button theme-toggle js-only" type="button" data-theme-toggle data-light-label="${e(t.lightTheme)}" data-dark-label="${e(t.darkTheme)}" aria-label="${e(t.darkTheme)}">${icon('sun', 'sun-icon')}${icon('moon', 'moon-icon')}</button></div></div></header>
<main id="main">
  <section class="hero shell" aria-labelledby="hero-title"><div class="hero-copy"><h1 id="hero-title"><span>${e(t.headline[0])}</span><span>${e(t.headline[1])}</span></h1><p class="hero-intro">${e(t.intro)}</p><p class="hero-license"><a href="${prefix}downloads/LICENSE.txt">${e(t.heroLicense)}</a><span>${e(t.heroAvailability)}</span></p><div class="hero-actions"><a class="button button-primary" href="#install">${e(t.heroPrimary)}${icon('arrow-up-right', 'directional')}</a><a class="text-link" href="#difference">${e(t.heroSecondary)}${icon('arrow-down', 'directional')}</a></div></div><div class="hero-art" aria-hidden="true">${lensMarkup()}</div></section>

  <section class="demo-section shell" id="difference" aria-labelledby="demo-title"><div class="section-heading"><h2 id="demo-title">${e(t.demoTitle)}</h2></div><div class="example-desk"><div class="example-controls"><div class="example-picker js-only" aria-label="${e(t.demoTabs)}"><button type="button" id="reading-tab" data-example="reading" class="is-active">${e(t.readingTab)}</button><button type="button" id="writing-tab" data-example="writing">${e(t.writingTab)}</button></div><p class="demo-disclosure">${e(t.demoDisclosure)}</p></div><div class="examples">${panel('reading', false)}${panel('writing', true)}</div></div></section>

  <section class="install-section" id="install" aria-labelledby="install-title"><div class="shell"><div class="section-heading"><h2 id="install-title">${e(t.installTitle)}</h2><p>${e(t.installIntro)}</p></div><div class="install-grid"><div class="install-code"><p class="command-label">${e(t.commandLabel)}</p><div class="command-row"><pre class="command-text" id="install-command" tabindex="0" translate="no"><code>npx skills add HasanAboShally/humane</code></pre><button class="copy-command js-only" data-copy="install-command" data-copy-failure-hint="${e(t.copyCommandFailed)}" type="button" aria-label="${e(t.copyCommand)}">${icon('copy')}<span>${e(t.copyCommand)}</span></button></div><p class="private-hint">${icon('lock-keyhole')}<span>${e(t.privateHint)}</span></p><div class="skill-links"><a class="button button-secondary download-button" href="${prefix}downloads/humane.zip" download="humane.zip">${e(t.download)}${icon('download')}</a><a class="text-link" href="${prefix}downloads/humane.md" type="text/markdown">${e(t.readSkill)}${icon('arrow-up-right', 'directional')}</a></div><p class="small-note">${e(t.downloadHint)}</p></div><div class="install-chat"><h3>${e(t.chatTitle)}</h3><p>${e(t.chatBody)}</p><button class="button button-secondary js-only" data-copy="skill-text" data-copy-notice="${e(t.copyInstructionsNotice)}" data-copy-failure-hint="${e(t.copyInstructionsFailed)}" type="button">${e(t.copySkill)}${icon('copy')}</button><details class="manual-instructions" id="manual-instructions"><summary>${e(t.viewSkill)}${icon('chevron-down', 'disclosure-icon')}</summary><textarea id="skill-text" readonly spellcheck="false" translate="no" aria-label="${e(t.skillLabel)}">${e(skill)}</textarea></details></div></div><p class="install-requirements">${e(t.costNote)}</p><noscript><p>${e(t.noJs)}</p></noscript></div></section>

  <section class="faq-section shell" aria-labelledby="faq-title"><h2 id="faq-title">${e(t.faqTitle)}</h2><div>${t.faqs.map(([question, answer], index) => `<details class="faq" id="${questionId(index)}"><summary><span>${e(question)}</span>${icon('plus', 'disclosure-icon')}</summary><p>${e(answer)}</p></details>`).join('')}</div></section>
</main>
<footer class="site-footer shell"><div class="footer-top"><a class="brand" href="#main" aria-label="Humane" translate="no">${markMarkup}<span>humane</span></a><div class="footer-links"><a href="${e(identity.repository)}">${e(t.repoLink)}${icon('arrow-up-right', 'directional')}</a><a href="${prefix}downloads/LICENSE.txt">${e(t.licenseLink)}</a><a href="${prefix}index.md" type="text/markdown">${e(t.readMarkdown)}</a></div></div><p class="footer-legal">${e(t.footerLegal)}</p></footer>
<p id="copy-status" class="copy-status" role="status" aria-live="polite" aria-atomic="true"></p>
</body></html>`;
}

export function renderNotFound(siteUrl) {
  const base = escape(new URL(siteUrl).pathname);
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#eef1e8"><title>Page not found — Humane</title><script src="${base}assets/theme.js"></script><link rel="stylesheet" href="${base}assets/styles.css"></head><body><main class="not-found shell"><a class="brand" href="${base}" aria-label="Humane">${markMarkup}<span>humane</span></a><h1>Page not found.</h1><p>This address does not point to a page in Humane.</p><a class="button button-primary" href="${base}">Return to Humane</a></main></body></html>\n`;
}
