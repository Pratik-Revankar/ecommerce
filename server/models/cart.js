const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Cart", cartSchema);
