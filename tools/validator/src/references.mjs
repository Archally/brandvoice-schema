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
  "validated_by",
  "invalidated_by",
  "related_experiments",
  "related_decisions",
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
  if (NON_REF_KEYS.has(key)) return false;
  if (LIKELY_REF_KEYS.has(key)) return true;
  for (const suffix of REF_KEY_SUFFIXES) {
    if (key.endsWith(suffix)) return true;
  }
  return false;
}

export function collectIds(node, ids = new Map(), duplicates = new Map(), pathStack = []) {
  if (Array.isArray(node)) {
    node.forEach((item, idx) => collectIds(item, ids, duplicates, [...pathStack, `[${idx}]`]));
    return { ids, duplicates };
  }
  if (!node || typeof node !== "object") return { ids, duplicates };

  if (typeof node.id === "string" && ID_RE.test(node.id)) {
    const loc = pathStack.join(".") || "root";
    if (ids.has(node.id)) {
      const current = duplicates.get(node.id) ?? [ids.get(node.id)];
      current.push(loc);
      duplicates.set(node.id, current);
    } else {
      ids.set(node.id, loc);
    }
  }

  for (const [k, v] of Object.entries(node)) {
    collectIds(v, ids, duplicates, [...pathStack, k]);
  }
  return { ids, duplicates };
}

export function collectRefs(node, refs = [], pathStack = []) {
  if (Array.isArray(node)) {
    node.forEach((item, idx) => collectRefs(item, refs, [...pathStack, `[${idx}]`]));
    return refs;
  }
  if (!node || typeof node !== "object") return refs;

  for (const [k, v] of Object.entries(node)) {
    if (isRefKey(k)) {
      if (typeof v === "string" && ID_RE.test(v)) {
        refs.push({ key: k, value: v, loc: [...pathStack, k].join(".") });
      } else if (Array.isArray(v)) {
        v.forEach((item, idx) => {
          if (typeof item === "string" && ID_RE.test(item)) {
            refs.push({ key: k, value: item, loc: [...pathStack, `${k}[${idx}]`].join(".") });
          }
        });
      }
    }
    collectRefs(v, refs, [...pathStack, k]);
  }
  return refs;
}
