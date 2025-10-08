const express = require("express");
const router = express.Router();
const {
  registerNGO,
  loginNGO,
  getAllNGOs,
  getNGOById,
  updateNGO,
  deleteNGO,
  findNearbyNGOs,
  getMyEmergencyRequests,
  acceptEmergencyRequest,
  rejectEmergencyRequest,
} = require("../controllers/ngoController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerNGO);
router.post("/login", loginNGO);
router.get("/nearby", findNearbyNGOs);

// Protected routes for NGOs (require NGO authentication)
router.get("/my/requests", authMiddleware, getMyEmergencyRequests);
router.post(
  "/requests/:requestId/accept",
  authMiddleware,
  acceptEmergencyRequest
);
router.post(
  "/requests/:requestId/reject",
  authMiddleware,
  rejectEmergencyRequest
);
router.patch("/:id", authMiddleware, updateNGO);

// Protected routes (require admin authentication)
router.get("/", authMiddleware, adminOnly, getAllNGOs);
router.get("/:id", authMiddleware, getNGOById);
router.delete("/:id", authMiddleware, adminOnly, deleteNGO);

module.exports = router;
