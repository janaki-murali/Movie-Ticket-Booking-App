const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  } else {
    res.status(401).json({ message: 'No token provided' })
  }
}

const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' })
  }
  next()
}

const checkTheaterOwner = (req, res, next) => {
  if (req.user.role !== 'theater_owner') {
    return res.status(403).json({ message: 'Access denied: Theater owners only' })
  }
  next()
}

const checkUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied: Users only' })
  }
  next()
}

module.exports = { protect, checkAdmin, checkTheaterOwner, checkUser }
