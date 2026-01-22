const jwt = require("jsonwebtoken");
const { FailError } = require("./errors");

const { User } = require("../models/users-model");

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    throw new FailError("no token provided", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_PASSWORD);
    req.user = decoded;
  } catch (err) {
    throw new FailError(err, 401);
  }


  const user = await User.findById(req.user._id);
  if (!user) {
    throw new FailError("you User no longer exists", 401);
  }

  next();
};

const verifyTokenForAdmin = function (req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      throw new FailError("you are not admin,only admin can make this", 403);
    } else {
      next();
    }
  });
};

const verifyTokenForAuthOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin && req.params.id !== req.user._id) {
      throw new FailError(
        "you are not allowed to make that for another user",
        403,
      );
    } else {
      next();
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
};
