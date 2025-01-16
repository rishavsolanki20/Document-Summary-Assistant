const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { handleUpload } = require("./src/controllers/uploadController");
const { extractTextFromFile } = require("./src/controllers/extractionController");
const { generateSummary } = require("./src/controllers/summaryController");

const app = express();

app.use(express.json());

// Routes
app.post("/upload", upload.single("file"), handleUpload);
app.post("/extract", extractTextFromFile);
app.post("/summarize", generateSummary);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
