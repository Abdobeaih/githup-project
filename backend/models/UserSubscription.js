const mongoose = require('mongoose')

const userSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  status: { type: String, enum: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'], default: 'PENDING' },
  startDate: { type: Date },
  endDate: { type: Date },
  autoRenew: { type: Boolean, default: false },
  paymentMethod: { type: String },
  price: { type: Number, default: 0 },
}, { timestamps: true })

// Index for fast "current subscription" lookups and subscription status queries
userSubscriptionSchema.index({ userId: 1, status: 1 })

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema)
