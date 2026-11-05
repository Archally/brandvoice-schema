import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
for (const [name, content] of Object.entries({ id:'Decision D-P99', path:'.prompts/private', mechanic:'Read the monorepo', future:'The next release will support automatic migration.', stale:'npx @archally/brandvoice-schema validate'  })) {
  test(`docs check rejects ${name}`, () => {
    const root = mkdtempSync(join(tmpdir(), 'docs-test-'));
    try {
      const doc = join(root, 'text.md');
      writeFileSync(doc, content);
      const result = spawnSync(process.execPath, ['tools/port/docs-check.mjs', doc], {encoding:'utf8'});
      assert.equal(result.status, 1);
      assert.match(result.stdout, /Forbidden/);
    } finally { rmSync(root, {recursive:true, force:true}); }
  });
}
test('actual documentation passes', () => {
  const result = spawnSync(process.execPath, ['tools/port/docs-check.mjs'], {encoding:'utf8'});
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /checked/);
});
