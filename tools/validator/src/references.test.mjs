import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isRefKey } from "./references.mjs";
import { validateModel } from "./validate.mjs";

const schemas = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "schema", "v1.9");

function writeModel(offerings) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "brandvoice-refs-"));
  const lines = [
    'version: "1.0.0"',
    'schemaVersion: "1.8.0"',
    "name: Reference fixture",
    "strategy:",
    "  market_product:",
    '    version: "1.0.0"',
    "    offerings:",
    ...offerings.flatMap((offering) => [
      `      - id: ${offering.id}`,
      `        name: ${offering.id} name`,
      `        value_statement: ${offering.id} value`,
      ...(offering.supersededBy ? [`        superseded_by: [${offering.supersededBy.join(", ")}]`] : []),
    ]),
  ];
  fs.writeFileSync(path.join(directory, "brandvoice.yaml"), lines.join("\n") + "\n");
  return directory;
}

test("superseded_by is read as a reference field", () => {
  assert.equal(isRefKey("superseded_by"), true);
});

test("a superseded_by target that no entity declares is a cross-reference error", () => {
  const model = writeModel([{ id: "OFF001", supersededBy: ["OFF009"] }]);
  const result = validateModel({ model, schemas, compat: false });
  assert.deepEqual(result.crossErrors.filter((error) => error.includes("OFF009")).length, 1);
});

test("a superseded_by target that resolves raises no cross-reference error", () => {
  const model = writeModel([{ id: "OFF001", supersededBy: ["OFF002"] }, { id: "OFF002" }]);
  const result = validateModel({ model, schemas, compat: false });
  assert.deepEqual(result.crossErrors, []);
  assert.deepEqual(result.schemaErrors, []);
});

test("a superseded_by target of another entity type is a schema error", () => {
  const model = writeModel([{ id: "OFF001", supersededBy: ["EVD001"] }]);
  const result = validateModel({ model, schemas, compat: false });
  assert.ok(result.schemaErrors.some((error) => error.includes("/superseded_by/0")));
});
