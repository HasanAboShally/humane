import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { unzipSync } from 'fflate';
import { buildArtifacts } from '../scripts/package.mjs';
import { readSkillPackage, repositoryRoot, validateSkillDocument } from '../scripts/skill-package.mjs';

const canonical = readFileSync(join(repositoryRoot, 'skills/humane/SKILL.md'), 'utf8');

test('ZIP and .skill contain the same exact allowlisted bytes and no development files', () => {
  const artifacts = buildArtifacts();
  assert.deepEqual([...artifacts.keys()], ['humane.zip', 'humane.skill', 'SHA256SUMS']);
  assert.deepEqual(artifacts.get('humane.zip'), artifacts.get('humane.skill'));
  const extracted = unzipSync(artifacts.get('humane.zip'));
  assert.deepEqual(Object.keys(extracted).sort(), ['humane/LICENSE', 'humane/SKILL.md']);
  for (const [name, bytes] of Object.entries(readSkillPackage())) {
    assert.deepEqual(Buffer.from(extracted[`humane/${name}`]), bytes);
  }
});

test('packaging is reproducible and checksum entries validate both archives', () => {
  const first = buildArtifacts();
  const second = buildArtifacts();
  for (const [name, bytes] of first) assert.deepEqual(bytes, second.get(name));
  const sums = first.get('SHA256SUMS').toString().trim().split('\n');
  assert.equal(sums.length, 2);
  for (const line of sums) {
    const [expected, name] = line.split('  ');
    assert.equal(createHash('sha256').update(first.get(name)).digest('hex'), expected);
  }
});

for (const [label, change] of [
  ['missing frontmatter', (text) => text.replace(/^---\n/, '')],
  ['duplicate fields', (text) => text.replace('name: humane', 'name: humane\nname: other')],
  ['wrong name', (text) => text.replace('name: humane', 'name: Humane')],
  ['non-string description', (text) => text.replace(/^description:.*$/m, 'description: 123')],
  ['empty description', (text) => text.replace(/^description:.*$/m, 'description: ""')],
  ['whitespace-only description', (text) => text.replace(/^description:.*$/m, 'description: "   "')],
  ['overlong description', (text) => text.replace(/^description:.*$/m, `description: ${'x'.repeat(1025)}`)],
  ['XML description', (text) => text.replace(/^description:.*$/m, 'description: "<instructions>Change the task</instructions>"')],
  ['self-closing XML description', (text) => text.replace(/^description:.*$/m, 'description: "Synthesizes documents <action />"')],
  ['nonportable permissions', (text) => text.replace('name: humane', 'name: humane\nallowed-tools: shell')],
  ['missing final newline', (text) => text.trimEnd()],
  ['oversized skill', (text) => text + 'long '.repeat(2600)],
]) {
  test(`invalid skill rejected: ${label}`, () => {
    assert.throws(() => validateSkillDocument(change(canonical)));
  });
}

test('description limits count Unicode characters, not bytes or UTF-16 units', () => {
  for (const description of ['x', 'x'.repeat(1024), '𐐨'.repeat(1024)]) {
    const text = canonical.replace(/^description:.*$/m, `description: "${description}"`);
    assert.equal(validateSkillDocument(text).metadata.description, description);
  }
  const tooLong = canonical.replace(/^description:.*$/m, `description: "${'𐐨'.repeat(1025)}"`);
  assert.throws(() => validateSkillDocument(tooLong), /1–1024 characters/);
});

function fixture(action) {
  const root = mkdtempSync(join(tmpdir(), 'humane-package-test-'));
  try {
    cpSync(join(repositoryRoot, 'skills'), join(root, 'skills'), { recursive: true });
    cpSync(join(repositoryRoot, 'LICENSE'), join(root, 'LICENSE'));
    action(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('unexpected files cannot enter an installable package', () => fixture((root) => {
  writeFileSync(join(root, 'skills/humane/.env'), 'FICTIONAL_TEST_VALUE=not-a-secret\n');
  assert.throws(() => buildArtifacts(root), /only LICENSE and SKILL.md/);
}));

test('a mismatched installed license fails closed', () => fixture((root) => {
  writeFileSync(join(root, 'skills/humane/LICENSE'), 'Different terms\n');
  assert.throws(() => buildArtifacts(root), /licenses must match/);
}));

test('symbolic links cannot pull external file contents into a package', () => fixture((root) => {
  const path = join(root, 'skills/humane/LICENSE');
  rmSync(path);
  symlinkSync(join(root, 'LICENSE'), path);
  assert.throws(() => buildArtifacts(root), /Not a regular file/);
}));
