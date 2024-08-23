const ErrorHandler = require("../utils/error");

const asyncErrorHandler = require("./errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.isAuthenticated = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Not autho", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodedData.id) {
    return next(new ErrorHandler("Not autho", 401));
  }

  req.user = await User.findById(decodedData.id);

  next();
});

exports.isAuthorized = (...role) =>
  asyncErrorHandler(async (req, res, next) => {
    console.log(req.user);
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not authorized to access this resouce`,
          403
        )
      );
    }
    next();
  });
