import { resolveEntityType, TYPE_TO_PLANE, isEntityId } from './entity-types.js';
import type { BrandvoiceEntity, BrandvoiceRelation } from './types.js';

const NAME_FIELDS = ['name', 'title', 'label', 'statement', 'hypothesis', 'phase'];

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
  const entities: BrandvoiceEntity[] = [];
  const seen = new Set<string>();

  function walk(node: unknown): void {
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;

    if (isEntityId(record.id) && !seen.has(record.id)) {
      seen.add(record.id);
      const entityType = resolveEntityType(record.id) ?? 'unknown';
      const plane = TYPE_TO_PLANE[entityType] ?? 'unknown';
      entities.push({
        id: record.id,
        type: entityType,
        plane,
        name: resolveName(record) ?? record.id,
        data: record,
      });
    }

    for (const value of Object.values(record)) {
      walk(value);
    }
  }

  walk(composedModel);
  return entities;
}

const NON_REF_KEYS = new Set([
  'id', 'name', 'title', 'statement', 'description', 'summary',
  'source', 'version', 'schemaVersion', 'scope', 'category', 'type',
  'status', 'method', 'date', 'file',
]);

const SPECIAL_REF_KEYS = new Set([
  'supports', 'contradicts', 'supersedes', 'validated_by', 'invalidated_by',
  'actors', 'solves_needs', 'competitors', 'target_actors', 'target_markets',
  'affected_needs', 'affected_actors', 'affected_markets', 'for_needs',
  'creates_opportunities', 'unmet_needs', 'enabling_forces', 'blocking_forces',
  'measured_by',
]);

function isRefKey(key: string): boolean {
  if (NON_REF_KEYS.has(key)) return false;
  if (SPECIAL_REF_KEYS.has(key)) return true;
  return key.endsWith('_ref') || key.endsWith('_refs');
}

const RELATION_TYPE_MAP: Record<string, string> = {
  evidence_refs: 'backed-by',
  supports: 'supports',
  contradicts: 'contradicts',
  supersedes: 'supersedes',
  validated_by: 'validated-by',
  invalidated_by: 'invalidated-by',
  actors: 'targets-actor',
  actor_refs: 'targets-actor',
  target_actors: 'targets-actor',
  solves_needs: 'solves-need',
  need_refs: 'solves-need',
  affected_needs: 'affects-need',
  market_refs: 'in-market',
  target_markets: 'targets-market',
  competitor_refs: 'competes-with',
  competitors: 'competes-with',
  opportunity_refs: 'captures-opportunity',
  message_refs: 'uses-message',
  channel_refs: 'uses-channel',
  outcome_refs: 'targets-outcome',
  campaign_refs: 'contains-campaign',
  program_ref: 'part-of-program',
  program_refs: 'part-of-program',
  message_house_refs: 'follows-message-house',
  positioning_refs: 'supports-positioning',
  proof_refs: 'proved-by',
  proof_points: 'proved-by',
  brand_ref: 'belongs-to-brand',
  brand_script_ref: 'uses-script',
  tone_refs: 'uses-tone',
  journey_stage_refs: 'at-stage',
  also_competitor_ref: 'also-competes-as',
  success_metrics: 'measured-by',
  measured_by: 'measured-by',
  metric: 'tracks-metric',
};

function deriveRelationType(refKey: string): string {
  if (RELATION_TYPE_MAP[refKey]) return RELATION_TYPE_MAP[refKey];
  const cleaned = refKey.replace(/_refs?$/, '').replace(/_/g, '-');
  return `references-${cleaned}`;
}

export function extractRelations(entities: BrandvoiceEntity[]): BrandvoiceRelation[] {
  const entityIndex = new Set(entities.map(entity => entity.id));
  const relations: BrandvoiceRelation[] = [];
  let counter = 0;

  for (const entity of entities) {
    walkRefs(entity.data, entity, entityIndex, relations, () => ++counter);
  }

  return relations;
}

function walkRefs(
  node: unknown,
  sourceEntity: BrandvoiceEntity,
  entityIndex: Set<string>,
  relations: BrandvoiceRelation[],
  nextId: () => number,
): void {
  if (Array.isArray(node)) {
    for (const item of node) walkRefs(item, sourceEntity, entityIndex, relations, nextId);
    return;
  }
  if (!node || typeof node !== 'object') return;
  const record = node as Record<string, unknown>;

  for (const [key, value] of Object.entries(record)) {
    if (!isRefKey(key)) {
      walkRefs(value, sourceEntity, entityIndex, relations, nextId);
      continue;
    }

    const refs: string[] = [];
    if (isEntityId(value)) {
      refs.push(value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (isEntityId(item)) refs.push(item);
      }
    }

    for (const targetId of refs) {
      if (!entityIndex.has(targetId)) continue;
      relations.push({
        id: `REL${String(nextId()).padStart(4, '0')}`,
        source: sourceEntity.id,
        target: targetId,
        type: deriveRelationType(key),
        predicate: key,
      });
    }

    if (refs.length === 0) {
      walkRefs(value, sourceEntity, entityIndex, relations, nextId);
    }
  }
}
