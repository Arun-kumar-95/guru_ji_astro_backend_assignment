// require path module
const path = require("path");
const crypto = require("crypto");

//******************* * REQUIRING THE SCHEMAS   ***********************//

const userSchema = require(path.join(process.cwd(), "./backend/models/User"));

// ERROR HANDLER
const { ErrorHandler } = require(path.join(
  process.cwd(),
  "./backend/utils/errorHandler"
));

// MESSAGE HANDLER
const SuccessMessage = require(path.join(
  process.cwd(),
  "./backend/utils/message"
));

// CATCH ASYNC MIDDLEWARE
const { CatchAsyncError } = require(path.join(
  process.cwd(),
  "./backend/middlewares/CatchAsyncError"
));

// SEND TOKEN
const sendToken = require(path.join(
  process.cwd(),
  "./backend/utils/sendToken"
));

const { SendMail } = require(path.join(
  process.cwd(),
  "./backend/utils/sendMail"
));
// ***** REGISTER USER ****//

module.exports.register = CatchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // FIND THE TOTAL DOCS AND IF THE DOC LENGTH IS  0 THEN CREATE FIRST ADMIN

  const totalUsers = await userSchema.countDocuments();
  console.log(!totalUsers);

  if (totalUsers) {
    // find the user using email
    let user = await userSchema.findOne({ email });
    //   if we find the user
    if (user) {
      return next(new ErrorHandler(404, "User Exists, Try login"));
    }
    //  create a user
    user = await userSchema.create({
      name,
      password,

      email,
    });

    // save the user doc inside mongodb
    await user.save();
  } else {
    // CREATE FIRST ADMIN
    user = await userSchema.create({
      name,
      password,
      email,
      role: "Admin",
    });

    // save the user doc inside mongodb
    await user.save();
  }

  return SuccessMessage(201, "Registered Successfully", res);
});

// ***** LOGIN USER ****//

module.exports.login = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //find the user based on email
  if (!email || !password) {
    return next(new ErrorHandler(400, "Invalid Fields"));
  }

  let user = await userSchema.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler(404, "Invalid User"));
  }

  // if user exists
  if (user) {
    //  check for password by call match function
    const isMatch = await user.matchPassword(req.body.password);

    if (!isMatch) {
      return next(new ErrorHandler(403, "Incorrect email or password"));
    }
    // if password match then generate the token
    sendToken(res, 200, user);
  }
});

// ***** LOGOUT USER ****//

module.exports.logout = CatchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return SuccessMessage(200, "Logout successfully", res);
});

// Get User Detail
module.exports.getUserDetails = CatchAsyncError(async (req, res, next) => {
  const user = await userSchema.findById(req.user._id).select("name email");
  res.status(200).json({
    success: true,
    user,
  });
});

// update user details

module.exports.updateUser = CatchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  await userSchema.updateOne(
    { _id: req.user._id },
    {
      $set: {
        name,
        email,
      },
    },
    {
      new: true,
      runvalidator: true,
      upsert: true,
    }
  );
  return SuccessMessage(200, "User detail Updated", res);
});

// GENERATE LINK FOR RESET NEW PASSWORD
module.exports.forgotPassword = CatchAsyncError(async (req, res, next) => {
  //  find the user via email
  const user = await userSchema.findOne({ email: req.body.email });
  // if user not found
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  // get rest password token
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBefore: false });

  // generate the reset password url
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/app/v1/reset-password/${resetToken}`;

  const mailMessage = `Your password reset token is: \n\n${resetPasswordUrl}`;

  try {
    await SendMail({
      email: user.email,
      subject: "Reset Your Password",
      mailMessage,
    });

    return SuccessMessage(200, `Email Send To:${user.email} `, res);
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    //  save the user
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(500, err.message));
  }
});

// GENERATE LINK FOR RESET NEW PASSWORD
module.exports.resetPassword = CatchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await userSchema.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(400, "Reset Password Token Is Invalid Or Expired")
    );
  }

  // user

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  sendToken(res, 201, user);
});

// ****    ADMIN  PART      ******//

module.exports.getDshboardInfo = CatchAsyncError(async (req, res, next) => {
  let users = await userSchema.find({ role: "user" });

  return res.status(200).json({
    success: true,
    data: {
      totalUsers: users.length,
    },
  });
});
