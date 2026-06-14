const Feature = require('../models/Feature')

const getFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find().sort('name')
    res.json({ success: true, data: features })
  } catch (error) { next(error) }
}

const createFeature = async (req, res, next) => {
  try {
    const feature = await Feature.create(req.body)
    res.status(201).json({ success: true, data: feature })
  } catch (error) { next(error) }
}

const updateFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!feature) { res.status(404); throw new Error('Feature not found') }
    res.json({ success: true, data: feature })
  } catch (error) { next(error) }
}

const deleteFeature = async (req, res, next) => {
  try {
    await Feature.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Feature deleted' })
  } catch (error) { next(error) }
}

module.exports = { getFeatures, createFeature, updateFeature, deleteFeature }
