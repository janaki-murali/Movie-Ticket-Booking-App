const Theater = require('../models/Theater')
const User = require('../models/User')
const Show = require('../models/Show')
const Movie = require('../models/Movie')

// Register a Theater
const registerTheater = async (req, res) => {
  const { name, city, area, licenseId, totalScreens } = req.body
  const ownerId = req.user.id

  try {
    const user = await User.findById(ownerId)
    if (!user || user.role !== 'theater_owner') {
      return res.status(403).json({ message: 'Only theater owners can register a theater' })
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Your account is not yet approved by admin' })
    }

    const alreadyExists = await Theater.findOne({ owner: ownerId })
    if (alreadyExists) {
      return res.status(400).json({ message: 'You have already registered a theater' })
    }

    const theater = new Theater({
      owner: ownerId,
      name,
      city,
      area,
      licenseId,
      totalScreens
    })

    const saved = await theater.save()
    res.status(201).json({ message: 'Theater registered successfully', theater: saved })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// View Own Theater
const getMyTheater = async (req, res) => {
  try {
    const theater = await Theater.findOne({ owner: req.user.id })
    if (!theater) {
      return res.status(404).json({ message: 'No theater registered under your account' })
    }
    res.status(200).json({ theater })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Add Show to Theater (with seat generation)
const addShow = async (req, res) => {
  const { movieId, screenNumber, showDate, showTime, language, format, ticketPrice, totalSeats } = req.body
  const ownerId = req.user.id

  try {
    const theater = await Theater.findOne({ owner: ownerId })
    if (!theater) {
      return res.status(400).json({ message: 'You must register a theater before adding shows' })
    }

    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    const seats = []
    const rows = ['A', 'B', 'C', 'D', 'E']
    let count = 1

    for (let i = 0; i < totalSeats; i++) {
      const row = rows[Math.floor(i / 10) % rows.length]
      const seatNum = `${row}${count}`
      let category = 'Gold'
      if (row === 'A' || row === 'B') category = 'Platinum'
      if (row === 'E') category = 'Recliner'

      seats.push({ seatNumber: seatNum, category, isBooked: false })

      count++
      if (count > 10) count = 1
    }

    const show = new Show({
      movie: movieId,
      theater: theater._id,
      screenNumber,
      showDate,
      showTime,
      language,
      format,
      ticketPrice,
      totalSeats,
      availableSeats: totalSeats,
      seats
    })

    const savedShow = await show.save()
    res.status(201).json({ message: 'Show added successfully', show: savedShow })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// View All My Shows
const getMyShows = async (req, res) => {
  try {
    const theater = await Theater.findOne({ owner: req.user.id })
    if (!theater) {
      return res.status(400).json({ message: 'You must register a theater to view shows' })
    }

    const shows = await Show.find({ theater: theater._id }).populate('movie')
    res.status(200).json({ shows })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update Show
const updateShow = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    const show = await Show.findById(id)
    if (!show) {
      return res.status(404).json({ message: 'Show not found' })
    }

    const theater = await Theater.findOne({ owner: req.user.id })
    if (!theater || show.theater.toString() !== theater._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this show' })
    }

    const updatedShow = await Show.findByIdAndUpdate(id, updates, { new: true })
    res.json({ message: 'Show updated successfully', show: updatedShow })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete Show
const deleteShow = async (req, res) => {
  const { id } = req.params

  try {
    const show = await Show.findById(id)
    if (!show) {
      return res.status(404).json({ message: 'Show not found' })
    }

    const theater = await Theater.findOne({ owner: req.user.id })
    if (!theater || show.theater.toString() !== theater._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this show' })
    }

    await Show.findByIdAndDelete(id)
    res.json({ message: 'Show deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  registerTheater,
  getMyTheater,
  addShow,
  getMyShows,
  updateShow,
  deleteShow
}
