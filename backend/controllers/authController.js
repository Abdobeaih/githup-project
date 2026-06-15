const User = require('../models/User')
const Company = require('../models/Company')
const Admin = require('../models/Admin')
const Enrollment = require('../models/Enrollment')
const Otp = require('../models/Otp')
const generateToken = require('../utils/generateToken')
const {
  sendForgotPasswordOtp,
  sendSignupOtp,
  sendPasswordResetConfirmation,
  sendWelcomeEmail,
} = require('../utils/sendEmail')

// ─── Helpers ──────────────────────────────────────────────────────

/** Look up the user's display name for a given email + role. */
async function findUserName(email, role) {
  let entity
  if (role === 'user') entity = await User.findOne({ email }).select('name')
  else if (role === 'company') entity = await Company.findOne({ email }).select('name')
  else if (role === 'admin') entity = await Admin.findOne({ email }).select('name')
  return entity?.name || 'صديق Freelancer360'
}

/** Generate a 6‑digit OTP code as a string. */
function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/** Create and persist an OTP document (code is auto‑hashed by the model pre‑save hook). */
async function createOtp(email, role, code) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min
  return Otp.create({ email, role, code, expiresAt })
}

// ─── POST /api/auth/login ─────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Try User first
    let entity = await User.findOne({ email })
    if (entity && (await entity.matchPassword(password))) {
      return res.json({
        success: true,
        data: {
          user: { id: entity._id, name: entity.name, email: entity.email, phone: entity.phone, nationalId: entity.nationalId, job: entity.job, plan: entity.plan, governorate: entity.governorate, scans: entity.scans, saved: entity.saved, points: entity.points, role: 'user', isActive: entity.isActive, join_date: entity.createdAt },
          token: generateToken(entity._id),
          role: 'user',
        },
      })
    }

    // Try Company
    entity = await Company.findOne({ email })
    if (entity && (await entity.matchPassword(password))) {
      return res.json({
        success: true,
        data: {
          user: { ...entity.toObject(), role: 'company' },
          token: generateToken(entity._id),
          role: 'company',
        },
      })
    }

    // Try Admin
    entity = await Admin.findOne({ email })
    if (entity && (await entity.matchPassword(password))) {
      return res.json({
        success: true,
        data: {
          user: { ...entity.toObject(), role: 'admin' },
          token: generateToken(entity._id),
          role: 'admin',
        },
      })
    }

    // No match in any collection
    res.status(401)
    throw new Error('Invalid email or password')
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/auth/register ──────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, phone, nationalId, job, password, plan, governorate, center_id, bank_id } = req.body

    if (!name || !email || !phone || !nationalId || !job || !password || !governorate) {
      res.status(400)
      throw new Error('All required fields must be provided')
    }

    const trimmedName = String(name).trim()
    const trimmedEmail = String(email).trim().toLowerCase()
    const trimmedPhone = String(phone).trim()
    const trimmedNationalId = String(nationalId).trim()
    const trimmedJob = String(job).trim()
    const trimmedGovernorate = String(governorate).trim()
    const validPlan = ['free', 'premium', 'elite'].includes(plan) ? plan : 'free'

    const existingUser = await User.findOne({ email: trimmedEmail })
    if (existingUser) {
      res.status(400)
      throw new Error('Email already exists')
    }

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      nationalId: trimmedNationalId,
      job: trimmedJob,
      password,
      plan: validPlan,
      governorate: trimmedGovernorate,
    })

    if ((validPlan === 'premium' || validPlan === 'elite') && (center_id || bank_id)) {
      const serviceType = center_id && bank_id ? 'combined' : center_id ? 'medical' : 'financial'
      await Enrollment.create({
        user_id: user._id,
        service_type: serviceType,
        center_id: center_id || null,
        bank_id: bank_id || null,
      })
    }

    // ── Send signup OTP for email verification ──
    const code = generateOtpCode()
    await createOtp(trimmedEmail, 'user', code)
    await sendSignupOtp(trimmedName, trimmedEmail, code)

    res.status(201).json({
      success: true,
      message: 'Account created. A verification code has been sent to your email.',
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, nationalId: user.nationalId, job: user.job, plan: user.plan, governorate: user.governorate, scans: user.scans, saved: user.saved, points: user.points, role: user.role, isActive: user.isActive },
        token: generateToken(user._id),
        role: 'user',
      },
    })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/auth/forgot-password ───────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email, role } = req.body
    if (!email || !role) {
      res.status(400)
      throw new Error('Email and role are required')
    }

    // Invalidate any previous unverified OTPs for this email+role
    await Otp.deleteMany({ email, role, verified: false })

    // Generate + persist OTP (auto-hashed by model)
    const code = generateOtpCode()
    await createOtp(email, role, code)

    // Send real email — no console.log fallback
    const name = await findUserName(email, role)
    const emailResult = await sendForgotPasswordOtp(name, email, code)

    if (!emailResult.success) {
      await Otp.deleteMany({ email, role })
      res.status(500)
      throw new Error('Failed to send verification email. Please try again later.')
    }

    res.json({
      success: true,
      message: 'A verification code has been sent to your email.',
    })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/auth/verify-otp ────────────────────────────────────
const verifyOtp = async (req, res, next) => {
  try {
    const { email, role, code } = req.body
    if (!email || !role || !code) {
      res.status(400)
      throw new Error('Email, role, and verification code are required')
    }

    // Fetch the most recent unverified OTP for this email+role
    const otp = await Otp.findOne({ email, role, verified: false }).sort({ createdAt: -1 })

    if (!otp) {
      res.status(400)
      throw new Error('Invalid or expired verification code')
    }

    // Check expiration
    if (new Date() > otp.expiresAt) {
      await Otp.deleteOne({ _id: otp._id })
      res.status(400)
      throw new Error('Verification code has expired')
    }

    // Compare using bcrypt (stored hash vs plain-text input)
    const isMatch = await otp.compareCode(code)
    if (!isMatch) {
      otp.attempts += 1
      await otp.save()

      if (otp.attempts >= 5) {
        await Otp.deleteOne({ _id: otp._id })
        res.status(400)
        throw new Error('Too many failed attempts. Please request a new code.')
      }

      res.status(400)
      throw new Error('Invalid verification code')
    }

    // Mark as verified
    otp.verified = true
    await otp.save()

    res.json({
      success: true,
      message: 'Code verified successfully. You can now reset your password.',
    })
  } catch (error) {
    next(error)
  }
}

// ─── PUT /api/auth/reset-password ─────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password || !role) {
      res.status(400)
      throw new Error('Email, password, and role are required')
    }

    if (password.length < 6) {
      res.status(400)
      throw new Error('Password must be at least 6 characters')
    }

    // Require OTP verification before reset
    const verifiedOtp = await Otp.findOne({ email, role, verified: true })
    if (!verifiedOtp) {
      res.status(400)
      throw new Error('Please verify your email with the code first')
    }

    let entity
    if (role === 'user') entity = await User.findOne({ email })
    else if (role === 'company') entity = await Company.findOne({ email })
    else if (role === 'admin') entity = await Admin.findOne({ email })

    if (entity) {
      entity.password = password
      await entity.save()
    }

    // Send confirmation email
    const name = await findUserName(email, role)
    await sendPasswordResetConfirmation(name, email)

    // Clean up used OTPs
    await Otp.deleteMany({ email, role })

    res.json({
      success: true,
      message: 'Password has been reset successfully.',
    })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/auth/send-signup-otp ───────────────────────────────
const sendSignupOtpCode = async (req, res, next) => {
  try {
    const { email, name, role } = req.body
    if (!email || !name) {
      res.status(400)
      throw new Error('Email and name are required')
    }

    const userRole = role || 'user'

    // Invalidate old OTPs
    await Otp.deleteMany({ email, role: userRole, verified: false })

    // Generate + persist
    const code = generateOtpCode()
    await createOtp(email, userRole, code)

    // Send email
    const emailResult = await sendSignupOtp(name, email, code)
    if (!emailResult.success) {
      await Otp.deleteMany({ email, role: userRole })
      res.status(500)
      throw new Error('Failed to send verification code. Please try again later.')
    }

    res.json({
      success: true,
      message: 'A verification code has been sent to your email.',
    })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/auth/verify-email ──────────────────────────────────
const verifyEmail = async (req, res, next) => {
  try {
    const { email, role, code } = req.body
    if (!email || !code) {
      res.status(400)
      throw new Error('Email and verification code are required')
    }

    const userRole = role || 'user'

    const otp = await Otp.findOne({ email, role: userRole, verified: false }).sort({ createdAt: -1 })
    if (!otp) {
      res.status(400)
      throw new Error('Invalid or expired verification code')
    }

    if (new Date() > otp.expiresAt) {
      await Otp.deleteOne({ _id: otp._id })
      res.status(400)
      throw new Error('Verification code has expired')
    }

    const isMatch = await otp.compareCode(code)
    if (!isMatch) {
      otp.attempts += 1
      await otp.save()

      if (otp.attempts >= 5) {
        await Otp.deleteOne({ _id: otp._id })
        res.status(400)
        throw new Error('Too many failed attempts. Please request a new code.')
      }

      res.status(400)
      throw new Error('Invalid verification code')
    }

    otp.verified = true
    await otp.save()

    // Send welcome email on successful verification
    const name = await findUserName(email, userRole)
    await sendWelcomeEmail(name, email)

    // Clean up used OTPs
    await Otp.deleteMany({ email, role: userRole })

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to Freelancer360.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  signup,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
  sendSignupOtpCode,
  verifyEmail,
}
