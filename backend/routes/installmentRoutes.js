const express = require('express')
const router = express.Router()
const { getInstallments, getMyInstallments, createInstallment, payInstallment } = require('../controllers/installmentController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', protect, adminOnly, getInstallments)
router.get('/my', protect, getMyInstallments)
router.post('/', protect, createInstallment)
router.put('/:id/pay', protect, payInstallment)

module.exports = router
