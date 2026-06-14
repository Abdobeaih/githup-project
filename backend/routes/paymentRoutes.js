const express = require('express')
const router = express.Router()
const { getPayments, getPayment, createPayment, getMyPayments, getPaymentStats } = require('../controllers/paymentController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyPayments)
router.get('/stats', protect, adminOnly, getPaymentStats)
router.route('/').get(protect, adminOnly, getPayments).post(protect, createPayment)
router.get('/:id', protect, getPayment)

module.exports = router
