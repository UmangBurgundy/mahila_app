const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: String,
    },
    emergencyType: {
      type: String,
      enum: ["medical", "safety", "violence", "accident", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "acknowledged", "in-progress", "resolved", "cancelled"],
      default: "pending",
    },
    notifiedNGOs: [
      {
        ngoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "NGO",
        },
        notifiedAt: Date,
        status: String, // 'sent', 'failed'
        responseStatus: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        respondedAt: Date,
      },
    ],
    notifiedVolunteers: [
      {
        volunteerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Volunteer",
        },
        notifiedAt: Date,
        status: String, // 'sent', 'failed'
        responseStatus: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        respondedAt: Date,
      },
    ],
    assignedTo: {
      type: String, // NGO or Volunteer ID
      model: String, // 'NGO' or 'Volunteer'
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high",
    },
    dangerLevel: {
      type: String,
      enum: ["normal", "moderate", "critical"],
      default: "moderate",
    },
    threatLevel: {
      type: String,
      enum: ["low", "medium", "high", "fatal"],
      default: "medium",
    },
    // User medical information for better emergency response
    userMedicalInfo: {
      bloodType: String,
      medicalConditions: String,
      allergies: String,
    },
    // User emergency contacts
    userEmergencyContacts: [
      {
        name: String,
        relationship: String,
        phone: String,
      },
    ],
    resolvedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location queries
emergencyRequestSchema.index({ location: "2dsphere" });
emergencyRequestSchema.index({ status: 1 });
emergencyRequestSchema.index({ createdAt: -1 });

const EmergencyRequest = mongoose.model(
  "EmergencyRequest",
  emergencyRequestSchema
);

module.exports = EmergencyRequest;
