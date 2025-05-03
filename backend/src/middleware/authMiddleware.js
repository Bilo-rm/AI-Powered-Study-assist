const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication" });
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

// Admin authorization middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(403).json({ message: "Authorization failed", error: error.message });
  }
};

// User authorization middleware (allows both the user themselves and admins)
exports.isUserOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Allow if user is requesting their own data or if user is an admin
    if (req.user.id === req.params.id || req.user.role === "admin") {
      return next();
    }
    
    return res.status(403).json({ message: "Access denied. You can only access your own data." });
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(403).json({ message: "Authorization failed", error: error.message });
  }
};