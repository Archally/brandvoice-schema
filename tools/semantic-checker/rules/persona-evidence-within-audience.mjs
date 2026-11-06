import { isFirstShard, linkedEntities, shardsFor, sortedIds } from './resolved-entities.mjs';

const levels = ['hypothesis', 'weak-signal', 'moderate-evidence', 'strong-evidence'];

export default function checkPersonaEvidenceWithinAudience(model, subject) {
  if (!isFirstShard(model, subject)) {
    return { ok: true };
  }
  const personaRanks = shardsFor(model, subject).map(entity => levels.indexOf(entity.data.evidence_level));
  const higherThan = linkedEntities(model, subject, 'audience', 'audience').filter(entity => {
    const audienceRank = levels.indexOf(entity.data.evidence_level);
    return audienceRank >= 0 && personaRanks.some(rank => rank > audienceRank);
  });
  return { ok: higherThan.length === 0, context: { audiences: sortedIds(higherThan) } };
}
