import { isFirstShard, linkedEntities, shardsFor, sortedIds } from './resolved-entities.mjs';

export default function checkActiveMessageRetiredOffering(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  if (!shardsFor(model, subject).some(entity => entity.data.status === 'active')) {
    return { ok: true };
  }
  const retired = linkedEntities(model, subject, 'offering', 'offering').filter(entity => ['sunset', 'deprioritized'].includes(entity.data.status));
  return { ok: retired.length === 0, context: { offerings: sortedIds(retired) } };
}
