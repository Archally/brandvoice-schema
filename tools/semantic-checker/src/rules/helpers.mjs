const ID_RE = /^([a-z][a-z0-9-]*\.)?([A-Z]{3}\d{3}|[A-Z]\d{3})$/;

export function getPrefix(id) {
  const normalized = id.includes(".") ? id.split(".").at(-1) : id;
  return normalized.slice(0, 3);
}

export function walkEntities(node, callback, path = []) {
  if (Array.isArray(node)) {
    node.forEach((item, idx) => walkEntities(item, callback, [...path, `[${idx}]`]));
    return;
  }
  if (!node || typeof node !== "object") return;
  if (typeof node.id === "string" && ID_RE.test(node.id)) {
    callback(node, path.join(".") || "root");
  }
  for (const [k, v] of Object.entries(node)) {
    walkEntities(v, callback, [...path, k]);
  }
}

export function collectAllRefs(node, refs = new Set()) {
  if (Array.isArray(node)) {
    for (const item of node) {
      if (typeof item === "string" && ID_RE.test(item)) refs.add(item);
      else collectAllRefs(item, refs);
    }
    return refs;
  }
  if (!node || typeof node !== "object") return refs;
  for (const [k, v] of Object.entries(node)) {
    if (k === "id") continue;
    if (typeof v === "string" && ID_RE.test(v) && (k.endsWith("_ref") || k.endsWith("_refs"))) {
      refs.add(v);
    } else {
      collectAllRefs(v, refs);
    }
  }
  return refs;
}
