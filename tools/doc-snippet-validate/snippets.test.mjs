import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
test('named valid model passes, invalid model fails, traversal and empty input fail', () => {
  const root = mkdtempSync(join(tmpdir(), 'snippet-test-'));
  try {
    const doc = join(root, 'guide.md');
    const run = () => spawnSync(process.execPath, ['tools/doc-snippet-validate/cli.mjs', doc], {encoding:'utf8'});
    const snippet = (body, name='brandvoice.yaml') => '# `'+name+'`\n\n```yaml\n'+body+'\n```\n';
    writeFileSync(doc, snippet('version: "1.0.0"\nschemaVersion: "1.8.0"\nname: Sample'));
    assert.equal(run().status, 0);
    writeFileSync(doc, snippet('version: false'));
    assert.equal(run().status, 1);
    writeFileSync(doc, snippet('version: "1.0.0"', '../brandvoice.yaml'));
    assert.notEqual(run().status, 0);
    writeFileSync(doc, 'No named model here.');
    assert.notEqual(run().status, 0);
  } finally { rmSync(root, {recursive:true, force:true}); }
});
