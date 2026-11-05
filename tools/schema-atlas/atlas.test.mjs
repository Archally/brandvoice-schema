import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const cli = new URL('./cli.mjs', import.meta.url);
test('atlas renders definitions and references and rejects missing or stale output', () => {
  const root = mkdtempSync(join(tmpdir(), 'atlas-test-'));
  try {
    const schema = join(root, 'schema');
    const output = join(root, 'atlas.md');
    mkdirSync(schema);
    writeFileSync(join(schema, 'brand.schema.yaml'), 'title: Brand\n$defs:\n  brand:\n    properties:\n      id:\n        $ref: "meta.schema.yaml#/$defs/brand_ref"\n');
    writeFileSync(join(schema, 'meta.schema.yaml'), '$defs:\n  brand_ref:\n    type: string\n    pattern: "BRD"\n');
    const run = (mode) => spawnSync(process.execPath, [cli.pathname, mode, '--schema', schema, '--out', output], {encoding:'utf8'});
    assert.equal(run('check').status, 1);
    assert.equal(run('generate').status, 0);
    assert.match(readFileSync(output,'utf8'), /brand_ref/);
    assert.match(readFileSync(output,'utf8'), /meta.schema.yaml#\/\$defs\/brand_ref/);
    assert.equal(run('check').status, 0);
    writeFileSync(output, 'stale');
    assert.equal(run('check').status, 1);
    assert.equal(run('generate').status, 0);
    assert.equal(run('check').status, 0);
  } finally { rmSync(root, {recursive:true, force:true}); }
});
