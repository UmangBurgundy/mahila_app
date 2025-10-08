const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: Number,
    gender: String,
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
      city: String,
      state: String,
      pincode: String,
    },
    availableRadius: {
      type: Number,
      default: 5, // km
    },
    skills: [
      {
        type: String,
        enum: [
          "first-aid",
          "counseling",
          "driving",
          "language-translation",
          "legal-knowledge",
          "medical",
          "other",
        ],
      },
    ],
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    idProof: {
      type: String, // Document number
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalResponses: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
volunteerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
volunteerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create geospatial index for location queries
volunteerSchema.index({ location: "2dsphere" });
volunteerSchema.index({ availability: 1 });
volunteerSchema.index({ skills: 1 });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
