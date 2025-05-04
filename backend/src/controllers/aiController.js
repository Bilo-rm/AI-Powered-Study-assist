// src/controllers/aiController.js
const fs = require("fs");
const path = require("path");
const extractTextFromPDF = require("../untils/pdfParser");
const { askGPT } = require("../services/gptService");
const { ResponseHistory } = require("../models/ResponseHistory");

exports.processMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file"
      });
    }

    const filePath = req.file.path;
    const { action } = req.body; // "summary", "flashcards", or "quiz"
    
    if (!action || !["summary", "flashcards", "quiz"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid action (summary, flashcards, or quiz)"
      });
    }

    // Extract text from uploaded file (currently only supports PDF)
    let extractedText;
    try {
      // Get file extension
      const fileExtension = path.extname(filePath).toLowerCase();
      
      if (fileExtension === '.pdf') {
        extractedText = await extractTextFromPDF(filePath);
      } else {
        return res.status(400).json({
          success: false,
          message: "Currently only PDF files are supported"
        });
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the file"
      });
    }
    
    if (!extractedText || extractedText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Extracted text is empty"
      });
    }

    // Use the GPT service to process the text
    const response = await askGPT(action, extractedText);
    
    // Save to response history if user is authenticated
    if (req.user && req.user.id) {
      try {
        await ResponseHistory.create({
          userId: req.user.id,
          action,
          prompt: `Process ${action} for ${req.file.originalname}`,
          response,
          originalContent: extractedText,
          fileName: req.file.originalname
        });
      } catch (error) {
        console.error("Error saving to response history:", error);
        // Continue even if saving to history fails
      }
    }

    // Clean up the uploaded file
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Continue even if file deletion fails
    }

    res.status(200).json({
      success: true,
      action,
      data: response
    });
  } catch (error) {
    console.error("Error processing material:", error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: "Error processing material",
      error: error.message
    });
  }
};