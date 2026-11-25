import fs from "node:fs";
import path from "node:path";
import { loadYaml, toPosixPath } from "./utils.mjs";
import { PLANE_SUBDIRS, planeOfPath, resolveDataFileSchemaPath } from "./schema-types.mjs";

function isPlainObject(value) {
  if (!value) {
    return false;
  }
  if (typeof value !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  return true;
}

function isFileRefPlaceholder(node) {
  if (!isPlainObject(node)) {
    return false;
  }
  const keys = Object.keys(node);
  if (keys.length !== 1) {
    return false;
  }
  if (typeof node.$ref !== "string") {
    return false;
  }
  return true;
}

function isYamlFileName(fileName) {
  if (fileName.endsWith(".yaml")) {
    return true;
  }
  if (fileName.endsWith(".yml")) {
    return true;
  }
  return false;
}

function collectPlaceholderRefs(node, collectedRefs) {
  if (Array.isArray(node)) {
    for (const item of node) {
      collectPlaceholderRefs(item, collectedRefs);
    }
    return;
  }
  if (!isPlainObject(node)) {
    return;
  }
  if (isFileRefPlaceholder(node)) {
    collectedRefs.push(node.$ref);
    return;
  }
  for (const childValue of Object.values(node)) {
    collectPlaceholderRefs(childValue, collectedRefs);
  }
}

function loadDocumentEntry(relativePath, absolutePath) {
  const schemaPath = resolveDataFileSchemaPath(relativePath);
  const plane = planeOfPath(relativePath);
  try {
    const data = loadYaml(absolutePath);
    return {
      file: relativePath,
      absolutePath,
      plane,
      schemaPath,
      data,
      parseError: null,
    };
  } catch (error) {
    const parseMessage = error instanceof Error ? error.message : String(error);
    return {
      file: relativePath,
      absolutePath,
      plane,
      schemaPath,
      data: null,
      parseError: parseMessage,
    };
  }
}

export function discoverModelDocuments(rootModelPath) {
  const rootDir = path.dirname(rootModelPath);
  const rootFileName = toPosixPath(path.basename(rootModelPath));
  const rootDocument = loadDocumentEntry(rootFileName, rootModelPath);
  if (rootDocument.schemaPath === null) {
    rootDocument.schemaPath = "brandvoice.schema.yaml";
  }

  const documents = [rootDocument];
  const files = { [rootDocument.file]: rootModelPath };
  const errors = [];
  const warnings = [];
  const seenRelativePaths = new Set([rootDocument.file]);
  const referencedExistingFiles = [];

  const placeholderRefs = [];
  collectPlaceholderRefs(rootDocument.data, placeholderRefs);

  for (const refPath of placeholderRefs) {
    const targetAbsolutePath = path.resolve(rootDir, refPath);
    if (!fs.existsSync(targetAbsolutePath)) {
      errors.push(`Missing composed file '${refPath}' from ${rootFileName}`);
      continue;
    }
    if (!fs.statSync(targetAbsolutePath).isFile()) {
      errors.push(`Missing composed file '${refPath}' from ${rootFileName}`);
      continue;
    }
    const relativeTarget = toPosixPath(path.relative(rootDir, targetAbsolutePath));
    referencedExistingFiles.push({
      relativePath: relativeTarget,
      absolutePath: targetAbsolutePath,
    });
  }

  const migrationsAbsolutePath = path.join(rootDir, "migrations.yaml");
  if (fs.existsSync(migrationsAbsolutePath)) {
    if (fs.statSync(migrationsAbsolutePath).isFile()) {
      if (!seenRelativePaths.has("migrations.yaml")) {
        seenRelativePaths.add("migrations.yaml");
        const migrationDocument = loadDocumentEntry("migrations.yaml", migrationsAbsolutePath);
        documents.push(migrationDocument);
        files[migrationDocument.file] = migrationsAbsolutePath;
      }
    }
  }

  for (const planeDir of PLANE_SUBDIRS) {
    const planeAbsoluteDir = path.join(rootDir, planeDir);
    if (!fs.existsSync(planeAbsoluteDir)) {
      continue;
    }
    if (!fs.statSync(planeAbsoluteDir).isDirectory()) {
      continue;
    }

    const fileNames = fs
      .readdirSync(planeAbsoluteDir)
      .filter((fileName) => isYamlFileName(fileName))
      .sort();

    for (const fileName of fileNames) {
      const fileAbsolutePath = path.join(planeAbsoluteDir, fileName);
      if (!fs.statSync(fileAbsolutePath).isFile()) {
        continue;
      }
      const relativePath = `${planeDir}/${fileName}`;
      if (seenRelativePaths.has(relativePath)) {
        continue;
      }
      seenRelativePaths.add(relativePath);
      const shardDocument = loadDocumentEntry(relativePath, fileAbsolutePath);
      documents.push(shardDocument);
      files[relativePath] = fileAbsolutePath;
    }
  }

  referencedExistingFiles.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  for (const referenced of referencedExistingFiles) {
    if (seenRelativePaths.has(referenced.relativePath)) {
      continue;
    }
    seenRelativePaths.add(referenced.relativePath);
    const extraDocument = loadDocumentEntry(referenced.relativePath, referenced.absolutePath);
    documents.push(extraDocument);
    files[referenced.relativePath] = referenced.absolutePath;
  }

  return {
    root: rootDocument.data,
    documents,
    files,
    errors,
    supplementaryWarnings: warnings,
  };
}

export const resolveComposition = discoverModelDocuments;
