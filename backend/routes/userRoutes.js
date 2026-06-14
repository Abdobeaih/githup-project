const express = require('express')
const router = express.Router()
const { getUsers, getUser, createUser, updateUser, deleteUser, getUserStats } = require('../controllers/userController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.route('/').get(protect, adminOnly, getUsers).post(protect, adminOnly, createUser)
router.get('/stats', protect, adminOnly, getUserStats)
router.route('/:id').get(protect, getUser).put(protect, updateUser).delete(protect, adminOnly, deleteUser)

module.exports = router
