const express = require('express')
const router = express.Router()
const {
  login,
  signup,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  sendSignupOtpCode,
  verifyEmail,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/login', login)
router.post('/register', signup)

// Email verification flows
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.put('/reset-password', resetPassword)

// Signup email verification
router.post('/send-signup-otp', sendSignupOtpCode)
router.post('/verify-email', verifyEmail)

router.get('/me', protect, getMe)

module.exports = router
