const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSubscription', default: null },
  amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['VISA', 'MASTERCARD', 'FAWRY', 'CASH', 'VODAFONE_CASH', 'INSTAPAY', 'BANK_TRANSFER'], required: true },
  transaction_id: { type: String, default: () => 'TXN' + Date.now() },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'], default: 'SUCCESS' },
  paid_at: { type: Date, default: Date.now },
  receipt_url: { type: String },
  notes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)
