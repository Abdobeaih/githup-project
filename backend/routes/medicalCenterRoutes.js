const express = require('express')
const router = express.Router()
const MedicalCenter = require('../models/MedicalCenter')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.governorate) filter.governorate = req.query.governorate
    const centers = await MedicalCenter.find(filter)
    res.json({ success: true, data: centers })
  } catch (error) { next(error) }
})

router.get('/:id', protect, async (req, res, next) => {
  try {
    const center = await MedicalCenter.findById(req.params.id)
    if (!center) { res.status(404); throw new Error('Medical center not found') }
    res.json({ success: true, data: center })
  } catch (error) { next(error) }
})

module.exports = router
