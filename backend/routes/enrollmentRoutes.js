const express = require('express')
const router = express.Router()
const { getEnrollments, getMyEnrollments, enrollInService, confirmEnrollment, getMedicalCenters, getBanks } = require('../controllers/enrollmentController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', protect, adminOnly, getEnrollments)
router.get('/my', protect, getMyEnrollments)
router.post('/', protect, enrollInService)
router.post('/confirm', protect, confirmEnrollment)
router.get('/medical-centers', protect, getMedicalCenters)
router.get('/banks', protect, getBanks)

module.exports = router
