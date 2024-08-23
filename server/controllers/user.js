const asyncErrorHandler = require("../middleware/errorHandler");
const User = require("../models/user");
const ErrorHandler = require("../utils/error");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const user = await User.create(req.body);
    sendToken(user, 201, res);
    next();
  } else {
    return next(new ErrorHandler("User Already Exists", 401));
  }
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const isPasswordMatched = await user?.comparePassword(password);

  if (user && isPasswordMatched) {
    sendToken(user, 200, res);
  } else {
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 401));
    }

    if (!user) {
      return next(new ErrorHandler("Email doesn't exists", 401));
    }

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  }
});

exports.logout = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/password/reset/${resetToken}`;

  console.log(resetPasswordUrl);
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: `Ecommerce Password Recovery`,
  //     message,
  //   });

  //   res.status(200).json({
  //     success: true,
  //     message: `Email sent to ${user.email} successfully`,
  //   });
  // } catch (error) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;

  //   await user.save({ validateBeforeSave: false });

  //   return next(new ErrorHandler(error.message, 500));
  // }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // console.log(passwordResetToken);

  console.log(new Date().toISOString());

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, 200, res);
});

exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user?.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
  const newProfileData = {
    firstName: req.body.firstName,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newProfileData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
