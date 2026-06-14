const mongoose = require('mongoose')

const serviceRequestSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  phone: { type: String, required: [true, 'Phone number is required'], maxlength: 11, trim: true },
  email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  address: { type: String, required: [true, 'Address is required'], trim: true },
  service_id: { type: String, required: [true, 'Service ID is required'], trim: true },
  service_name: { type: String, required: [true, 'Service name is required'], trim: true },
  provider_id: { type: String, default: null, trim: true },
  provider_name: { type: String, default: null, trim: true },
  notes: { type: String, default: '', trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema)
