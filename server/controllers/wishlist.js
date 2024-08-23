const wishlist = require("../models/wishlist");

const asyncErrorHandler = require("../middleware/errorHandler");

exports.addToWishlist = asyncErrorHandler(async (req, res, next) => {
  const list = await wishlist.create({
    ...req.body,
    user: "668f7828514ceee74b83eaad",
  });

  const item = await list.populate("product");
  res.status(201).json({
    success: true,
    item,
  });
});

exports.removeFromWishlist = asyncErrorHandler(async (req, res, next) => {
  const list = await wishlist.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    list,
  });
});

exports.getWishlist = asyncErrorHandler(async (req, res, next) => {
  const list = await wishlist.find({ user: req.user.id }).populate("product");

  res.status(200).json({
    success: true,
    list,
  });
});
