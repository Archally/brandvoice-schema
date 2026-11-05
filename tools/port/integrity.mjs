import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, lstatSync } from 'node:fs';
import { join, resolve, relative, isAbsolute } from 'node:path';

export function hashFile(path) {
  return createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex');
}
export function safePath(root, path) {
  const result = resolve(root, path);
  const local = relative(root, result);
  if (isAbsolute(path) || local.startsWith('..')) throw new Error(`Unsafe integrity path: ${path}`);
  let current = root;
  for (const part of local.split('/')) {
    current = join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error(`Symbolic link is not an integrity unit: ${path}`);
  }
  return result;
}
export function filesUnder(root, path = '') {
  const directory = safePath(root, path || '.');
  if (!existsSync(directory)) return [];
  const files = [];
  for (const name of readdirSync(directory).sort()) {
    if (['node_modules', 'dist', 'PORTED.sha256'].includes(name)) continue;
    const local = path ? `${path}/${name}` : name;
    const full = safePath(root, local);
    if (lstatSync(full).isDirectory()) files.push(...filesUnder(root, local));
    else files.push(local);
  }
  return files;
}
export function readIntegrity(text) {
  const jobs = [];
  const absent = [];
  const covered = [];
  const hashes = new Map();
  for (const line of text.split(/\r?\n/)) {
    let match = line.match(/^# (job|file) ([\w-]+) (\S+)$/);
    if (match) {
      jobs.push({ kind: match[1], name: match[2], path: match[3] });
      continue;
    }
    match = line.match(/^# (absent|covered) (\S+)$/);
    if (match) {
      if (match[1] === 'absent') absent.push(match[2]);
      else covered.push(match[2]);
      continue;
    }
    if (!line.trim() || line.startsWith('#')) continue;
    match = line.match(/^([a-f0-9]{64})  (\S+)$/);
    if (!match || hashes.has(match[2])) throw new Error('Invalid or duplicate integrity entry');
    hashes.set(match[2], match[1]);
  }
  if (!jobs.length || !hashes.size) throw new Error('Integrity manifest has no jobs or hashes');
  return { jobs, absent, covered, hashes };
}
export function collectHashes(root, jobs) {
  const hashes = new Map();
  for (const job of jobs) {
    const path = safePath(root, job.path);
    const files = job.kind === 'file' ? (existsSync(path) ? [job.path] : []) : filesUnder(root, job.path);
    for (const file of files) {
      const key = job.kind === 'file' ? `${job.name}/${job.path.split('/').at(-1)}` : `${job.name}/${relative(path, join(root, file)).replaceAll('\\', '/')}`;
      hashes.set(key, hashFile(join(root, file)));
    }
  }
  return hashes;
}
export function compareHashes(expected, actual, label = 'files') {
  const problems = [];
  for (const [file, hash] of actual) {
    if (!expected.has(file)) problems.push(`${label}: unexpected ${file}`);
    else if (expected.get(file) !== hash) problems.push(`${label}: modified ${file}`);
  }
  for (const file of expected.keys()) {
    if (!actual.has(file)) problems.push(`${label}: missing ${file}`);
  }
  return problems;
}
export function verifyIntegrity(root, integrity) {
  const actual = collectHashes(root, integrity.jobs);
  const problems = compareHashes(integrity.hashes, actual);
  for (const job of integrity.jobs) {
    if (!existsSync(safePath(root, job.path))) problems.push(`Missing unit: ${job.path}`);
  }
  for (const path of integrity.absent) {
    if (existsSync(safePath(root, path))) problems.push(`Private path present: ${path}`);
  }
  for (const path of integrity.covered) {
    const directory = safePath(root, path);
    if (!existsSync(directory)) {
      problems.push(`Missing covered root: ${path}`);
      continue;
    }
    for (const child of readdirSync(directory)) {
      const local = `${path}/${child}`;
      const claimed = integrity.jobs.some(job => job.path === local || job.path.startsWith(`${local}/`) || local.startsWith(`${job.path}/`));
      if (!claimed) problems.push(`Undeclared path: ${local}`);
    }
  }
  return { ok: problems.length === 0, checked: actual.size, problems };
}
