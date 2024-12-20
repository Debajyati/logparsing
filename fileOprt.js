async function* readLogFile(filePath) {
  const { default: readline } = await import('node:readline');
  const { default: fs } = await import('node:fs');
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    yield line;
  }
}

async function getPath(filePath) {
  const { default: path } = await import('node:path');
  const dirname  = import.meta.dirname;
  return path.join(dirname, filePath);
}

async function writeJSON(filePath, data) {
  const { default: fs } = await import('node:fs');
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
}

export { readLogFile, getPath, writeJSON };
