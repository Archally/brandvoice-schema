// Keep every shard of a logical graph identity; never replace one with a Map entry.
const indexes = new WeakMap();

export function hasResolvedEvidence(model, subject, relationTypes = ['backed-by', 'validated-by']) {
  return model.relations.some(relation => relation.source === subject.id
    && relationTypes.includes(relation.type)
    && model.entities.some(entity => entity.id === relation.target && entity.data?._placeholder !== true));
}

export function entityGroups(model, type) {
  let groups = indexes.get(model);
  if (!groups) {
    groups = new Map();
    for (const entity of model.entities) {
      const key = `${entity.type}:${entity.id}`;
      const shards = groups.get(key) ?? [];
      shards.push(entity);
      groups.set(key, shards);
    }
    indexes.set(model, groups);
  }
  return [...groups.values()].filter(shards => shards[0].type === type);
}

export function shardsFor(model, subject) {
  return entityGroups(model, subject.type).find(shards => shards[0].id === subject.id) ?? [];
}

export function isFirstShard(model, subject) {
  return shardsFor(model, subject)[0] === subject;
}

export function resolveEntities(model, reference, type) {
  if (typeof reference !== 'string') {
    return [];
  }
  const groups = entityGroups(model, type);
  const exact = groups.find(shards => shards[0].id === reference);
  if (exact) {
    return exact;
  }
  const localId = reference.split('.').at(-1);
  const matches = groups.filter(shards => shards.some(entity => (entity.displayId ?? entity.id).split('.').at(-1) === localId));
  if (matches.length !== 1) {
    return [];
  }
  return matches[0];
}

export function linkedEntities(model, subject, field, type) {
  const linked = new Map();
  for (const shard of shardsFor(model, subject)) {
    const value = shard.data[field];
    const references = Array.isArray(value) ? value : [value];
    for (const reference of references) {
      const resolved = resolveEntities(model, reference, type);
      if (resolved.length > 0) {
        linked.set(resolved[0].id, resolved);
      }
    }
  }
  return [...linked.values()].flat();
}

export function attachedEntities(model, offering) {
  return ['value_proposition', 'message'].flatMap(type => entityGroups(model, type).flat())
    .filter(entity => linkedEntities(model, entity, 'offering', 'offering').some(target => target.id === offering.id));
}

export function sortedIds(entities) {
  return [...new Set(entities.map(entity => entity.displayId ?? entity.id))].sort().join(', ');
}

export function populated(value) {
  if (Array.isArray(value)) {
    return value.some(populated);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some(populated);
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
}
