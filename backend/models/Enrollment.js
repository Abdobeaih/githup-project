const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_type: { type: String, enum: ['medical', 'financial', 'combined'], required: true },
  center_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  bank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  subscription_confirmed: { type: Boolean, default: false },
  subscription_name: { type: String, default: null },
  subscription_dob: { type: String, default: null },
  subscription_phone: { type: String, default: null },
  subscription_data_use_agree: { type: Boolean, default: false },
  subscription_terms_agree: { type: Boolean, default: false },
  subscription_confirmed_at: { type: Date, default: null },
}, { timestamps: true })

module.exports = mongoose.model('Enrollment', enrollmentSchema)
