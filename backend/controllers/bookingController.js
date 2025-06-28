const Booking = require('../models/Booking')
const Show = require('../models/Show')

const bookShow = async (req, res) => {
  const { showId, seats, totalAmount } = req.body
  const userId = req.user.id

  try {
    const show = await Show.findById(showId)
    if (!show) return res.status(404).json({ message: 'Show not found' })

    const seatMap = new Map()
    show.seats.forEach(seat => {
    const normalized = seat.seatNumber.trim().toUpperCase()
    seatMap.set(normalized, seat)
  })


    const alreadyBooked = []
    for (let s of seats) {
      const match = seatMap.get(s.seatNumber.trim().toUpperCase())
      if (!match) return res.status(400).json({ message: `Seat ${s.seatNumber} not found` })
      if (match.isBooked) alreadyBooked.push(s.seatNumber)
    }

    if (alreadyBooked.length > 0) {
      return res.status(400).json({ message: `Seats already booked: ${alreadyBooked.join(', ')}` })
    }

    show.seats = show.seats.map(seat => {
      if (seats.find(s => s.seatNumber === seat.seatNumber)) {
        seat.isBooked = true
      }
      return seat
    })

    show.availableSeats -= seats.length
    await show.save()

    const booking = new Booking({
      user: userId,
      show: showId,
      seats,
      totalAmount
    })

    const saved = await booking.save()
    res.status(201).json({ message: 'Booking successful', booking: saved })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'show',
        populate: [{ path: 'movie' }, { path: 'theater' }]
      })

    res.status(200).json({ bookings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const cancelBooking = async (req, res) => {
  const { id } = req.params

  try {
    const booking = await Booking.findById(id).populate('show')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' })
    }
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' })
    }

    booking.bookingStatus = 'cancelled'
    await booking.save()

    const show = await Show.findById(booking.show._id)

    show.seats = show.seats.map(seat => {
      if (booking.seats.find(s => s.seatNumber === seat.seatNumber)) {
        seat.isBooked = false
      }
      return seat
    })

    show.availableSeats += booking.seats.length
    await show.save()

    res.json({ message: 'Booking cancelled successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  bookShow,
  getMyBookings,
  cancelBooking
}
