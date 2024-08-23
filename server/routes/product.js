const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductDetails,
  getProductsByCategory,
  fetchAllProducts,
  getCategories,
  getBrandsByCategory,
} = require("../controllers/product");
const { isAuthenticated, isAuthorized } = require("../middleware/auth");

const router = express.Router();
router.route("/categories").get(getCategories);
router.route("/brands").get(getBrandsByCategory);
router.route("/").get(getAllProducts);
router.route("/").post(isAuthenticated, isAuthorized("admin"), createProduct);
router.route("/:id").get(getProductDetails);

module.exports = router;
