const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
} = require('../controllers/serviceRequestController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Optional auth: if a valid Bearer token is present, populate req.user;
// if missing or invalid, proceed without auth (frontend sends locked body data).
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      if (user) {
        req.user = user
        req.entityType = 'user'
      }
    } catch (_) {
      // Token invalid or user gone — ignore, use body data
    }
  }
  next()
}

router.post('/', optionalAuth, createServiceRequest)
router.get('/', protect, adminOnly, getServiceRequests)
router.get('/:id', protect, getServiceRequestById)
router.patch('/:id/status', protect, adminOnly, updateServiceRequestStatus)

module.exports = router
