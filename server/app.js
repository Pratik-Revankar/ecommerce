const dotenv = require("dotenv");
dotenv.config({ path: "server/config/config.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
const errorMiddleware = require("./middleware/error");

app.use(
  cors({
    origin: "https://floopkart.netlify.app",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Access-Control-Allow-Headers,Content-Type,Authorization",
  })
);

const product = require("./routes/product");
const user = require("./routes/user");
const order = require("./routes/order");
const cart = require("./routes/cart");
const contact = require("./routes/contact");
const wishlist = require("./routes/wishlist");
// const { isAuthenticated } = require("./middleware/auth");

app.use("/api/product", product);
app.use("/api/user", user);
app.use("/api/order", order);
app.use("/api/cart", cart);
app.use("/api/contact", contact);
app.use("/api/wishlist", wishlist);

app.use(errorMiddleware);
// app.use(isAuthenticated);

//Stripe Payment

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    // payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = app;
