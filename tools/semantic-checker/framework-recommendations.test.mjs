import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';
import { loadRules, loadExtensions, runChecker } from '@archally/semantic-checker';
import { recommendedFrameworks } from './rules/recommended-story-framework.mjs';
import { validateModel } from '../validator/src/validate.mjs';

const checkerDirectory = fileURLToPath(new URL('.', import.meta.url));
const canonicalMode = existsSync(new URL('../../../../servers/brandvoice/cli/bin/bv.mjs', import.meta.url));
const packageRoot = resolve(checkerDirectory, canonicalMode ? '../../../..' : '../..');
const portableMode = process.env.BRANDVOICE_FRAMEWORK_TEST_MODE === 'portable' || !canonicalMode;
const commandRoot = process.env.BRANDVOICE_FRAMEWORK_PUBLIC_ROOT ?? packageRoot;
const schemaDirectory = portableMode
  ? join(commandRoot, 'schema', readdirSync(join(commandRoot, 'schema')).sort().at(-1))
  : resolve(checkerDirectory, '../../v1/schema');
const fixtureRoot = mkdtempSync(join(tmpdir(), 'brandvoice-framework-'));
let loadBrandvoice;
let buildBrandvoiceModel;
let toCheckableModel;
let rules;
let extensions;

function runCommand(command, argumentsList, cwd = packageRoot) {
  const result = spawnSync(command, argumentsList, {
    cwd,
    encoding: 'utf8',
    timeout: 120000,
    env: { ...process.env, npm_config_cache: join(tmpdir(), 'npm-cache') },
  });
  assert.ifError(result.error);
  return result;
}

before(async () => {
  if (!portableMode) {
    for (const argumentsList of [
      ['run', 'build', '-w', '@archally/brandvoice-core'],
      ['run', 'build', '-w', '@archally/cli-shared'],
      ['run', 'build:checker', '-w', '@archally/brandvoice-cli'],
      ['run', 'build', '-w', '@archally/brandvoice-cli'],
    ]) {
      const result = runCommand('npm', argumentsList);
      assert.equal(result.status, 0, result.stdout + result.stderr);
    }
  }
  const builderUrl = new URL('../model-builder/dist/index.js', import.meta.url);
  const adapterUrl = new URL('./dist/adapter.js', import.meta.url);
  assert.ok(existsSync(builderUrl), 'Build the model builder before running fixtures');
  assert.ok(existsSync(adapterUrl), 'Build the checker before running fixtures');
  ({ loadBrandvoice, buildBrandvoiceModel } = await import(builderUrl.href));
  ({ toCheckableModel } = await import(adapterUrl.href));
  rules = await loadRules(join(checkerDirectory, 'rules'));
  extensions = await loadExtensions(rules);
  assert.equal(rules.filter(rule => rule.id === 'recommended-story-framework').length, 1);
});

after(() => {
  if (process.env.BRANDVOICE_FRAMEWORK_KEEP_FIXTURES === '1') {
    process.stdout.write(`Fixture root: ${fixtureRoot}\n`);
  }
  if (process.env.BRANDVOICE_FRAMEWORK_KEEP_FIXTURES !== '1') {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

function script(id, framework) {
  const narrative = framework === undefined ? {} : { framework };
  return { id, name: id, brand_ref: 'BRD001', narrative };
}

function fixture(name, scripts, extra = {}) {
  const directory = join(fixtureRoot, name);
  mkdirSync(directory, { recursive: true });
  const model = {
    version: '1.0.0',
    name: 'Framework fixture',
    strategy: {
      brand_core: {
        version: '1.0.0',
        brands: [{ id: 'BRD001', name: 'Example', promise: 'Clarity', purpose: 'Explain', narrative: { framework: 'brand-house-style' } }],
        brand_scripts: scripts,
      },
      ...extra,
    },
  };
  writeFileSync(join(directory, 'brandvoice.yaml'), YAML.stringify(model));
  return directory;
}

function check(directory, extraArguments = []) {
  if (portableMode) {
    return runCommand('npm', ['run', 'check', '--', directory, ...extraArguments], commandRoot);
  }
  return runCommand(process.execPath, ['servers/brandvoice/cli/bin/bv.mjs', 'check', directory, ...extraArguments]);
}

function frameworkIssues(directory) {
  const composed = loadBrandvoice(directory);
  assert.deepEqual(composed.errors, []);
  const model = toCheckableModel(buildBrandvoiceModel(composed.root));
  return runChecker(model, rules, {}, extensions).filter(issue => issue.ruleId === 'recommended-story-framework');
}

function expectedMessage(id, value) {
  return `Brand script '${id}' narrative.framework '${value}' is not a recommended framework (sb7, freytag, pixar, hero_journey, three_act); a custom framework is valid.`;
}

for (const framework of ['sb7', 'freytag', 'pixar', 'hero_journey', 'three_act', undefined]) {
  test(`keeps ${framework ?? 'an omitted framework'} quiet through the registered CLI`, () => {
    const directory = fixture(framework ?? 'absent', [script('BSC001', framework)]);
    const result = check(directory);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /\[recommended-story-framework\]/);
    assert.deepEqual(frameworkIssues(directory), []);
  });
}

for (const [name, framework] of [['custom', 'house-style'], ['mixed-case', 'Pixar'], ['upper-case', 'SB7'], ['empty', ''], ['whitespace', ' sb7 ']]) {
  test(`warns once for ${name} without rejecting its schema or changing its value`, () => {
    const directory = fixture(name, [script('BSC001', framework)]);
    const validation = validateModel({ model: directory, schemas: schemaDirectory });
    assert.deepEqual(validation.schemaErrors, []);
    assert.deepEqual(frameworkIssues(directory), [{
      ruleId: 'recommended-story-framework',
      severity: 'warn',
      entityId: 'BSC001',
      message: expectedMessage('BSC001', framework),
    }]);
    const result = check(directory);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.stdout.split('[recommended-story-framework]').length - 1, 1);
    assert.ok(result.stdout.includes(expectedMessage('BSC001', framework)));
    assert.match(result.stdout, /Warnings:/);
    assert.doesNotMatch(result.stdout, /Errors:/);
  });
}

test('locates both custom scripts and emits exactly one warning per script', () => {
  const directory = fixture('two-scripts', [script('BSC001', 'house-style'), script('BSC002', 'Pixar')]);
  const issues = frameworkIssues(directory);
  assert.equal(issues.length, 2);
  assert.deepEqual(issues.map(issue => issue.entityId), ['BSC001', 'BSC002']);
  const result = check(directory);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(result.stdout.split('[recommended-story-framework]').length - 1, 2);
  for (const issue of issues) {
    assert.equal(issue.severity, 'warn');
    assert.ok(result.stdout.includes(issue.message));
  }
});

test('leaves a non-string to schema validation and ignores absent narratives', () => {
  const directory = fixture('non-string', [script('BSC001', 42), { id: 'BSC002', name: 'Missing narrative', brand_ref: 'BRD001' }]);
  const validation = validateModel({ model: directory, schemas: schemaDirectory });
  assert.ok(validation.schemaErrors.some(message => message.includes('must be string')));
  assert.deepEqual(frameworkIssues(directory), []);
  const result = check(directory);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /\[recommended-story-framework\]/);
});

test('fails on an unrelated real semantic error while keeping the framework advisory', () => {
  const directory = fixture('unrelated-error', [script('BSC001', 'house-style')], {
    messaging: { version: '1.0.0', messages: [{ id: 'MSG001', title: 'Active', core_statement: 'Explain', status: 'active' }] },
  });
  const result = check(directory);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Errors:\s+\[active-message-proof\]/);
  assert.match(result.stdout, /Warnings:[\s\S]*\[recommended-story-framework\]/);
  assert.deepEqual(frameworkIssues(directory).map(issue => issue.severity), ['warn']);
});

test('loads an explicit config through the CLI without changing the default rule', () => {
  const directory = fixture('configured', [script('BSC001', 'house-style')]);
  const configPath = join(directory, 'lint.yaml');
  writeFileSync(configPath, 'rules:\n  recommended-story-framework: off\n');
  const result = check(directory, ['--config', configPath]);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /\[recommended-story-framework\]/);
  assert.equal(frameworkIssues(directory)[0].severity, 'warn');
});

test('keeps the documented recommendations and membership set identical while accepting house styles', () => {
  const schema = YAML.parse(readFileSync(join(schemaDirectory, 'strategy/brand-core.schema.yaml'), 'utf8'));
  const framework = schema.$defs.narrative_backbone.properties.framework;
  const recommendationText = framework.description.match(/Recommended values:([\s\S]*?)\. Any other/)[1];
  const documented = [...recommendationText.matchAll(/`([^`]+)`/g)].map(match => match[1]);
  assert.deepEqual([...recommendedFrameworks], documented);
  assert.equal(framework.type, 'string');
  assert.equal(framework.enum, undefined);
  assert.equal(schema.$defs.narrative_backbone.required, undefined);
  const rule = rules.find(candidate => candidate.id === 'recommended-story-framework');
  assert.equal(rule.severity, 'warn');
  assert.ok(rule.message.includes(documented.join(', ')));
});


test('fails composition when a referenced model file is missing', () => {
  const directory = fixture('composition-error', [script('BSC001', 'sb7')]);
  const modelPath = join(directory, 'brandvoice.yaml');
  const model = YAML.parse(readFileSync(modelPath, 'utf8'));
  model.strategy.brand_core = { $ref: 'missing-brand-core.yaml' };
  writeFileSync(modelPath, YAML.stringify(model));
  const result = check(directory);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stderr, /Composition errors:/);
});
