import fs from "node:fs";
import path from "node:path";
import { loadYaml, toPosixPath, mergeIntoPlane, mergeSliceDocument } from "./utils.mjs";
import { PLANE_SUBDIRS, nestedSubKey } from "./schema-types.mjs";

export function resolveComposition(rootPath) {
  const rootDir = path.dirname(rootPath);
  const root = loadYaml(rootPath);
  const files = { root: rootPath };
  const errors = [];
  const refTargetPosix = new Set();

  function loadRefObject(node, fileKey) {
    if (!node || typeof node !== "object" || Array.isArray(node)) return node;
    if (Object.keys(node).length === 1 && typeof node.$ref === "string") {
      const filePath = path.resolve(rootDir, node.$ref);
      if (!fs.existsSync(filePath)) {
        errors.push(`Missing composed file '${node.$ref}' from ${fileKey}`);
        return node;
      }
      refTargetPosix.add(toPosixPath(path.relative(rootDir, filePath)));
      files[node.$ref] = filePath;
      return loadYaml(filePath);
    }
    const out = { ...node };
    for (const [k, v] of Object.entries(node)) {
      out[k] = loadRefObject(v, fileKey);
    }
    return out;
  }

  const hydrated = loadRefObject(root, "brandvoice.yaml");
  const supplementaryWarnings = [];
  mergeUnreferencedSupplementaryFiles(hydrated, rootDir, refTargetPosix, supplementaryWarnings);
  return { root: hydrated, files, errors, refTargetPosix, supplementaryWarnings };
}

function mergeUnreferencedSupplementaryFiles(root, modelDir, refTargetPosix, warnings = []) {
  for (const planeDir of PLANE_SUBDIRS) {
    const dir = path.join(modelDir, planeDir);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;

    const names = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
      .sort();

    for (const name of names) {
      const rel = path.join(planeDir, name).split(path.sep).join("/");
      if (refTargetPosix.has(rel)) continue;

      const filePath = path.join(dir, name);
      if (!fs.statSync(filePath).isFile()) continue;

      const data = loadYaml(filePath);
      if (data == null || typeof data !== "object" || Array.isArray(data)) {
        warnings.push(`Supplementary: skipped non-object ${rel}`);
        continue;
      }

      if (!root[planeDir] || typeof root[planeDir] !== "object" || Array.isArray(root[planeDir])) {
        root[planeDir] = {};
      }
      const planeNode = root[planeDir];

      const targetKey = nestedSubKey(planeDir, name);
      if (targetKey) {
        if (!planeNode[targetKey] || typeof planeNode[targetKey] !== "object" || Array.isArray(planeNode[targetKey])) {
          planeNode[targetKey] = {};
        }
        mergeSliceDocument(planeNode[targetKey], data);
      } else {
        mergeIntoPlane(planeNode, data, warnings);
      }
    }
  }
}
