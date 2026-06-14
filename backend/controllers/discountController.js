const Discount = require('../models/Discount')
const DiscountBranch = require('../models/DiscountBranch')
const UserScan = require('../models/UserScan')
const APIFeatures = require('../utils/apiFeatures')

const getDiscounts = async (req, res, next) => {
  try {
    const features = new APIFeatures(Discount.find().populate('company_id', 'name email category'), req.query).filter().search(['name', 'description']).sort().paginate()
    const discounts = await features.query
    const pagination = await features.count()
    res.json({ success: true, data: discounts, ...pagination })
  } catch (error) { next(error) }
}

const getDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findById(req.params.id).populate('company_id', 'name email category phone city')
    if (!discount) { res.status(404); throw new Error('Discount not found') }
    res.json({ success: true, data: discount })
  } catch (error) { next(error) }
}

const createDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.create({ ...req.body, company_id: req.entityId })
    res.status(201).json({ success: true, data: discount })
  } catch (error) { next(error) }
}

const updateDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!discount) { res.status(404); throw new Error('Discount not found') }
    res.json({ success: true, data: discount })
  } catch (error) { next(error) }
}

const deleteDiscount = async (req, res, next) => {
  try {
    await Discount.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Discount deleted' })
  } catch (error) { next(error) }
}

const approveDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, { status: 'approved', approved_at: new Date() }, { new: true })
    if (!discount) { res.status(404); throw new Error('Discount not found') }
    res.json({ success: true, data: discount })
  } catch (error) { next(error) }
}

const rejectDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true })
    if (!discount) { res.status(404); throw new Error('Discount not found') }
    res.json({ success: true, data: discount })
  } catch (error) { next(error) }
}

const getDiscountScans = async (req, res, next) => {
  try {
    const scans = await UserScan.find({ discount_id: req.params.id }).populate('user_id', 'name email').sort('-scanned_at')
    res.json({ success: true, data: scans })
  } catch (error) { next(error) }
}

const recordScan = async (req, res, next) => {
  try {
    const scan = await UserScan.create({ user_id: req.entityId, discount_id: req.params.id, ...req.body })
    await Discount.findByIdAndUpdate(req.params.id, { $inc: { uses: 1 } })
    res.status(201).json({ success: true, data: scan })
  } catch (error) { next(error) }
}

const incrementViews = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    res.json({ success: true, data: { views: discount.views } })
  } catch (error) { next(error) }
}

// Discount Branches (many-to-many)
const getDiscountBranches = async (req, res, next) => {
  try {
    const links = await DiscountBranch.find({ discount_id: req.params.id }).populate('branch_id')
    res.json({ success: true, data: links.map(l => l.branch_id) })
  } catch (error) { next(error) }
}

const setDiscountBranches = async (req, res, next) => {
  try {
    await DiscountBranch.deleteMany({ discount_id: req.params.id })
    const branches = req.body.branch_ids.map(branch_id => ({ discount_id: req.params.id, branch_id }))
    await DiscountBranch.insertMany(branches)
    res.json({ success: true, message: 'Branches updated' })
  } catch (error) { next(error) }
}

module.exports = { getDiscounts, getDiscount, createDiscount, updateDiscount, deleteDiscount, approveDiscount, rejectDiscount, getDiscountScans, recordScan, incrementViews, getDiscountBranches, setDiscountBranches }
