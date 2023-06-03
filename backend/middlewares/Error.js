const path = require("path");
// error handler
const { ErrorHandler } = require(path.join(
  process.cwd(),
  "./backend/utils/errorHandler"
));

// error formatter

const { errorFormatter } = require(path.join(
  process.cwd(),
  "./backend/utils/errorFormatter"
));

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  // CAST ERROR
  if (err.name === "CastError") {
    const message = `Resource not found`;
    err = new ErrorHandler(400, message);
  }

  // DUPLICATE KEY ERROR
  if (err.code === 11000) {
    const message = "Duplicate Key Error";
    err = new ErrorHandler(400, message);
  }

  // validation error
  if (err.name === "ValidationError") {
    const message = errorFormatter(err.message);
    err = new ErrorHandler(400, message);
  }

  // WRONG JWT ERROR
  if (err.name === "JsonWebTokenError") {
    const message = "JWT Invalid, Try Login again";
    err = new ErrorHandler(401, message);
  }

  // JWT EXPIRES ERROR
  if (err.name === "TokenExpiredError") {
    const message = "JWT Token Expired , Try Login again";
    err = new ErrorHandler(401, message);
  }

  // JWT IS NOT ACTIVE
  if (err.name === "NotBeforeError") {
    const message = "Json web token is not active, Try again";
    err = new ErrorHandler(401, message);
  }

  return res.status(err.statusCode).json({
    status: false,
    message: err.message,
  });
};

module.exports = errorMiddleware;
