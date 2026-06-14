const Review = require('../models/Review')
const SocialReview = require('../models/SocialReview')
const Discount = require('../models/Discount')

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ discount_id: req.params.discountId }).populate('user_id', 'name').sort('-createdAt')
    res.json({ success: true, data: reviews })
  } catch (error) { next(error) }
}

const createReview = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, user_id: req.entityId })
    // Update discount rating stats
    const stats = await Review.aggregate([
      { $match: { discount_id: review.discount_id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])
    res.status(201).json({ success: true, data: review, stats: stats[0] || null })
  } catch (error) { next(error) }
}

const deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Review deleted' })
  } catch (error) { next(error) }
}

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('user_id', 'name').populate('discount_id', 'name').sort('-createdAt')
    res.json({ success: true, data: reviews })
  } catch (error) { next(error) }
}

// Social reviews (for medical centers, banks, etc.)
const getSocialReviews = async (req, res, next) => {
  try {
    const reviews = await SocialReview.find({ target_type: req.query.target_type, target_id: req.query.target_id }).sort('-createdAt')
    res.json({ success: true, data: reviews })
  } catch (error) { next(error) }
}

const createSocialReview = async (req, res, next) => {
  try {
    const review = await SocialReview.create({ ...req.body, user_id: req.entityId })
    res.status(201).json({ success: true, data: review })
  } catch (error) { next(error) }
}

const deleteSocialReview = async (req, res, next) => {
  try {
    await SocialReview.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Review deleted' })
  } catch (error) { next(error) }
}

module.exports = { getReviews, createReview, deleteReview, getAllReviews, getSocialReviews, createSocialReview, deleteSocialReview }
