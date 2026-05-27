import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export function toPosixPath(p) {
  return p.split(path.sep).join("/");
}

export function stripBom(content) {
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
}

export function walkFiles(dir, include) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (include(full)) {
        out.push(full);
      }
    }
  }
  return out.sort();
}

export function loadYaml(filePath) {
  const raw = stripBom(fs.readFileSync(filePath, "utf8"));
  return YAML.parse(raw);
}

export function mergeIntoPlane(target, source, _warnings = []) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return;
  for (const [key, value] of Object.entries(source)) {
    if (key === "version" || key === "schemaVersion" || key === "scope" || key === "tags") continue;
    const existing = target[key];
    if (Array.isArray(value) && Array.isArray(existing)) {
      existing.push(...value);
    } else if (Array.isArray(value)) {
      target[key] = [...value];
    } else {
      target[key] = value;
    }
  }
}

export function mergeSliceDocument(target, source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return;
  for (const [key, value] of Object.entries(source)) {
    if (key === "version" || key === "schemaVersion") {
      if (target[key] === undefined) target[key] = value;
      continue;
    }
    if (key === "scope" || key === "tags") continue;
    const existing = target[key];
    if (Array.isArray(value) && Array.isArray(existing)) {
      existing.push(...value);
    } else if (Array.isArray(value)) {
      target[key] = [...value];
    } else {
      target[key] = value;
    }
  }
}
