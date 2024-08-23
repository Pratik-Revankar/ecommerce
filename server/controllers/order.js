const asyncErrorHandler = require("../middleware/errorHandler");
const Order = require("../models/order");

exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    shippingDetails,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingDetails,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("shippingDetails")
    .populate("orderItems");

  // const data = await doc.populate("shippingDetails");
  // const d = await data.save();
  // const orderDetails = await d.populate("orderItems");

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getOrderDetails = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});
