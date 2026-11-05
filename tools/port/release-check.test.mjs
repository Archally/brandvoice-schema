import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const checkScript = path.join(path.dirname(fileURLToPath(import.meta.url)), "release-check.mjs");

function writeFile(root, relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function writeCandidate(overrides = {}) {
  const version = overrides.version ?? "1.8.0";
  const lockVersion = overrides.lockVersion ?? version;
  const changelogVersion = overrides.changelogVersion ?? version;
  const enumValues = overrides.enumValues ?? ["1.6.1", "1.7.0", "1.8.0"];
  const exportsMap = overrides.exportsMap ?? {
    "./schema/v1.8/*": "./schema/v1.8/*",
    "./model": "./tools/model-builder/dist/index.js",
  };
  const readmeVersion = overrides.readmeVersion ?? version;
  const exampleVersion = overrides.exampleVersion ?? version;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "release-check-"));
  writeFile(root, "package.json", JSON.stringify({
    name: "@archally/brandvoice-schema",
    version,
    exports: exportsMap,
    files: ["schema/", "tools/", "README.md"],
    bin: { "brandvoice-validate": "tools/validator/src/cli.mjs" },
  }, null, 2));
  writeFile(root, "package-lock.json", JSON.stringify({
    name: "@archally/brandvoice-schema",
    version: lockVersion,
    lockfileVersion: 3,
    packages: { "": { name: "@archally/brandvoice-schema", version: lockVersion } },
  }, null, 2));
  writeFile(root, "CHANGELOG.md", `# Changelog\n\n## [Unreleased]\n\n## [${changelogVersion}] - 2026-10-28\n\n- Change.\n\n## [1.7.0] - 2026-10-21\n\n- Change.\n`);
  writeFile(root, "README.md", `# Schema\n\n## Quick Start\n\n\`\`\`yaml\nschemaVersion: "${readmeVersion}"\n\`\`\`\n\n## Architecture\n`);
  writeFile(root, "schema/v1.8/metamodel.schema.yaml", `$defs:\n  schema_version:\n    type: string\n    enum: [${enumValues.map((value) => `"${value}"`).join(", ")}]\n`);
  writeFile(root, "schema/v1.8/brandvoice.schema.yaml", "type: object\n");
  writeFile(root, "tools/validator/src/cli.mjs", "#!/usr/bin/env node\n");
  writeFile(root, "tools/model-builder/dist/index.js", "export {};\n");
  writeFile(root, "examples/sample/.brandvoice/v1.8/brandvoice.yaml", `version: "1.0.0"\nschemaVersion: "${exampleVersion}"\nname: Sample\n`);
  if (overrides.extraFiles) {
    for (const [relativePath, content] of Object.entries(overrides.extraFiles)) {
      writeFile(root, relativePath, content);
    }
  }
  if (overrides.removeFiles) {
    for (const relativePath of overrides.removeFiles) {
      fs.rmSync(path.join(root, relativePath), { force: true });
    }
  }
  return root;
}

function runCheck(root, expected = "1.8.0") {
  return spawnSync(process.execPath, [checkScript, "--root", root, "--expect", expected], { encoding: "utf8" });
}

test("a coherent candidate passes", () => {
  const result = runCheck(writeCandidate());
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /0 failed/);
});

test("a package version other than the expected release fails", () => {
  const result = runCheck(writeCandidate({ version: "1.6.2", lockVersion: "1.6.2", changelogVersion: "1.6.2", readmeVersion: "1.6.2", exampleVersion: "1.6.2" }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL package version/);
});

test("a top changelog release that differs from the package version fails", () => {
  const result = runCheck(writeCandidate({ changelogVersion: "1.7.0" }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL changelog/);
});

test("a lockfile version that differs from the package version fails", () => {
  const result = runCheck(writeCandidate({ lockVersion: "1.6.1" }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL lockfile/);
});

test("an export that names a schema version not shipped fails", () => {
  const result = runCheck(writeCandidate({ exportsMap: { "./schema/v1.6/*": "./schema/v1.6/*", "./model": "./tools/model-builder/dist/index.js" } }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL export/);
});

test("an export whose target file is missing fails", () => {
  const result = runCheck(writeCandidate({ removeFiles: ["tools/model-builder/dist/index.js"] }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL export/);
});

test("a schema that does not accept the release version fails", () => {
  const result = runCheck(writeCandidate({ enumValues: ["1.6.1", "1.7.0"] }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL schema accepts/);
});

test("a 1.9.0 schema directory mixed into the candidate fails", () => {
  const result = runCheck(writeCandidate({ extraFiles: { "schema/v1.9/metamodel.schema.yaml": "$defs: {}\n" } }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL no newer release/);
});

test("a 1.9.0 schemaVersion value mixed into the deployed schema fails", () => {
  const result = runCheck(writeCandidate({ enumValues: ["1.7.0", "1.8.0", "1.9.0"] }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL no newer release/);
});

test("a Quick Start that declares an older schemaVersion fails", () => {
  const result = runCheck(writeCandidate({ readmeVersion: "1.6.1" }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL readme/);
});

test("an example that declares an older schemaVersion fails", () => {
  const result = runCheck(writeCandidate({ exampleVersion: "1.6.1" }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL example/);
});

test("a candidate with no example fails rather than passing on nothing", () => {
  const result = runCheck(writeCandidate({ removeFiles: ["examples/sample/.brandvoice/v1.8/brandvoice.yaml"] }));
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /FAIL example/);
});

test("a missing candidate root is a runner error", () => {
  const result = runCheck(path.join(os.tmpdir(), "release-check-does-not-exist"));
  assert.equal(result.status, 2);
});
