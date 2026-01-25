const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  User,
} = require("../models/users-model");

const { FailError } = require("../middlewares/errors");

/**
 * @decs  login user
 * @route /api/auth/login
 * @method post
 */
const loginFunc = async function (reqBody) {
  
  const myUser = await User.findOne({ email: reqBody.email }).select('+password');;

  if (!myUser) {
    throw new FailError("wrong email or password", 400);
  }

  const checkPassword = await bcrypt.compare(reqBody.password, myUser.password);

  if (!checkPassword) {
    throw new FailError("wrong email or password", 400);
  }

  const token = generateToken(myUser);
  const { password, ...other } = myUser._doc;
  const user = { ...other, token: token };
  return user;
};

/**
 * @decs  register new user
 * @route /api/auth/register
 * @method post
 */

const registerFunc = async function (reqBody) {


  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(reqBody.password, salt);

  const myUser = new User({
    addresses: reqBody.addresses,
    userName: reqBody.userName,
    email: reqBody.email,
    lastName: reqBody.lastName,
    firstName: reqBody.firstName,
    phone: reqBody.phone,
    password: hash,
    payments: reqBody.payments,
  });

  try {
    await myUser.save();
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      throw new FailError(`this ${field} already exists`, 400);
    }
    throw new FailError(error, 400);
  }

  const token = generateToken(myUser);

  const { password, ...other } = myUser._doc;
  const user = { ...other, token: token };
  return user;
};

const generateToken = function (myUser) {
  const token = jwt.sign(
    { _id: myUser._id, email: myUser.email, isAdmin: myUser.isAdmin },
    process.env.TOKEN_PASSWORD,
    { expiresIn: "7d" },
  );
  return token;
};

module.exports = { loginFunc, registerFunc };
