const express = require("express");
const router = express.Router();
const {
  registerVolunteer,
  loginVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  findNearbyVolunteers,
  getMyEmergencyRequests,
  acceptEmergencyRequest,
  rejectEmergencyRequest,
} = require("../controllers/volunteerController");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerVolunteer);
router.post("/login", loginVolunteer);
router.get("/nearby", findNearbyVolunteers);

// Protected routes for Volunteers (require volunteer authentication)
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
router.patch("/:id", authMiddleware, updateVolunteer);

// Protected routes (require admin authentication)
router.get("/", authMiddleware, adminOnly, getAllVolunteers);
router.get("/:id", authMiddleware, getVolunteerById);
router.delete("/:id", authMiddleware, adminOnly, deleteVolunteer);

module.exports = router;
