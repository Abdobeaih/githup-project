const express = require('express')
const router = express.Router()
const { login, signup, getMe, forgotPassword, resetPassword } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/login', login)
router.post('/register', signup)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)
router.get('/me', protect, getMe)

module.exports = router
