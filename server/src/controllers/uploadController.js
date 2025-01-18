const path = require("path");
const fs = require("fs").promises; // For reading the uploaded file
const supabase = require("../config/supabase");

exports.handleUpload = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.resolve(file.path); // Local path to the uploaded file
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}-${file.originalname}`; // Unique file name for storage

  console.log("File path:", filePath);
  console.log("File extension:", fileExtension);

  try {
    // Read the file content
    const fileContent = await fs.readFile(filePath);

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("uploads")
      .upload(fileName, fileContent, {
        contentType: file.mimetype,
        cacheControl: "3600",
      });

    if (storageError) throw new Error(`Supabase Storage Error: ${storageError.message}`);

    console.log("File uploaded to Supabase Storage:", storageData);

    // Save file metadata to Supabase Database
    const { data: dbData, error: dbError } = await supabase
      .from("files")
      .insert([
        {
          filename: file.originalname,
          file_path: storageData.path,
          file_extension: fileExtension,
          upload_date: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) throw new Error(`Supabase Database Error: ${dbError.message}`);

    console.log("File metadata saved to database:", dbData);

    // Clean up local file (optional since Vercel doesn’t persist local storage)
    await fs.unlink(filePath);

    return res.status(200).json({
      message: "File uploaded successfully",
      fileId: dbData[0].id,
    });
  } catch (error) {
    console.error("Error handling file upload:", error);

    // Clean up local file in case of an error
    try {
      await fs.unlink(filePath);
    } catch (cleanupError) {
      console.error("Error cleaning up local file:", cleanupError);
    }

    return res.status(500).json({
      error: "Failed to upload file. Please try again.",
      details: error.message,
    });
  }
};
