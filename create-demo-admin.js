require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./server/models/Admin");

async function createDemoAdmin() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if demo admin already exists
    const existingAdmin = await Admin.findOne({
      email: "demo@controlroom.com",
    });

    if (existingAdmin) {
      console.log("ℹ️  Demo admin already exists!");
      console.log("\n📧 Email: demo@controlroom.com");
      console.log("🔑 Password: demo123");
      await mongoose.connection.close();
      return;
    }

    // Create demo admin
    const demoAdmin = await Admin.create({
      email: "demo@controlroom.com",
      password: "demo123",
      name: "Demo Operator",
      role: "operator",
      isActive: true,
    });

    console.log("✅ Demo admin account created successfully!\n");
    console.log("📧 Email: demo@controlroom.com");
    console.log("🔑 Password: demo123");
    console.log("\n🎯 You can now use the 'Try Demo Login' button in the app!");

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error creating demo admin:", error.message);
    process.exit(1);
  }
}

createDemoAdmin();
