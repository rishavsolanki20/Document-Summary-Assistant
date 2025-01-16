const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const supabase = require("../config/supabase");

exports.extractTextFromFile = async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    return res.status(400).json({ error: "File ID not provided" });
  }

  try {
    // Fetch file metadata from Supabase
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (error || !data) {
      throw new Error("File not found");
    }

    const { file_path: filePath, file_extension: fileExtension } = data;

    if (fileExtension === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return res.status(200).json({ extractedText: pdfData.text });
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
      const { data: { text } } = await tesseract.recognize(filePath, "eng");
      return res.status(200).json({ extractedText: text });
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only PDF and images are allowed." });
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    return res.status(500).json({ error: "Failed to extract text from file" });
  }
};
