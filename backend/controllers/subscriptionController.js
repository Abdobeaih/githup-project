const UserSubscription = require('../models/UserSubscription')
const SubscriptionPlan = require('../models/SubscriptionPlan')
const APIFeatures = require('../utils/apiFeatures')

const getMySubscription = async (req, res, next) => {
  try {
    const sub = await UserSubscription.findOne({ userId: req.entityId, status: 'ACTIVE' }).populate('planId')
    if (!sub) { return res.json({ success: true, data: null }) }
    res.json({ success: true, data: sub })
  } catch (error) { next(error) }
}

const getSubscriptionHistory = async (req, res, next) => {
  try {
    const subs = await UserSubscription.find({ userId: req.entityId }).populate('planId').sort('-createdAt')
    res.json({ success: true, data: subs })
  } catch (error) { next(error) }
}

const createSubscription = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findById(req.body.planId)
    if (!plan) { res.status(404); throw new Error('Plan not found') }

    const existing = await UserSubscription.findOne({ userId: req.entityId, status: 'ACTIVE' })
    if (existing) {
      res.status(400)
      throw new Error('Already have an active subscription')
    }

    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + plan.durationDays)

    const sub = await UserSubscription.create({
      userId: req.entityId,
      planId: plan._id,
      status: 'ACTIVE',
      startDate: now,
      endDate: endDate,
      price: plan.price,
      paymentMethod: req.body.paymentMethod,
      autoRenew: req.body.autoRenew || false,
    })

    res.status(201).json({ success: true, data: sub })
  } catch (error) { next(error) }
}

const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await UserSubscription.findByIdAndUpdate(req.params.id, { status: 'CANCELLED' }, { new: true })
    if (!sub) { res.status(404); throw new Error('Subscription not found') }
    res.json({ success: true, data: sub })
  } catch (error) { next(error) }
}

const getAllSubscriptions = async (req, res, next) => {
  try {
    const features = new APIFeatures(UserSubscription.find().populate('userId', 'name email').populate('planId', 'name price'), req.query).filter().sort().paginate()
    const subs = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: subs, ...pagination })
  } catch (error) { next(error) }
}

module.exports = { getMySubscription, getSubscriptionHistory, createSubscription, cancelSubscription, getAllSubscriptions }
