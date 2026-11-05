import fs from "node:fs";
import path from "node:path";
import { loadSchemaRegistry, makeAjv, schemaBaseUri } from "./schema-registry.mjs";
import { resolveComposition } from "./composition.mjs";
import { collectIds, collectRefs } from "./references.mjs";
import { collectSemanticErrors, collectGapWarnings } from "./semantics.mjs";

function formatAjvErrors(errors) {
  if (!errors) return [];
  return errors.map((e) => {
    const at = e.instancePath ? e.instancePath : "/";
    return `${at} -> ${e.message ?? "schema error"}`;
  });
}

export function detectSchemaVersion(schemasDir) {
  const match = schemasDir.match(/v(\d+\.\d+)/);
  return match ? `v${match[1]}` : "v1.8";
}

export function validateModel(args) {
  const { registry } = loadSchemaRegistry(args.schemas);
  const version = detectSchemaVersion(args.schemas);
  const baseUri = schemaBaseUri(version);
  const ajv = makeAjv(registry, baseUri);

  const rootSchemaUri = baseUri + "brandvoice.schema.yaml";
  const rootSchemaValidate = ajv.getSchema(rootSchemaUri);
  if (!rootSchemaValidate) {
    throw new Error("Could not load brandvoice.schema.yaml from schema directory.");
  }

  const rootModelPath = fs.statSync(args.model).isDirectory()
    ? path.join(args.model, "brandvoice.yaml")
    : args.model;

  if (!fs.existsSync(rootModelPath)) {
    throw new Error(`Model file not found: ${rootModelPath}`);
  }

  const composed = resolveComposition(rootModelPath);
  const schemaErrors = [];
  const crossErrors = [];
  const semanticErrors = [];
  const warnings = [];

  if (composed.errors.length) schemaErrors.push(...composed.errors);
  if (composed.supplementaryWarnings?.length) {
    warnings.push(...composed.supplementaryWarnings);
  }

  const validRoot = rootSchemaValidate(composed.root);
  if (!validRoot) schemaErrors.push(...formatAjvErrors(rootSchemaValidate.errors));

  const { ids, duplicates } = collectIds(composed.root);
  for (const [id, locs] of duplicates.entries()) {
    warnings.push(`Potential duplicate ID '${id}' in: ${locs.join(", ")}`);
  }

  const refs = collectRefs(composed.root);
  for (const r of refs) {
    if (!ids.has(r.value)) {
      crossErrors.push(`Missing reference '${r.value}' at ${r.loc}`);
    }
  }

  semanticErrors.push(...collectSemanticErrors(composed.root));
  warnings.push(...collectGapWarnings(composed.root, ids, refs));

  if (args.compat && schemaErrors.length > 0) {
    warnings.push(
      ...schemaErrors.map((e) => `Compat schema warning: ${e}`),
      "Compat mode active: schema violations are non-fatal.",
    );
    schemaErrors.length = 0;
  }

  return {
    schemaErrors,
    crossErrors,
    semanticErrors,
    warnings,
    modelPath: rootModelPath,
    filesComposed: Object.keys(composed.files).length,
  };
}
