
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

async function name() {
  console.log(await User.find());
}
// name()

