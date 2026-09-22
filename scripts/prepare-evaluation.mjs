import { createHash } from 'node:crypto';
import { lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSkillPackage, repositoryRoot } from './skill-package.mjs';

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

function rejectSymlinkPath(root, path) {
  let ancestor = resolve(root);
  for (const part of ['', ...relative(root, path).split(sep)]) {
    ancestor = join(ancestor, part);
    if (lstatSync(ancestor, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error('Evaluation paths must not use symbolic links.');
  }
}

// Only task inputs reach the generator. Acceptance criteria stay with the reviewer.
export function evaluationRequest(item, root = repositoryRoot) {
  const parts = ['USER REQUEST', item.prompt];
  for (const source of item.sources) {
    if (source.file && (!source.file.startsWith('examples/') || source.file.includes('\\') || source.file.split('/').includes('..'))) throw new Error('Evaluation sources must stay inside examples.');
    if (source.file) rejectSymlinkPath(root, join(root, source.file));
    const text = source.file ? readFileSync(join(root, source.file), 'utf8') : source.text;
    parts.push(`SOURCE — ${source.id}${source.file ? ` (${source.file})` : ''}`, text);
  }
  if (item.unread?.length) parts.push('UNREAD MATERIAL', item.unread.join('\n'));
  return parts.join('\n\n') + '\n';
}

export function prepareEvaluation({ root = repositoryRoot } = {}) {
  const instruction = readSkillPackage(root)['SKILL.md'];
  const skillSha256 = sha256(instruction);
  const directory = join(root, 'dist/evaluation', skillSha256);
  rejectSymlinkPath(root, directory);
  mkdirSync(directory, { recursive: true });
  const write = (path, bytes) => {
    const target = join(directory, path);
    const existing = lstatSync(target, { throwIfNoEntry: false });
    if (existing) {
      if (!existing.isFile()) throw new Error('Evaluation output must be a regular file.');
      if (!readFileSync(target).equals(Buffer.from(bytes))) throw new Error('Frozen evaluation output already exists with different content.');
      return;
    }
    writeFileSync(target, bytes, { flag: 'wx' });
  };
  write('instructions.md', instruction);
  const items = JSON.parse(readFileSync(join(root, 'tests/cases.json'), 'utf8'));
  const cases = items.map((item) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) throw new Error('Invalid evaluation case ID.');
    const request = evaluationRequest(item, root);
    write(`${item.id}.md`, request);
    return { id: item.id, inputSha256: sha256(request) };
  });
  const manifest = { skillSha256, caseInputsSha256: sha256(JSON.stringify(cases)), cases };
  write('manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  return { directory, ...manifest };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { directory, skillSha256, caseInputsSha256, cases } = prepareEvaluation();
  console.log(JSON.stringify({ directory, skillSha256, caseInputsSha256, count: cases.length }, null, 2));
}
