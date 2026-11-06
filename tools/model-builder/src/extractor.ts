import { resolveEntityType, TYPE_TO_PLANE, PREFIX_TO_TYPE, isEntityId } from './entity-types.js';
import { deriveRelations } from '../src/relation-contract.cjs';
import type { BrandvoiceEntity, BrandvoiceRelation } from './types.js';

const NAME_FIELDS = ['name', 'title', 'label', 'statement', 'hypothesis', 'phase'];
const PLANES = ['market', 'strategy', 'activation', 'governance'];

function resolveName(data: Record<string, unknown>): string | null {
  for (const field of NAME_FIELDS) {
    const value = data[field];
    if (typeof value === 'string' && value.trim()) {
      return value.trim().slice(0, 120);
    }
  }
  return null;
}

export function extractEntities(composedModel: Record<string, unknown>): BrandvoiceEntity[] {
  const entities = new Map<string, BrandvoiceEntity>();

  function walk(node: unknown, parent?: BrandvoiceEntity, collectionName?: string): void {
    if (Array.isArray(node)) {
      for (const item of node) walk(item, parent, collectionName);
      return;
    }
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    let owner = parent;

    if (isEntityId(record.id)) {
      // Core assigns nested pillar types from their collection, regardless of ID prefix.
      const entityType = parent?.type === 'message_house' && collectionName === 'pillars'
        ? 'message_pillar'
        : resolveEntityType(record.id) ?? 'unknown';
      const data = { ...record };
      if (entityType === 'message_pillar' && parent?.type === 'message_house' && !data.message_house_ref) {
        data.message_house_ref = parent.id;
      }
      if (entityType === 'white_space' && parent?.type === 'position_map' && !data.position_map_ref) {
        data.position_map_ref = parent.id;
      }
      const existing = entities.get(record.id);
      if (existing) {
        for (const [key, value] of Object.entries(data)) {
          if (!(key in existing.data)) existing.data[key] = value;
        }
        owner = existing;
      } else {
        owner = {
          id: record.id,
          type: entityType,
          plane: TYPE_TO_PLANE[entityType] ?? 'unknown',
          name: resolveName(record) ?? record.id,
          data,
        };
        entities.set(record.id, owner);
      }
    }

    for (const [field, value] of Object.entries(record)) walk(value, owner, field);
  }

  // Plane order determines which shard supplies conflicting field values.
  for (const plane of PLANES) walk(composedModel[plane]);
  const remaining = Object.fromEntries(Object.entries(composedModel).filter(([key]) => !PLANES.includes(key)));
  walk(remaining);
  return [...entities.values()];
}

export function deriveBuilderRelations(entities: BrandvoiceEntity[]): {
  relations: BrandvoiceRelation[];
  placeholders: BrandvoiceEntity[];
} {
  const entityIndex = new Set(entities.map(entity => entity.id));
  const placeholders = new Map<string, BrandvoiceEntity>();
  const result = deriveRelations(
    entities.map(entity => ({ id: entity.id, entityType: entity.type, data: entity.data })),
    reference => {
      if (!entityIndex.has(reference) && !placeholders.has(reference)) {
        const bareReference = reference.split('.').at(-1)!;
        const prefix = bareReference.match(/^([A-Z]+)/)?.[1];
        const entityType = (prefix ? PREFIX_TO_TYPE[prefix] : undefined) ?? 'evidence';
        placeholders.set(reference, {
          id: reference,
          type: entityType,
          plane: TYPE_TO_PLANE[entityType] ?? 'governance',
          name: `[Unresolved] ${reference}`,
          data: { _placeholder: true },
        });
      }
      return reference;
    },
  );
  return {
    relations: result.relations.map((relation, index) => ({
      id: `REL${String(index + 1).padStart(4, '0')}`,
      source: relation.sourceId,
      target: relation.targetId,
      type: relation.relationType,
      predicate: relation.refField,
    })),
    placeholders: [...placeholders.values()].sort((first, second) => first.id.localeCompare(second.id)),
  };
}

export function extractRelations(entities: BrandvoiceEntity[]): BrandvoiceRelation[] {
  return deriveBuilderRelations(entities).relations;
}
