const User = require('../models/User')
const Company = require('../models/Company')
const Admin = require('../models/Admin')
const Enrollment = require('../models/Enrollment')
const generateToken = require('../utils/generateToken')

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    let entity

    if (role === 'user') {
      entity = await User.findOne({ email })
      if (entity && (await entity.matchPassword(password))) {
        res.json({
          success: true,
          data: {
            user: { id: entity._id, name: entity.name, email: entity.email, phone: entity.phone, nationalId: entity.nationalId, job: entity.job, plan: entity.plan, governorate: entity.governorate, scans: entity.scans, saved: entity.saved, points: entity.points, role: entity.role, isActive: entity.isActive, join_date: entity.createdAt },
            token: generateToken(entity._id),
            role: 'user',
          },
        })
      } else {
        res.status(401)
        throw new Error('Invalid email or password')
      }
    } else if (role === 'company') {
      entity = await Company.findOne({ email })
      if (entity && (await entity.matchPassword(password))) {
        res.json({
          success: true,
          data: {
            user: entity,
            token: generateToken(entity._id),
            role: 'company',
          },
        })
      } else {
        res.status(401)
        throw new Error('Invalid email or password')
      }
    } else if (role === 'admin') {
      entity = await Admin.findOne({ email })
      if (entity && (await entity.matchPassword(password))) {
        res.json({
          success: true,
          data: {
            user: entity,
            token: generateToken(entity._id),
            role: 'admin',
          },
        })
      } else {
        res.status(401)
        throw new Error('Invalid email or password')
      }
    } else {
      res.status(400)
      throw new Error('Invalid role')
    }
  } catch (error) {
    next(error)
  }
}

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

    res.status(201).json({
      success: true,
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

const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email, role } = req.body
    if (!email || !role) {
      res.status(400)
      throw new Error('Email and role are required')
    }

    let entity
    if (role === 'user') entity = await User.findOne({ email })
    else if (role === 'company') entity = await Company.findOne({ email })
    else if (role === 'admin') entity = await Admin.findOne({ email })

    if (!entity) {
      res.status(404)
      throw new Error('No account found with this email')
    }

    // In production, generate a reset token and send email
    // For demo, we just confirm the email exists
    res.json({
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    })
  } catch (error) {
    next(error)
  }
}

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

    let entity
    if (role === 'user') entity = await User.findOne({ email })
    else if (role === 'company') entity = await Company.findOne({ email })
    else if (role === 'admin') entity = await Admin.findOne({ email })

    if (!entity) {
      res.status(404)
      throw new Error('No account found with this email')
    }

    entity.password = password
    await entity.save()

    res.json({
      success: true,
      message: 'Password has been reset successfully.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { login, signup, getMe, forgotPassword, resetPassword }
