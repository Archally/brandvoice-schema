import { hasResolvedEvidence } from './resolved-entities.mjs';

export default function checkPositioningEvidence(model, subject) {
  return { ok: hasResolvedEvidence(model, subject, ['backed-by']) };
}
