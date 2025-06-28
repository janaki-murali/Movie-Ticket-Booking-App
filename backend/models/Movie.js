const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  category: {
    type: String,
    enum: ['2D', '3D', 'IMAX'],
    required: true
  },
  description: { type: String },
  posterUrl: { type: String },
  rating: { type: Number, default: 0 }
}, { timestamps: true })

const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie
