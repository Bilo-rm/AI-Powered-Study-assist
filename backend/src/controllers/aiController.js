const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const pptx2json = require("pptx2json");

const Material = require("../models/MaterialModel");
const { askGPT } = require("../services/gptService");

const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === ".pptx") {
    const slides = await pptx2json.parse(filePath);
    return slides.map(s => s.text).join("\n");
  }

  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  throw new Error("Unsupported file type");
};

const processMaterial = async (req, res) => {
  try {
    const file = req.file;
    const { action } = req.body;

    const content = await extractTextFromFile(file.path);
    const result = await askGPT(action, content);

    const saved = await Material.create({
      filePath: file.path,
      fileName: file.originalname,
      type: action,
      result,
    });

    res.status(200).json({ message: "Success", data: saved });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

module.exports = { processMaterial };
