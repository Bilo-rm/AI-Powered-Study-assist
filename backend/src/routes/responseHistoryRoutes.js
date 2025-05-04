// src/routes/responseHistoryRoutes.js
const express = require("express");
const router = express.Router();
const responseHistoryController = require("../controllers/responseHistoryController");
const { authenticate, isUserOrAdmin } = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new response history entry
router.post("/", responseHistoryController.createResponseHistory);

// Get all response history for the authenticated user
router.get("/", responseHistoryController.getUserResponseHistory);

// Get response history filtered by action type
router.get("/action/:action", responseHistoryController.getResponseHistoryByAction);

// Get a specific response history by ID
router.get("/:id", responseHistoryController.getResponseHistoryById);

// Delete a response history entry
router.delete("/:id", responseHistoryController.deleteResponseHistory);

module.exports = router;