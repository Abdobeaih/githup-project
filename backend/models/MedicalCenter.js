const mongoose = require('mongoose')

const pricingSchema = new mongoose.Schema({
  service: { type: String },
  memberPrice: { type: Number },
  nonMemberPrice: { type: Number },
}, { _id: false })

const reviewSubSchema = new mongoose.Schema({
  userName: { type: String },
  rating: { type: Number },
  comment: { type: String },
  date: { type: Date, default: Date.now },
}, { _id: false })

const medicalCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  governorate: { type: String },
  address: { type: String },
  phone: { type: String },
  rating: { type: Number, default: 0 },
  img_url: { type: String },
  description: { type: String },
  services_offered: [{ type: String }],
  pricing: [pricingSchema],
  reviews: [reviewSubSchema],
}, { timestamps: true })

module.exports = mongoose.model('MedicalCenter', medicalCenterSchema)
