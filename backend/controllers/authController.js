const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Helper to hash password
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(plainPassword, salt)
}

// Register Regular User
const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await hashPassword(password)

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user'
    })

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Register Theater Owner (account only — approval required before login)
const registerTheaterOwner = async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Theater owner already exists' })
    }

    const hashedPassword = await hashPassword(password)

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'theater_owner',
      isApproved: false
    })

    res.status(201).json({ message: 'Theater owner registered successfully. Awaiting admin approval.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Register Admin (requires secret code)
const registerAdmin = async (req, res) => {
  const { name, email, phone, password, secretCode } = req.body

  if (secretCode !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized admin registration' })
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Admin already exists' })
    }

    const hashedPassword = await hashPassword(password)

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin'
    })

    res.status(201).json({ message: 'Admin registered successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Login for all roles
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    // 🚫 Block unapproved theater_owner from logging in
    if (user.role === 'theater_owner' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is not yet approved by admin' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  registerUser,
  registerTheaterOwner,
  registerAdmin,
  loginUser
}
