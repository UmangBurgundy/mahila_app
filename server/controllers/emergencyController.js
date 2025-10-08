const EmergencyRequest = require("../models/EmergencyRequest");
const User = require("../models/User");
const { findNearbyHelpers } = require("../services/locationService");
const { sendBulkEmergencySMS } = require("../services/smsService");

// Quick emergency signal - for authenticated users (NEW)
const sendEmergencySignal = async (req, res) => {
  try {
    // Get user from token
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    const { location, emergencyType, description, priority } = req.body;

    // Validate location coordinates
    const { longitude, latitude } = location;
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates. Please enable location access.",
      });
    }

    // Create emergency request using stored user profile
    const emergencyRequest = new EmergencyRequest({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
        address: location.address || "Current Location",
      },
      emergencyType: emergencyType || "medical", // Default to medical
      description: description || "Emergency! Need immediate help!",
      priority: priority || "high",
      status: "pending",
      // Include medical info if available
      userMedicalInfo: {
        bloodType: user.bloodType,
        medicalConditions: user.medicalConditions,
        allergies: user.allergies,
      },
      userEmergencyContacts: user.emergencyContacts,
    });

    // Save to database
    await emergencyRequest.save();

    // Find nearby helpers
    const nearbyHelpers = await findNearbyHelpers(
      longitude,
      latitude,
      emergencyType || "medical"
    );

    // Prepare SMS data with user profile info
    const emergencyData = {
      userName: user.name,
      userPhone: user.phone,
      emergencyType: emergencyType || "medical",
      description: description || "Emergency! Need immediate help!",
      location: emergencyRequest.location,
      bloodType: user.bloodType || "Not specified",
      medicalConditions: user.medicalConditions || "None specified",
    };

    // Send SMS to nearby NGOs
    let ngoNotifications = [];
    if (nearbyHelpers.ngos.length > 0) {
      ngoNotifications = await sendBulkEmergencySMS(
        nearbyHelpers.ngos,
        emergencyData
      );

      // Update emergency request with notified NGOs
      emergencyRequest.notifiedNGOs = ngoNotifications.map((notif) => ({
        ngoId: notif.helperId,
        notifiedAt: new Date(),
        status: notif.status.success ? "sent" : "failed",
      }));
    }

    // Send SMS to nearby volunteers
    let volunteerNotifications = [];
    if (nearbyHelpers.volunteers.length > 0) {
      volunteerNotifications = await sendBulkEmergencySMS(
        nearbyHelpers.volunteers,
        emergencyData
      );

      // Update emergency request with notified volunteers
      emergencyRequest.notifiedVolunteers = volunteerNotifications.map(
        (notif) => ({
          volunteerId: notif.helperId,
          notifiedAt: new Date(),
          status: notif.status.success ? "sent" : "failed",
        })
      );
    }

    await emergencyRequest.save();

    res.status(201).json({
      success: true,
      message: "Emergency signal sent! Help is on the way.",
      data: {
        requestId: emergencyRequest._id,
        status: emergencyRequest.status,
        notifiedCount: {
          ngos: ngoNotifications.length,
          volunteers: volunteerNotifications.length,
          total: ngoNotifications.length + volunteerNotifications.length,
        },
        nearbyHelpers: {
          ngos: nearbyHelpers.ngos.length,
          volunteers: nearbyHelpers.volunteers.length,
        },
      },
    });
  } catch (error) {
    console.error("Error sending emergency signal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send emergency signal",
      error: error.message,
    });
  }
};

// Create new emergency request (keeping for backward compatibility)
const createEmergencyRequest = async (req, res) => {
  try {
    const {
      userName,
      userPhone,
      location,
      emergencyType,
      description,
      priority,
    } = req.body;

    // Validate required fields
    if (
      !userName ||
      !userPhone ||
      !location ||
      !emergencyType ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate location coordinates
    const { longitude, latitude } = location;
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates",
      });
    }

    // Create emergency request
    const emergencyRequest = new EmergencyRequest({
      userId: userPhone, // Using phone as unique identifier
      userName,
      userPhone,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
        address: location.address,
      },
      emergencyType,
      description,
      priority: priority || "high",
      threatLevel: threatLevel || "medium",
      status: "pending",
    });

    // Save to database
    await emergencyRequest.save();

    // Find nearby helpers
    const nearbyHelpers = await findNearbyHelpers(
      longitude,
      latitude,
      emergencyType
    );

    // Prepare SMS data
    const emergencyData = {
      userName,
      userPhone,
      emergencyType,
      description,
      location: emergencyRequest.location,
    };

    // Send SMS to nearby NGOs
    let ngoNotifications = [];
    if (nearbyHelpers.ngos.length > 0) {
      ngoNotifications = await sendBulkEmergencySMS(
        nearbyHelpers.ngos,
        emergencyData
      );

      // Update emergency request with notified NGOs
      emergencyRequest.notifiedNGOs = ngoNotifications.map((notif) => ({
        ngoId: notif.helperId,
        notifiedAt: new Date(),
        status: notif.status.success ? "sent" : "failed",
      }));
    }

    // Send SMS to nearby volunteers
    let volunteerNotifications = [];
    if (nearbyHelpers.volunteers.length > 0) {
      volunteerNotifications = await sendBulkEmergencySMS(
        nearbyHelpers.volunteers,
        emergencyData
      );

      // Update emergency request with notified volunteers
      emergencyRequest.notifiedVolunteers = volunteerNotifications.map(
        (notif) => ({
          volunteerId: notif.helperId,
          notifiedAt: new Date(),
          status: notif.status.success ? "sent" : "failed",
        })
      );
    }

    // Auto-assign for fatal threat level
    if (emergencyRequest.threatLevel === "fatal") {
      // Auto-assign to the nearest available NGO or volunteer
      if (nearbyHelpers.ngos.length > 0) {
        const firstNGO = nearbyHelpers.ngos[0];
        emergencyRequest.assignedTo = firstNGO._id.toString();
        emergencyRequest.status = "acknowledged";
        emergencyRequest.notifiedNGOs[0].responseStatus = "accepted";
        emergencyRequest.notifiedNGOs[0].respondedAt = new Date();
      } else if (nearbyHelpers.volunteers.length > 0) {
        const firstVolunteer = nearbyHelpers.volunteers[0];
        emergencyRequest.assignedTo = firstVolunteer._id.toString();
        emergencyRequest.status = "acknowledged";
        emergencyRequest.notifiedVolunteers[0].responseStatus = "accepted";
        emergencyRequest.notifiedVolunteers[0].respondedAt = new Date();
      }
    }

    await emergencyRequest.save();

    res.status(201).json({
      success: true,
      message:
        emergencyRequest.threatLevel === "fatal"
          ? "FATAL emergency! Responder automatically assigned."
          : "Emergency request created and notifications sent",
      data: {
        requestId: emergencyRequest._id,
        status: emergencyRequest.status,
        notifiedCount: {
          ngos: ngoNotifications.length,
          volunteers: volunteerNotifications.length,
          total: ngoNotifications.length + volunteerNotifications.length,
        },
        nearbyHelpers: {
          ngos: nearbyHelpers.ngos.length,
          volunteers: nearbyHelpers.volunteers.length,
        },
      },
    });
  } catch (error) {
    console.error("Error creating emergency request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating emergency request",
      error: error.message,
    });
  }
};

// Get all emergency requests (for control room)
const getAllEmergencyRequests = async (req, res) => {
  try {
    const { status, emergencyType, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (emergencyType) filter.emergencyType = emergencyType;

    const requests = await EmergencyRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("notifiedNGOs.ngoId", "organizationName phone")
      .populate("notifiedVolunteers.volunteerId", "name phone");

    const total = await EmergencyRequest.countDocuments(filter);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching emergency requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
      error: error.message,
    });
  }
};

// Get single emergency request by ID
const getEmergencyRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await EmergencyRequest.findById(id)
      .populate("notifiedNGOs.ngoId")
      .populate("notifiedVolunteers.volunteerId");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching emergency request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching request",
      error: error.message,
    });
  }
};

// Update emergency request status
const updateEmergencyRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const request = await EmergencyRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Update status
    if (status) request.status = status;
    if (notes) request.notes = notes;
    if (assignedTo) request.assignedTo = assignedTo;

    // Set resolved timestamp if status is resolved
    if (status === "resolved") {
      request.resolvedAt = new Date();
    }

    await request.save();

    res.json({
      success: true,
      message: "Emergency request updated successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error updating emergency request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating request",
      error: error.message,
    });
  }
};

// Get statistics for dashboard
const getEmergencyStats = async (req, res) => {
  try {
    const totalRequests = await EmergencyRequest.countDocuments();
    const pendingRequests = await EmergencyRequest.countDocuments({
      status: "pending",
    });
    const inProgressRequests = await EmergencyRequest.countDocuments({
      status: "in-progress",
    });
    const resolvedRequests = await EmergencyRequest.countDocuments({
      status: "resolved",
    });

    // Get requests by emergency type
    const requestsByType = await EmergencyRequest.aggregate([
      { $group: { _id: "$emergencyType", count: { $sum: 1 } } },
    ]);

    // Get recent requests (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentRequests = await EmergencyRequest.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    res.json({
      success: true,
      data: {
        total: totalRequests,
        pending: pendingRequests,
        inProgress: inProgressRequests,
        resolved: resolvedRequests,
        last24Hours: recentRequests,
        byType: requestsByType,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
      error: error.message,
    });
  }
};

module.exports = {
  sendEmergencySignal,
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyRequestStatus,
  getEmergencyStats,
};
