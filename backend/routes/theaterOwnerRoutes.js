const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  registerTheater,
  getMyTheater,
  addShow,
  getMyShows,
  updateShow,
  deleteShow
} = require('../controllers/theaterController')


router.post('/register', protect, registerTheater)
router.get('/my-theater', protect, getMyTheater)
router.post('/add-show', protect, addShow)
router.get('/my-shows', protect, getMyShows)
router.put('/shows/:id', protect, updateShow)
router.delete('/shows/:id', protect, deleteShow)

module.exports = router
