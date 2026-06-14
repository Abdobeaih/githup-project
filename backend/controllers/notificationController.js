const Notification = require('../models/Notification')

const getNotifications = async (req, res, next) => {
  try {
    const filter = { user_id: req.query.user_id || req.entityId }
    if (req.query.is_read !== undefined) filter.is_read = req.query.is_read === 'true'
    if (req.query.type) filter.type = req.query.type
    const notifications = await Notification.find(filter).sort('-createdAt').limit(parseInt(req.query.limit) || 50)
    res.json({ success: true, data: notifications })
  } catch (error) { next(error) }
}

const getUnreadCount = async (req, res, next) => {
  try {
    const filter = { user_id: req.query.user_id || req.entityId, is_read: false }
    const count = await Notification.countDocuments(filter)
    res.json({ success: true, data: { count } })
  } catch (error) { next(error) }
}

const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body)
    res.status(201).json({ success: true, data: notification })
  } catch (error) { next(error) }
}

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { is_read: true, read_at: new Date() }, { new: true })
    if (!notification) { res.status(404); throw new Error('Notification not found') }
    res.json({ success: true, data: notification })
  } catch (error) { next(error) }
}

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user_id: req.entityId, is_read: false }, { is_read: true, read_at: new Date() })
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) { next(error) }
}

const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) { next(error) }
}

module.exports = { getNotifications, getUnreadCount, createNotification, markAsRead, markAllAsRead, deleteNotification }
