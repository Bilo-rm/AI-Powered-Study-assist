// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const aiController = require("../controllers/aiController");

// Configure storage and fileFilter
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".docx", ".pptx", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, PPTX, and TXT files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });


router.post("/upload", upload.single("file"), aiController.processMaterial);

module.exports = router;
