const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
}, { timestamps: true })

module.exports = mongoose.model('Feature', featureSchema)
