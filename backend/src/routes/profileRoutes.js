const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// User profile routes - only accessible by the authenticated user for their own profile
router.get("/profile", profileController.getProfile);
router.put("/profile", profileController.updateProfile);
router.put("/profile/password", profileController.changePassword);

module.exports = router;