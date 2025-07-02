const express = require('express')
const router = express.Router()
const {
  createReview,
  getMovieReviews,
  getTheaterReviews
} = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createReview)
router.get('/movie/:id', getMovieReviews)
router.get('/theater/:id', getTheaterReviews)

module.exports = router
