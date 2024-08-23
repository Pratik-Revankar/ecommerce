class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    // console.log(this.query, queryStr);
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          title: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    // console.log(this.query);
    return this;
  }

  filter() {
    const queryStrCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "brand", "category"];

    removeFields.forEach((key) => delete queryStrCopy[key]);

    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    // console.log(queryStr, JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  brand() {
    const queryStrCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "price", "category"];
    removeFields.forEach((key) => delete queryStrCopy[key]);
    // console.log(queryStrCopy);
    if (queryStrCopy.brand) {
      this.query = this.query.find({
        brand: { $in: queryStrCopy.brand.split(",") },
      });
      // console.log("nlcn");
      return this;
    }
    return this;
  }

  category() {
    const queryStrCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "price", "brand"];
    removeFields.forEach((key) => delete queryStrCopy[key]);
    // console.log(queryStrCopy);
    if (queryStrCopy.category) {
      this.query = this.query.find(queryStrCopy);
      return this;
    }
    return this;
  }

  pagination(productsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = productsPerPage * (currentPage - 1);

    this.query = this.query.limit(productsPerPage).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;
