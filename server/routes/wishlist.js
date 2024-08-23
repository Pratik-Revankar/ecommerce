const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlist");

const router = express.Router();

router.route("/add").post(isAuthenticated, addToWishlist);
router.route("/remove/:id").delete(isAuthenticated, removeFromWishlist);
router.route("/").get(isAuthenticated, getWishlist);

module.exports = router;
