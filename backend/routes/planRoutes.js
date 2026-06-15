const express = require('express')
const router = express.Router()
const { getPlans, getPlan, createPlan, updatePlan, deletePlan, getPlanFeatures, setPlanFeatures, getPlansWithFeatures } = require('../controllers/planController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/with-features', protect, getPlansWithFeatures)
router.route('/').get(protect, getPlans).post(protect, adminOnly, createPlan)
router.get('/:id/features', protect, getPlanFeatures)
router.put('/:id/features', protect, adminOnly, setPlanFeatures)
router.route('/:id').get(protect, getPlan).put(protect, adminOnly, updatePlan).delete(protect, adminOnly, deletePlan)

module.exports = router
