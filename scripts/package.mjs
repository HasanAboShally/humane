import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import { readSkillPackage, repositoryRoot } from './skill-package.mjs';

export function buildArtifacts(root = repositoryRoot) {
  const source = readSkillPackage(root);
  const entries = {};
  for (const [name, bytes] of Object.entries(source)) {
    // Fixed local calendar fields yield stable ZIP timestamps across builds.
    entries[`humane/${name}`] = [bytes, { mtime: new Date(2000, 0, 1, 0, 0, 0) }];
  }
  const zip = Buffer.from(zipSync(entries, { level: 9 }));
  const digest = createHash('sha256').update(zip).digest('hex');
  return new Map([
    ['humane.zip', zip],
    ['humane.skill', zip],
    ['SHA256SUMS', Buffer.from(`${digest}  humane.zip\n${digest}  humane.skill\n`)],
  ]);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const artifacts = buildArtifacts();
  const output = join(repositoryRoot, 'dist');
  mkdirSync(output, { recursive: true });
  for (const [name, bytes] of artifacts) {
    writeFileSync(join(output, name), bytes);
    console.log(`${name}: ${bytes.length} bytes`);
  }
  console.log('Built locally. No upload, release, or publication performed.');
}
