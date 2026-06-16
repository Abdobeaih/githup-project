const Payment = require('../models/Payment')
const APIFeatures = require('../utils/apiFeatures')

const getPayments = async (req, res, next) => {
  try {
    const features = new APIFeatures(Payment.find().populate('user_id', 'name email').lean(), req.query).filter().sort().paginate()
    const payments = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: payments, ...pagination })
  } catch (error) { next(error) }
}

const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user_id', 'name email').lean()
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
    const payments = await Payment.find({ user_id: req.entityId }).sort('-createdAt').lean()
    res.json({ success: true, data: payments })
  } catch (error) { next(error) }
}

const getPaymentStats = async (req, res, next) => {
  try {
    const stats = await Payment.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          success: [{ $match: { status: 'SUCCESS' } }, { $count: 'count' }],
          failed: [{ $match: { status: 'FAILED' } }, { $count: 'count' }],
          pending: [{ $match: { status: 'PENDING' } }, { $count: 'count' }],
          totalRevenue: [{ $match: { status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ['$total.count', 0] },
          success: { $arrayElemAt: ['$success.count', 0] },
          failed: { $arrayElemAt: ['$failed.count', 0] },
          pending: { $arrayElemAt: ['$pending.count', 0] },
          totalRevenue: { $arrayElemAt: ['$totalRevenue.total', 0] },
        },
      },
    ])
    const data = stats[0] || { total: 0, success: 0, failed: 0, pending: 0, totalRevenue: 0 }
    res.json({ success: true, data })
  } catch (error) { next(error) }
}

module.exports = { getPayments, getPayment, createPayment, getMyPayments, getPaymentStats }
