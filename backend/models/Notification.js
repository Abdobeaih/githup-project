const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'], default: 'INFO' },
  channel: { type: String, enum: ['IN_APP', 'EMAIL', 'PUSH'], default: 'IN_APP' },
  link: { type: String, default: '' },
  is_read: { type: Boolean, default: false },
  read_at: { type: Date, default: null },
}, { timestamps: true })

notificationSchema.index({ user_id: 1, is_read: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
