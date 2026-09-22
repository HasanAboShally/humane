import { existsSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { create } from 'fontkit';
import sharp from 'sharp';
import { buildArtifacts } from './package.mjs';
import { readSkillPackage, repositoryRoot } from './skill-package.mjs';
import { renderPage, renderNotFound, escape } from '../site/page.mjs';
import { lensMarkup } from '../site/artwork.mjs';
import { discoveryFiles, validateSiteUrl } from '../site/discovery.mjs';

export const plannedSiteUrl = 'https://hasanaboshally.github.io/humane/';

export async function buildSite({ root = repositoryRoot, output = join(repositoryRoot, 'dist/site'), siteUrl = plannedSiteUrl, indexable = false } = {}) {
  const url = validateSiteUrl(siteUrl, indexable);
  if (resolve(output) === resolve(root) || !resolve(output).startsWith(`${resolve(root)}/dist/`)) {
    throw new Error('Website output must be a child of this repository’s dist directory.');
  }
  let ancestor = resolve(root);
  for (const part of ['', ...relative(root, output).split(sep)]) {
    ancestor = join(ancestor, part);
    if (existsSync(ancestor) && lstatSync(ancestor).isSymbolicLink()) throw new Error('Website output must not pass through symbolic links.');
  }
  const payload = readSkillPackage(root);
  const skill = payload['SKILL.md'].toString('utf8');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(join(output, 'assets'), { recursive: true });
  mkdirSync(join(output, 'downloads'), { recursive: true });
  const write = (path, bytes) => writeFileSync(join(output, path), bytes);
  for (const name of ['styles.css', 'theme.js', 'main.js']) write(`assets/${name}`, readFileSync(join(root, 'site', name)));
  const fonts = [
    ['manrope-latin.woff2', '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'],
  ];
  for (const [name, source] of fonts) write(`assets/${name}`, readFileSync(join(root, 'node_modules', source)));
  const licenses = ['@fontsource-variable/manrope', 'lucide-static'];
  write('assets/THIRD-PARTY-LICENSES.txt', licenses.map((name) => `${name}\n\n${readFileSync(join(root, 'node_modules', name, 'LICENSE'), 'utf8')}`).join('\n\n---\n\n'));
  const t = JSON.parse(readFileSync(join(root, 'site/content.json'), 'utf8'));
  write('index.html', renderPage({ t, skill, root, siteUrl: url.href, indexable }));
  for (const [path, bytes] of discoveryFiles({ t, siteUrl: url.href, indexable })) write(path, bytes);
  for (const [name, bytes] of buildArtifacts(root)) write(`downloads/${name}`, bytes);
  write('downloads/humane.md', payload['SKILL.md']);
  write('downloads/LICENSE.txt', payload.LICENSE);
  write('.nojekyll', '\n');
  write('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#254e3b"/><path d="M11 10v20M29 10v20M11 20c4.5-10 13.5 10 18 0" fill="none" stroke="#e5f0d1" stroke-width="3.2" stroke-linecap="round"/></svg>\n');

  // Fontkit's variation clone cannot read this WOFF2 cmap. The base glyph outlines
  // work; a narrow same-color outline gives the social raster its display weight.
  const face = create(readFileSync(join(output, 'assets/manrope-latin.woff2')));
  const textPath = (text, x, y, size, fill) => {
    const run = face.layout(text);
    let advance = 0;
    const scale = size / face.unitsPerEm;
    return run.glyphs.map((glyph, i) => {
      const position = run.positions[i];
      const path = `<path d="${glyph.path.toSVG()}" fill="${fill}" stroke="${fill}" stroke-width="12" stroke-linejoin="round" transform="translate(${x + (advance + position.xOffset) * scale} ${y - position.yOffset * scale}) scale(${scale} ${-scale})"/>`;
      advance += position.xAdvance;
      return path;
    }).join('');
  };
  const geometry = lensMarkup().replace(/class="lens-stop-a"/, 'stop-color="#b6cc88"').replace(/class="lens-stop-b"/, 'stop-color="#2c6950"').replace(/class="lens-stop-c"/, 'stop-color="#759b7c"').replace('<svg ', '<svg x="620" y="25" width="570" height="570" color="#526459" ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eef1e8"/>${geometry}${textPath('humane', 64, 92, 34, '#18382c')}${textPath('Less to read.', 64, 284, 66, '#18382c')}${textPath('More to understand.', 64, 369, 56, '#526459')}${textPath('A small skill for your existing AI assistant.', 66, 480, 22, '#526459')}</svg>`;
  const provenance = 'Original Humane optical-band geometry from site/artwork.mjs; original composition and Manrope outline lettering from scripts/build-site.mjs. Not a photograph, generated-AI image, benchmark, or product screenshot.';
  const image = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).withMetadata().withXmp(`<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:description>${escape(provenance)}</dc:description></rdf:Description></rdf:RDF></x:xmpmeta>`).toBuffer();
  write('assets/social.png', image);
  write('404.html', renderNotFound(url.href));
  console.log(`Static site built at ${output}. Preview only; no deployment performed.`);
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const setting = process.env.HUMANE_SITE_INDEXABLE ?? 'false';
  if (!['true', 'false'].includes(setting)) throw new Error('HUMANE_SITE_INDEXABLE must be true or false.');
  await buildSite({ siteUrl: process.env.HUMANE_SITE_URL || plannedSiteUrl, indexable: setting === 'true' });
}
