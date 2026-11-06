import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collectHashes, readIntegrity, verifyIntegrity } from './integrity.mjs';

function fixture(context) {
  const root = mkdtempSync(join(tmpdir(), 'brandvoice-integrity-'));
  context.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'tools/port'), { recursive: true });
  for (const name of ['verify-ported.mjs', 'integrity.mjs']) cpSync(join(dirname(fileURLToPath(import.meta.url)), name), join(root, 'tools/port', name));
  mkdirSync(join(root, 'schema/v1.8'), { recursive: true });
  writeFileSync(join(root, 'schema/v1.8/model.yaml'), 'version: 1.8.0\n');
  writeFileSync(join(root, 'package.json'), '{"version":"1.8.0"}\n');
  const jobs = [{ name: 'schema', kind: 'job', path: 'schema/v1.8' }, { name: 'port', kind: 'job', path: 'tools/port' }, { name: 'package', kind: 'file', path: 'package.json' }];
  const lines = ['# job schema schema/v1.8', '# job port tools/port', '# file package package.json', '# covered schema', '# covered tools', '# absent tools/private'];
  for (const [file, hash] of collectHashes(root, jobs)) lines.push(`${hash}  ${file}`);
  writeFileSync(join(root, 'tools/port/PORTED.sha256'), lines.join('\n') + '\n');
  const run = () => spawnSync(process.execPath, [join(root, 'tools/port/verify-ported.mjs'), '--json'], { encoding: 'utf8' });
  return { root, run };
}

test('standalone verifier passes in a disposable package', context => {
  const { root, run } = fixture(context);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).checked, 4);
  const modelRoot = 'examples/fitness-app/.brandvoice/v1.9';
  mkdirSync(join(root, modelRoot), { recursive: true });
  writeFileSync(join(root, modelRoot, 'model.yaml'), 'version: 1.9.0\n');
  const baselinePath = join(root, 'tools/port/PORTED.sha256');
  const baseline = readFileSync(baselinePath, 'utf8');
  const hashes = collectHashes(root, [{ name: 'example', kind: 'job', path: modelRoot }]);
  writeFileSync(baselinePath, baseline + `# covered examples\n# job example ${modelRoot}\n`
    + [...hashes].map(([file, hash]) => `${hash}  ${file}\n`).join(''));
  assert.equal(run().status, 0);
  for (const path of ['examples/fitness-app/README.md', 'examples/fitness-app/.brandvoice/README.md']) {
    writeFileSync(join(root, path), 'extra\n');
    const refused = run();
    assert.equal(refused.status, 1, refused.stdout + refused.stderr);
    assert.ok(JSON.parse(refused.stdout).problems.includes(`Undeclared path: ${path}`));
    rmSync(join(root, path));
  }
  assert.equal(run().status, 0);
});
for (const path of ['schema/v1.8/model.yaml', 'tools/port/integrity.mjs', 'tools/port/verify-ported.mjs', 'package.json']) {
  test(`changed ${path} fails`, context => {
    const { root, run } = fixture(context);
    // YAML/JSON use whitespace; executable files use a comment so the verifier still runs.
    const suffix = path.endsWith('.mjs') ? '\n// changed\n' : '\n ';
    writeFileSync(join(root, path), readFileSync(join(root, path), 'utf8') + suffix);
    assert.equal(run().status, 1);
  });
}
for (const operation of ['add', 'missing', 'private', 'unknown', 'missing-unit', 'CRLF']) {
  test(`${operation} has the expected integrity verdict`, context => {
    const { root, run } = fixture(context);
    if (operation === 'add') writeFileSync(join(root, 'schema/v1.8/new.yaml'), 'extra\n');
    if (operation === 'missing') rmSync(join(root, 'schema/v1.8/model.yaml'));
    if (operation === 'private') mkdirSync(join(root, 'tools/private'));
    if (operation === 'unknown') mkdirSync(join(root, 'tools/unknown'));
    if (operation === 'missing-unit') rmSync(join(root, 'schema/v1.8'), { recursive: true });
    if (operation === 'CRLF') writeFileSync(join(root, 'schema/v1.8/model.yaml'), 'version: 1.8.0\r\n');
    assert.equal(run().status, operation === 'CRLF' ? 0 : 1);
  });
}
test('malformed, duplicate and empty manifests refuse', () => {
  for (const text of ['', 'invalid', '# job tool tools/tool\n' + 'a'.repeat(64) + '  tool/file\n' + 'a'.repeat(64) + '  tool/file']) {
    assert.throws(() => readIntegrity(text));
  }
});
test('escaping paths refuse', context => {
  const { root } = fixture(context);
  assert.throws(() => verifyIntegrity(root, { jobs: [{ name: 'bad', kind: 'job', path: '../escape' }], hashes: new Map(), covered: [], absent: [] }));
});
