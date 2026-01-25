
const bcrypt = require("bcryptjs");

const { User } = require("../models/users-model");



const { FailError } = require("../middlewares/errors");
const isValidObjectId = require("../utils/isValidObjectId");

/**
 * @decs  get all users
 * @route /api/users/
 * @method get
 * @access admin
 */

const getAllUsersFunc = async function () {
  const users = await User.find();
  return users;
};

/**
 * @decs  get user by id
 * @route /api/users/:id
 * @method get
 * @access admin or auth
 */
 
const getUserFunc = async function (id) {
  if (!isValidObjectId(id)) {
    throw new FailError("that is not a valid userId", 400);
  }
  const user = await User.findById(id);
  if (user) {
    return user;
  } else {
    throw new FailError("that user not found", 404);
  }
};

/**
 * @decs  update a user by id
 * @route /api/users/:id
 * @method put
* @access admin or auth 
 */

const updateUserFunc = async function (id,reqBody) {
    if (!isValidObjectId(id)) {
      throw new FailError("that is not a valid userId", 400);
    }
    const user = await User.findById(id);

    if (!user) {
      throw new FailError("that user not found", 404);
    }


    let hash = undefined;

    if (reqBody.password) {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(reqBody.password, salt);
    } else {
      const hash = undefined;
    }
    let newUser;
    try {
      newUser = await User.findByIdAndUpdate(
        id,
        {
          addresses: reqBody.addresses,
          userName: reqBody.userName,
          email: reqBody.email,
          lastName: reqBody.lastName,
          firstName: reqBody.firstName,
          phone: reqBody.phone,
          password: hash,
          payments: reqBody.payments,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new FailError(`this ${field} already exists`, 400);
      }
      throw new FailError(error, 400);
    }

    return newUser;
  }

/**

 * @decs  delete a user by id
 * @route /api/users/:id
 * @method delete
* @access admin or auth 
 */
const deleteUserFunc = async function (id) {
    if (!isValidObjectId(id)) {
      throw new FailError("that is not a valid userId", 400);
    }
    const user = await User.findById(id);

    if (!user) {
      throw new FailError("that user not found", 404);
    }

    const deleted = await User.findByIdAndDelete(id);

    return "deleted successfully";
  }
module.exports = {getAllUsersFunc,getUserFunc,updateUserFunc,deleteUserFunc};
