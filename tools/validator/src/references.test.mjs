import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isRefKey } from "./references.mjs";
import { validateModel } from "./validate.mjs";

const schemasCandidates = [
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "v1"),
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "schema", "v1.9"),
];
const schemas = schemasCandidates.find((candidate) => fs.existsSync(candidate)) ?? schemasCandidates[0];

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

function writeProofAndAudienceModel({ targetAudiences, proofPoints }) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "brandvoice-refs-"));
  const lines = [
    'version: "1.0.0"',
    'schemaVersion: "1.9.0"',
    "name: Proof and audience reference fixture",
    "strategy:",
    "  market_product:",
    '    version: "1.0.0"',
    "    audiences:",
    "      - id: AUD001",
    "        name: Primary audience",
    "        need: Shared audience need",
    "    offerings:",
    "      - id: OFF001",
    "        name: Core offering",
    "        value_statement: Core offering value",
    `        target_audiences: [${targetAudiences.join(", ")}]`,
    "  messaging:",
    '    version: "1.0.0"',
    "    proof_points:",
    "      - id: PRF001",
    "        claim: Verified claim",
    "        evidence: Observed proof",
    "    messages:",
    "      - id: MSG001",
    "        title: Core message",
    "        core_statement: Clear message statement",
    `        proof_points: [${proofPoints.join(", ")}]`,
  ];
  fs.writeFileSync(path.join(directory, "brandvoice.yaml"), lines.join("\n") + "\n");
  return directory;
}

test("dangling proof_points and target_audiences ids are reported as missing references", () => {
  const danglingModelDirectory = writeProofAndAudienceModel({
    targetAudiences: ["AUD999"],
    proofPoints: ["PRF999"],
  });
  const validationResult = validateModel({
    model: danglingModelDirectory,
    schemas,
    compat: false,
  });
  assert.deepEqual(validationResult.schemaErrors, []);
  assert.equal(
    validationResult.crossErrors.filter((error) => error.includes("PRF999")).length,
    1,
  );
  assert.equal(
    validationResult.crossErrors.filter((error) => error.includes("AUD999")).length,
    1,
  );
});

test("valid proof_points and target_audiences ids pass without reference errors", () => {
  const validModelDirectory = writeProofAndAudienceModel({
    targetAudiences: ["AUD001"],
    proofPoints: ["PRF001"],
  });
  const validationResult = validateModel({
    model: validModelDirectory,
    schemas,
    compat: false,
  });
  assert.deepEqual(validationResult.schemaErrors, []);
  assert.deepEqual(validationResult.crossErrors, []);
});
