const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  governorate: { type: String, default: '' },
  phone: { type: String, default: '' },
  working_hours: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('CompanyBranch', branchSchema)
