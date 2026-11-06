import { entityGroups, isFirstShard, linkedEntities, sortedIds } from './resolved-entities.mjs';

const cycleIndexes = new WeakMap();

// Iterative strongly connected components avoid recursion limits and cycle-tail false positives.
function cycleComponents(model, type) {
  let byType = cycleIndexes.get(model);
  if (!byType) {
    byType = new Map();
    cycleIndexes.set(model, byType);
  }
  if (byType.has(type)) {
    return byType.get(type);
  }
  const subjects = entityGroups(model, type).map(shards => shards[0]);
  const subjectsById = new Map(subjects.map(entity => [entity.id, entity]));
  const successors = new Map(subjects.map(entity => [entity.id, [...new Set(linkedEntities(model, entity, 'superseded_by', type).map(target => target.id))]]));
  const predecessors = new Map(subjects.map(entity => [entity.id, []]));
  for (const [source, targets] of successors) {
    for (const target of targets) {
      predecessors.get(target).push(source);
    }
  }
  const visited = new Set();
  const finishOrder = [];
  for (const entity of subjects) {
    const pending = [{ id: entity.id, finished: false }];
    while (pending.length > 0) {
      const current = pending.pop();
      if (current.finished) {
        finishOrder.push(current.id);
        continue;
      }
      if (visited.has(current.id)) {
        continue;
      }
      visited.add(current.id);
      pending.push({ id: current.id, finished: true });
      for (const target of successors.get(current.id)) {
        if (!visited.has(target)) {
          pending.push({ id: target, finished: false });
        }
      }
    }
  }
  const assigned = new Set();
  const components = new Map();
  for (const source of finishOrder.reverse()) {
    if (assigned.has(source)) {
      continue;
    }
    const participants = [];
    const pending = [source];
    while (pending.length > 0) {
      const current = pending.pop();
      if (assigned.has(current)) {
        continue;
      }
      assigned.add(current);
      participants.push(subjectsById.get(current));
      pending.push(...predecessors.get(current));
    }
    if (participants.length === 1 && !successors.get(source).includes(source)) {
      continue;
    }
    const context = sortedIds(participants);
    for (const participant of participants) {
      components.set(participant.id, context);
    }
  }
  byType.set(type, components);
  return components;
}

export default function checkSupersededByCycle(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  const participants = cycleComponents(model, subject.type).get(subject.id);
  return { ok: participants === undefined, context: { participants } };
}
