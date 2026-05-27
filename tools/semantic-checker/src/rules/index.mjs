import { evidenceCoverage } from "./evidence-coverage.mjs";
import { orphanEvidence } from "./orphan-evidence.mjs";
import { activeMessageProof } from "./active-message-proof.mjs";
import { activeCampaignLinks } from "./active-campaign-links.mjs";
import { experimentResults } from "./experiment-results.mjs";
import { emptyPlanes } from "./empty-planes.mjs";
import { positioningEvidence } from "./positioning-evidence.mjs";
import { highThreatDepth } from "./high-threat-depth.mjs";

export const builtinRules = [
  evidenceCoverage,
  orphanEvidence,
  activeMessageProof,
  activeCampaignLinks,
  experimentResults,
  emptyPlanes,
  positioningEvidence,
  highThreatDepth,
];
