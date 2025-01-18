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

    // Get the file from Supabase Storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("uploads")  // your bucket name
      .download(filePath); // file path from the database

    if (fileError) {
      throw new Error(`Error downloading file from storage: ${fileError.message}`);
    }

    // Convert the file data to a Buffer (if it's not already)
    const fileBuffer = Buffer.from(await fileData.arrayBuffer());

    if (fileExtension === ".pdf") {
      // Parse the PDF file
      const pdfData = await pdfParse(fileBuffer);
      return res.status(200).json({ extractedText: pdfData.text });
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
      // For images, use Tesseract OCR to extract text
      // Ensure Tesseract is properly configured with the correct path to the WASM file
      const { data: { text } } = await tesseract.recognize(fileBuffer, "eng", {
        logger: (m) => console.log(m),
        corePath: path.join(__dirname, 'node_modules/tesseract.js-core/tesseract-core-simd.wasm') // Explicitly set the WASM file path
      });
      return res.status(200).json({ extractedText: text });
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only PDF and images are allowed." });
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    return res.status(500).json({ error: "Failed to extract text from file" });
  }
};
