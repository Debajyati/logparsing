#!/usr/bin/env node

import parseLogFile from './logParser.js';
import { getPath, writeJSON } from './fileOprt.js';

const require = await (async ()=>{
  const { createRequire } = await import("node:module");
  return createRequire(import.meta.url);
})();

const helpText = `
Usage: winlogparse [options] [path-to-your-log-file.log]

A NodeJS based CLI for parsing your local Windows Update log files.

Options:
  -h, --help        Show help information
  -v, --version     Show version number

Examples:
  winlogparse --help                Show help information
  winlogparse path-to-your-log-file.log     Parse the specified log file and output JSON

Description:
  This will output a JSON file with the parsed data in the current working directory.

  If the filepath is omitted, it will default to a sample log file included in the CLI package for your reference.

License:
  ISC
`;

// main function
await (async () => {
  try {
    if (process.argv[2] === "-h" || process.argv[2] === "--help") {
      console.log(helpText);
      process.exit(0);
    }

    if (process.argv[2] === "-v" || process.argv[2] === "--version") {
      console.log(require("./package.json").version);
      process.exit(0);
    }
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
