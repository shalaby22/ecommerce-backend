const mongoose = require("mongoose");

let isConnected = false;

async function connectToDB() {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL);
    isConnected = db.connections[0].readyState;
    console.log("=> connected to database");
  } catch (error) {
    console.log("couldn't connect to the data base --> " + error);
  }
}

module.exports = connectToDB;
