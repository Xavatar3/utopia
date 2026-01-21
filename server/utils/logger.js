import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.join(__dirname, "../logs/fallback.log");

export function logFallback(req) {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const entry = {
    ip: ip,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.headers["user-agent"] || "unknown"
  }

  let logs = {};
  if (fs.existsSync(logFile)) {
    logs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
  }

  // Ensure nested structure exists
  logs[year] = logs[year] || {};
  logs[year][month] = logs[year][month] || {};
  logs[year][month][day] = logs[year][month][day] || {};
  logs[year][month][day][hour] = logs[year][month][day][hour] || [];
  logs[year][month][day][hour].push(entry); // New entry

  console.log("[Fallback]", logs);
    fs.writeFileSync(logFile, JSON.stringify(logs,null,2), {
      encoding: "utf8",
      mode: 0o644,
      flag: "w"
    });
}