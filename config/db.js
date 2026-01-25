
const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connected to database");
  } catch (error) {
    console.log("couldn't connect to the data base -->" + error);
  }
}

module.exports = connectToDB;