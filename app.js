//installing express
const express = require("express");
const { connect } = require("http2");
const app = express();


// connecting with database
const mongoose = require("mongoose");

const db = async function () {
  try {
    await mongoose.connect(
      "mongodb+srv://mmessm45_db_user:13iBuvbdcTg16can@ecommerce-db.e60mfwv.mongodb.net/develpment-testing?appName=ecommerce-db",
    
    );
    console.log("connected to database");
  } catch (error) {
    console.log("couldn't connect to the data base -->" + error);
  }

};
db();

const User = require("./models/users-model");

const test1 = async function(){
  const newUser = new User();
  newUser.userName ="play foot2";
  newUser.email ="play foot2";
  newUser.lastName ="play ";
  newUser.firstName ="play ";
  newUser.phone ="play foot2";
  newUser.password ="play foot";
  newUser.payments =[
      {
        cardNumber:"4012001037141112",
        expiry: "12/2027",
        cvv: "343",
      },
    ];
  newUser.addresses =["play foot"];
  await newUser.save();

}
// test1();

app.get("/", (req, res) => {
  res.send("Hello World");
});


// app execution
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
