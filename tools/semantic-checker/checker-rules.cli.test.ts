import { it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

it('executes the composed rule fixtures in the default checker suite', () => {
  const testPath = fileURLToPath(new URL('./checker-rules.test.mjs', import.meta.url));
  const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', testPath], {
    encoding: 'utf8', timeout: 120000,
  });
  expect(result.error).toBeUndefined();
  expect(result.status, result.stdout + result.stderr).toBe(0);
  expect(result.stdout).toMatch(/# tests 92/);
  expect(result.stdout).toMatch(/# fail 0/);
}, 125000);
