#!/usr/bin/env node
// Verify the shipped schema, tools and package resources against their integrity baseline.
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readIntegrity, verifyIntegrity } from './integrity.mjs';

try {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const integrity = readIntegrity(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'PORTED.sha256'), 'utf8'));
  const result = verifyIntegrity(root, integrity);
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else if (result.ok) console.log(`OK: ${result.checked} files match PORTED.sha256.`);
  else console.error(result.problems.join('\n'));
  process.exitCode = result.ok ? 0 : 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
