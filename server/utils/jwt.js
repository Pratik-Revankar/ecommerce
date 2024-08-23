// const cookieParser = require("cookie-parser");
// const express = require("express");
// const app = express();
// app.use(cookieParser());

const sendToken = (user, statusCode, res) => {
  const token = user.generateJWT();
  console.log("hi");
  const { firstName, email, role, cart, wishList, _id } = user;

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("token", token, options);
  console.log(statusCode);
  res.status(statusCode).json({
    success: true,
    user: { firstName, email, role, cart, wishList, _id },
    token,
  });
};

module.exports = sendToken;
