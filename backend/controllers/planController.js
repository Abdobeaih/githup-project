const SubscriptionPlan = require('../models/SubscriptionPlan')
const PlanFeature = require('../models/PlanFeature')
const APIFeatures = require('../utils/apiFeatures')

const getPlans = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      SubscriptionPlan.find({ isActive: true }).lean(),
      req.query
    ).filter().sort().paginate()
    const plans = await features.query
    const pagination = await features.count()
    res.set('Cache-Control', 'public, max-age=300')
    res.json({ success: true, data: plans, ...pagination })
  } catch (error) { next(error) }
}

const getPlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id)
    if (!plan) { res.status(404); throw new Error('Plan not found') }
    res.json({ success: true, data: plan })
  } catch (error) { next(error) }
}

const createPlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.create(req.body)
    res.status(201).json({ success: true, data: plan })
  } catch (error) { next(error) }
}

const updatePlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!plan) { res.status(404); throw new Error('Plan not found') }
    res.json({ success: true, data: plan })
  } catch (error) { next(error) }
}

const deletePlan = async (req, res, next) => {
  try {
    await SubscriptionPlan.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'Plan deactivated' })
  } catch (error) { next(error) }
}

const getPlanFeatures = async (req, res, next) => {
  try {
    const links = await PlanFeature.find({ plan_id: req.params.id }).populate('feature_id', 'name nameAr').lean()
    res.set('Cache-Control', 'public, max-age=300')
    res.json({ success: true, data: links.map(l => l.feature_id).filter(Boolean) })
  } catch (error) { next(error) }
}

const setPlanFeatures = async (req, res, next) => {
  try {
    await PlanFeature.deleteMany({ plan_id: req.params.id })
    const features = req.body.feature_ids.map(feature_id => ({ plan_id: req.params.id, feature_id }))
    await PlanFeature.insertMany(features)
    res.json({ success: true, message: 'Features updated' })
  } catch (error) { next(error) }
}

/**
 * Get all active plans with their features pre-populated.
 * Single aggregation pipeline — one DB round-trip instead of two.
 */
const getPlansWithFeatures = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.aggregate([
      { $match: { isActive: true } },
      { $sort: { priority: 1 } },
      {
        $lookup: {
          from: 'planfeatures',
          let: { planId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$plan_id', '$$planId'] } } },
            {
              $lookup: {
                from: 'features',
                localField: 'feature_id',
                foreignField: '_id',
                as: 'feature',
              },
            },
            { $unwind: { path: '$feature', preserveNullAndEmptyArrays: true } },
            { $replaceRoot: { newRoot: '$feature' } },
            { $match: { _id: { $exists: true } } },
            { $project: { name: 1, nameAr: 1, key: 1 } },
          ],
          as: 'linkedFeatures',
        },
      },
      {
        $project: {
          name: 1,
          nameAr: 1,
          price: 1,
          durationDays: 1,
          description: 1,
          descriptionAr: 1,
          features: 1,
          maxCompanies: 1,
          maxDiscounts: 1,
          maxScans: 1,
          priority: 1,
          popular: 1,
          isActive: 1,
          linkedFeatures: 1,
        },
      },
    ])

    const enriched = plans.map(plan => ({
      ...plan,
      features: [
        ...(Array.isArray(plan.features) ? plan.features : []),
        ...(plan.linkedFeatures || []),
      ],
      linkedFeatures: undefined,
    }))

    res.set('Cache-Control', 'public, max-age=300')
    res.json({ success: true, data: enriched })
  } catch (error) {
    // Fallback to two-query approach if aggregation collection names differ
    try {
      const fallbackPlans = await SubscriptionPlan.find({ isActive: true })
        .sort('priority')
        .select('_id id name nameAr price durationDays description descriptionAr features maxCompanies maxDiscounts maxScans priority')
        .lean()

      const planIds = fallbackPlans.map(p => p._id)
      const planFeatures = await PlanFeature.find({ plan_id: { $in: planIds } })
        .populate('feature_id', 'name nameAr')
        .lean()

      const featuresByPlan = {}
      planFeatures.forEach(pf => {
        if (!featuresByPlan[pf.plan_id]) featuresByPlan[pf.plan_id] = []
        if (pf.feature_id) featuresByPlan[pf.plan_id].push(pf.feature_id)
      })

      const enriched = fallbackPlans.map(plan => ({
        ...plan,
        features: featuresByPlan[plan._id] || [],
      }))

      res.set('Cache-Control', 'public, max-age=300')
      res.json({ success: true, data: enriched })
    } catch (fallbackError) {
      next(fallbackError)
    }
  }
}

module.exports = { getPlans, getPlan, createPlan, updatePlan, deletePlan, getPlanFeatures, setPlanFeatures, getPlansWithFeatures }
