const path = require("path");
// ERROR HANDLER
const { ErrorHandler } = require(path.join(
  process.cwd(),
  "./backend/utils/errorHandler"
));

module.exports.AuthorizedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          403,
          `Role ${req.user.role} not allowed`
        )
      );
    }
    // passing the next function if included
    next();
  };
};
