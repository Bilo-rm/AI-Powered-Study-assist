const express = require("express");
const router = express.Router();
const userController = require("../controllers/userscontroller");
const authMiddleware = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Admin user management routes
// All these routes require admin privileges
router.get("/users", authMiddleware.isAdmin, userController.getAllUsers);
router.get("/users/:id", authMiddleware.isAdmin, userController.getUserById);
router.post("/users", authMiddleware.isAdmin, userController.createUser);
router.put("/users/:id", authMiddleware.isAdmin, userController.updateUser);
router.delete("/users/:id", authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;