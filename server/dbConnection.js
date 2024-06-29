const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = { connectDb };
