
const asyncHandler = require("express-async-handler");

const {loginFunc,registerFunc} =require("../services/auth.services")
/**
 * @decs  login user
 * @route /api/auth/login
 * @method post
 */

const loginUser = asyncHandler(async (req, res) => {
  const user = await loginFunc(req.body);
  return res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**

 * @decs  register new user
 * @route /api/auth/register
 * @method post
 */

const registerUser = asyncHandler(async (req, res) => {
  const user = await registerFunc(req.body);
  return res.status(201).json({
    status: "success",
    data: { user },
  });
});



module.exports = { loginUser, registerUser };
