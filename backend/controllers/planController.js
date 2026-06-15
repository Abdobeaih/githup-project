const SubscriptionPlan = require('../models/SubscriptionPlan')
const PlanFeature = require('../models/PlanFeature')
const APIFeatures = require('../utils/apiFeatures')

const getPlans = async (req, res, next) => {
  try {
    const features = new APIFeatures(SubscriptionPlan.find(), req.query).filter().sort().paginate()
    const plans = await features.query
    const pagination = await features.count()
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
    const links = await PlanFeature.find({ plan_id: req.params.id }).populate('feature_id')
    res.json({ success: true, data: links.map(l => l.feature_id) })
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
 * Eliminates N+1 — single query for plans + features.
 */
const getPlansWithFeatures = async (req, res, next) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort('priority');
    const planFeatures = await PlanFeature.find({
      plan_id: { $in: plans.map(p => p._id) }
    }).populate('feature_id');

    // Group features by plan_id
    const featuresByPlan = {};
    planFeatures.forEach(pf => {
      if (!featuresByPlan[pf.plan_id]) featuresByPlan[pf.plan_id] = [];
      if (pf.feature_id) featuresByPlan[pf.plan_id].push(pf.feature_id);
    });

    const enriched = plans.map(plan => ({
      ...plan.toObject(),
      features: featuresByPlan[plan._id] || [],
    }));

    res.json({ success: true, data: enriched });
  } catch (error) { next(error) }
};

module.exports = { getPlans, getPlan, createPlan, updatePlan, deletePlan, getPlanFeatures, setPlanFeatures, getPlansWithFeatures }
