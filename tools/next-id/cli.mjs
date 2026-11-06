#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
try {
  const [file, prefix, ...argumentsList] = process.argv.slice(2);
  if (!file || !prefix) throw new Error('Usage: cli.mjs model.json PREFIX [--scope namespace]');
  let scope = '';
  if (argumentsList.length) {
    if (argumentsList.length !== 2 || argumentsList[0] !== '--scope' || !/^[a-z][a-z0-9-]*$/.test(argumentsList[1])) throw new Error('Expected --scope namespace');
    scope = argumentsList[1] + '.';
  }
  const definitions = parse(readFileSync(new URL('../../schema/v1.9/metamodel.schema.yaml', import.meta.url), 'utf8')).$defs;
  const prefixes = new Set(Object.values(definitions).flatMap(definition => [...(definition.pattern ?? '').matchAll(/([A-Z]{2,6})\\d/g)].map(match => match[1])));
  if (!prefixes.has(prefix)) throw new Error(`Unknown Brandvoice prefix: ${prefix}`);
  const model = JSON.parse(readFileSync(file,'utf8'));
  if (!Array.isArray(model.entities)) throw new Error('Expected a built model with entities');
  const pattern = new RegExp(`^${escape(scope + prefix)}(\\d{3})$`);
  let maximum = 0;
  for (const entity of model.entities) {
    const match = pattern.exec(entity.id);
    if (match) maximum = Math.max(maximum, Number(match[1]));
  }
  if (maximum >= 999) throw new Error('Three-digit prefix range exhausted');
  console.log(`${scope}${prefix}${String(maximum+1).padStart(3,'0')}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
