import { ID_RE } from "./references.mjs";

const EVIDENCE_EXPECTED_PREFIXES = new Set([
  "ACT", "NED", "OFF", "CPR", "CTX", "MKT", "MFR", "OPP",
  "PMP", "VAL", "POS", "MSG", "PRF", "CHN", "CMP", "ACN",
  "OUT", "DEC", "RSK", "MET", "KPI", "TST", "BRD", "PBP",
  "MHS", "PRG", "CPL", "WSP",
]);

function getPrefix(id) {
  const normalized = id.includes(".") ? id.split(".").at(-1) : id;
  return normalized.slice(0, 3);
}

export function collectSemanticErrors(rootModel) {
  const errors = [];

  const messages = rootModel?.strategy?.messaging?.messages ?? [];
  for (const message of messages) {
    if (message?.status === "active") {
      if (!Array.isArray(message.evidence_refs) || message.evidence_refs.length === 0) {
        errors.push(
          `Semantic: active message '${message.id ?? "<unknown>"}' must include evidence_refs`,
        );
      }
      if (!Array.isArray(message.proof_points) || message.proof_points.length === 0) {
        errors.push(
          `Semantic: active message '${message.id ?? "<unknown>"}' should include proof_points`,
        );
      }
    }
  }

  const campaigns = rootModel?.activation?.campaigns?.campaigns ?? [];
  for (const campaign of campaigns) {
    if (campaign?.status === "active") {
      const hasMessages = Array.isArray(campaign.message_refs) && campaign.message_refs.length > 0;
      const hasChannels = Array.isArray(campaign.channel_refs) && campaign.channel_refs.length > 0;
      const hasOutcomes = Array.isArray(campaign.outcome_refs) && campaign.outcome_refs.length > 0;
      if (!hasMessages || !hasChannels || !hasOutcomes) {
        errors.push(
          `Semantic: active campaign '${campaign.id ?? "<unknown>"}' must include message_refs, channel_refs, and outcome_refs`,
        );
      }
    }
  }

  const experiments = rootModel?.governance?.experiments?.experiments ?? [];
  for (const experiment of experiments) {
    if (experiment?.status === "completed") {
      const hasStructuredResult = !!experiment.result;
      const hasSummary = typeof experiment.result_summary === "string" && experiment.result_summary.trim().length > 0;
      if (!hasStructuredResult && !hasSummary) {
        errors.push(
          `Semantic: completed experiment '${experiment.id ?? "<unknown>"}' needs result or result_summary`,
        );
      }
    }
  }

  return errors;
}

export function collectGapWarnings(rootModel, ids, refs) {
  const warnings = [];
  const referencedIds = new Set(refs.map((r) => r.value));

  (function walk(node, pathStack = []) {
    if (Array.isArray(node)) {
      node.forEach((item, idx) => walk(item, [...pathStack, `[${idx}]`]));
      return;
    }
    if (!node || typeof node !== "object") return;

    if (typeof node.id === "string" && ID_RE.test(node.id)) {
      const prefix = getPrefix(node.id);
      if (EVIDENCE_EXPECTED_PREFIXES.has(prefix)) {
        const hasEvidenceRefs = Array.isArray(node.evidence_refs) && node.evidence_refs.length > 0;
        const hasValidatedBy = Array.isArray(node.validated_by) && node.validated_by.length > 0;
        if (!hasEvidenceRefs && !hasValidatedBy) {
          warnings.push(`Gap: ${node.id} has no evidence linkage (${pathStack.join(".") || "root"})`);
        }
      }
    }

    for (const [k, v] of Object.entries(node)) walk(v, [...pathStack, k]);
  })(rootModel);

  for (const id of ids.keys()) {
    if (getPrefix(id) === "EVD" && !referencedIds.has(id)) {
      warnings.push(`Gap: evidence ${id} is never referenced`);
    }
  }

  if (!rootModel.activation || Object.keys(rootModel.activation).length === 0) {
    warnings.push("Gap: activation plane is missing or empty");
  }
  if (!rootModel.governance || Object.keys(rootModel.governance).length === 0) {
    warnings.push("Gap: governance plane is missing or empty");
  }

  return warnings;
}
