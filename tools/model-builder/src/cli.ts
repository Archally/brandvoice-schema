#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { loadBrandvoice } from './loader.js';
import { buildBrandvoiceModel } from './build-model.js';

function printHelp() {
  console.log(
    [
      'Usage: brandvoice-model <brandvoice-dir> [--output <path>] [--pretty] [--stats]',
      '',
      'Loads brandvoice YAML files and produces a model.json.',
      '',
      'Arguments:',
      '  <brandvoice-dir>   Path to .brandvoice/v1.6 directory',
      '',
      'Options:',
      '  --output, -o   Write to file instead of stdout',
      '  --pretty, -p   Pretty-print JSON (2-space indent)',
      '  --stats        Print entity/relation stats and exit (no JSON output)',
      '  --help, -h     Show this help',
    ].join('\n'),
  );
}

function main() {
  const args = process.argv.slice(2);
  let brandvoiceDir: string | undefined;
  let outputPath: string | undefined;
  let pretty = false;
  let statsOnly = false;

  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (token === '--help' || token === '-h') {
      printHelp();
      process.exit(0);
    } else if ((token === '--output' || token === '-o') && args[i + 1]) {
      outputPath = path.resolve(args[i + 1]);
      i++;
    } else if (token === '--pretty' || token === '-p') {
      pretty = true;
    } else if (token === '--stats') {
      statsOnly = true;
    } else if (!token.startsWith('-')) {
      brandvoiceDir = path.resolve(token);
    }
  }

  const resolvedDir = brandvoiceDir ?? path.resolve('.brandvoice/v1.6');

  console.error(`Loading: ${resolvedDir}`);

  const composed = loadBrandvoice(resolvedDir);
  if (composed.errors.length) {
    console.error('Composition errors:');
    for (const error of composed.errors) console.error(`  - ${error}`);
    process.exit(2);
  }

  const model = buildBrandvoiceModel(composed.root);

  console.error(`Entities:  ${model.metadata.totalEntities}`);
  console.error(`Relations: ${model.metadata.totalRelations}`);

  if (statsOnly) {
    console.error('');
    console.error('Entity types:');
    for (const [type, count] of Object.entries(model.metadata.entityTypeCounts).sort(([, a], [, b]) => b - a)) {
      console.error(`  ${type}: ${count}`);
    }
    console.error('');
    console.error('Planes:');
    for (const [plane, count] of Object.entries(model.metadata.planeCounts).sort(([, a], [, b]) => b - a)) {
      console.error(`  ${plane}: ${count}`);
    }
    console.error('');
    console.error('Relation types:');
    for (const [type, count] of Object.entries(model.metadata.relationTypeCounts).sort(([, a], [, b]) => b - a)) {
      console.error(`  ${type}: ${count}`);
    }
    process.exit(0);
  }

  const json = JSON.stringify(model, null, pretty ? 2 : undefined);

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, json, 'utf8');
    console.error(`Written: ${outputPath}`);
  } else {
    process.stdout.write(json);
  }
}

main();
