const express = require('express')
const router = express.Router()
const { getFeatures, createFeature, updateFeature, deleteFeature } = require('../controllers/featureController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.route('/').get(getFeatures).post(protect, adminOnly, createFeature)
router.route('/:id').put(protect, adminOnly, updateFeature).delete(protect, adminOnly, deleteFeature)

module.exports = router
