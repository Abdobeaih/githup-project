const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'company', 'admin'],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

// ── Hash the OTP code before saving ───────────────────────────────
otpSchema.pre('save', async function (next) {
  if (!this.isModified('code')) return next()
  this.code = await bcrypt.hash(this.code, 10)
  next()
})

// ── Compare a plain-text code against the stored hash ─────────────
otpSchema.methods.compareCode = async function (plainCode) {
  return bcrypt.compare(plainCode, this.code)
}

// ── Indexes ───────────────────────────────────────────────────────
// TTL: auto-delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
// Fast lookup for verification
otpSchema.index({ email: 1, role: 1 })
// Compound index for OTP reuse check
otpSchema.index({ email: 1, role: 1, verified: 1 })

module.exports = mongoose.model('Otp', otpSchema)
