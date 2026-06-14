const mongoose = require('mongoose')

const planFeatureSchema = new mongoose.Schema({
  plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  feature_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature', required: true },
}, { timestamps: true })

module.exports = mongoose.model('PlanFeature', planFeatureSchema)
