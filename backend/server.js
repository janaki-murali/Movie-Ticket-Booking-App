const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const app = express()
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/api/user', userRoutes)
const theaterOwnerRoutes = require('./routes/theaterOwnerRoutes')
app.use('/api/theater', theaterOwnerRoutes)
const adminRoutes = require('./routes/adminRoutes')
app.use('/api/admin', adminRoutes)
const bookingRoutes = require('./routes/bookingRoutes')
app.use('/api/bookings', bookingRoutes)

const showRoutes = require('./routes/showRoutes')
app.use('/api/shows', showRoutes)
const paymentRoutes = require('./routes/paymentRoutes')
app.use('/api/payments', paymentRoutes)
const reviewRoutes = require('./routes/reviewRoutes')
app.use('/api/reviews', reviewRoutes)



app.get('/', (req, res) => {
  res.send('API is running')
})

mongoose.connect(process.env.MONGO_URI) 
  .then(() => {
    console.log('MongoDB connected')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => {
    console.log('MongoDB connection error:', err.message)
  })
