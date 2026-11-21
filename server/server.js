const express = require("express");
const multer = require("multer");
const cors = require('cors');
const path = require('path');                       // ← added

const { handleUpload } = require("./src/controllers/uploadController");
const { extractTextFromFile } = require("./src/controllers/extractionController");
const { generateSummary } = require("./src/controllers/summaryController");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// API Routes (must stay above the SPA fallback)
app.post("/upload", upload.single("file"), handleUpload);
app.post("/extract", extractTextFromFile);
app.post("/summarize", generateSummary);

// --- Static React build serving ---
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback: any non-API GET request returns index.html so React Router works
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  // Skip paths that belong to the API so we don't swallow them
  const apiPrefixes = ['/upload', '/extract', '/summarize'];
  if (apiPrefixes.some(p => req.path.startsWith(p))) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});