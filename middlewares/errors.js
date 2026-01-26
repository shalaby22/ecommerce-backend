const logger = require("../config/logger");

class FailError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = "fail";
  }
}
class serverError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
  }
}

const notFound = (req, res) => {
  throw new FailError(`Route ${req.originalUrl} not found`, 404);
};

const errHandler = (err, req, res, next) => {
  const errStatus = !err.status ? "error" : err.status;
  let statusCode;
  if (err.statusCode) {
    statusCode = +err.statusCode;
  } else if (res.statusCode === 200) {
    statusCode = 500;
  } else {
    statusCode === res.statusCode;
  }

  const message = errStatus === "fail" ? undefined : err.message;
  const data = errStatus === "fail" ? err.message : undefined;

  if (statusCode >= 500) {
    // console.error(err);
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    status: errStatus,
    message: message,
    data: data,
  });
};

module.exports = { serverError, FailError, notFound, errHandler };
