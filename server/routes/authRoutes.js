const express = require("express");
const router = express.Router();
const {
  login,
  verifyToken,
  createAdmin,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/create-admin", createAdmin); // For initial setup only

// Protected routes
router.get("/verify", authMiddleware, verifyToken);

module.exports = router;
