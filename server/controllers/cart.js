const Cart = require("../models/cart");

const asyncErrorHandler = require("../middleware/errorHandler");

exports.getUserCartDetails = asyncErrorHandler(async (req, res, next) => {
  const cartDetails = await Cart.find({ user: req.user.id }).populate(
    "product"
  );
  res.status(200).json({
    success: true,
    cartDetails,
  });
});

exports.addCartItem = asyncErrorHandler(async (req, res, next) => {
  const cartItem = await Cart.create({
    ...req.body,
    user: "668f7828514ceee74b83eaad",
  });

  const doc = await cartItem.save();
  const cart = await doc.populate("product");
  res.status(201).json({
    success: true,
    cart,
  });
});

exports.removeCartItem = asyncErrorHandler(async (req, res, next) => {
  const cartItem = await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    cartItem,
  });
});
exports.updateCartItem = asyncErrorHandler(async (req, res, next) => {
  const cartItem = await Cart.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({
    success: true,
    cartItem,
  });
});
