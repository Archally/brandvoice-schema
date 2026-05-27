#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import YAML from "yaml";
import { resolveComposition } from "../../validator/src/composition.mjs";
import { runChecker } from "./engine.mjs";
import { builtinRules } from "./rules/index.mjs";

function printHelp() {
  console.log(
    [
      "Usage: brandvoice-check <brandvoice-dir> [--config <path>]",
      "",
      "Run semantic checks on a brandvoice model.",
      "",
      "Arguments:",
      "  <brandvoice-dir>   Path to .brandvoice/v1.6 directory",
      "",
      "Options:",
      "  --config, -c   Path to .brandvoice-lint.yaml config file",
      "  --help, -h     Show this help",
      "  --list         List available rules and exit",
      "",
      "Config file format (.brandvoice-lint.yaml):",
      "  rules:",
      "    evidence-coverage: warn",
      "    active-message-proof: error",
      "    high-threat-depth: off",
    ].join("\n"),
  );
}

function listRules() {
  console.log("Available rules:\n");
  for (const rule of builtinRules) {
    console.log(`  ${rule.id} (default: ${rule.defaultSeverity})`);
    console.log(`    ${rule.description}\n`);
  }
}

function loadConfig(configPath) {
  if (!configPath) {
    const defaultPaths = [".brandvoice-lint.yaml", ".brandvoice-lint.yml"];
    for (const defaultPath of defaultPaths) {
      const resolved = path.resolve(defaultPath);
      if (fs.existsSync(resolved)) {
        const content = fs.readFileSync(resolved, "utf8");
        return YAML.parse(content) ?? {};
      }
    }
    return {};
  }
  const resolved = path.resolve(configPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Config file not found: ${resolved}`);
    process.exit(2);
  }
  const content = fs.readFileSync(resolved, "utf8");
  return YAML.parse(content) ?? {};
}

function main() {
  const args = process.argv.slice(2);
  let brandvoiceDir;
  let configPath;

  for (let i = 0; i < args.length; i++) {
    const token = args[i];
    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else if (token === "--list") {
      listRules();
      process.exit(0);
    } else if ((token === "--config" || token === "-c") && args[i + 1]) {
      configPath = args[i + 1];
      i++;
    } else if (!token.startsWith("-")) {
      brandvoiceDir = path.resolve(token);
    }
  }

  if (!brandvoiceDir) {
    brandvoiceDir = path.resolve(".brandvoice/v1.6");
  }

  const config = loadConfig(configPath);

  const rootModelPath = fs.statSync(brandvoiceDir).isDirectory()
    ? path.join(brandvoiceDir, "brandvoice.yaml")
    : brandvoiceDir;

  if (!fs.existsSync(rootModelPath)) {
    console.error(`Model file not found: ${rootModelPath}`);
    process.exit(2);
  }

  console.log(`Model:  ${rootModelPath}`);
  console.log(`Config: ${configPath ?? "(defaults)"}`);
  console.log(`Rules:  ${builtinRules.length} loaded`);
  console.log("");

  const composed = resolveComposition(rootModelPath);
  if (composed.errors.length) {
    console.error("Composition errors:");
    for (const error of composed.errors) console.error(`  - ${error}`);
    process.exit(2);
  }

  const issues = runChecker(composed.root, builtinRules, config);

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warn");
  const infos = issues.filter((i) => i.severity === "info");

  if (errors.length > 0) {
    console.log("Errors:");
    for (const issue of errors) {
      console.log(`  [${issue.ruleId}] ${issue.message}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const issue of warnings) {
      console.log(`  [${issue.ruleId}] ${issue.message}`);
    }
    console.log("");
  }

  if (infos.length > 0) {
    console.log("Info:");
    for (const issue of infos) {
      console.log(`  [${issue.ruleId}] ${issue.message}`);
    }
    console.log("");
  }

  const total = errors.length + warnings.length + infos.length;
  if (errors.length > 0) {
    console.log(`FAILED: ${errors.length} error(s), ${warnings.length} warning(s), ${infos.length} info(s).`);
    process.exit(1);
  } else if (total > 0) {
    console.log(`PASSED: ${warnings.length} warning(s), ${infos.length} info(s).`);
  } else {
    console.log("PASSED: no issues found.");
  }
}

main();
