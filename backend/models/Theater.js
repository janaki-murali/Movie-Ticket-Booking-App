const mongoose = require('mongoose')

const theaterSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  licenseId: {
    type: String,
    required: true,
    unique: true
  },
  totalScreens: {
    type: Number,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  averageRating: {
  type: Number,
  default: 0
 }
}, { timestamps: true })

module.exports = mongoose.model('Theater', theaterSchema)
