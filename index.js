import parseLogFile from './logParser.js';
// import { argv } from 'process';
import { getPath, writeJSON } from './fileOprt.js';

// main function
await (async () => {
  try {
    const logFilePath = await getPath("WindowsUpdate.log");
    const parsedLogs = await parseLogFile(logFilePath);

    await writeJSON("parsedLogs.json", parsedLogs);

    console.log("Done!");
    console.log("Parsed logs written to parsedLogs.json");
  } catch (err) {
    console.error(`Error parsing log file: ${err}`);
    process.exit(1);
  }
})();
