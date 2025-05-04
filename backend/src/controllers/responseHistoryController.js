// src/controllers/responseHistoryController.js
const { ResponseHistory } = require("../models/ResponseHistory");

// Create a new response history entry
exports.createResponseHistory = async (req, res) => {
  try {
    const { action, prompt, response, originalContent, fileName } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!action || !prompt || !response) {
      return res.status(400).json({ 
        success: false, 
        message: "Action, prompt, and response are required fields" 
      });
    }
    
    // Validate action type
    if (!["summary", "flashcards", "quiz"].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        message: "Action must be one of: summary, flashcards, quiz" 
      });
    }

    const responseHistory = await ResponseHistory.create({
      userId,
      action,
      prompt,
      response,
      originalContent,
      fileName
    });

    res.status(201).json({
      success: true,
      data: responseHistory
    });
  } catch (error) {
    console.error("Error creating response history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all response history entries for a user
exports.getUserResponseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const responseHistory = await ResponseHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: responseHistory.length,
      data: responseHistory
    });
  } catch (error) {
    console.error("Error fetching response history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get a specific response history entry by ID
exports.getResponseHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const responseHistory = await ResponseHistory.findOne({
      where: { 
        id,
        userId // Ensure user can only access their own history
      }
    });

    if (!responseHistory) {
      return res.status(404).json({
        success: false,
        message: "Response history not found"
      });
    }

    res.status(200).json({
      success: true,
      data: responseHistory
    });
  } catch (error) {
    console.error("Error fetching response history by ID:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete a response history entry
exports.deleteResponseHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const responseHistory = await ResponseHistory.findOne({
      where: { 
        id,
        userId // Ensure user can only delete their own history
      }
    });

    if (!responseHistory) {
      return res.status(404).json({
        success: false,
        message: "Response history not found"
      });
    }

    await responseHistory.destroy();

    res.status(200).json({
      success: true,
      message: "Response history deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting response history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get response history filtered by action type
exports.getResponseHistoryByAction = async (req, res) => {
  try {
    const { action } = req.params;
    const userId = req.user.id;
    
    // Validate action type
    if (!["summary", "flashcards", "quiz"].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        message: "Action must be one of: summary, flashcards, quiz" 
      });
    }
    
    const responseHistory = await ResponseHistory.findAll({
      where: { 
        userId,
        action 
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: responseHistory.length,
      data: responseHistory
    });
  } catch (error) {
    console.error("Error fetching response history by action:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};