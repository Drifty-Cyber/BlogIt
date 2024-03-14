class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A) FILTERING             e.g.  ENDPOINT//localhost://3000/api/v1/pets?duration=5&difficulty=easy
    const queryObj = { ...this.queryString }; //e.g. { duration: { gte: '5' }, difficulty: 'easy', sort: '1', limit: '2' }
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); //e.g. { duration: { gte: '5' }, difficulty: 'easy' } After Exclusion
    // REMEMBER console.log(req.query, queryObj);

    //1B) ADVANCED FILTERING     e.g.  ENDPOINT//localhost://3000/api/v1/pets?duration=5&difficulty=easy&price[gte]=400
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // REMEMBER console.log(JSON.parse(queryStr)); //E.G. ---------- { duration: { '$gte': '5' }, difficulty: 'easy' }

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //2) SORTING     e.g.  ENDPOINT//localhost://3000/api/v1/tours?sort=price     //Returns based on price in ascending order
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      //ADDING A DEFAULT SORT query
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    //3) FIELD LIMITING    e.g.  ENDPOINT//localhost://3000/api/v1/tours?fields=price,name     //Returns based on selected fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //EXCLUDING __V FIELD
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //4) PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
