const User = require('../models/User')
const Company = require('../models/Company')
const Discount = require('../models/Discount')
const Payment = require('../models/Payment')
const UserScan = require('../models/UserScan')
const Enrollment = require('../models/Enrollment')

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalCompanies = await Company.countDocuments()
    const totalDiscounts = await Discount.countDocuments()
    const totalScans = await UserScan.countDocuments()
    const pendingCompanies = await Company.countDocuments({ status: 'pending' })
    const pendingDiscounts = await Discount.countDocuments({ status: 'pending' })
    const approvedDiscounts = await Discount.countDocuments({ status: 'approved' })
    const revenueAgg = await Payment.aggregate([{ $match: { status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    const totalRevenue = revenueAgg[0]?.total || 0
    res.json({ success: true, data: { totalUsers, totalCompanies, totalDiscounts, totalScans, pendingCompanies, pendingDiscounts, approvedDiscounts, totalRevenue } })
  } catch (error) { next(error) }
}

const getRevenueDetails = async (req, res, next) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paid_at' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    res.json({ success: true, data: revenue })
  } catch (error) { next(error) }
}

const getCompanyAnalytics = async (req, res, next) => {
  try {
    const companyId = req.params.companyId || req.entityId
    const discounts = await Discount.find({ company_id: companyId })
    const discountIds = discounts.map(d => d._id)
    const totalViews = discounts.reduce((sum, d) => sum + (d.views || 0), 0)
    const totalUses = discounts.reduce((sum, d) => sum + (d.uses || 0), 0)
    const scans = await UserScan.countDocuments({ discount_id: { $in: discountIds } })
    res.json({ success: true, data: { totalDiscounts: discounts.length, totalViews, totalUses, totalScans: scans, discounts } })
  } catch (error) { next(error) }
}

const getDiscountUsageDetail = async (req, res, next) => {
  try {
    const scans = await UserScan.find({ discount_id: req.params.id }).populate('user_id', 'name email').sort('-scanned_at')
    res.json({ success: true, data: scans })
  } catch (error) { next(error) }
}

module.exports = { getDashboardStats, getRevenueDetails, getCompanyAnalytics, getDiscountUsageDetail }
