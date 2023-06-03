const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getUserDetails,
  updateUser,
  forgotPassword,
  resetPassword
} = require("../controllers/userController");

const { isAuthenticated } = require("../utils/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getUserDetails);

router.route("/profile/update").put(isAuthenticated, updateUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").put(resetPassword);

module.exports = router;
