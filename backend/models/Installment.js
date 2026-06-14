const mongoose = require('mongoose')

const installmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  total: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  monthly_amount: { type: Number, required: true },
  next_due: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'overdue'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('Installment', installmentSchema)
