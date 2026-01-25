const jwt = require("jsonwebtoken");
const { FailError } = require("./errors");

const { User } = require("../models/users-model");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return next(new FailError("no token provided", 401));
    }
    const decoded = jwt.verify(token, process.env.TOKEN_PASSWORD);
    req.user = decoded;

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new FailError("User no longer exists", 401));
    }

    next();
  } catch (err) {
    next(new FailError("Invalid token", 401));
  }
};

const verifyTokenForAdmin = function (req, res, next) {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (!req.user.isAdmin) {
      next(new FailError("you are not admin,only admin can make this", 403));
    } else {
      next();
    }
  });
};

const verifyAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new FailError("Only admin can access this route", 403)
    );
  }
  next();
};

const verifyTokenForAuthOrAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (!req.user.isAdmin && req.params.id !== req.user._id) {
      next(
        new FailError("you are not allowed to make that for another user", 403),
      );
    } else {
      next();
    }
  });
};

const verifyAuthOrAdmin = (req, res, next) => {
    if (!req.user.isAdmin && req.params.id !== req.user._id) {
      next(
        new FailError("you are not allowed to make that for another user", 403),
      );
    } else {
      next();
    }
};

module.exports = {
  verifyToken,
  verifyTokenForAdmin,
  verifyTokenForAuthOrAdmin,
  verifyAdmin,
  verifyAuthOrAdmin
};
