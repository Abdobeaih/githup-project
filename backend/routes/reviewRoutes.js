const express = require('express')
const router = express.Router()
const { getReviews, createReview, deleteReview, getAllReviews, getSocialReviews, createSocialReview, deleteSocialReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

// Discount reviews
router.get('/discount/:discountId', protect, getReviews)
router.post('/', protect, createReview)
router.delete('/:id', protect, deleteReview)
router.get('/all', protect, getAllReviews)

// Social reviews
router.get('/social', protect, getSocialReviews)
router.post('/social', protect, createSocialReview)
router.delete('/social/:id', protect, deleteSocialReview)

module.exports = router
