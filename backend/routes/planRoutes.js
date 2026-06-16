const express = require('express')
const router = express.Router()
const { getPlans, getPlan, createPlan, updatePlan, deletePlan, getPlanFeatures, setPlanFeatures, getPlansWithFeatures } = require('../controllers/planController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Public read routes — pricing & packages pages must load without auth
router.get('/with-features', getPlansWithFeatures)
router.get('/', getPlans)
router.get('/:id/features', getPlanFeatures)

router.route('/').post(protect, adminOnly, createPlan)
router.put('/:id/features', protect, adminOnly, setPlanFeatures)
router.route('/:id').get(protect, getPlan).put(protect, adminOnly, updatePlan).delete(protect, adminOnly, deletePlan)

module.exports = router
