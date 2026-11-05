#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
function files(target) {
  if (!existsSync(target)) throw new Error(`Missing documentation: ${target}`);
  const entries = readdirSync(target, {withFileTypes:true});
  return entries.flatMap(entry => {
    if (['node_modules','dist'].includes(entry.name)) return [];
    const full = join(target,entry.name);
    if (entry.isDirectory()) return files(full);
    return /\.(md|ya?ml|txt)$/.test(entry.name) || entry.name === 'LICENSE' ? [full] : [];
  });
}
try {
  const argumentsList = process.argv.slice(2);
  const targets = argumentsList.length ? argumentsList : ['README.md','docs','tools','schema','examples'];
  const documents = targets.flatMap(target => /\.(md|ya?ml|txt)$/.test(target) ? [target] : files(target));
  const forbidden = /(?:npx @archally\/brandvoice-schema|monorepo|\.prompts\/|\.agents\/|\/Users\/|D-P\d+|OQ-P\d+|DEC-ATL-\d+|next release will|will (?:support|ship|introduce)|coming soon)/i;
  let failed = 0;
  for (const document of documents) {
    const lines = readFileSync(document,'utf8').split('\n');
    for (let index=0; index<lines.length; index++) {
      if (forbidden.test(lines[index])) {
        console.log(`Forbidden text: ${document}:${index+1}`);
        failed++;
      }
    }
  }
  console.log(`${documents.length} documents checked, ${failed} violations`);
  process.exitCode = failed ? 1 : 0;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
