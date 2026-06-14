const mongoose = require('mongoose')

const discountBranchSchema = new mongoose.Schema({
  discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyBranch', required: true },
}, { timestamps: true })

module.exports = mongoose.model('DiscountBranch', discountBranchSchema)
