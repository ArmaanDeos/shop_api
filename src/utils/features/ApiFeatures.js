class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Searching Product Feature
  searchProduct() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Fitering Product Feature
  filterProduct() {
    const queryCopy = { ...this.queryStr };

    // Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for price
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Pagination Feature
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
export { ApiFeatures };
