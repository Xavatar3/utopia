import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logFallback } from "./utils/logger.js"
import dotenv from "dotenv";
dotenv.config(); // ← load .env

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "../dist"); // Vite build output

// Frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => { // Fallback
    logFallback(req);
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("Development mode: frontend served by Vite dev server at http://localhost:5173");
	// Later solve double restart problem of the server in dev and let nodemon handle standard input in concurently.
}
// Middleware
//app.use(express.json()); // parse JSON

//Listening...
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));