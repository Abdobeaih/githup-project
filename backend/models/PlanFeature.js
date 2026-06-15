const mongoose = require('mongoose')

const planFeatureSchema = new mongoose.Schema({
  plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  feature_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature', required: true },
}, { timestamps: true })

// Index for efficient plan-feature lookups (used in getPlansWithFeatures)
planFeatureSchema.index({ plan_id: 1, feature_id: 1 })

module.exports = mongoose.model('PlanFeature', planFeatureSchema)
