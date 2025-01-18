const supabase = require("../config/supabase");
const path = require("path");

exports.handleUpload = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}-${file.originalname}`; // Unique file name for storage

  console.log("File received:", file.originalname);
  console.log("File extension:", fileExtension);

  try {
    // Use file buffer from memory
    const fileContent = file.buffer;

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

    return res.status(200).json({
      message: "File uploaded successfully",
      fileId: dbData[0].id,
    });
  } catch (error) {
    console.error("Error handling file upload:", error);

    return res.status(500).json({
      error: "Failed to upload file. Please try again.",
      details: error.message,
    });
  }
};
