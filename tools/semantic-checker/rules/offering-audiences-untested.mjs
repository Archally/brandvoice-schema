import { isFirstShard, linkedEntities, sortedIds } from './resolved-entities.mjs';

export default function checkOfferingAudiencesUntested(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  const audiences = linkedEntities(model, subject, 'target_audiences', 'audience');
  return {
    ok: audiences.length === 0 || !audiences.every(entity => entity.data.evidence_level === 'hypothesis'),
    context: { audiences: sortedIds(audiences) },
  };
}
