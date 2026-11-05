#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { parse } from 'yaml';

function files(directory) {
  return readdirSync(directory, {withFileTypes:true}).sort((left,right) => left.name.localeCompare(right.name)).flatMap(entry => {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) return files(full);
    return entry.name.endsWith('.schema.yaml') ? [full] : [];
  });
}
const escape = value => String(value).replaceAll('|', '&#124;').replaceAll('\n', ' ');
function render(schemaDirectory, output) {
  const sources = files(schemaDirectory);
  if (!sources.length) throw new Error('No schema files found');
  const lines = ['# Brandvoice 1.8.0 schema atlas', '', 'Generated from the shipped YAML schemas. The schemas define validation; this reference lists their fields, definitions and references.', '', '## Schema files', ''];
  for (const source of sources) {
    const name = relative(schemaDirectory, source);
    const link = relative(dirname(output), source).replaceAll('\\','/');
    lines.push(`- [${name}](${link})`);
  }
  for (const source of sources) {
    const schema = parse(readFileSync(source,'utf8'));
    const name = relative(schemaDirectory,source);
    lines.push('', `## ${name}`, '', schema.title ?? '', '', '| JSON Pointer | Type / constraints | Reference |', '|---|---|---|');
    function visit(value, pointer) {
      if (!value || typeof value !== 'object') return;
      const constraints = ['type','required','enum','const','pattern','additionalProperties','description'].filter(key => value[key] !== undefined).map(key => `${key}: ${typeof value[key] === 'string' ? value[key] : JSON.stringify(value[key])}`);
      if (constraints.length || value.$ref) lines.push(`| ${escape(pointer || '/')} | ${escape(constraints.join('; '))} | ${escape(value.$ref ?? '')} |`);
      for (const [key, child] of Object.entries(value)) {
        if (key === 'x-gdsm') continue;
        if (child && typeof child === 'object') visit(child, `${pointer}/${key.replaceAll('~','~0').replaceAll('/','~1')}`);
      }
    }
    visit(schema,'');
  }
  return `${lines.join('\n')}\n`;
}
try {
  const [mode, ...argumentsList] = process.argv.slice(2);
  if (!['generate','check'].includes(mode)) throw new Error('Usage: cli.mjs generate|check [--schema directory] [--out file]');
  let schema = resolve('schema/v1.8');
  let output = resolve('docs/schema-atlas/2026-11-05-reference.md');
  for (let index=0; index<argumentsList.length; index++) {
    const argument = argumentsList[index];
    if (!['--schema','--out'].includes(argument) || !argumentsList[index+1]) throw new Error(`Unknown or incomplete option: ${argument}`);
    const value = resolve(argumentsList[++index]);
    if (argument === '--schema') schema = value;
    else output = value;
  }
  const body = render(schema, output);
  if (mode === 'generate') {
    mkdirSync(dirname(output), {recursive:true});
    writeFileSync(output, body);
    console.log('Atlas generated');
  } else {
    const matches = existsSync(output) && readFileSync(output,'utf8') === body;
    console.log(matches ? 'Atlas is current' : 'Atlas missing or stale: run npm run atlas');
    process.exitCode = matches ? 0 : 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
