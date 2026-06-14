const mongoose = require('mongoose')

const userScanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
  company_name: { type: String },
  type: { type: String, default: 'discount' },
  scanned_at: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

module.exports = mongoose.model('UserScan', userScanSchema)
