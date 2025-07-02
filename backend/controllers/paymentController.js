const Payment = require('../models/Payment')
const Booking = require('../models/Booking')

const makePayment = async (req, res) => {
  const { bookingId, amount, paymentMethod } = req.body
  const userId = req.user.id

  try {
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const payment = new Payment({
      booking: bookingId,
      user: userId,
      amount,
      paymentMethod,
      paymentStatus: 'paid'
    })

    const savedPayment = await payment.save()

    res.status(201).json({
      message: 'Payment successful',
      payment: savedPayment
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { makePayment }
