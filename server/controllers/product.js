const asyncErrorHandler = require("../middleware/errorHandler");
const Product = require("../models/product");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/error");

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  //Search
  const productsPerPage = 10;
  const totalProducts = await Product.countDocuments();
  const apifeature = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .brand()
    .category();
  // .pagination(productsPerPage);
  const product = await apifeature.query;
  res.status(200).json({
    success: true,
    product,
    totalProducts,
  });
});

exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// exports.fetchAllProducts = async (req, res) => {
//   // filter = {"category":["smartphone","laptops"]}
//   // sort = {_sort:"price",_order="desc"}
//   // pagination = {_page:1,_limit=10}

//   let query = Product.find({});

//   if (req.query.category) {
//     console.log(req.query.category);
//     query = query.find({ category: req.query.category });
//   }
//   if (req.query.brand) {
//     query = query.find({ brand: { $in: req.query.brand.split(",") } });
//   }

//   if (req.query.sort && req.query.order) {
//     query = query.sort({ [req.query.sort]: req.query.order });
//   }

//   // if (req.query.page && req.query.limit) {
//   //   const pageSize = req.query._limit;
//   //   const page = req.query._page;
//   //   query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   // }

//   try {
//     const docs = await query.exec();
//     // res.set("X-Total-Count", totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

exports.getCategories = asyncErrorHandler(async (req, res, next) => {
  const categories = await Product.find({}, { category: 1 }).distinct(
    "category"
  );

  res.status(200).json({
    success: true,
    categories,
  });
});

exports.getBrandsByCategory = asyncErrorHandler(async (req, res, next) => {
  const brands = await Product.find(
    { category: req.query.category },
    { brand: 1 }
  ).distinct("brand");

  res.status(200).json({
    success: true,
    brands,
  });
});
