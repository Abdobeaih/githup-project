const mongoose = require('mongoose')

const socialReviewSchema = new mongoose.Schema({
  target_type: { type: String, required: true },
  target_id: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  user_name: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('SocialReview', socialReviewSchema)
