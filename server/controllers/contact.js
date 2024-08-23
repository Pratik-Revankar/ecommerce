const asyncErrorHandler = require("../middleware/errorHandler");
const Contact = require("../models/contact");

exports.addShippingAddress = asyncErrorHandler(async (req, res, next) => {
  const address = await Contact.create({ ...req.body, user: req.user._id });

  res.status(201).json({
    success: true,
    address,
  });
});

exports.getShippingAddress = asyncErrorHandler(async (req, res, next) => {
  const address = await Contact.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    address,
  });
});

exports.updateShippingAddress = asyncErrorHandler(async (req, res, next) => {
  const address = await Contact.findByIdAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    {
      new: true,
    }
  );
  const updatedAddress = await address.save();
  res.status(200).json({
    success: true,
    updatedAddress,
  });
  next();
});
