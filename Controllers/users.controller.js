const asyncHandler = require("express-async-handler");

const {
  getAllUsersFunc,
  getUserFunc,
  updateUserFunc,
  deleteUserFunc,
} = require("../services/users.services");
/**
 * @decs  get all users
 * @route /api/users/
 * @method get
 * @access admin
 */

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersFunc();

  return res.status(200).json({
    status: "success",
    data: { users },
  });
});

/**

 * @decs  get user by id
 * @route /api/users/:id
 * @method get
* @access admin or auth 
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await getUserFunc(req.params.id);
  return res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**

 * @decs  update a user by id
 * @route /api/users/:id
 * @method put
* @access admin or auth 
 */

const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserFunc(req.params.id, req.body);

  return res.status(200).json({
    status: "success",
    data: { user: user },
  });
});

/**

 * @decs  delete a user by id
 * @route /api/users/:id
 * @method delete
* @access admin or auth 
 */
const deleteUser = asyncHandler(async (req, res) => {
  const deleted = await deleteUserFunc(req.params.id);

  return res.status(200).json({
    status: "success",
    data: deleted,
  });
});

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
