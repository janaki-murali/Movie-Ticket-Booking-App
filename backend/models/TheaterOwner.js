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
  totalScreens: {
    type: Number,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  licenseId: {
  type: String,
  required: true,
  unique: true
}
}, { timestamps: true })

const Theater = mongoose.model('Theater', theaterSchema)
module.exports = Theater
