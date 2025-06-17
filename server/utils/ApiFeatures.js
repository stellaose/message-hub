class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              firstName: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              phoneNumber: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              companyName: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              profession: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              email: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };


    // ! remove fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach(key => delete queryCopy[key]);

    // + filter category for price and rating
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;
