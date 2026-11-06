import { hasResolvedEvidence } from './resolved-entities.mjs';

export default function checkEvidenceCoverage(model, subject) {
  return { ok: hasResolvedEvidence(model, subject) };
}
