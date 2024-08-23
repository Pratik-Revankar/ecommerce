const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateProfile,
} = require("../controllers/user");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").patch(resetPassword);

router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/password/change").patch(isAuthenticated, changePassword);
router.route("/update/profile").put(isAuthenticated, updateProfile);

module.exports = router;
