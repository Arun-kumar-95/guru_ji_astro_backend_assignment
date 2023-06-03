class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // MAKING FUNCTION SEARCH
  search() {
    const keyword = this.queryStr.search
      ? {
          todo: {
            $regex: this.queryStr.search,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // FILTER BY CATEGORY ANS STATUS

  filter() {
    const queryCopy = { ...this.queryStr };
    // remove the fields
    const removeField = ["search", "page"];
    removeField.forEach((key) => delete queryCopy[key]);

    // FILTER FOR PRICE AND RATING
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // MAKING PAGINATION

  pagination(resultPerPage) {
    //  GET THE INITIAL PAGE
    const currentPage = Number(this.queryStr.page) || 1;
    // DEFINING THE RESULT PER PAGE
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
