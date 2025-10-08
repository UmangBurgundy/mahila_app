const NGO = require("../models/NGO");
const EmergencyRequest = require("../models/EmergencyRequest");
const jwt = require("jsonwebtoken");

// Register new NGO
const registerNGO = async (req, res) => {
  try {
    const ngoData = req.body;

    // Check if NGO already exists
    const existingNGO = await NGO.findOne({
      $or: [
        { registrationNumber: ngoData.registrationNumber },
        { phone: ngoData.phone },
      ],
    });

    if (existingNGO) {
      return res.status(400).json({
        success: false,
        message: "NGO with this registration number or phone already exists",
      });
    }

    // Create new NGO
    const ngo = new NGO({
      ...ngoData,
      location: {
        type: "Point",
        coordinates: [ngoData.location.longitude, ngoData.location.latitude],
        address: ngoData.location.address,
        city: ngoData.location.city,
        state: ngoData.location.state,
        pincode: ngoData.location.pincode,
      },
    });

    await ngo.save();

    res.status(201).json({
      success: true,
      message: "NGO registered successfully",
      data: ngo,
    });
  } catch (error) {
    console.error("Error registering NGO:", error);
    res.status(500).json({
      success: false,
      message: "Server error while registering NGO",
      error: error.message,
    });
  }
};

// Get all NGOs
const getAllNGOs = async (req, res) => {
  try {
    const { availability, services, verified, limit = 50 } = req.query;

    const filter = { isActive: true };
    if (availability) filter.availability = availability;
    if (services) filter.services = services;
    if (verified !== undefined) filter.verified = verified === "true";

    const ngos = await NGO.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: ngos,
      count: ngos.length,
    });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching NGOs",
      error: error.message,
    });
  }
};

// Get NGO by ID
const getNGOById = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = await NGO.findById(id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    res.json({
      success: true,
      data: ngo,
    });
  } catch (error) {
    console.error("Error fetching NGO:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching NGO",
      error: error.message,
    });
  }
};

// Update NGO
const updateNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle location update if provided
    if (
      updates.location &&
      updates.location.longitude &&
      updates.location.latitude
    ) {
      updates.location = {
        type: "Point",
        coordinates: [updates.location.longitude, updates.location.latitude],
        address: updates.location.address,
        city: updates.location.city,
        state: updates.location.state,
        pincode: updates.location.pincode,
      };
    }

    const ngo = await NGO.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    res.json({
      success: true,
      message: "NGO updated successfully",
      data: ngo,
    });
  } catch (error) {
    console.error("Error updating NGO:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating NGO",
      error: error.message,
    });
  }
};

// Delete NGO (soft delete)
const deleteNGO = async (req, res) => {
  try {
    const { id } = req.params;

    const ngo = await NGO.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      });
    }

    res.json({
      success: true,
      message: "NGO deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting NGO:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting NGO",
      error: error.message,
    });
  }
};

// Find nearby NGOs
const findNearbyNGOs = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50, services } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required",
      });
    }

    const filter = {
      isActive: true,
      verified: true,
      availability: { $ne: "unavailable" },
    };

    if (services) {
      filter.services = services;
    }

    const ngos = await NGO.find({
      ...filter,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(maxDistance) * 1000, // Convert km to meters
        },
      },
    }).limit(10);

    res.json({
      success: true,
      data: ngos,
      count: ngos.length,
    });
  } catch (error) {
    console.error("Error finding nearby NGOs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while finding nearby NGOs",
      error: error.message,
    });
  }
};

// NGO Login
const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find NGO by email
    const ngo = await NGO.findOne({ email, isActive: true });

    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await ngo.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: ngo._id, userType: "ngo" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        ngo: {
          id: ngo._id,
          organizationName: ngo.organizationName,
          email: ngo.email,
          phone: ngo.phone,
          services: ngo.services,
          verified: ngo.verified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in NGO:", error);
    res.status(500).json({
      success: false,
      message: "Server error while logging in",
      error: error.message,
    });
  }
};

// Get emergency requests for specific NGO
const getMyEmergencyRequests = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const { status, dangerLevel } = req.query;

    // Find all requests where this NGO was notified
    const filter = {
      "notifiedNGOs.ngoId": ngoId,
    };

    if (status) {
      filter.status = status;
    }
    if (dangerLevel) {
      filter.dangerLevel = dangerLevel;
    }

    const requests = await EmergencyRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("notifiedVolunteers.volunteerId", "name phone");

    // Add response status for this NGO to each request
    const requestsWithStatus = requests.map((request) => {
      const ngoNotification = request.notifiedNGOs.find(
        (n) => n.ngoId.toString() === ngoId
      );
      return {
        ...request.toObject(),
        myResponseStatus: ngoNotification?.responseStatus || "pending",
        myRespondedAt: ngoNotification?.respondedAt,
      };
    });

    res.json({
      success: true,
      data: requestsWithStatus,
      count: requestsWithStatus.length,
    });
  } catch (error) {
    console.error("Error fetching NGO emergency requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
      error: error.message,
    });
  }
};

// Accept emergency request
const acceptEmergencyRequest = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const { requestId } = req.params;

    const request = await EmergencyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Find the NGO notification
    const ngoNotification = request.notifiedNGOs.find(
      (n) => n.ngoId.toString() === ngoId
    );

    if (!ngoNotification) {
      return res.status(403).json({
        success: false,
        message: "You were not notified about this request",
      });
    }

    // Update response status
    ngoNotification.responseStatus = "accepted";
    ngoNotification.respondedAt = new Date();

    // Update main request status if it's still pending
    if (request.status === "pending") {
      request.status = "acknowledged";
    }

    await request.save();

    res.json({
      success: true,
      message: "Emergency request accepted",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting emergency request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while accepting request",
      error: error.message,
    });
  }
};

// Reject emergency request
const rejectEmergencyRequest = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await EmergencyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Find the NGO notification
    const ngoNotification = request.notifiedNGOs.find(
      (n) => n.ngoId.toString() === ngoId
    );

    if (!ngoNotification) {
      return res.status(403).json({
        success: false,
        message: "You were not notified about this request",
      });
    }

    // Update response status
    ngoNotification.responseStatus = "rejected";
    ngoNotification.respondedAt = new Date();
    if (reason) {
      ngoNotification.rejectionReason = reason;
    }

    await request.save();

    res.json({
      success: true,
      message: "Emergency request rejected",
      data: request,
    });
  } catch (error) {
    console.error("Error rejecting emergency request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while rejecting request",
      error: error.message,
    });
  }
};

module.exports = {
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
};
