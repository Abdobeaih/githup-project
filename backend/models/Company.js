const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  category: { type: String, enum: ['medical', 'gym', 'food', 'fun', 'financial', 'training'], default: 'food' },
  city: { type: String, default: '' },
  governorate: { type: String, default: '' },
  emoji: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approved_at: { type: String, default: null },
  join_date: { type: String },
  views: { type: Number, default: 0 },
  uses: { type: Number, default: 0 },
  commission: { type: Number, default: 10 },
  plan: { type: String, default: '' },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  phone: { type: String, default: '' },
}, { timestamps: true })

companySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

companySchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('Company', companySchema)
