import type { RuleDefinition } from '../types.js';
import { evidenceCoverage } from './evidence-coverage.js';
import { orphanEvidence } from './orphan-evidence.js';
import { activeMessageProof } from './active-message-proof.js';
import { activeCampaignLinks } from './active-campaign-links.js';
import { experimentResults } from './experiment-results.js';
import { emptyPlanes } from './empty-planes.js';
import { positioningEvidence } from './positioning-evidence.js';
import { highThreatDepth } from './high-threat-depth.js';

export const builtinRules: RuleDefinition[] = [
  evidenceCoverage,
  orphanEvidence,
  activeMessageProof,
  activeCampaignLinks,
  experimentResults,
  emptyPlanes,
  positioningEvidence,
  highThreatDepth,
];
