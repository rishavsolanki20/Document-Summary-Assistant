const path = require("path");
const supabase = require("../config/supabase");

exports.handleUpload = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.resolve(file.path);
  const fileExtension = path.extname(file.originalname).toLowerCase();
  console.log("File path:", filePath);
  console.log("File ex:", fileExtension);

  try {
    // Save file metadata to Supabase
    const { data, error } = await supabase
    .from("files")
    .insert([
      {
        filename: file.originalname,
        file_path: filePath,
        file_extension: fileExtension,
        upload_date: new Date().toISOString(),
      },
    ])
    .select();
  
  console.log("Insert result:", data, error);
  

    if (error) throw error;

    return res.status(200).json({
      message: "File uploaded successfully",
      fileId: data[0].id,
    });
  } catch (error) {
    console.error("Error uploading file metadata:", error);
    return res.status(500).json({ error: "Failed to upload file metadata" });
  }
};
