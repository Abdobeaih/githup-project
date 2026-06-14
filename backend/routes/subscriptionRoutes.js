const express = require('express')
const router = express.Router()
const { getMySubscription, getSubscriptionHistory, createSubscription, cancelSubscription, getAllSubscriptions } = require('../controllers/subscriptionController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/my', protect, getMySubscription)
router.get('/history', protect, getSubscriptionHistory)
router.post('/', protect, createSubscription)
router.get('/all', protect, adminOnly, getAllSubscriptions)
router.put('/:id/cancel', protect, cancelSubscription)

module.exports = router
