const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("wishlist", wishlistSchema);
