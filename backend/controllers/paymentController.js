const Payment = require('../models/Payment')
const APIFeatures = require('../utils/apiFeatures')

const getPayments = async (req, res, next) => {
  try {
    const features = new APIFeatures(Payment.find().populate('user_id', 'name email'), req.query).filter().sort().paginate()
    const payments = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: payments, ...pagination })
  } catch (error) { next(error) }
}

const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user_id', 'name email')
    if (!payment) { res.status(404); throw new Error('Payment not found') }
    res.json({ success: true, data: payment })
  } catch (error) { next(error) }
}

const createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create({ ...req.body, user_id: req.entityId, transaction_id: 'TXN' + Date.now() })
    res.status(201).json({ success: true, data: payment })
  } catch (error) { next(error) }
}

const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user_id: req.entityId }).sort('-createdAt')
    res.json({ success: true, data: payments })
  } catch (error) { next(error) }
}

const getPaymentStats = async (req, res, next) => {
  try {
    const total = await Payment.countDocuments()
    const success = await Payment.countDocuments({ status: 'SUCCESS' })
    const failed = await Payment.countDocuments({ status: 'FAILED' })
    const pending = await Payment.countDocuments({ status: 'PENDING' })
    const totalRevenue = await Payment.aggregate([{ $match: { status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    res.json({ success: true, data: { total, success, failed, pending, totalRevenue: totalRevenue[0]?.total || 0 } })
  } catch (error) { next(error) }
}

module.exports = { getPayments, getPayment, createPayment, getMyPayments, getPaymentStats }
