const Volunteer = require("../models/Volunteer");
const EmergencyRequest = require("../models/EmergencyRequest");
const jwt = require("jsonwebtoken");

// Register new volunteer
const registerVolunteer = async (req, res) => {
  try {
    const volunteerData = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({
      phone: volunteerData.phone,
    });

    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: "Volunteer with this phone number already exists",
      });
    }

    // Create new volunteer
    const volunteer = new Volunteer({
      ...volunteerData,
      location: {
        type: "Point",
        coordinates: [
          volunteerData.location.longitude,
          volunteerData.location.latitude,
        ],
        address: volunteerData.location.address,
        city: volunteerData.location.city,
        state: volunteerData.location.state,
        pincode: volunteerData.location.pincode,
      },
    });

    await volunteer.save();

    res.status(201).json({
      success: true,
      message: "Volunteer registered successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("Error registering volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while registering volunteer",
      error: error.message,
    });
  }
};

// Get all volunteers
const getAllVolunteers = async (req, res) => {
  try {
    const { availability, skills, verified, limit = 50 } = req.query;

    const filter = { isActive: true };
    if (availability) filter.availability = availability;
    if (skills) filter.skills = skills;
    if (verified !== undefined) filter.verified = verified === "true";

    const volunteers = await Volunteer.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: volunteers,
      count: volunteers.length,
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching volunteers",
      error: error.message,
    });
  }
};

// Get volunteer by ID
const getVolunteerById = async (req, res) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching volunteer",
      error: error.message,
    });
  }
};

// Update volunteer
const updateVolunteer = async (req, res) => {
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

    // Update last active time
    updates.lastActive = new Date();

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      message: "Volunteer updated successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating volunteer",
      error: error.message,
    });
  }
};

// Delete volunteer (soft delete)
const deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      message: "Volunteer deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting volunteer",
      error: error.message,
    });
  }
};

// Find nearby volunteers
const findNearbyVolunteers = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50, skills } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required",
      });
    }

    const filter = {
      isActive: true,
      verified: true,
      availability: "available",
    };

    if (skills) {
      filter.skills = skills;
    }

    const volunteers = await Volunteer.find({
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
      data: volunteers,
      count: volunteers.length,
    });
  } catch (error) {
    console.error("Error finding nearby volunteers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while finding nearby volunteers",
      error: error.message,
    });
  }
};

// Volunteer Login
const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find volunteer by email
    const volunteer = await Volunteer.findOne({ email, isActive: true });

    if (!volunteer) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await volunteer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: volunteer._id, userType: "volunteer" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        volunteer: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          phone: volunteer.phone,
          skills: volunteer.skills,
          verified: volunteer.verified,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while logging in",
      error: error.message,
    });
  }
};

// Get emergency requests for specific volunteer
const getMyEmergencyRequests = async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const { status, dangerLevel } = req.query;

    // Find all requests where this volunteer was notified
    const filter = {
      "notifiedVolunteers.volunteerId": volunteerId,
    };

    if (status) {
      filter.status = status;
    }
    if (dangerLevel) {
      filter.dangerLevel = dangerLevel;
    }

    const requests = await EmergencyRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("notifiedNGOs.ngoId", "organizationName phone");

    // Add response status for this volunteer to each request
    const requestsWithStatus = requests.map((request) => {
      const volunteerNotification = request.notifiedVolunteers.find(
        (v) => v.volunteerId.toString() === volunteerId
      );
      return {
        ...request.toObject(),
        myResponseStatus: volunteerNotification?.responseStatus || "pending",
        myRespondedAt: volunteerNotification?.respondedAt,
      };
    });

    res.json({
      success: true,
      data: requestsWithStatus,
      count: requestsWithStatus.length,
    });
  } catch (error) {
    console.error("Error fetching volunteer emergency requests:", error);
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
    const volunteerId = req.user.id;
    const { requestId } = req.params;

    const request = await EmergencyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Find the volunteer notification
    const volunteerNotification = request.notifiedVolunteers.find(
      (v) => v.volunteerId.toString() === volunteerId
    );

    if (!volunteerNotification) {
      return res.status(403).json({
        success: false,
        message: "You were not notified about this request",
      });
    }

    // Update response status
    volunteerNotification.responseStatus = "accepted";
    volunteerNotification.respondedAt = new Date();

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
    const volunteerId = req.user.id;
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await EmergencyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found",
      });
    }

    // Find the volunteer notification
    const volunteerNotification = request.notifiedVolunteers.find(
      (v) => v.volunteerId.toString() === volunteerId
    );

    if (!volunteerNotification) {
      return res.status(403).json({
        success: false,
        message: "You were not notified about this request",
      });
    }

    // Update response status
    volunteerNotification.responseStatus = "rejected";
    volunteerNotification.respondedAt = new Date();
    if (reason) {
      volunteerNotification.rejectionReason = reason;
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
};
