import { isEntityId } from '../../../model-builder/dist/entity-types.js';

export function walkEntities(
  node: unknown,
  callback: (entity: Record<string, unknown>, location: string) => void,
  path: string[] = [],
): void {
  if (Array.isArray(node)) {
    node.forEach((item, index) => walkEntities(item, callback, [...path, `[${index}]`]));
    return;
  }
  if (!node || typeof node !== 'object') return;
  const record = node as Record<string, unknown>;

  if (isEntityId(record.id)) {
    callback(record, path.join('.') || 'root');
  }

  for (const [key, value] of Object.entries(record)) {
    walkEntities(value, callback, [...path, key]);
  }
}

export function collectAllRefs(node: unknown, refs = new Set<string>()): Set<string> {
  if (Array.isArray(node)) {
    for (const item of node) {
      if (isEntityId(item)) refs.add(item as string);
      else collectAllRefs(item, refs);
    }
    return refs;
  }
  if (!node || typeof node !== 'object') return refs;
  const record = node as Record<string, unknown>;

  for (const [key, value] of Object.entries(record)) {
    if (key === 'id') continue;
    if (isEntityId(value) && (key.endsWith('_ref') || key.endsWith('_refs'))) {
      refs.add(value as string);
    } else {
      collectAllRefs(value, refs);
    }
  }
  return refs;
}

export function getPrefix(id: string): string {
  const bare = id.includes('.') ? id.split('.').at(-1)! : id;
  const match = bare.match(/^([A-Z]{1,4})\d/);
  return match ? match[1] : '';
}
