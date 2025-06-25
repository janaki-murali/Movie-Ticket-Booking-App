const express = require('express')
const router = express.Router()
const { protect, checkTheaterOwner } = require('../middleware/authMiddleware')

router.get('/dashboard', protect, checkTheaterOwner, (req, res) => {
  res.send('Welcome Theater Owner')
})

module.exports = router
