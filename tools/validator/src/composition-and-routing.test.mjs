import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateModel } from "./validate.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const schemasDirCandidates = [
  path.resolve(currentDir, "..", "..", "..", "v1"),
  path.resolve(currentDir, "..", "..", "..", "schema", "v1.9"),
];
const schemasDir = schemasDirCandidates.find((candidate) => fs.existsSync(candidate)) ?? schemasDirCandidates[0];
const fixturesRoot = path.join(currentDir, "fixtures");

function fixturePath(fixtureName) {
  return path.join(fixturesRoot, fixtureName);
}

test("suffix-style shards preserve object slots, scoped IDs, and nested white-space IDs", () => {
  const result = validateModel({
    model: fixturePath("shard-object-slots"),
    schemas: schemasDir,
    compat: false,
  });

  assert.deepEqual(result.schemaErrors, []);
  assert.deepEqual(result.crossErrors, []);
  assert.deepEqual(result.semanticErrors, []);
});

test("custom root slots and alias-named supplementary shards validate against target schemas", () => {
  const result = validateModel({
    model: fixturePath("custom-slots-and-routing"),
    schemas: schemasDir,
    compat: false,
  });

  assert.deepEqual(result.schemaErrors, []);
  assert.deepEqual(result.crossErrors, []);
  assert.deepEqual(result.semanticErrors, []);
});

test("an unmapped plane YAML shard fails with an explicit schema-routing error", () => {
  const result = validateModel({
    model: fixturePath("unmapped-shard"),
    schemas: schemasDir,
    compat: false,
  });

  assert.equal(result.schemaErrors.length, 1);
  assert.match(result.schemaErrors[0], /^\/market\/notes\.unknown\.yaml\/ -> No schema maps to "market\/notes\.unknown\.yaml"/);
});

test("a root-level referenced shard is rejected while a plane-routed shard passes", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "brandvoice-root-ref-"));
  try {
    const unroutedDir = path.join(tempRoot, "unrouted");
    fs.mkdirSync(unroutedDir);
    fs.writeFileSync(
      path.join(unroutedDir, "brandvoice.yaml"),
      'version: "1.0.0"\nname: "Unrouted root shard"\nmarket:\n  competition:\n    $ref: "competition.yaml"\n',
    );
    fs.writeFileSync(
      path.join(unroutedDir, "competition.yaml"),
      'version: "1.0.0"\ncompetitors: []\n',
    );

    const unrouted = validateModel({
      model: unroutedDir,
      schemas: schemasDir,
      compat: false,
    });
    assert.equal(unrouted.schemaErrors.length, 1);
    assert.match(unrouted.schemaErrors[0], /^\/competition\.yaml\/ -> No schema maps to "competition\.yaml"/);

    const routedDir = path.join(tempRoot, "routed");
    fs.mkdirSync(path.join(routedDir, "market"), { recursive: true });
    fs.writeFileSync(
      path.join(routedDir, "brandvoice.yaml"),
      'version: "1.0.0"\nname: "Routed plane shard"\nmarket:\n  competition:\n    $ref: "market/competition.yaml"\n',
    );
    fs.writeFileSync(
      path.join(routedDir, "market", "competition.yaml"),
      'version: "1.0.0"\ncompetitors: []\n',
    );

    const routed = validateModel({
      model: routedDir,
      schemas: schemasDir,
      compat: false,
    });
    assert.deepEqual(routed.schemaErrors, []);
    assert.deepEqual(routed.crossErrors, []);
    assert.deepEqual(routed.semanticErrors, []);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("per-file shard shape violations surface with source file and property path without root oneOf noise", () => {
  const result = validateModel({
    model: fixturePath("per-file-shape-violations"),
    schemas: schemasDir,
    compat: false,
  });

  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/strategy/capacity-priorities.yaml/ -> must NOT have additional properties: scope",
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/strategy/capacity-priorities.yaml/priority_streams/0 -> must have required property 'name'",
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/strategy/capacity-priorities.yaml/priority_streams/0/priority -> must be integer",
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/governance/measurement.yaml/ -> must NOT have additional properties: north_star",
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error.startsWith("/market/substitutes.competition.yaml/competitors/0/growth_trajectory -> must be equal to one of the allowed values:"),
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/strategy/market-product.yaml/personas/0 -> must NOT have additional properties: buying_psychology",
    ),
  );
  assert.equal(
    result.schemaErrors.some((error) => error.includes("must match exactly one schema in oneOf")),
    false,
  );
});

test("missing composed files wired in brandvoice.yaml and missing references remain errors", () => {
  const result = validateModel({
    model: fixturePath("missing-composed-file"),
    schemas: schemasDir,
    compat: false,
  });

  assert.ok(
    result.schemaErrors.includes("Missing composed file 'strategy/brand-core.yaml' from brandvoice.yaml"),
  );
  assert.ok(
    result.crossErrors.some(
      (error) => error === "Missing reference 'demo.CPR999' at governance/evidence.yaml.evidence.[0].supports[0]",
    ),
  );
});

test("typed ref prefixes fail only on declared fields, undeclared keys fail only on closed objects", () => {
  const result = validateModel({
    model: fixturePath("schema-aware-typed-refs"),
    schemas: schemasDir,
    compat: false,
  });

  assert.deepEqual(result.crossErrors, []);
  assert.ok(
    result.schemaErrors.some(
      (error) => error.startsWith("/strategy/market-product.yaml/positioning/0/target_audiences/0 -> must match pattern"),
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error.startsWith("/activation/campaigns.yaml/campaigns/0/north_star -> must match pattern"),
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/activation/channels.yaml/channels/0 -> must NOT have additional properties: primary_audience_refs",
    ),
  );
  assert.ok(
    result.schemaErrors.some(
      (error) => error === "/strategy/messaging.yaml/journey_stages/0 -> must NOT have additional properties: primary_audience_ref",
    ),
  );
  assert.equal(
    result.schemaErrors.some((error) => error.includes("pattern_blocks")),
    false,
  );
});

test("active messages and campaigns missing optional fields emit advisories instead of errors", () => {
  const result = validateModel({
    model: fixturePath("semantic-advisories"),
    schemas: schemasDir,
    compat: false,
  });

  assert.deepEqual(result.schemaErrors, []);
  assert.deepEqual(result.crossErrors, []);
  assert.deepEqual(result.semanticErrors, []);
  assert.ok(
    result.warnings.includes("Advisory: active message 'MSG001' has no evidence_refs"),
  );
  assert.ok(
    result.warnings.includes("Advisory: active message 'MSG001' has no proof_points"),
  );
  assert.ok(
    result.warnings.includes("Advisory: active campaign 'CMP001' is missing message_refs, channel_refs, or outcome_refs"),
  );
});
