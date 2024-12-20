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

function* jsonGenerator(data) {
  yield '[';
  for (let i = 0; i < data.length; i++) {
    yield JSON.stringify(data[i], null, 2);
    if (i < data.length - 1) {
      yield ',';
    }
  }
  yield ']';
}

async function writeJSON(filePath, data) {
  const { default: fs } = await import("node:fs");
  // const jsonData = JSON.stringify(data, null, 2);
  const jsonData = jsonGenerator(data);
  try {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      writeStream.on("error", (err) => {
        reject(new Error(`Error writing JSON file: ${err.message}`));
      });
      writeStream.on("finish", resolve);
      for (const chunk of jsonData) {
        writeStream.write(chunk);
      }
      writeStream.end();
    });
  } catch (err) {
    throw new Error(`Error writing JSON file: ${err.message}`);
  }
}

export { readLogFile, getPath, writeJSON };
