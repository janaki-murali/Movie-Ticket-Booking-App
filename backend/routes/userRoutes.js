const express = require('express')
const router = express.Router()
const { protect, checkUser } = require('../middleware/authMiddleware')

router.get('/dashboard', protect, checkUser, (req, res) => {
  res.send('Welcome User')
})

module.exports = router
