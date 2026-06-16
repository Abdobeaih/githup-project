const User = require('../models/User')
const Company = require('../models/Company')
const Discount = require('../models/Discount')
const Payment = require('../models/Payment')
const UserScan = require('../models/UserScan')
const Enrollment = require('../models/Enrollment')

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $facet: {
          users: [{ $count: 'count' }],
        },
      },
    ]).then(async () => {
      const companies = await Company.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
            approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
          },
        },
      ])

      const discounts = await Discount.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
            approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
          },
        },
      ])

      const scans = await UserScan.countDocuments()
      const revenue = await Payment.aggregate([{ $match: { status: 'SUCCESS' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])

      return {
        totalUsers: stats[0]?.users[0]?.count || 0,
        totalCompanies: companies[0]?.total[0]?.count || 0,
        pendingCompanies: companies[0]?.pending[0]?.count || 0,
        totalDiscounts: discounts[0]?.total[0]?.count || 0,
        pendingDiscounts: discounts[0]?.pending[0]?.count || 0,
        approvedDiscounts: discounts[0]?.approved[0]?.count || 0,
        totalScans: scans,
        totalRevenue: revenue[0]?.total || 0,
      }
    })

    res.json({ success: true, data: stats })
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
