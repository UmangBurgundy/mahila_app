const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // If no MongoDB URI provided, use in-memory MongoDB
    if (!mongoUri || mongoUri.trim() === "") {
      console.log("📦 Starting in-memory MongoDB server...");
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log("✅ In-memory MongoDB server started");
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Cleanup on exit
process.on("SIGINT", async () => {
  if (mongod) {
    await mongod.stop();
  }
  process.exit(0);
});

module.exports = connectDB;
