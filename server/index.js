require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const { initializeTwilio } = require("./services/smsService");

// Import routes
const emergencyRoutes = require("./routes/emergencyRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize Twilio
initializeTwilio();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // Logging

// API Routes
app.use("/api/emergency", emergencyRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Emergency Response Control Room API",
    version: "1.0.0",
    endpoints: {
      emergency: "/api/emergency",
      users: "/api/users",
      ngos: "/api/ngos",
      volunteers: "/api/volunteers",
      auth: "/api/auth",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const os = require("os");

// Get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

app.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Local API: http://localhost:${PORT}/api`);
  console.log(`🌐 Network API: http://${localIP}:${PORT}/api`);
});

module.exports = app;
