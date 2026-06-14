class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
    excludedFields.forEach(field => delete queryObj[field])

    // Advanced filtering (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  search(fields) {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, 'i')
      const orConditions = fields.map(field => ({ [field]: regex }))
      this.query = this.query.find({ $or: orConditions })
    }
    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1
    const limit = parseInt(this.queryString.limit) || 20
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }

  async count() {
    const total = await this.query.model.countDocuments(this.query._conditions)
    const page = parseInt(this.queryString.page) || 1
    const limit = parseInt(this.queryString.limit) || 20
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    }
  }
}

module.exports = APIFeatures
