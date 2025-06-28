const express = require('express')
const router = express.Router()
const { protect, checkAdmin } = require('../middleware/authMiddleware')
const {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getAllUsers,
  getAllTheaters,
  deleteUser,
  deleteTheaterOwner,
  approveTheaterOwner
} = require('../controllers/adminController')


router.get('/dashboard', protect, checkAdmin, (req, res) => {
  res.send('Welcome Admin')
})

router.post('/movies', protect, checkAdmin, addMovie)
router.put('/movies/:id', protect, checkAdmin, updateMovie)
router.delete('/movies/:id', protect, checkAdmin, deleteMovie)
router.get('/movies', protect, checkAdmin, getAllMovies)
router.get('/users', protect, checkAdmin, getAllUsers)
router.get('/theaters', protect, checkAdmin, getAllTheaters)
router.delete('/users/:id', protect, checkAdmin, deleteUser)
router.delete('/theaters/:id', protect, checkAdmin, deleteTheaterOwner)
router.put('/theaters/:id/approve', protect, checkAdmin, approveTheaterOwner)

module.exports = router
