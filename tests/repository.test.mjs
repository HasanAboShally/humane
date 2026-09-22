import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { parseDocument } from 'yaml';
import { evaluationRequest, sha256 } from '../scripts/prepare-evaluation.mjs';
import { readSkillPackage, repositoryRoot, validateSkillDocument } from '../scripts/skill-package.mjs';

const read = (path) => readFileSync(join(repositoryRoot, path), 'utf8');
const skill = read('skills/humane/SKILL.md');
const cases = JSON.parse(read('tests/cases.json'));

function sourceFiles(directory = repositoryRoot) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', 'node_modules', 'dist', '.tmp', '.vscode', 'test-results', 'playwright-report'].includes(entry.name)) return [];
    if (relative(repositoryRoot, directory) === '.impeccable' && entry.name === 'review') return [];
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected source symlink: ${path}`);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

test('the installable skill uses valid portable metadata and fits the reading budget', () => {
  const { metadata, body } = validateSkillDocument(skill);
  assert.equal(metadata.name, 'humane');
  assert.match(metadata.description, /brief|synthesize/i);
  assert.match(metadata.description, /prepare/);
  assert.match(metadata.description, /Use when/);
  assert.match(body, /## If the reader received material/);
  assert.match(body, /## If the reader will receive your output/);
});

test('the distributed payload is just instructions and a matching license', () => {
  const payload = readSkillPackage();
  assert.deepEqual(Object.keys(payload), ['LICENSE', 'SKILL.md']);
  assert.match(payload.LICENSE.toString(), /MIT License/);
  assert.ok(payload['SKILL.md'].length < 20000);
});

test('the maintainer package cannot accidentally be npm-published', () => {
  const manifest = JSON.parse(read('package.json'));
  assert.equal(manifest.private, true);
  assert.equal(manifest.dependencies, undefined);
  assert.equal(manifest.scripts.publish, undefined);
});

test('the workflow only checks and packages, with read-only repository permissions', () => {
  const document = parseDocument(read('.github/workflows/checks.yml'));
  assert.deepEqual(document.errors, []);
  const workflow = document.toJS();
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  assert.deepEqual(Object.keys(workflow.on).sort(), ['pull_request', 'push', 'workflow_dispatch']);
  assert.equal(workflow.jobs.check.permissions, undefined);
  const commands = workflow.jobs.check.steps.filter((step) => step.run).map((step) => step.run);
  assert.deepEqual(commands, ['npm ci --ignore-scripts', 'npm test', 'npm run pack:skill']);
  assert.equal(workflow.jobs.check.steps[0].with['persist-credentials'], false);
});

test('local Markdown links point to existing files and headings', () => {
  const headingSlug = (heading) => heading.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/ /g, '-');
  for (const file of sourceFiles().filter((path) => extname(path) === '.md')) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:)/.test(target)) continue;
      const [pathPart, anchor] = target.split('#');
      const destination = pathPart ? resolve(dirname(file), decodeURIComponent(pathPart)) : file;
      assert.ok(!relative(repositoryRoot, destination).startsWith('..'), `${file}: link escapes repository`);
      assert.ok(existsSync(destination), `${file}: missing ${target}`);
      if (anchor) {
        const content = readFileSync(destination, 'utf8');
        const slugs = [...content.matchAll(/^#{1,6} (.+)$/gm)].map((heading) => headingSlug(heading[1]));
        assert.ok(slugs.includes(anchor), `${file}: missing anchor ${target}`);
      }
    }
  }
});

test('maintained text files have clean whitespace and no leftover placeholders', () => {
  for (const file of sourceFiles()) {
    if (!['.md', '.mjs', '.json', '.yml', ''].includes(extname(file))) continue;
    const text = readFileSync(file, 'utf8');
    assert.ok(text.endsWith('\n'), `${relative(repositoryRoot, file)}: missing final newline`);
    assert.ok(!text.includes('\r') && !text.includes('\t'), `${file}: unexpected CR or tab`);
    assert.doesNotMatch(text, /[ \t]+$/m, `${file}: trailing whitespace`);
    if (extname(file) === '.md') {
      assert.doesNotMatch(text, /\[To be written\]|\[TODO\]|<github-owner>/, `${file}: placeholder`);
    }
  }
});

test('behavioral cases are unique, self-contained, and have explicit acceptance criteria', () => {
  assert.ok(cases.length >= 12);
  assert.equal(new Set(cases.map((item) => item.id)).size, cases.length);
  for (const item of cases) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(item.prompt.trim());
    assert.ok(item.checks.length >= 2);
    assert.equal(new Set(item.sources.map((source) => source.id)).size, item.sources.length);
    for (const source of item.sources) {
      assert.notEqual(Boolean(source.file), Boolean(source.text), `${item.id}: use file or text, not both`);
      if (source.file) {
        assert.match(source.file, /^examples\//);
        assert.ok(existsSync(join(repositoryRoot, source.file)));
      }
    }
    if (item.maxWords !== undefined) assert.ok(Number.isInteger(item.maxWords) && item.maxWords > 0);
    if (item.protected !== undefined) {
      assert.ok(Array.isArray(item.protected) && item.protected.length > 0);
      for (const literal of item.protected) {
        assert.ok(typeof literal === 'string' && literal.length > 0);
        assert.ok(item.sources.some((source) => source.text?.includes(literal)), `${item.id}: protected text must come from a supplied source`);
      }
    }
  }
});

test('authored examples identify themselves rather than pretending to be measured runs', () => {
  for (const file of ['examples/receiver/brief.md', 'examples/sender/proposal.md', 'examples/changes/brief.md']) {
    const text = read(file);
    assert.match(text, /authored illustration/);
    assert.match(text, /not a recorded model result|not legal advice or a recorded model result/);
    assert.match(text, /## What the reader should understand/);
  }
});

function assertResponseShape(result) {
  const scenario = cases.find((item) => item.id === result.id);
  assert.ok(scenario, `Unknown case: ${result.id}`);
  assert.ok(result.output.trim());
  if (scenario.maxWords) assert.ok(result.output.trim().split(/\s+/u).length <= scenario.maxWords, `${result.id}: word limit`);
  const bulletLimit = { 'exact-two-bullets': 25, 'unsupported-promise-and-obligation': 35 }[result.id];
  if (bulletLimit) {
    const bullets = result.output.split('\n').filter((line) => line.trim());
    assert.equal(bullets.length, 2, `${result.id}: two bullets only`);
    for (const bullet of bullets) {
      assert.ok(bullet.startsWith('- '));
      assert.ok(bullet.slice(2).trim().split(/\s+/u).length <= bulletLimit, `${result.id}: bullet word limit`);
    }
  }
  const sentenceCount = { 'general-explanation': 2, 'one-sentence-invitation': 1, 'short-personal-thanks': 2, 'explain-operational-cause': 3 }[result.id];
  if (sentenceCount) {
    const segments = new Intl.Segmenter('en', { granularity: 'sentence' }).segment(result.output);
    assert.equal([...segments].filter((item) => item.segment.trim()).length, sentenceCount, `${result.id}: sentence count`);
  }
  for (const literal of scenario.protected || []) {
    assert.equal(result.output.split(literal).length - 1, 1, `${result.id}: protected content must appear once, unchanged`);
  }
}

function assertMetadataOnlyRevision(text, results, audit) {
  assert.equal(audit.changeType, 'description-only');
  assert.equal(audit.skillSha256, sha256(text), 'New skill bytes require a fresh audit or behavioral record.');
  const { metadata, body } = validateSkillDocument(text);
  assert.equal(audit.bodySha256, sha256(body), 'The audited body must remain unchanged.');
  const evaluatedDocument = audit.evaluatedFrontmatter + body;
  const evaluated = validateSkillDocument(evaluatedDocument);
  assert.equal(evaluated.metadata.name, metadata.name);
  assert.notEqual(evaluated.metadata.description, metadata.description);
  assert.equal(audit.evaluatedSkillSha256, results.skillSha256);
  assert.equal(sha256(evaluatedDocument), results.skillSha256, 'Current body must reproduce the evaluated revision with its original frontmatter.');
}

test('historical outputs match the unchanged body and exact inputs, not a fresh metadata-revision run', () => {
  const results = JSON.parse(read('notes/smoke-results-2026-09-17-editorial-final.json'));
  const audit = JSON.parse(read('notes/metadata-audit-2026-09-17.json'));
  assert.equal(audit.behaviorEvidence, 'smoke-results-2026-09-17-editorial-final.json');
  assertMetadataOnlyRevision(skill, results, audit);
  const inputs = cases.map((item) => ({ id: item.id, inputSha256: sha256(evaluationRequest(item)) }));
  assert.equal(results.caseInputsSha256, sha256(JSON.stringify(inputs)), 'Changed task inputs require fresh evidence.');
  assert.deepEqual(results.cases.map((item) => item.id).sort(), cases.map((item) => item.id).sort());
  results.cases.forEach(assertResponseShape);
  assert.deepEqual(results.repetitions.map((item) => item.id).sort(), ['short-humane-introduction', 'short-payment-warning']);
  results.repetitions.forEach(assertResponseShape);
  assert.ok(results.limits.length >= 3);

  assert.equal(results.baseline.file, 'editorial-baseline-2026-09-17.json');
  const baseline = JSON.parse(read(`notes/${results.baseline.file}`));
  assert.equal(results.baseline.skillSha256, baseline.skillSha256);
  assert.equal(baseline.skillSha256, '530d07ba728c3f6bb934aea8242dde4bb32dcc8443dc31d5bf5a49aa8317f487');
  assert.equal(baseline.caseInputsSha256, results.caseInputsSha256);
  assert.deepEqual(baseline.cases.map((item) => item.id).sort(), [
    'already-good-prose', 'explain-operational-cause', 'prose-only-protected-content',
    'qualified-facts-survive-style', 'restructure-padded-update', 'short-humane-introduction',
    'short-payment-warning', 'unsupported-promise-and-obligation', 'voice-sample-not-facts',
  ]);
  baseline.cases.forEach(assertResponseShape);
  assert.deepEqual(baseline.repetitions.map((item) => item.id).sort(), ['short-humane-introduction', 'short-payment-warning']);
  baseline.repetitions.forEach(assertResponseShape);
  assert.equal(baseline.generationErrors.length, 1);
  assert.match(baseline.generationErrors[0].error, /high demand/);
  // Content quality and semantic acceptance remain a separate, recorded review.
});

test('a metadata-only audit cannot disguise a body change by updating its recorded hashes', () => {
  const results = JSON.parse(read('notes/smoke-results-2026-09-17-editorial-final.json'));
  const audit = JSON.parse(read('notes/metadata-audit-2026-09-17.json'));
  const changed = skill.replace('Write for the person who has to use the result.', 'Write only for experts.');
  assert.notEqual(changed, skill);
  assert.throws(() => assertMetadataOnlyRevision(changed, results, audit), /New skill bytes/);
  assert.throws(() => assertMetadataOnlyRevision(changed, results, {
    ...audit, skillSha256: sha256(changed), bodySha256: sha256(validateSkillDocument(changed).body),
  }), /reproduce the evaluated revision/);
});

test('historical smoke evidence is retained under its original fingerprint', () => {
  const historical = JSON.parse(read('notes/smoke-results.json'));
  assert.equal(historical.skillSha256, '49408da32ddddf203a988b393e572d561f73d67a1ad46999e62c4ae9600d46fa');
  assert.equal(historical.cases.length, 16);
  assert.ok(historical.exploratoryFailures.observations.length >= 4);
  const previous = JSON.parse(read('notes/smoke-results-2026-09-17.json'));
  assert.equal(previous.skillSha256, '5f518ad5dd5d42e04d8e5d56f625b7a659ef002dc44023289f9f21adb46868e3');
  assert.equal(previous.cases.length, 24);
  const round2 = JSON.parse(read('notes/smoke-results-2026-09-17-round2.json'));
  assert.equal(round2.skillSha256, '8bafd3546a2512ca3fa56e753f861761393af9e7c2a491a35aa8b4eadc4021fd');
  assert.equal(round2.cases.length, 28);
  const shortWriting = JSON.parse(read('notes/smoke-results-2026-09-17-short-writing.json'));
  assert.equal(shortWriting.skillSha256, '530d07ba728c3f6bb934aea8242dde4bb32dcc8443dc31d5bf5a49aa8317f487');
  assert.equal(shortWriting.cases.length, 33);
  assert.equal(shortWriting.baseline.skillSha256, round2.skillSha256);
  assert.deepEqual(shortWriting.baseline.cases.map((item) => item.id).sort(), ['short-beside-introduction', 'short-borrowboard-introduction', 'short-humane-introduction']);
  shortWriting.baseline.cases.forEach(assertResponseShape);
  const intermediate = JSON.parse(read('notes/smoke-results-2026-09-17-editorial.json'));
  assert.equal(intermediate.skillSha256, '6828674df3ba89a20ce538293dba339d4021bacafa40eae3f0523ad559fde89e');
  assert.equal(intermediate.cases.length, 40);
  assert.equal(intermediate.repetitions.length, 2);
});
