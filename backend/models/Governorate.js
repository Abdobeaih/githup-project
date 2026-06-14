const mongoose = require('mongoose')

const govSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true })

module.exports = mongoose.model('Governorate', govSchema)
