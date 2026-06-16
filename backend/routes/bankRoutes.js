const express = require('express')
const router = express.Router()
const Bank = require('../models/Bank')
router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.governorate) filter.governorate = req.query.governorate
    const banks = await Bank.find(filter)
    res.json({ success: true, data: banks })
  } catch (error) { next(error) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const bank = await Bank.findById(req.params.id)
    if (!bank) { res.status(404); throw new Error('Bank not found') }
    res.json({ success: true, data: bank })
  } catch (error) { next(error) }
})

module.exports = router
