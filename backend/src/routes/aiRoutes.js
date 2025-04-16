const express = require("express");
const multer = require("multer");
const { askWithLangChain } = require("../controllers/aiController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/ask", upload.single("file"), askWithLangChain);

module.exports = router;
