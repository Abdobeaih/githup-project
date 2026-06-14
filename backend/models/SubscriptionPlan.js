const mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionAr: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  durationDays: { type: Number, default: 30 },
  features: [{ type: String }],
  maxCompanies: { type: Number, default: 1 },
  maxDiscounts: { type: Number, default: 5 },
  maxScans: { type: Number, default: 100 },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('SubscriptionPlan', planSchema)
