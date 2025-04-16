const extractTextFromPDF = require('../untils/pdfParser');
const fs = require('fs');


exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const text = await extractTextFromPDF(req.file.path);
    fs.unlinkSync(req.file.path); // Delete the uploaded file after processing

    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
};
