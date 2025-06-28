const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screenNumber: Number,
  showDate: Date,
  showTime: String,
  language: String,
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX']
  },
  ticketPrice: Number,
  totalSeats: Number,
  availableSeats: Number
}, { timestamps: true })

module.exports = mongoose.model('Show', showSchema)
