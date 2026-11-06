import { attachedEntities, isFirstShard, linkedEntities, shardsFor } from './resolved-entities.mjs';

export default function checkActiveOfferingAudience(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  const active = shardsFor(model, subject).some(entity => ['active', 'beta'].includes(entity.data.status));
  const audiences = linkedEntities(model, subject, 'target_audiences', 'audience');
  const attachedAudience = attachedEntities(model, subject).some(entity => linkedEntities(model, entity, 'audience', 'audience').length > 0);
  return { ok: !active || audiences.length > 0 || attachedAudience };
}
