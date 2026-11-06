import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { CompositionResult } from './types.js';

const PLANE_DIRECTORIES = ['market', 'strategy', 'activation', 'governance'] as const;

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function stripBom(content: string): string {
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
}

function loadYaml(filePath: string): Record<string, unknown> {
  const content = stripBom(fs.readFileSync(filePath, 'utf8'));
  return YAML.parse(content) as Record<string, unknown>;
}

function mergeIntoPlane(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (key === 'version' || key === 'schemaVersion' || key === 'scope' || key === 'tags') continue;
    const existing = target[key];
    if (Array.isArray(value) && Array.isArray(existing)) {
      existing.push(...value);
    } else if (Array.isArray(value)) {
      target[key] = [...value];
    } else {
      target[key] = value;
    }
  }
}

export function loadBrandvoice(modelPath: string): CompositionResult {
  const rootPath = fs.statSync(modelPath).isDirectory()
    ? path.join(modelPath, 'brandvoice.yaml')
    : modelPath;
  const rootDirectory = path.dirname(rootPath);
  const root = loadYaml(rootPath);
  const files: Record<string, string> = { root: rootPath };
  const errors: string[] = [];

  function resolveReferences(
    node: unknown,
    fileKey: string,
  ): unknown {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return node;
    const record = node as Record<string, unknown>;
    if (Object.keys(record).length === 1 && typeof record.$ref === 'string') {
      const filePath = path.resolve(rootDirectory, record.$ref);
      if (!fs.existsSync(filePath)) {
        errors.push(`Missing composed file '${record.$ref}' from ${fileKey}`);
        return node;
      }
      files[record.$ref as string] = filePath;
      return loadYaml(filePath);
    }
    const resolvedRecord: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      resolvedRecord[key] = resolveReferences(value, fileKey);
    }
    return resolvedRecord;
  }

  const hydrated = resolveReferences(root, 'brandvoice.yaml') as Record<string, unknown>;

  // Core flattens root-inline slices before merging direct plane children.
  // Keep explicit references outside those directories for portable composition;
  // discovered plane files are merged only in the sorted disk pass below.
  for (const plane of PLANE_DIRECTORIES) {
    const planeData = root[plane];
    const mergedPlane: Record<string, unknown> = {};
    if (planeData && typeof planeData === 'object' && !Array.isArray(planeData)) {
      for (const [sliceKey, sliceData] of Object.entries(planeData)) {
        if (sliceKey === '$ref') continue;
        if (!sliceData || typeof sliceData !== 'object' || Array.isArray(sliceData)) continue;

        const slice = sliceData as Record<string, unknown>;
        if (typeof slice.$ref === 'string') {
          const referencePath = path.resolve(rootDirectory, slice.$ref);
          const relativePath = toPosix(path.relative(rootDirectory, referencePath));
          const [subdirectory, fileName, nestedPath] = relativePath.split('/');
          const discoveredPlane = PLANE_DIRECTORIES.some(planeName => planeName === subdirectory);
          if (discoveredPlane && fileName && !nestedPath && /\.ya?ml$/.test(fileName)) {
            mergeIntoPlane(mergedPlane, slice);
            continue;
          }
        }

        const hydratedPlane = hydrated[plane] as Record<string, unknown>;
        const hydratedSlice = hydratedPlane[sliceKey] as Record<string, unknown>;
        mergeIntoPlane(mergedPlane, hydratedSlice);
      }
    }
    hydrated[plane] = mergedPlane;
  }

  const supplementaryWarnings: string[] = [];
  for (const planeDirectory of PLANE_DIRECTORIES) {
    const directory = path.join(rootDirectory, planeDirectory);
    if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) continue;

    const fileNames = fs.readdirSync(directory)
      .filter((fileName: string) => fileName.endsWith('.yaml') || fileName.endsWith('.yml'))
      .sort();

    for (const fileName of fileNames) {
      const relativePath = toPosix(path.join(planeDirectory, fileName));

      const filePath = path.join(directory, fileName);
      if (!fs.statSync(filePath).isFile()) continue;

      const data = loadYaml(filePath);
      if (data == null || typeof data !== 'object' || Array.isArray(data)) {
        supplementaryWarnings.push(`Supplementary: skipped non-object ${relativePath}`);
        continue;
      }

      files[relativePath] = filePath;
      mergeIntoPlane(hydrated[planeDirectory] as Record<string, unknown>, data);
    }
  }

  return { root: hydrated, files, errors, supplementaryWarnings };
}
