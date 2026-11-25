import fs from "node:fs";
import path from "node:path";
import { loadSchemaRegistry, makeAjv, schemaBaseUri } from "./schema-registry.mjs";
import { discoverModelDocuments } from "./composition.mjs";
import { collectIdsFromDocuments, collectRefsFromDocuments } from "./references.mjs";
import {
  collectSemanticAdvisories,
  collectSemanticErrors,
  collectGapWarnings,
} from "./semantics.mjs";

function describeAjvError(error) {
  const baseMessage = error.message ?? "schema error";
  const params = error.params;
  if (!params) {
    return baseMessage;
  }
  if (error.keyword === "additionalProperties") {
    if (typeof params.additionalProperty === "string") {
      return `${baseMessage}: ${params.additionalProperty}`;
    }
  }
  if (error.keyword === "enum") {
    if (Array.isArray(params.allowedValues)) {
      return `${baseMessage}: ${params.allowedValues.join(", ")}`;
    }
  }
  return baseMessage;
}

function formatDocumentPath(documentFile, isRootDocument, instancePath) {
  if (isRootDocument) {
    if (instancePath) {
      return instancePath;
    }
    return "/";
  }
  if (instancePath) {
    return `/${documentFile}${instancePath}`;
  }
  return `/${documentFile}/`;
}

function formatAjvErrors(documentFile, isRootDocument, errors) {
  if (!errors) {
    return [];
  }
  return errors.map((error) => {
    const location = formatDocumentPath(documentFile, isRootDocument, error.instancePath);
    const message = describeAjvError(error);
    return `${location} -> ${message}`;
  });
}

export function detectSchemaVersion(schemasDir) {
  const match = schemasDir.match(/v(\d+\.\d+)/);
  if (match) {
    return `v${match[1]}`;
  }
  return "v1.9";
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

  const isDirectory = fs.statSync(args.model).isDirectory();
  const rootModelPath = isDirectory
    ? path.join(args.model, "brandvoice.yaml")
    : args.model;

  if (!fs.existsSync(rootModelPath)) {
    throw new Error(`Model file not found: ${rootModelPath}`);
  }

  const discovered = discoverModelDocuments(rootModelPath);
  const schemaErrors = [];
  const crossErrors = [];
  const semanticErrors = [];
  const warnings = [];

  if (discovered.errors.length > 0) {
    schemaErrors.push(...discovered.errors);
  }
  if (discovered.supplementaryWarnings.length > 0) {
    warnings.push(...discovered.supplementaryWarnings);
  }

  for (const document of discovered.documents) {
    const isRootDocument = document.file === discovered.documents[0].file;
    if (document.parseError) {
      const errorLocation = formatDocumentPath(document.file, isRootDocument, "");
      schemaErrors.push(`${errorLocation} -> YAML parse error: ${document.parseError}`);
      continue;
    }

    if (!document.schemaPath) {
      const errorLocation = formatDocumentPath(document.file, isRootDocument, "");
      schemaErrors.push(
        `${errorLocation} -> No schema maps to "${document.file}" - the file was loaded but never checked.`,
      );
      continue;
    }

    const validator = ajv.getSchema(baseUri + document.schemaPath);
    if (!validator) {
      const errorLocation = formatDocumentPath(document.file, isRootDocument, "");
      schemaErrors.push(
        `${errorLocation} -> No validator available for schema "${baseUri + document.schemaPath}"`,
      );
      continue;
    }

    const validDocument = validator(document.data);
    if (!validDocument) {
      schemaErrors.push(...formatAjvErrors(document.file, isRootDocument, validator.errors));
    }
  }

  const { ids, duplicates } = collectIdsFromDocuments(discovered.documents);
  for (const [identifier, locations] of duplicates.entries()) {
    warnings.push(`Potential duplicate ID '${identifier}' in: ${locations.join(", ")}`);
  }

  const refs = collectRefsFromDocuments(discovered.documents);
  for (const reference of refs) {
    if (!ids.has(reference.value)) {
      crossErrors.push(`Missing reference '${reference.value}' at ${reference.loc}`);
    }
  }

  semanticErrors.push(...collectSemanticErrors(discovered.documents));
  warnings.push(...collectSemanticAdvisories(discovered.documents));
  warnings.push(...collectGapWarnings(discovered.documents, ids, refs));

  if (args.compat) {
    if (schemaErrors.length > 0) {
      warnings.push(
        ...schemaErrors.map((error) => `Compat schema warning: ${error}`),
        "Compat mode active: schema violations are non-fatal.",
      );
      schemaErrors.length = 0;
    }
  }

  return {
    schemaErrors,
    crossErrors,
    semanticErrors,
    warnings,
    modelPath: rootModelPath,
    filesComposed: discovered.documents.length,
  };
}
