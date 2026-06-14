const User = require('../models/User')
const APIFeatures = require('../utils/apiFeatures')

const getUsers = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find(), req.query).filter().search(['name', 'email', 'phone']).sort().paginate()
    const users = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: users, ...pagination })
  } catch (error) { next(error) }
}

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) { res.status(404); throw new Error('User not found') }
    res.json({ success: true, data: user })
  } catch (error) { next(error) }
}

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) { next(error) }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password')
    if (!user) { res.status(404); throw new Error('User not found') }
    res.json({ success: true, data: user })
  } catch (error) { next(error) }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) { res.status(404); throw new Error('User not found') }
    res.json({ success: true, message: 'User deleted' })
  } catch (error) { next(error) }
}

const getUserStats = async (req, res, next) => {
  try {
    const total = await User.countDocuments()
    const active = await User.countDocuments({ isActive: true })
    const elite = await User.countDocuments({ plan: 'elite' })
    const premium = await User.countDocuments({ plan: 'premium' })
    res.json({ success: true, data: { total, active, elite, premium } })
  } catch (error) { next(error) }
}

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, getUserStats }
