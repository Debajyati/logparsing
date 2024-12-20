async function parseLogFile(filePath) {
  const { readLogFile } = await import('./fileOprt.js');
  try {
    const lines = readLogFile(filePath);
    const parsedData = [];

    const updateIdPattern = /\b[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\.[0-9]+\b/;

    for await (const line of lines) {
      const parts = line.split(' ');
      // helper function
      const getMessage = (begindex, subStrArray) => {
        for (let i = begindex; i < subStrArray.length; i++) {
          const item = subStrArray[i].trim();
          if (item) {
            return subStrArray.slice(i).join(' ');
          }
        }
      }

      if (parts.length >= 3) {
        const timestamp = `${parts[0]} ${parts[1]}`;
        const components = [parts[2].trim()];
        let process, message;

        if (!parts[3]) {
          components.push(parts[4].trim());
        } else {
          components.push(parts[3].trim());
        }

        if (parts[3] && parts[4]) {
          process = parts[4].trim();
          message = getMessage(5, parts);
        } else if (!parts[5]) {
          process = parts[6].trim();
          message = getMessage(7,parts);
        } else {
          process = parts[5].trim();
          message = getMessage(6, parts);
        }

        const updateId = message.match(updateIdPattern)?.[0];
        const status = extractStatus(message);

        parsedData.push({
          timestamp,
          components,
          process,
          message,
          updateId,
          status,
        });
      }    
    }

    return parsedData;
  } catch (err) {
    console.error(`Error reading log file: ${err}`);
    return [];
  }
}

function extractStatus(message) {
  if (!message) {
    return null;
  }

  message = message.toLowerCase();

  const successKeywords = new Set(["succeeded", "successfully", "completed", "finished"]);
  const failureKeywords = new Set(["failed", "error", "failure", "not found", "could not"]);
  const inProgressKeywords = new Set(["downloading", "installing", "preparing", "starting", "registering"]);
  const pendingKeywords = new Set(["queued", "pending"]);
  const cleanupKeywords = new Set(["uninit", "deleting", "purge"]);

  // helper function
  const hasKeyword = (message, keywords) => {
    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        return true;
      }
    }
    return false;
  }


  if (hasKeyword(message, successKeywords)) {
    return "success";
  }
  if (hasKeyword(message, failureKeywords)) {
    return "failure";
  }
  if (hasKeyword(message, inProgressKeywords)) {
    return "in progress";
  } 
  if (hasKeyword(message, pendingKeywords)) {
    return "pending";
  }
  if (hasKeyword(message, cleanupKeywords)) {
    return "cleanup";
  }
  return "unknown";
}

export default parseLogFile;
