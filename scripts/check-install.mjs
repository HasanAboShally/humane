import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readSkillPackage, repositoryRoot } from './skill-package.mjs';

const installerVersion = '1.5.26';
const sandbox = mkdtempSync(join(tmpdir(), 'humane-install-'));
const project = join(sandbox, 'project');
const home = join(sandbox, 'home');
mkdirSync(project);
mkdirSync(home);

const env = {
  ...process.env,
  HOME: home,
  USERPROFILE: home,
  XDG_CONFIG_HOME: join(home, '.config'),
  CODEX_HOME: join(home, '.codex'),
  CLAUDE_CONFIG_DIR: join(home, '.claude'),
  COPILOT_HOME: join(home, '.copilot'),
  npm_config_cache: join(sandbox, 'npm-cache'),
  DISABLE_TELEMETRY: '1',
  DO_NOT_TRACK: '1',
  CI: '1',
  COPILOT_AUTO_UPDATE: 'false',
  COPILOT_OTEL_ENABLED: 'false',
  GIT_CONFIG_GLOBAL: join(home, '.gitconfig'),
};

// No access tokens or custom provider configuration are needed for a local install test.
for (const key of Object.keys(env)) {
  if (/^(?:COPILOT_PROVIDER_|OTEL_|COPILOT_CUSTOM_INSTRUCTIONS_DIRS$|COPILOT_ALLOW_ALL$)/.test(key)
    || ['GH_TOKEN', 'GITHUB_TOKEN', 'COPILOT_GITHUB_TOKEN', 'NODE_OPTIONS'].includes(key)) {
    delete env[key];
  }
}

const execute = (command, args, overrides = {}) => execFileSync(command, args, {
  cwd: project,
  env,
  encoding: 'utf8',
  timeout: 120000,
  maxBuffer: 1024 * 1024,
  ...overrides,
});

try {
  execute('git', ['init', '--quiet', '--initial-branch=main']);
  const output = execute('npx', [
    '--yes', `skills@${installerVersion}`, 'add', repositoryRoot,
    '--skill', 'humane', '--agent', 'github-copilot', 'claude-code', 'codex', '--copy', '--yes',
  ]);
  console.log(output);

  // Copilot and Codex share the universal project location in the pinned installer.
  const targets = ['.agents/skills/humane', '.claude/skills/humane'];
  const payload = readSkillPackage();
  for (const target of targets) {
    const installed = join(project, target);
    assert.ok(existsSync(installed), `Missing installed directory: ${target}`);
    assert.deepEqual(readdirSync(installed).sort(), Object.keys(payload).sort());
    for (const [name, bytes] of Object.entries(payload)) {
      assert.deepEqual(readFileSync(join(installed, name)), bytes, `Byte mismatch: ${target}/${name}`);
    }
  }
  console.log(JSON.stringify({
    installerVersion,
    requestedClients: ['github-copilot', 'claude-code', 'codex'],
    verifiedProjectLocations: targets,
    instructionSha256: createHash('sha256').update(payload['SKILL.md']).digest('hex'),
  }, null, 2));

  if (process.env.HUMANE_COPILOT_BIN) {
    const binary = process.env.HUMANE_COPILOT_BIN;
    const version = execute(binary, ['--version'], { env: { ...env, COPILOT_OFFLINE: 'true' } }).trim();
    const discovered = JSON.parse(execute(binary, ['--no-auto-update', 'skill', 'list', '--json'], {
      env: { ...env, COPILOT_OFFLINE: 'true' },
    }));
    const findHumane = (value) => {
      if (!value || typeof value !== 'object') return [];
      return [
        ...(value.name === 'humane' ? [value] : []),
        ...Object.values(value).flatMap(findHumane),
      ];
    };
    const matches = findHumane(discovered);
    assert.ok(matches.length > 0, 'Copilot CLI did not discover Humane.');
    console.log(JSON.stringify({ nativeDiscovery: 'passed', client: version, skills: matches }, null, 2));
  } else {
    console.log('Native discovery not run: set HUMANE_COPILOT_BIN to an installed Copilot CLI.');
  }
  console.log('Isolated install passed. No user-level skills were changed.');
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
