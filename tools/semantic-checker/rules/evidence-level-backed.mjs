import { hasResolvedEvidence } from './resolved-entities.mjs';

export default function checkEvidenceLevelBacked(model, subject) {
  return { ok: hasResolvedEvidence(model, subject) };
}
