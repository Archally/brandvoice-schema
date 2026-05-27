import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { CompositionResult } from './types.js';

const PLANE_SUBDIRS = ['market', 'strategy', 'activation', 'governance'] as const;

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function stripBom(content: string): string {
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
}

function loadYaml(filePath: string): Record<string, unknown> {
  const raw = stripBom(fs.readFileSync(filePath, 'utf8'));
  return YAML.parse(raw) as Record<string, unknown>;
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

function mergeSliceDocument(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (key === 'version' || key === 'schemaVersion') {
      if (target[key] === undefined) target[key] = value;
      continue;
    }
    if (key === 'scope' || key === 'tags') continue;
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

function nestedSubKey(plane: string, fileName: string): string | null {
  const stem = path.parse(fileName).name.toLowerCase();

  if (plane === 'strategy') {
    if (stem.startsWith('market-product')) return 'market_product';
    if (stem.startsWith('messaging') || stem.startsWith('messages')) return 'messaging';
    if (stem.startsWith('brand-core')) return 'brand_core';
    if (stem.startsWith('visual-identity')) return 'visual_identity';
    if (stem.startsWith('capacity-priorities')) return 'capacity_priorities';
    return null;
  }
  if (plane === 'governance') {
    if (stem.startsWith('evidence') || stem.startsWith('research-evidence')) return 'evidence';
    if (stem.startsWith('measurement')) return 'measurement';
    if (stem.startsWith('decisions')) return 'decisions';
    if (stem.startsWith('experiments')) return 'experiments';
    return null;
  }
  if (plane === 'market') {
    if (stem.startsWith('landscape')) return 'landscape';
    if (stem.startsWith('competition') || stem.startsWith('substitutes')) return 'competition';
    if (stem.startsWith('opportunities') || stem.startsWith('cross-domain')) return 'opportunities';
    if (stem.startsWith('ecosystem')) return 'ecosystem';
    return null;
  }
  if (plane === 'activation') {
    if (stem.startsWith('channels')) return 'channels';
    if (stem.startsWith('campaigns') || stem.startsWith('content')) return 'campaigns';
    return null;
  }
  return null;
}

export function loadBrandvoice(modelPath: string): CompositionResult {
  const rootPath = fs.statSync(modelPath).isDirectory()
    ? path.join(modelPath, 'brandvoice.yaml')
    : modelPath;
  const rootDir = path.dirname(rootPath);
  const root = loadYaml(rootPath);
  const files: Record<string, string> = { root: rootPath };
  const errors: string[] = [];
  const refTargetPosix = new Set<string>();

  function resolveRefs(
    node: unknown,
    fileKey: string,
  ): unknown {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return node;
    const record = node as Record<string, unknown>;
    if (Object.keys(record).length === 1 && typeof record.$ref === 'string') {
      const filePath = path.resolve(rootDir, record.$ref);
      if (!fs.existsSync(filePath)) {
        errors.push(`Missing composed file '${record.$ref}' from ${fileKey}`);
        return node;
      }
      refTargetPosix.add(toPosix(path.relative(rootDir, filePath)));
      files[record.$ref as string] = filePath;
      return loadYaml(filePath);
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record)) {
      out[k] = resolveRefs(v, fileKey);
    }
    return out;
  }

  const hydrated = resolveRefs(root, 'brandvoice.yaml') as Record<string, unknown>;

  const supplementaryWarnings: string[] = [];
  for (const planeDir of PLANE_SUBDIRS) {
    const dir = path.join(rootDir, planeDir);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;

    const names = fs.readdirSync(dir)
      .filter((f: string) => f.endsWith('.yaml') || f.endsWith('.yml'))
      .sort();

    for (const name of names) {
      const rel = toPosix(path.join(planeDir, name));
      if (refTargetPosix.has(rel)) continue;

      const filePath = path.join(dir, name);
      if (!fs.statSync(filePath).isFile()) continue;

      const data = loadYaml(filePath);
      if (data == null || typeof data !== 'object' || Array.isArray(data)) {
        supplementaryWarnings.push(`Supplementary: skipped non-object ${rel}`);
        continue;
      }

      if (!hydrated[planeDir] || typeof hydrated[planeDir] !== 'object' || Array.isArray(hydrated[planeDir])) {
        hydrated[planeDir] = {};
      }
      const planeNode = hydrated[planeDir] as Record<string, unknown>;
      const targetKey = nestedSubKey(planeDir, name);

      if (targetKey) {
        if (!planeNode[targetKey] || typeof planeNode[targetKey] !== 'object' || Array.isArray(planeNode[targetKey])) {
          planeNode[targetKey] = {};
        }
        mergeSliceDocument(planeNode[targetKey] as Record<string, unknown>, data);
      } else {
        mergeIntoPlane(planeNode, data);
      }
    }
  }

  return { root: hydrated, files, errors, supplementaryWarnings };
}
