// src/routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const aiController = require("../controllers/aiController");
const { authenticate } = require("../middleware/authMiddleware");

// Configure storage and fileFilter
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  // Currently only supporting PDF files to match your existing implementation
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are supported"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Apply authentication middleware to all routes
router.use(authenticate);

// Process uploaded material and save to response history
router.post("/upload", upload.single("file"), aiController.processMaterial);

module.exports = router;