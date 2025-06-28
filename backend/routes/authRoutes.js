const express = require('express')
const router = express.Router()
const {
  registerUser,
  registerTheaterOwner,
  registerAdmin,
  loginUser
} = require('../controllers/authController')

const { protect } = require('../middleware/authMiddleware')

router.post('/register-user', registerUser)
router.post('/register-theater', registerTheaterOwner)
router.post('/register-admin', registerAdmin)
router.post('/login', loginUser)
router.get('/profile', protect, async (req, res) => {
  res.json(req.user)
})

module.exports = router
