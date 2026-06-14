const Installment = require('../models/Installment')

const getInstallments = async (req, res, next) => {
  try {
    const installments = await Installment.find().populate('user_id', 'name email').sort('-createdAt')
    res.json({ success: true, data: installments })
  } catch (error) { next(error) }
}

const getMyInstallments = async (req, res, next) => {
  try {
    const installments = await Installment.find({ user_id: req.entityId }).sort('-createdAt')
    res.json({ success: true, data: installments })
  } catch (error) { next(error) }
}

const createInstallment = async (req, res, next) => {
  try {
    const installment = await Installment.create({ ...req.body, user_id: req.entityId })
    res.status(201).json({ success: true, data: installment })
  } catch (error) { next(error) }
}

const payInstallment = async (req, res, next) => {
  try {
    const installment = await Installment.findById(req.params.id)
    if (!installment) { res.status(404); throw new Error('Installment not found') }
    const amount = req.body.amount || installment.monthly_amount
    installment.paid += amount
    if (installment.paid >= installment.total) installment.status = 'completed'
    await installment.save()
    res.json({ success: true, data: installment })
  } catch (error) { next(error) }
}

module.exports = { getInstallments, getMyInstallments, createInstallment, payInstallment }
