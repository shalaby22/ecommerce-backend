//installing express
const express = require("express");
const app = express();
app.use(express.json());
const dotenv = require('dotenv').config()




// connecting with database
const mongoose = require("mongoose");

const db = async function () {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connected to database");
  } catch (error) {
    console.log("couldn't connect to the data base -->" + error);
  }

};
db();


const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");


app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)



// app execution
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
