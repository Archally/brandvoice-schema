import { isFirstShard, linkedEntities, shardsFor, sortedIds } from './resolved-entities.mjs';

export default function checkSupersededOfferingLifecycle(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  const shards = shardsFor(model, subject);
  const superseded = shards.some(entity => Array.isArray(entity.data.superseded_by) && entity.data.superseded_by.length > 0);
  if (!superseded) {
    return { ok: true };
  }
  const reasons = [];
  if (shards.some(entity => ['active', 'beta'].includes(entity.data.status))) {
    reasons.push('superseded offering remains active/beta');
  }
  const retired = linkedEntities(model, subject, 'superseded_by', 'offering').filter(entity => ['deprioritized', 'sunset'].includes(entity.data.status));
  if (retired.length > 0) {
    reasons.push(`retired replacements: ${sortedIds(retired)}`);
  }
  return { ok: reasons.length === 0, context: { reasons: reasons.sort().join('; ') } };
}
