export const ID_RE = /^([a-z][a-z0-9-]*\.)?([A-Z]{3}\d{3}|[A-Z]\d{3})$/;

const REF_KEY_SUFFIXES = ["_ref", "_refs"];

const LIKELY_REF_KEYS = new Set([
  "actor",
  "audience",
  "persona",
  "job",
  "offering",
  "need",
  "market",
  "stage",
  "channel",
  "positioning",
  "opportunity",
  "value",
  "decision",
  "risk",
  "message",
  "proof",
  "context",
  "campaign",
  "metric",
  "kpi",
  "outcome",
  "action",
  "served_by",
  "entity",
  "supports",
  "contradicts",
  "supersedes",
  "superseded_by",
  "validated_by",
  "invalidated_by",
  "related_experiments",
  "related_decisions",
  "primary_message",
  "journey_stage",
  "north_star",
  "decision_outcome",
  "actors",
  "key_competitors",
  "contexts",
  "forces",
  "position_maps",
  "opportunities",
  "solves_needs",
  "addresses_opportunities",
  "proof_points",
  "linked_business_model",
  "for_needs",
  "target_actors",
  "target_markets",
  "target_audiences",
  "based_on_opportunities",
  "competitors",
  "reasons_to_believe",
  "jobs_supported",
  "linked_values",
  "linked_positions",
  "linked_actors",
  "linked_needs",
  "linked_offerings",
  "pursuing_opportunities",
  "linked_messages",
  "needs",
  "journey_stages",
  "intended_actions",
  "expected_outcomes",
  "tone",
  "linked_positioning",
  "guardrail_metrics",
  "measured_by",
  "linked_metrics",
  "linked_kpis",
  "linked_campaigns",
  "linked_outcomes",
  "risks",
  "success_metrics",
  "produced_evidence",
  "affected_needs",
  "affected_actors",
  "affected_markets",
  "creates_opportunities",
  "unmet_needs",
  "enabling_forces",
  "blocking_forces",
  "addressed_by_offerings",
  "addressed_by_positioning",
  "addressed_by_values",
  "related_opportunities",
  "competitor_adjacents",
  "offerings",
  "channels",
  "affected_opportunities",
  "actors_served",
  "content",
]);

const NON_REF_KEYS = new Set([
  "id",
  "name",
  "title",
  "statement",
  "description",
  "summary",
  "source",
  "version",
  "schemaVersion",
  "scope",
  "category",
  "type",
  "status",
  "method",
  "date",
  "file",
]);

export function isRefKey(key) {
  if (NON_REF_KEYS.has(key)) {
    return false;
  }
  if (LIKELY_REF_KEYS.has(key)) {
    return true;
  }
  for (const suffix of REF_KEY_SUFFIXES) {
    if (key.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

export function collectIds(node, ids = new Map(), duplicates = new Map(), pathStack = []) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      collectIds(item, ids, duplicates, [...pathStack, `[${index}]`]);
    });
    return { ids, duplicates };
  }
  if (!node) {
    return { ids, duplicates };
  }
  if (typeof node !== "object") {
    return { ids, duplicates };
  }

  if (typeof node.id === "string") {
    if (ID_RE.test(node.id)) {
      const location = pathStack.join(".") || "root";
      if (ids.has(node.id)) {
        const currentLocations = duplicates.get(node.id) ?? [ids.get(node.id)];
        currentLocations.push(location);
        duplicates.set(node.id, currentLocations);
      } else {
        ids.set(node.id, location);
      }
    }
  }

  for (const [key, value] of Object.entries(node)) {
    collectIds(value, ids, duplicates, [...pathStack, key]);
  }
  return { ids, duplicates };
}

export function collectRefs(node, refs = [], pathStack = []) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      collectRefs(item, refs, [...pathStack, `[${index}]`]);
    });
    return refs;
  }
  if (!node) {
    return refs;
  }
  if (typeof node !== "object") {
    return refs;
  }

  for (const [key, value] of Object.entries(node)) {
    if (isRefKey(key)) {
      if (typeof value === "string") {
        if (ID_RE.test(value)) {
          refs.push({ key, value, loc: [...pathStack, key].join(".") });
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === "string") {
            if (ID_RE.test(item)) {
              refs.push({ key, value: item, loc: [...pathStack, `${key}[${index}]`].join(".") });
            }
          }
        });
      }
    }
    collectRefs(value, refs, [...pathStack, key]);
  }
  return refs;
}

export function collectIdsFromDocuments(documents) {
  const ids = new Map();
  const duplicates = new Map();
  for (const document of documents) {
    if (!document.data) {
      continue;
    }
    const initialPath = document.plane === null ? [] : [document.file];
    collectIds(document.data, ids, duplicates, initialPath);
  }
  return { ids, duplicates };
}

export function collectRefsFromDocuments(documents) {
  const refs = [];
  for (const document of documents) {
    if (!document.data) {
      continue;
    }
    const initialPath = document.plane === null ? [] : [document.file];
    collectRefs(document.data, refs, initialPath);
  }
  return refs;
}
