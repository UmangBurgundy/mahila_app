const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ngoSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    contactPerson: {
      name: String,
      designation: String,
    },
    phone: {
      type: String,
      required: true,
    },
    alternatePhone: String,
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
      address: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      pincode: String,
    },
    serviceArea: {
      radiusKm: {
        type: Number,
        default: 10,
      },
      cities: [String],
    },
    services: [
      {
        type: String,
        enum: [
          "medical",
          "legal",
          "shelter",
          "counseling",
          "emergency-transport",
          "food",
          "other",
        ],
      },
    ],
    capacity: {
      currentLoad: {
        type: Number,
        default: 0,
      },
      maxCapacity: {
        type: Number,
        default: 10,
      },
    },
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalResponsed: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
ngoSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
ngoSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create geospatial index for location queries
ngoSchema.index({ location: "2dsphere" });
ngoSchema.index({ availability: 1 });
ngoSchema.index({ services: 1 });

const NGO = mongoose.model("NGO", ngoSchema);

module.exports = NGO;
