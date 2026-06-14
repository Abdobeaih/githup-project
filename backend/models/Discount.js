const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['medical', 'gym', 'food', 'fun', 'financial', 'courses'], required: true },
  discount_percent: { type: String, required: true },
  discount_type: { type: String, enum: ['INSURANCE_FORM', 'PROMO_CODE', 'EXTERNAL_LINK'], required: true },
  promo_code: { type: String, default: null },
  description: { type: String, default: '' },
  city: { type: String, default: '' },
  governorate: { type: String, default: '' },
  tier_required: { type: String, enum: ['free', 'premium', 'elite'], default: 'free' },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  uses: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  approved_at: { type: String, default: null },
  image_url: { type: String, default: '' },
  terms_conditions: { type: String, default: '' },
  max_usage_per_user: { type: Number, default: 1 },
}, { timestamps: true })

module.exports = mongoose.model('Discount', discountSchema)
