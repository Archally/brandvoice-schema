#!/usr/bin/env node
import { readFileSync } from 'node:fs';
try {
  const [file, ...argumentsList] = process.argv.slice(2);
  if (!file) throw new Error('Usage: cli.mjs model.json [--type type] [--plane plane] [--text text]');
  const options = {};
  for (let index=0; index<argumentsList.length; index++) {
    const argument = argumentsList[index];
    if (!['--type','--plane','--text'].includes(argument) || !argumentsList[index+1]) throw new Error(`Unknown or incomplete option: ${argument}`);
    options[argument.slice(2)] = argumentsList[++index];
  }
  const model = JSON.parse(readFileSync(file,'utf8'));
  if (!Array.isArray(model.entities)) throw new Error('Expected a built model with entities');
  const entities = model.entities.filter(entity => {
    if (options.type && entity.type !== options.type) return false;
    if (options.plane && entity.plane !== options.plane) return false;
    if (options.text && !JSON.stringify(entity).toLowerCase().includes(options.text.toLowerCase())) return false;
    return true;
  });
  console.log(JSON.stringify({total:entities.length, entities}, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
