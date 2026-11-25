import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

export function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

export function stripBom(content) {
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1);
  }
  return content;
}

export function walkFiles(dirPath, include) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  if (!fs.statSync(dirPath).isDirectory()) {
    return [];
  }

  const outputPaths = [];
  const stack = [dirPath];
  while (stack.length > 0) {
    const currentDir = stack.pop();
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (include(fullPath)) {
        outputPaths.push(fullPath);
      }
    }
  }
  return outputPaths.sort();
}

export function loadYaml(filePath) {
  const rawContent = stripBom(fs.readFileSync(filePath, "utf8"));
  return YAML.parse(rawContent);
}
