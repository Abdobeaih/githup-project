const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  nationalId: { type: String, required: true },
  job: { type: String, required: true },
  password: { type: String, required: true },
  plan: { type: String, enum: ['free', 'premium', 'elite'], default: 'free' },
  governorate: { type: String, required: true },
  scans: { type: Number, default: 0 },
  saved: { type: Number, default: 0 },
  join_date: { type: String },
  points: { type: Number, default: 0 },
  role: { type: String, enum: ['USER', 'COMPANY_ADMIN', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
