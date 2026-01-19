import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve frontend
app.use(express.static(path.join(__dirname, "../src")));

//Listen for requests
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));