const express = require("express");
const router = express.Router();
const {
  sendEmergencySignal,
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyRequestStatus,
  getEmergencyStats,
} = require("../controllers/emergencyController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.post("/request", createEmergencyRequest); // Legacy endpoint

// Protected user routes (require user authentication)
router.post("/signal", authMiddleware, sendEmergencySignal); // NEW: Quick emergency signal

// Protected admin routes (require admin authentication)
router.get("/requests", authMiddleware, adminOnly, getAllEmergencyRequests);
router.get("/requests/:id", authMiddleware, getEmergencyRequestById);
router.patch(
  "/requests/:id/status",
  authMiddleware,
  adminOnly,
  updateEmergencyRequestStatus
);
router.get("/stats", authMiddleware, adminOnly, getEmergencyStats);

module.exports = router;
