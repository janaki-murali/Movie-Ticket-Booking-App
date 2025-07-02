const Review = require('../models/Review')
const Movie = require('../models/Movie')
const Theater = require('../models/Theater')

const updateAverageRating = async (type, id) => {
  const filter = type === 'movie' ? { movie: id } : { theater: id }

  const result = await Review.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        average: { $avg: '$rating' }
      }
    }
  ])

  const avg = result.length > 0 ? result[0].average.toFixed(1) : 0

  if (type === 'movie') {
    await Movie.findByIdAndUpdate(id, { averageRating: avg })
  } else {
    await Theater.findByIdAndUpdate(id, { averageRating: avg })
  }
}

const createReview = async (req, res) => {
  const { movie, theater, rating, comment } = req.body
  const userId = req.user.id

  if (!movie && !theater) {
    return res.status(400).json({ message: 'Either movie or theater must be provided' })
  }

  try {
    const review = new Review({
      user: userId,
      movie,
      theater,
      rating,
      comment
    })

    const saved = await review.save()

    if (movie) {
    await updateAverageRating('movie', movie)
    }
    if (theater) {
    await updateAverageRating('theater', theater)
    }

    res.status(201).json({ message: 'Review submitted', review: saved })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMovieReviews = async (req, res) => {
  const { id } = req.params
  try {
    const reviews = await Review.find({ movie: id }).populate('user', 'name')
    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getTheaterReviews = async (req, res) => {
  const { id } = req.params
  try {
    const reviews = await Review.find({ theater: id }).populate('user', 'name')
    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createReview,
  getMovieReviews,
  getTheaterReviews,
  updateAverageRating
}
