const mongoose = require("mongoose");
const initData = require("./data.js"); // Load initData only once
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj, owner: "67c55e9ae84e9eab0c8f3c43"}) );
    await Listing.insertMany(initData.data); // Ensure initData.data is correct

    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    mongoose.connection.close(); // Close the connection after operation
  }
};

// Connect to DB and initialize data
main().then(initDB);