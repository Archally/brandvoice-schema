import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
test('query filters Brandvoice types, planes and text and next-id respects namespaces', () => {
  const root = mkdtempSync(join(tmpdir(), 'query-test-'));
  try {
    const model = join(root, 'model.json');
    writeFileSync(model, JSON.stringify({entities:[{id:'BRD002',type:'brand',plane:'strategy',name:'Sample',data:{}},{id:'other.BRD009',type:'brand',plane:'strategy',name:'Other',data:{}}]}));
    const run = (tool, args) => spawnSync(process.execPath, [`tools/${tool}/cli.mjs`, model, ...args], {encoding:'utf8'});
    const query = run('entity-query', ['--type','brand','--plane','strategy','--text','Sample']);
    assert.equal(query.status, 0, query.stderr);
    assert.equal(JSON.parse(query.stdout).total, 1);
    assert.equal(run('entity-query', ['--unknown']).status, 2);
    assert.equal(run('next-id', ['BRD']).stdout.trim(), 'BRD003');
    assert.equal(run('next-id', ['BRD', '--scope', 'other']).stdout.trim(), 'other.BRD010');
    assert.equal(run('next-id', ['CMD']).status, 2);
    writeFileSync(model, '{}');
    assert.equal(run('entity-query', []).status, 2);
    assert.equal(run('next-id', ['BRD']).status, 2);
  } finally { rmSync(root, {recursive:true, force:true}); }
});
