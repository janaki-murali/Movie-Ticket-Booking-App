const express = require('express')
const router = express.Router()
const { protect, checkAdmin } = require('../middleware/authMiddleware')

router.get('/dashboard', protect, checkAdmin, (req, res) => {
  res.send('Welcome Admin')
})

module.exports = router
