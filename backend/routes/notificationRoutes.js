const express = require('express')
const router = express.Router()
const { getNotifications, getUnreadCount, createNotification, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getNotifications)
router.get('/unread-count', getUnreadCount)
router.post('/', protect, createNotification)
router.put('/read-all', protect, markAllAsRead)
router.put('/:id/read', protect, markAsRead)
router.delete('/:id', protect, deleteNotification)

module.exports = router
