import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { evaluationRequest, prepareEvaluation, sha256 } from '../scripts/prepare-evaluation.mjs';
import { repositoryRoot } from '../scripts/skill-package.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'humane-evaluation-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'skills/humane'), { recursive: true });
  mkdirSync(join(root, 'tests'));
  for (const path of ['LICENSE', 'skills/humane/LICENSE', 'skills/humane/SKILL.md']) copyFileSync(join(repositoryRoot, path), join(root, path));
  writeFileSync(join(root, 'tests/cases.json'), JSON.stringify([{ id: 'first', prompt: 'Explain.', sources: [{ id: 'Note', text: 'Pending.' }], checks: ['HIDDEN_RULE'] }]));
  return root;
}

test('generation requests exclude assessment rules but retain source text and unread scope', () => {
  const request = evaluationRequest({ id: 'test', prompt: 'Explain the note.', sources: [{ id: 'Note', text: 'Quote pending.\nTwo lines.' }], unread: ['Appendix'], checks: ['HIDDEN_ACCEPTANCE_CRITERION'], maxWords: 40, protected: ['HIDDEN_PROTECTED_ASSERTION'] });
  assert.equal(request, 'USER REQUEST\n\nExplain the note.\n\nSOURCE — Note\n\nQuote pending.\nTwo lines.\n\nUNREAD MATERIAL\n\nAppendix\n');
  assert.doesNotMatch(request, /HIDDEN_|maxWords|protected|40/);
  assert.equal(sha256(request), sha256(evaluationRequest({ prompt: 'Explain the note.', sources: [{ id: 'Note', text: 'Quote pending.\nTwo lines.' }], unread: ['Appendix'] })));
});

test('evaluation inputs do not read arbitrary files through source paths', () => {
  for (const file of ['../.env', 'notes/verification.md', 'examples/../../secret', 'examples/..\\..\\secret']) {
    assert.throws(() => evaluationRequest({ prompt: 'Read this.', sources: [{ id: 'Outside', file }] }), /inside examples/);
  }
});

test('evaluation snapshots are deterministic, minimal and cannot silently change existing inputs', (t) => {
  const root = fixture(t);
  const first = prepareEvaluation({ root });
  assert.deepEqual(readdirSync(first.directory).sort(), ['first.md', 'instructions.md', 'manifest.json']);
  assert.equal(sha256(readFileSync(join(first.directory, 'instructions.md'))), first.skillSha256);
  const original = readFileSync(join(first.directory, 'first.md'), 'utf8');
  assert.doesNotMatch(original, /HIDDEN_RULE|checks/);
  assert.deepEqual(prepareEvaluation({ root }), first);
  writeFileSync(join(root, 'tests/cases.json'), JSON.stringify([{ id: 'first', prompt: 'Different input.', sources: [] }]));
  assert.throws(() => prepareEvaluation({ root }), /Frozen evaluation output/);
  assert.equal(readFileSync(join(first.directory, 'first.md'), 'utf8'), original);
});

test('dangling source and output symlinks cannot escape evaluation boundaries', (t) => {
  const root = fixture(t);
  mkdirSync(join(root, 'examples'));
  symlinkSync('../missing.md', join(root, 'examples/linked.md'));
  assert.throws(() => evaluationRequest({ prompt: 'Explain.', sources: [{ id: 'Note', file: 'examples/linked.md' }] }, root), /symbolic links/);
  const snapshot = prepareEvaluation({ root });
  const target = join(snapshot.directory, 'first.md');
  const outside = join(root, 'must-not-write.md');
  rmSync(target);
  symlinkSync(outside, target);
  assert.throws(() => prepareEvaluation({ root }), /regular file/);
  assert.equal(existsSync(outside), false);
});

test('output ancestor symlinks are rejected before creating evaluation files', (t) => {
  const root = fixture(t);
  const outside = join(root, 'must-not-create');
  symlinkSync(outside, join(root, 'dist'));
  assert.throws(() => prepareEvaluation({ root }), /symbolic links/);
  assert.equal(existsSync(outside), false);
});
