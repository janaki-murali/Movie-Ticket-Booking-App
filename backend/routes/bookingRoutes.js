const express = require('express')
const router = express.Router()
const { protect, checkUser } = require('../middleware/authMiddleware')
const { bookShow, getMyBookings, cancelBooking } = require('../controllers/bookingController')

router.post('/book', protect, checkUser, bookShow)
router.get('/my-bookings', protect, checkUser, getMyBookings)
router.put('/cancel/:id', protect, checkUser, cancelBooking)

module.exports = router
