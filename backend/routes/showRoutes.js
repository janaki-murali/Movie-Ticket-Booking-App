const express = require('express')
const router = express.Router()
const { getShowSeats } = require('../controllers/showController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:id/seats', protect, getShowSeats)

module.exports = router
