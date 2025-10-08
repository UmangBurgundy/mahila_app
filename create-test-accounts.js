const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// Test NGO account
const testNGO = {
  organizationName: "Test Emergency NGO",
  email: "ngo@test.com",
  password: "password123",
  phone: "+1234567890",
  registrationNumber: "NGO001",
  location: {
    longitude: 77.5946,
    latitude: 12.9716,
    address: "Bangalore, Karnataka, India",
  },
  services: ["medical", "emergency-transport"],
  contactPerson: {
    name: "John Doe",
    designation: "Director",
  },
};

// Test Volunteer account
const testVolunteer = {
  name: "Jane Volunteer",
  email: "volunteer@test.com",
  password: "password123",
  phone: "+9876543210",
  location: {
    longitude: 77.5946,
    latitude: 12.9716,
    address: "Bangalore, Karnataka, India",
  },
  skills: ["first-aid", "driving"],
  age: 28,
  gender: "female",
};

// Wait for server to be ready
async function waitForServer() {
  console.log("⏳ Waiting for server to be ready...");
  let attempts = 0;
  while (attempts < 30) {
    try {
      await axios.get("http://localhost:5000/health");
      console.log("✅ Server is ready!\n");
      return true;
    } catch (error) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  console.log("❌ Server did not start in time. Make sure backend is running!");
  return false;
}

async function createTestAccounts() {
  // Wait for server first
  const serverReady = await waitForServer();
  if (!serverReady) {
    process.exit(1);
  }

  console.log("🔧 Creating test accounts...\n");

  try {
    // Create NGO
    console.log("📝 Creating NGO account...");
    const ngoResponse = await axios.post(`${API_URL}/ngos/register`, testNGO);
    console.log("✅ NGO account created successfully!");
    console.log("   Email: ngo@test.com");
    console.log("   Password: password123\n");
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("already exists")
    ) {
      console.log("ℹ️  NGO account already exists");
      console.log("   Email: ngo@test.com");
      console.log("   Password: password123\n");
    } else {
      console.error(
        "❌ Error creating NGO:",
        error.response?.data?.message || error.message
      );
    }
  }

  try {
    // Create Volunteer
    console.log("📝 Creating Volunteer account...");
    const volunteerResponse = await axios.post(
      `${API_URL}/volunteers/register`,
      testVolunteer
    );
    console.log("✅ Volunteer account created successfully!");
    console.log("   Email: volunteer@test.com");
    console.log("   Password: password123\n");
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("already exists")
    ) {
      console.log("ℹ️  Volunteer account already exists");
      console.log("   Email: volunteer@test.com");
      console.log("   Password: password123\n");
    } else {
      console.error(
        "❌ Error creating Volunteer:",
        error.response?.data?.message || error.message
      );
    }
  }

  console.log("✨ Test accounts are ready!");
  console.log("\n📱 You can now login to the mobile app with:");
  console.log("\n🏢 NGO Account:");
  console.log("   Email: ngo@test.com");
  console.log("   Password: password123");
  console.log("\n👤 Volunteer Account:");
  console.log("   Email: volunteer@test.com");
  console.log("   Password: password123");
}

createTestAccounts();
