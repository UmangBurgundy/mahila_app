require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const axios = require("axios");

let mongod;

async function setupMongoDB() {
  console.log("🔧 Setting up in-memory MongoDB for testing...\n");

  try {
    // Start in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    console.log("✅ In-memory MongoDB started");
    console.log(`📍 MongoDB URI: ${uri}\n`);

    // Connect to the in-memory database
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    // Now create test accounts
    await createTestAccounts();

    console.log("\n✨ Setup complete!");
    console.log("\n⚠️  IMPORTANT: Keep this terminal running!");
    console.log("   This provides an in-memory database for testing.");
    console.log("\n📱 Now you can:");
    console.log("   1. Start the backend: npm run dev (in another terminal)");
    console.log("   2. Login to mobile app with the credentials above\n");

    // Keep the process running
    process.on("SIGINT", async () => {
      await mongod.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error setting up MongoDB:", error);
    process.exit(1);
  }
}

async function createTestAccounts() {
  console.log("👥 Creating test accounts...\n");

  // Import models
  const NGO = require("./server/models/NGO");
  const Volunteer = require("./server/models/Volunteer");

  try {
    // Create NGO
    const ngo = await NGO.create({
      organizationName: "Test Emergency NGO",
      email: "ngo@test.com",
      password: "password123",
      phone: "+1234567890",
      registrationNumber: "NGO001",
      location: {
        type: "Point",
        coordinates: [77.5946, 12.9716],
        address: "Bangalore, Karnataka, India",
      },
      services: ["medical", "emergency-transport"],
      contactPerson: {
        name: "John Doe",
        designation: "Director",
      },
      verified: true,
      isActive: true,
    });

    console.log("✅ NGO Account Created:");
    console.log("   📧 Email: ngo@test.com");
    console.log("   🔑 Password: password123\n");

    // Create Volunteer
    const volunteer = await Volunteer.create({
      name: "Jane Volunteer",
      email: "volunteer@test.com",
      password: "password123",
      phone: "+9876543210",
      location: {
        type: "Point",
        coordinates: [77.5946, 12.9716],
        address: "Bangalore, Karnataka, India",
      },
      skills: ["first-aid", "driving"],
      age: 28,
      gender: "female",
      verified: true,
      isActive: true,
    });

    console.log("✅ Volunteer Account Created:");
    console.log("   📧 Email: volunteer@test.com");
    console.log("   🔑 Password: password123\n");
  } catch (error) {
    console.error("❌ Error creating accounts:", error.message);
  }
}

setupMongoDB();
