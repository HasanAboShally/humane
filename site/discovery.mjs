// Search and agent-readable representations share the visible page's source content.
export const identity = Object.freeze({ name: 'Humane', author: 'Hasan Abo-Shally', repository: 'https://github.com/HasanAboShally/humane' });

export function validateSiteUrl(siteUrl, indexable = false) {
  if (typeof indexable !== 'boolean') throw new TypeError('Indexable must be an explicit boolean.');
  const url = new URL(siteUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Use a clean HTTP(S) site URL.');
  if (!url.pathname.endsWith('/')) throw new Error('Site URL must end in a slash.');
  if (indexable && (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw new Error('Indexable builds require a public HTTPS site URL.');
  return url;
}

export const questionId = (index) => `question-${index + 1}`;
export const robotsDirective = (indexable = false) => indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow';
export const serializeJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export function searchMetadata({ t, siteUrl }) {
  const url = validateSiteUrl(siteUrl);
  const at = (path) => new URL(path, url).href;
  const creator = { '@id': at('#creator') };
  const work = { '@id': at('#skill') };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': creator['@id'], name: identity.author },
      { '@type': 'WebSite', '@id': at('#website'), name: identity.name, url: url.href, inLanguage: 'en', publisher: creator },
      {
        '@type': 'WebPage', '@id': at('#webpage'), url: url.href, name: t.title,
        description: t.description, inLanguage: 'en', isPartOf: { '@id': at('#website') },
        mainEntity: work, author: creator,
        primaryImageOfPage: { '@type': 'ImageObject', contentUrl: at('assets/social.png'), width: 1200, height: 630, caption: `${identity.name} — ${t.headline.join(' ')}` },
      },
      {
        '@type': 'CreativeWork', '@id': work['@id'], name: `${identity.name} Agent Skill`,
        description: t.intro, genre: 'Agent Skill', encodingFormat: 'text/markdown', inLanguage: 'en',
        url: at('downloads/humane.md'), license: at('downloads/LICENSE.txt'), author: creator,
        isAccessibleForFree: true, mainEntityOfPage: { '@id': at('#webpage') },
      },
    ],
  };
}

export function discoveryFiles({ t, siteUrl, indexable = false }) {
  const url = validateSiteUrl(siteUrl, indexable);
  const at = (path) => new URL(path, url).href;
  const link = (label, path) => `[${label.replace(/[\\[\]]/g, '\\$&')}](${at(path)})`;
  const sourceLink = (mode, source) => link(source.title, `#${mode}-${source.id}`);
  const example = (mode) => {
    const sources = t[`${mode}Sources`];
    return [
      `### ${t[`${mode}Tab`]}`,
      `#### ${t[`${mode}SourceHeading`]}`,
      ...sources.flatMap((source) => [`##### ${sourceLink(mode, source)} — ${source.meta}`, source.body]),
      `#### ${t.requestLabel}`, t[`${mode}Request`],
      `#### ${link(t[`${mode}Title`], `#${mode}-result`)}`,
      t[`${mode}Lead`], t[`${mode}Condition`],
      sources.slice(0, mode === 'reading' ? 2 : 1).map((source) => sourceLink(mode, source)).join(' · '),
      t[`${mode}Next`],
      ...(mode === 'reading' ? [sources.slice(1).map((source) => sourceLink(mode, source)).join(' · ')] : []),
      t[`${mode}Coverage`],
    ].join('\n\n');
  };
  const markdown = [
    `# ${identity.name}`, t.intro,
    `${link(t.heroLicense, 'downloads/LICENSE.txt')} · ${t.heroAvailability}`,
    `Canonical page: ${url.href}`,
    `## ${t.demoTitle}`, t.demoDisclosure, example('reading'), example('writing'),
    `## ${t.installTitle}`, t.installIntro, `### ${t.commandLabel}`,
    '```sh\nnpx skills add HasanAboShally/humane\n```', t.privateHint,
    link(t.download, 'downloads/humane.zip'), t.downloadHint,
    link(t.readSkill, 'downloads/humane.md'),
    `### ${t.chatTitle}`, t.chatBody, t.costNote,
    `## ${t.faqTitle}`,
    ...t.faqs.flatMap(([question, answer], index) => [`### ${link(question, `#${questionId(index)}`)}`, answer]),
    `[${t.repoLink}](${identity.repository})`, t.footerLegal,
  ].join('\n\n') + '\n';

  const llms = [
    `# ${identity.name}`, `> ${t.description}`, t.heroAvailability,
    t.intro,
    '## Pages and downloads',
    `- ${link('Website', '')}: the human-readable page.`,
    `- ${link('Full page in Markdown', 'index.md')}: the same content, including source texts, fictional examples, and limitations.`,
    `- ${link('Humane Agent Skill', 'downloads/humane.md')}: complete, optional skill instructions for use in an assistant.`,
    `- ${link('MIT license', 'downloads/LICENSE.txt')}: license for the skill.`,
    '## Before using the skill', t.privateHint, t.costNote,
    ...t.faqs.map(([question, answer]) => `${question}\n\n${answer}`),
    t.demoDisclosure, t.footerLegal,
  ].join('\n\n') + '\n';

  const files = new Map([['index.md', markdown], ['llms.txt', llms]]);
  const rootNote = url.pathname === '/' ? '' : `# Crawler rules must be served at ${url.origin}/robots.txt; this project copy does not control the host.\n`;
  files.set('robots.txt', rootNote + (indexable ? `User-agent: *\nAllow: ${url.pathname}\nSitemap: ${at('sitemap.xml')}\n` : 'User-agent: *\nDisallow: /\n'));
  if (indexable) {
    const location = url.href.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    files.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${location}</loc></url></urlset>\n`);
  }
  return files;
}
