#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { validateModel } from "./validate.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = {
    model: path.resolve(".brandvoice/v1.8"),
    schemas: path.resolve(__dirname, "..", "..", "..", "schema", "v1.8"),
    compat: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if ((token === "--model" || token === "-m") && argv[i + 1]) {
      args.model = path.resolve(argv[i + 1]);
      i += 1;
    } else if ((token === "--schemas" || token === "-s") && argv[i + 1]) {
      args.schemas = path.resolve(argv[i + 1]);
      i += 1;
    } else if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else if (token === "--compat" || token === "-c") {
      args.compat = true;
    } else if (!token.startsWith("-")) {
      args.model = path.resolve(token);
    }
  }
  if (!argv.includes("--schemas") && !argv.includes("-s")) {
    const versionMatch = args.model.match(/v(\d+\.\d+)/);
    if (versionMatch) {
      const detected = path.resolve(__dirname, "..", "..", "..", "schema", `v${versionMatch[1]}`);
      if (fs.existsSync(detected)) {
        args.schemas = detected;
      }
    }
  }
  return args;
}

function printHelp() {
  console.log(
    [
      "Usage: brandvoice-validate [PATH] [--model PATH] [--schemas PATH] [--compat]",
      "",
      "Validates brandvoice YAML files against schemas and checks cross-references.",
      "",
      "Options:",
      "  --model, -m    Brandvoice directory to validate (default: .brandvoice/v1.8)",
      "  --schemas, -s  Schema version root directory (default: auto-detected from model path)",
      "  --compat, -c   Relax schema failures to warnings",
      "  --help, -h     Show this help",
      "",
      "Checks performed:",
      "  1) Composition resolution ($ref loading + supplementary file merge)",
      "  2) Per-model schema validation (Ajv draft-2020-12)",
      "  3) Cross-file reference integrity (typed IDs)",
      "  4) Semantic checks (active messages need evidence, campaigns need refs)",
      "  5) Gap warnings (missing evidence linkage, orphan evidence, empty planes)",
    ].join("\n"),
  );
}

function main() {
  const args = parseArgs(process.argv);
  let result;
  try {
    result = validateModel(args);
  } catch (err) {
    console.error(`Validation runner failed: ${err.message}`);
    process.exit(2);
  }

  console.log(`Model:     ${result.modelPath}`);
  console.log(`Schemas:   ${args.schemas}`);
  console.log(`Mode:      ${args.compat ? "compat" : "strict"}`);
  console.log(`Files:     ${result.filesComposed} composed`);
  console.log("");

  if (result.schemaErrors.length) {
    console.log("Schema Errors:");
    result.schemaErrors.forEach((e) => console.log(`  - ${e}`));
    console.log("");
  } else {
    console.log("Schema Errors: none");
    console.log("");
  }

  if (result.crossErrors.length) {
    console.log("Cross-Reference Errors:");
    result.crossErrors.forEach((e) => console.log(`  - ${e}`));
    console.log("");
  } else {
    console.log("Cross-Reference Errors: none");
    console.log("");
  }

  if (result.semanticErrors.length) {
    console.log("Semantic Errors:");
    result.semanticErrors.forEach((e) => console.log(`  - ${e}`));
    console.log("");
  } else {
    console.log("Semantic Errors: none");
    console.log("");
  }

  if (result.warnings.length) {
    console.log("Gap Warnings:");
    result.warnings.forEach((w) => console.log(`  - ${w}`));
    console.log("");
  } else {
    console.log("Gap Warnings: none");
    console.log("");
  }

  const errorCount = result.schemaErrors.length + result.crossErrors.length + result.semanticErrors.length;
  if (errorCount > 0) {
    console.log(`FAILED with ${errorCount} error(s), ${result.warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(`PASSED with ${result.warnings.length} warning(s).`);
}

main();
