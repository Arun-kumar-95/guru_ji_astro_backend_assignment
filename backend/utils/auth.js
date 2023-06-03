const path = require("path");
const jwt = require("jsonwebtoken");
// CATCH ASYNC MIDDLEWARE
const { CatchAsyncError } = require(path.join(
  process.cwd(),
  "./backend/middlewares/CatchAsyncError"
));

// ERROR HANDLER
const { ErrorHandler } = require(path.join(
  process.cwd(),
  "./backend/utils/errorHandler"
));

// USER SCHEMA
const userSchema = require(path.join(process.cwd(), "./backend/models/User"));

module.exports.isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler(401, "Please login"));
  }

  // if we had token THEN VERIFY TOKEN
  const decode = await jwt.verify(token, process.env.JWT_SECRET);

  // fing the doctor via id and store
  req.user = await userSchema.findById(decode._id);
  next();
});
