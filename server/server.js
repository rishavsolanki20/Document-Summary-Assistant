const express = require("express");
const multer = require("multer");
const cors = require('cors');

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

// Routes
app.post("/upload", upload.single("file"), handleUpload);
app.post("/extract", extractTextFromFile);
app.post("/summarize", generateSummary);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
