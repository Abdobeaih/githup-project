const User = require('../models/User')
const APIFeatures = require('../utils/apiFeatures')

const getUsers = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find().lean(), req.query).filter().search(['name', 'email', 'phone']).sort().paginate()
    const users = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: users, ...pagination })
  } catch (error) { next(error) }
}

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean()
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
    const stats = await User.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { isActive: true } }, { $count: 'count' }],
          elite: [{ $match: { plan: 'elite' } }, { $count: 'count' }],
          premium: [{ $match: { plan: 'premium' } }, { $count: 'count' }],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ['$total.count', 0] },
          active: { $arrayElemAt: ['$active.count', 0] },
          elite: { $arrayElemAt: ['$elite.count', 0] },
          premium: { $arrayElemAt: ['$premium.count', 0] },
        },
      },
    ])
    const data = stats[0] || { total: 0, active: 0, elite: 0, premium: 0 }
    res.json({ success: true, data })
  } catch (error) { next(error) }
}

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, getUserStats }
