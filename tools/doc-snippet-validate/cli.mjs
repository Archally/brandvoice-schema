#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, dirname, join, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { extractBlocks, modelRelativePath } from './extract.mjs';
let checked = 0;
let failed = 0;
try {
  const documents = process.argv.slice(2);
  if (!documents.length) throw new Error('Usage: cli.mjs <markdown...>');
  for (const document of documents) {
    const {blocks, unnamed} = extractBlocks(readFileSync(document,'utf8'));
    if (!blocks.length) throw new Error(`${document}: no named model blocks`);
    const root = mkdtempSync(join(tmpdir(), 'brandvoice-snippets-'));
    try {
      const written = new Set();
      for (const block of blocks) {
        const name = modelRelativePath(block.path);
        if (isAbsolute(name) || name.split(/[\\/]/).some(part => part === '..') || written.has(name)) throw new Error(`Unsafe or duplicate snippet path: ${name}`);
        written.add(name);
        const target = join(root, name);
        mkdirSync(dirname(target), {recursive:true});
        writeFileSync(target, block.body + '\n');
      }
      const result = spawnSync(process.execPath, [resolve('tools/validator/src/cli.mjs'), root, '--schemas', resolve('schema/v1.8')], {encoding:'utf8'});
      checked += blocks.length;
      if (result.status !== 0) {
        failed++;
        console.error(result.stdout + result.stderr);
      }
      console.log(`${document}: ${blocks.length} named blocks, ${unnamed} unnamed fragments skipped`);
    } finally { rmSync(root,{recursive:true,force:true}); }
  }
  console.log(`${checked} blocks checked, ${failed} documents failed`);
  process.exitCode = failed ? 1 : 0;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
