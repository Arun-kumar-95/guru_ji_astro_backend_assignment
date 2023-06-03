const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, "Enter full name"],
    match: [/^[a-zA-Z]+ [a-zA-Z]+$/, "Enter valid name"],
  },
  email: {
    type: String,
    required: ["Please enter your email address", true],
    unique: ["Email already taken", true],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Enter valid email address",
    ],
  },
  password: {
    type: String,
    required: ["Enter your password", true],
    select: false,
    minLength: [6, "Password must be of 6 character"],
    trim: true,
  },

  role:{
    type:String,
    default: "user"
  },
  
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],


  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date(Date.now()),
  },
});

// METHODS

userSchema.pre("save", async function (next) {
  // create the salt
  let salt = await bcrypt.genSalt(10);
  // modify password field only is password field is changed
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// matchPassword
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate token

userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// reset password token
userSchema.methods.getResetPasswordToken = async function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hashing and adding reset password token to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
