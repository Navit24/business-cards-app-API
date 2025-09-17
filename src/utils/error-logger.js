// src/utils/error-logger.js

const fs = require("fs");
const { date } = require("joi");
const path = require("path");

// Logs folder
const logsDir = path.join(__dirname, "../../.logs");

// Create the folder if it does not exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logError = (status, message) => {
  if (status < 400) return;

  const now = new Date();

  // File name by date (YYYY-MM-DD.log)
  const fileName = `${now.toISOString().split("T")[0]}.log`;
  const filePath = path.join(logsDir, fileName);

  // Row content
  const logLine = `[${now.toISOString()}] STATUS: ${status}  | MESSAGE: ${message}\n`;

  // Add to file
  fs.appendFileSync(filePath, logLine, "utf-8");
};

module.exports = { logError };
