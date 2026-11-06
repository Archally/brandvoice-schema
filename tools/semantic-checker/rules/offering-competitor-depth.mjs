import { isFirstShard, linkedEntities, populated, shardsFor, sortedIds } from './resolved-entities.mjs';

export default function checkOfferingCompetitorDepth(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  const competitors = linkedEntities(model, subject, 'competitors', 'competitor');
  const bare = competitors.filter(entity => !shardsFor(model, entity).some(shard =>
    ['evidence_refs', 'strengths', 'weaknesses', 'pricing'].some(field => populated(shard.data[field]))));
  return { ok: bare.length === 0, context: { competitors: sortedIds(bare) } };
}
