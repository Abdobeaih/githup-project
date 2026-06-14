const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  name: String,
  governorate: String,
  address: String,
  phone: String,
  rating: Number,
  img_url: String,
  description: String,
  cuisine: String,
  discount_percent: String,
  city: String,
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', restaurantSchema)
