const express = require("express");
const { newOrder, myOrders, getOrderDetails } = require("../controllers/order");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.route("/new").post(isAuthenticated, newOrder);
router.route("/myOrders").get(isAuthenticated, myOrders);
router.route("/:id").get(isAuthenticated, getOrderDetails);

module.exports = router;
