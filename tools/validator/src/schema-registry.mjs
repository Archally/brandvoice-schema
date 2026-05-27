import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { walkFiles, loadYaml, toPosixPath } from "./utils.mjs";

export function schemaBaseUri(version) {
  return `https://archally.pro/schemas/brandvoice/${version}/`;
}

export function loadSchemaRegistry(versionRoot) {
  const schemaDir = fs.existsSync(path.join(versionRoot, "schema"))
    ? path.join(versionRoot, "schema")
    : versionRoot;
  if (!fs.existsSync(schemaDir)) {
    throw new Error(`Schema directory not found: ${schemaDir}`);
  }
  const schemaFiles = walkFiles(
    schemaDir,
    (f) => /\.schema\.(yaml|yml)$/i.test(f),
  );
  const registry = new Map();
  for (const filePath of schemaFiles) {
    const rel = toPosixPath(path.relative(schemaDir, filePath));
    registry.set(rel, loadYaml(filePath));
  }
  return { registry, schemaDir };
}

export function makeAjv(registry, baseUri) {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
    validateSchema: false,
  });
  const sorted = [...registry.entries()].sort(([a], [b]) => {
    const rank = (k) => (!k.includes("/") ? 0 : 1);
    return rank(a) !== rank(b) ? rank(a) - rank(b) : a.localeCompare(b);
  });
  for (const [rel, schema] of sorted) {
    const normalized = structuredClone(schema);
    normalized.$id = baseUri + rel;
    ajv.addSchema(normalized);
  }
  return ajv;
}
