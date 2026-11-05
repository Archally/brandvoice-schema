const FILE_HEADING = /^\s{0,3}(?:#{1,6}\s+|\*\*)\s*`([^`]+\.ya?ml)`/;


export function extractBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let unnamed = 0;
  let pendingPath = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    const heading = FILE_HEADING.exec(line);
    if (heading) {
      pendingPath = heading[1];
      continue;
    }

    const fence = /^\s*```\s*ya?ml\s*$/.exec(line);
    if (!fence) {
      if (line.trim() !== "" && pendingPath !== null) pendingPath = null;
      continue;
    }

    let start = index + 1;
    let end = start;
    while (end < lines.length && !/^\s*```\s*$/.test(lines[end])) end++;

    const marker = start < end ? /^\s*#\s*file:\s*(\S+\.ya?ml)\s*$/.exec(lines[start]) : null;
    if (marker) {
      pendingPath = marker[1];
      start++;
    }

    const body = lines.slice(start, end).join("\n");
    index = end;

    if (pendingPath === null) unnamed++;
    else blocks.push({ path: pendingPath, body, line: start + 1 });
    pendingPath = null;
  }

  return { blocks, unnamed };
}


export function modelRelativePath(declaredPath) {
  return declaredPath.replace(/\\/g, "/").replace(/^\.?\/?\.brandvoice\//, "").replace(/^\.?\//, "");
}
