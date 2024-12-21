#!/usr/bin/env node

import parseLogFile from './logParser.js';
import { getPath, writeJSON } from './fileOprt.js';

// main function
await (async () => {
  try {
    const logFilePath = (process.argv[2]) ? process.argv.slice(2).join(" ") : (await getPath("WindowsUpdate.log"));
    const parsedLogs = await parseLogFile(logFilePath);

    if (parsedLogs.length === 0) {
      console.error("No output file generated");
      process.exit(1);
    }

    await writeJSON("parsedLogs.json", parsedLogs);

    console.log("Done!");
    console.log("Parsed logs written to parsedLogs.json");
  } catch (err) {
    console.error(`Error parsing log file: ${err.message}`);
    process.exit(1);
  }
})();
