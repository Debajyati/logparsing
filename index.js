import parseLogFile from './logParser.js';

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

await (async () => {
  const logFilePath = await getPath("WindowsUpdate.log");
  const parsedLogs = await parseLogFile(logFilePath);
  await writeJSON("parsedLogs.json", parsedLogs);
  console.log("Done!");
  console.log("Parsed logs written to parsedLogs.json");
})();
