const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  card_holder_name: { type: String, required: true },
  card_number: { type: String, required: true },
  expiry: { type: String, required: true },
  brand: { type: String, enum: ['visa', 'mastercard', 'amex'], default: 'visa' },
  is_default: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)
