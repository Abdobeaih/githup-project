const express = require('express')
const router = express.Router()
const { getDiscounts, getDiscount, createDiscount, updateDiscount, deleteDiscount, approveDiscount, rejectDiscount, getDiscountScans, recordScan, incrementViews, getDiscountBranches, setDiscountBranches } = require('../controllers/discountController')
const { protect, adminOnly, companyOnly } = require('../middleware/authMiddleware')

router.route('/').get(protect, getDiscounts).post(protect, companyOnly, createDiscount)
router.get('/:id/scans', protect, adminOnly, getDiscountScans)
router.post('/:id/scan', protect, recordScan)
router.post('/:id/views', protect, incrementViews)
router.put('/:id/approve', protect, adminOnly, approveDiscount)
router.put('/:id/reject', protect, adminOnly, rejectDiscount)
router.get('/:id/branches', protect, getDiscountBranches)
router.put('/:id/branches', protect, setDiscountBranches)
router.route('/:id').get(protect, getDiscount).put(protect, updateDiscount).delete(protect, deleteDiscount)

module.exports = router
