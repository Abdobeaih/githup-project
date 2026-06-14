const express = require('express')
const router = express.Router()
const { getDashboardStats, getRevenueDetails, getCompanyAnalytics, getDiscountUsageDetail } = require('../controllers/analyticsController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/dashboard', protect, adminOnly, getDashboardStats)
router.get('/revenue', protect, adminOnly, getRevenueDetails)
router.get('/company/:companyId', protect, getCompanyAnalytics)
router.get('/discount/:id/usage', protect, getDiscountUsageDetail)

module.exports = router
