const Enrollment = require('../models/Enrollment')
const MedicalCenter = require('../models/MedicalCenter')
const Bank = require('../models/Bank')

const getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find().populate('user_id', 'name email').populate('center_id', 'name').populate('bank_id', 'name').sort('-createdAt')
    res.json({ success: true, data: enrollments })
  } catch (error) { next(error) }
}

const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user_id: req.entityId }).populate('center_id', 'name').populate('bank_id', 'name').sort('-createdAt')
    res.json({ success: true, data: enrollments })
  } catch (error) { next(error) }
}

const enrollInService = async (req, res, next) => {
  try {
    const { service_type, center_id, bank_id } = req.body
    if (!service_type) { res.status(400); throw new Error('service_type is required') }
    if (!['medical', 'financial', 'combined'].includes(service_type)) { res.status(400); throw new Error('Invalid service_type') }
    const enrollment = await Enrollment.create({
      user_id: req.entityId,
      service_type,
      center_id: center_id || null,
      bank_id: bank_id || null,
    })
    res.status(201).json({ success: true, data: enrollment })
  } catch (error) { next(error) }
}

const confirmEnrollment = async (req, res, next) => {
  try {
    const { enrollment_id, name, dob, phone, agreeDataUse, agreeTerms } = req.body
    if (!enrollment_id) { res.status(400); throw new Error('enrollment_id is required') }
    const existing = await Enrollment.findById(enrollment_id)
    if (!existing) { res.status(404); throw new Error('Enrollment not found') }
    if (existing.user_id.toString() !== req.entityId) { res.status(403); throw new Error('Not authorized to confirm this enrollment') }
    existing.subscription_confirmed = true
    existing.subscription_name = name || existing.subscription_name
    existing.subscription_dob = dob || existing.subscription_dob
    existing.subscription_phone = phone || existing.subscription_phone
    existing.subscription_data_use_agree = agreeDataUse ?? false
    existing.subscription_terms_agree = agreeTerms ?? false
    existing.subscription_confirmed_at = new Date()
    await existing.save()
    res.json({ success: true, data: existing })
  } catch (error) { next(error) }
}

const getMedicalCenters = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.governorate) filter.governorate = req.query.governorate
    const centers = await MedicalCenter.find(filter)
    res.json({ success: true, data: centers })
  } catch (error) { next(error) }
}

const getBanks = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.governorate) filter.governorate = req.query.governorate
    const banks = await Bank.find(filter)
    res.json({ success: true, data: banks })
  } catch (error) { next(error) }
}

module.exports = { getEnrollments, getMyEnrollments, enrollInService, confirmEnrollment, getMedicalCenters, getBanks }
