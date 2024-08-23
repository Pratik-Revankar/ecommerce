const express = require("express");
const {
  addCartItem,
  getUserCartDetails,
  removeCartItem,
  updateCartItem,
} = require("../controllers/cart");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/add").post(isAuthenticated, addCartItem);
router.route("/details").get(isAuthenticated, getUserCartDetails);
router.route("/remove/:id").delete(isAuthenticated, removeCartItem);
router.route("/update/:id").patch(isAuthenticated, updateCartItem);

module.exports = router;
