import { extractEntities, extractRelations } from './extractor.js';
import type { BrandvoiceModel } from './types.js';

export function buildBrandvoiceModel(composedRoot: Record<string, unknown>): BrandvoiceModel {
  const entities = extractEntities(composedRoot);
  const relations = extractRelations(entities);

  const entityTypeCounts: Record<string, number> = {};
  for (const entity of entities) {
    entityTypeCounts[entity.type] = (entityTypeCounts[entity.type] ?? 0) + 1;
  }

  const planeCounts: Record<string, number> = {};
  for (const entity of entities) {
    planeCounts[entity.plane] = (planeCounts[entity.plane] ?? 0) + 1;
  }

  const relationTypeCounts: Record<string, number> = {};
  for (const relation of relations) {
    relationTypeCounts[relation.type] = (relationTypeCounts[relation.type] ?? 0) + 1;
  }

  return {
    entities,
    relations,
    metadata: {
      name: (composedRoot.name as string) ?? null,
      version: (composedRoot.version as string) ?? null,
      schemaVersion: (composedRoot.schemaVersion as string) ?? null,
      totalEntities: entities.length,
      totalRelations: relations.length,
      entityTypeCounts,
      planeCounts,
      relationTypeCounts,
      builtAt: new Date().toISOString(),
    },
  };
}
