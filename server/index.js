import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logFallback } from "./utils/logger.js"
//import objectsRouter from "./routes/objects.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve frontend
app.use(express.static(path.join(__dirname, "../src")));

// Middleware
//app.use(express.json()); // parse JSON

// Fallback
app.get(/.*/, (req, res) => {
  logFallback(req);
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

//Listen for requests
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));