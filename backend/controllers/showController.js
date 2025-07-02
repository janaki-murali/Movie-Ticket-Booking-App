const Show = require('../models/Show')

const getShowSeats = async (req, res) => {
  const { id } = req.params

  try {
    const show = await Show.findById(id).select('seats')
    if (!show) {
      return res.status(404).json({ message: 'Show not found' })
    }

    res.status(200).json({ seats: show.seats })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getShowSeats }
