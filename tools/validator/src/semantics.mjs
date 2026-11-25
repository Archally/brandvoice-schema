import { ID_RE } from "./references.mjs";

const EVIDENCE_EXPECTED_PREFIXES = new Set([
  "ACT", "NED", "OFF", "CPR", "CTX", "MKT", "MFR", "OPP",
  "PMP", "VAL", "POS", "MSG", "PRF", "CHN", "CMP", "ACN",
  "OUT", "DEC", "RSK", "MET", "KPI", "TST", "BRD", "PBP",
  "MHS", "PRG", "CPL", "WSP",
]);

function getPrefix(identifier) {
  const normalized = identifier.includes(".") ? identifier.split(".").at(-1) : identifier;
  return normalized.slice(0, 3);
}

function normalizeDocuments(documentsOrRoot) {
  if (Array.isArray(documentsOrRoot)) {
    return documentsOrRoot;
  }
  return [{ file: "brandvoice.yaml", plane: null, data: documentsOrRoot }];
}

function hasNonEmptyArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length === 0) {
    return false;
  }
  return true;
}

function collectRecordsByKey(documents, planeName, inlineSlotName, arrayKey) {
  const records = [];
  for (const document of documents) {
    if (!document.data) {
      continue;
    }
    if (typeof document.data !== "object") {
      continue;
    }

    if (document.plane === null) {
      const planeSection = document.data[planeName];
      const inlineSlot = planeSection?.[inlineSlotName];
      const inlineItems = inlineSlot?.[arrayKey];
      if (Array.isArray(inlineItems)) {
        records.push(...inlineItems);
      }
      continue;
    }

    if (document.plane !== planeName) {
      continue;
    }

    const shardItems = document.data[arrayKey];
    if (Array.isArray(shardItems)) {
      records.push(...shardItems);
    }
  }
  return records;
}

export function collectSemanticAdvisories(documentsOrRoot) {
  const documents = normalizeDocuments(documentsOrRoot);
  const advisories = [];

  const messages = collectRecordsByKey(documents, "strategy", "messaging", "messages");
  for (const message of messages) {
    if (message?.status !== "active") {
      continue;
    }
    const messageId = message.id ?? "<unknown>";
    if (!hasNonEmptyArray(message.evidence_refs)) {
      advisories.push(
        `Advisory: active message '${messageId}' has no evidence_refs`,
      );
    }
    if (!hasNonEmptyArray(message.proof_points)) {
      advisories.push(
        `Advisory: active message '${messageId}' has no proof_points`,
      );
    }
  }

  const campaigns = collectRecordsByKey(documents, "activation", "campaigns", "campaigns");
  for (const campaign of campaigns) {
    if (campaign?.status !== "active") {
      continue;
    }
    const campaignId = campaign.id ?? "<unknown>";
    const hasMessages = hasNonEmptyArray(campaign.message_refs);
    const hasChannels = hasNonEmptyArray(campaign.channel_refs);
    const hasOutcomes = hasNonEmptyArray(campaign.outcome_refs);
    if (!hasMessages) {
      advisories.push(
        `Advisory: active campaign '${campaignId}' is missing message_refs, channel_refs, or outcome_refs`,
      );
      continue;
    }
    if (!hasChannels) {
      advisories.push(
        `Advisory: active campaign '${campaignId}' is missing message_refs, channel_refs, or outcome_refs`,
      );
      continue;
    }
    if (!hasOutcomes) {
      advisories.push(
        `Advisory: active campaign '${campaignId}' is missing message_refs, channel_refs, or outcome_refs`,
      );
    }
  }

  return advisories;
}

export function collectSemanticErrors(documentsOrRoot) {
  const documents = normalizeDocuments(documentsOrRoot);
  const errors = [];

  const experiments = collectRecordsByKey(documents, "governance", "experiments", "experiments");
  for (const experiment of experiments) {
    if (experiment?.status !== "completed") {
      continue;
    }
    const hasStructuredResult = Boolean(experiment.result);
    const hasSummary = typeof experiment.result_summary === "string"
      ? experiment.result_summary.trim().length > 0
      : false;
    if (!hasStructuredResult) {
      if (!hasSummary) {
        const experimentId = experiment.id ?? "<unknown>";
        errors.push(
          `Semantic: completed experiment '${experimentId}' needs result or result_summary`,
        );
      }
    }
  }

  return errors;
}

function planeHasContent(documents, planeName) {
  for (const document of documents) {
    if (document.plane === planeName) {
      return true;
    }
    if (document.plane === null) {
      const planeSection = document.data?.[planeName];
      if (planeSection) {
        if (typeof planeSection === "object") {
          if (Object.keys(planeSection).length > 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function collectGapWarnings(documentsOrRoot, ids, refs) {
  const documents = normalizeDocuments(documentsOrRoot);
  const warnings = [];
  const referencedIds = new Set(refs.map((reference) => reference.value));

  function walkForEvidenceGaps(node, pathStack) {
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        walkForEvidenceGaps(item, [...pathStack, `[${index}]`]);
      });
      return;
    }
    if (!node) {
      return;
    }
    if (typeof node !== "object") {
      return;
    }

    if (typeof node.id === "string") {
      if (ID_RE.test(node.id)) {
        const prefix = getPrefix(node.id);
        if (EVIDENCE_EXPECTED_PREFIXES.has(prefix)) {
          const hasEvidenceRefs = hasNonEmptyArray(node.evidence_refs);
          const hasValidatedBy = hasNonEmptyArray(node.validated_by);
          if (!hasEvidenceRefs) {
            if (!hasValidatedBy) {
              const location = pathStack.join(".") || "root";
              warnings.push(`Gap: ${node.id} has no evidence linkage (${location})`);
            }
          }
        }
      }
    }

    for (const [key, value] of Object.entries(node)) {
      walkForEvidenceGaps(value, [...pathStack, key]);
    }
  }

  for (const document of documents) {
    if (!document.data) {
      continue;
    }
    const initialPath = document.plane === null ? [] : [document.file];
    walkForEvidenceGaps(document.data, initialPath);
  }

  for (const identifier of ids.keys()) {
    if (getPrefix(identifier) !== "EVD") {
      continue;
    }
    if (!referencedIds.has(identifier)) {
      warnings.push(`Gap: evidence ${identifier} is never referenced`);
    }
  }

  if (!planeHasContent(documents, "activation")) {
    warnings.push("Gap: activation plane is missing or empty");
  }
  if (!planeHasContent(documents, "governance")) {
    warnings.push("Gap: governance plane is missing or empty");
  }

  return warnings;
}
