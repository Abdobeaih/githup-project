const express = require('express')
const router = express.Router()
const {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
} = require('../controllers/serviceRequestController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/', createServiceRequest)
router.get('/', protect, adminOnly, getServiceRequests)
router.get('/:id', protect, getServiceRequestById)
router.patch('/:id/status', protect, adminOnly, updateServiceRequestStatus)

module.exports = router
