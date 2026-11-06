import { attachedEntities, isFirstShard, linkedEntities, shardsFor, sortedIds } from './resolved-entities.mjs';

export default function checkOfferingAudienceConsistency(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  if (!shardsFor(model, subject).some(entity => Array.isArray(entity.data.target_audiences))) {
    return { ok: true };
  }
  const targetIds = new Set(linkedEntities(model, subject, 'target_audiences', 'audience').map(entity => entity.id));
  const outside = attachedEntities(model, subject).flatMap(entity => linkedEntities(model, entity, 'audience', 'audience'))
    .filter(entity => !targetIds.has(entity.id));
  return { ok: outside.length === 0, context: { audiences: sortedIds(outside) } };
}
