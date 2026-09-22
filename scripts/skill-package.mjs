import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
export const skillFiles = Object.freeze(['LICENSE', 'SKILL.md']);

// This validates Humane's deliberately small subset, not every legal Agent Skills field.
export function validateSkillDocument(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(text);
  if (!match) throw new Error('Skill must have YAML frontmatter followed by a body.');
  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length) throw new Error(document.errors[0].message);
  const metadata = document.toJS();
  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') {
    throw new Error('Skill metadata must be a mapping.');
  }
  if (Object.keys(metadata).sort().join(',') !== 'description,name') {
    throw new Error('Humane uses only the portable name and description fields.');
  }
  if (metadata.name !== 'humane') throw new Error('Skill name must be humane.');
  if (typeof metadata.description !== 'string' || !metadata.description.trim()
    || [...metadata.description].length > 1024) {
    throw new Error('Description must contain 1–1024 characters.');
  }
  // Anthropic's authoring guidance also excludes XML tags from discovery metadata.
  if (/<\/?[\p{L}_][^<>]*>/u.test(metadata.description)) {
    throw new Error('Description must not contain XML or HTML tags.');
  }
  if (text.split('\n').length > 500 || text.trim().split(/\s+/u).length > 2500
    || Buffer.byteLength(text) > 20000) {
    throw new Error('Keep the skill below 500 lines, 2500 words, and 20 KB.');
  }
  if (!text.endsWith('\n') || text.includes('\r') || text.includes('\t')) {
    throw new Error('Use spaces, LF line endings, and a final newline.');
  }
  if (!match[2].startsWith('\n# Humane\n')) {
    throw new Error('Skill body must begin with the Humane heading.');
  }
  return { metadata, body: match[2] };
}

export function readSkillPackage(root = repositoryRoot) {
  const directory = join(root, 'skills', 'humane');
  if (!lstatSync(join(root, 'skills')).isDirectory() || !lstatSync(directory).isDirectory()) {
    throw new Error('Skill directories must be real directories, not symbolic links.');
  }
  const entries = readdirSync(directory).sort();
  if (entries.join(',') !== skillFiles.join(',')) {
    throw new Error('Installable skill may contain only LICENSE and SKILL.md.');
  }
  const files = {};
  for (const name of skillFiles) {
    const source = join(directory, name);
    if (!lstatSync(source).isFile()) throw new Error(`Not a regular file: ${name}`);
    files[name] = readFileSync(source);
  }
  validateSkillDocument(files['SKILL.md'].toString('utf8'));
  if (!files.LICENSE.equals(readFileSync(join(root, 'LICENSE')))) {
    throw new Error('Repository and installable licenses must match.');
  }
  return files;
}
