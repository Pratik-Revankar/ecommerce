const express = require("express");
const {
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
} = require("../controllers/contact");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();
router.route("/:id").put(isAuthenticated, updateShippingAddress);
router.route("/new").post(isAuthenticated, addShippingAddress);
router.route("/").get(isAuthenticated, getShippingAddress);

module.exports = router;
