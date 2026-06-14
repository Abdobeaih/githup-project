const Card = require('../models/Card')

const getMyCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ user_id: req.entityId })
    res.json({ success: true, data: cards })
  } catch (error) { next(error) }
}

const saveCard = async (req, res, next) => {
  try {
    if (req.body.is_default) {
      await Card.updateMany({ user_id: req.entityId }, { is_default: false })
    }
    const card = await Card.create({ ...req.body, user_id: req.entityId })
    res.status(201).json({ success: true, data: card })
  } catch (error) { next(error) }
}

const deleteCard = async (req, res, next) => {
  try {
    await Card.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Card deleted' })
  } catch (error) { next(error) }
}

const setDefaultCard = async (req, res, next) => {
  try {
    await Card.updateMany({ user_id: req.entityId }, { is_default: false })
    const card = await Card.findByIdAndUpdate(req.params.id, { is_default: true }, { new: true })
    if (!card) { res.status(404); throw new Error('Card not found') }
    res.json({ success: true, data: card })
  } catch (error) { next(error) }
}

module.exports = { getMyCards, saveCard, deleteCard, setDefaultCard }
