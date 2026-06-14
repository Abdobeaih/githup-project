const express = require('express')
const router = express.Router()
const { getMyCards, saveCard, deleteCard, setDefaultCard } = require('../controllers/cardController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getMyCards)
router.post('/', protect, saveCard)
router.delete('/:id', protect, deleteCard)
router.put('/:id/default', protect, setDefaultCard)

module.exports = router
