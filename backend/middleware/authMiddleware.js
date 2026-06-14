const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Company = require('../models/Company')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.id).select('-password')
      const company = await Company.findById(decoded.id).select('-password')
      const admin = await Admin.findById(decoded.id).select('-password')

      if (user) {
        req.user = user
        req.entityType = 'user'
      } else if (company) {
        req.user = company
        req.entityType = 'company'
      } else if (admin) {
        req.user = admin
        req.entityType = 'admin'
      } else {
        res.status(401)
        return next(new Error('Not authorized'))
      }

      req.entityId = decoded.id
      return next()
    } catch (error) {
      res.status(401)
      return next(new Error('Not authorized, token failed'))
    }
  }

  if (!token) {
    res.status(401)
    return next(new Error('Not authorized, no token'))
  }
}

const adminOnly = (req, res, next) => {
  if (req.entityType !== 'admin') {
    res.status(403)
    return next(new Error('Admin access only'))
  }
  next()
}

const companyOnly = (req, res, next) => {
  if (req.entityType !== 'company') {
    res.status(403)
    return next(new Error('Company access only'))
  }
  next()
}

module.exports = { protect, adminOnly, companyOnly }
