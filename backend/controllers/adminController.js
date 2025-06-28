const Movie = require('../models/Movie')
const User = require('../models/User')

const addMovie = async (req, res) => {
  const { title, genre, language, duration, releaseDate, category, description, posterUrl } = req.body

  try {
    const movie = new Movie({
      title,
      genre,
      language,
      duration,
      releaseDate,
      category,
      description,
      posterUrl
    })

    const savedMovie = await movie.save()
    res.status(201).json({ message: 'Movie added successfully', movie: savedMovie })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateMovie = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, { new: true })

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json({ message: 'Movie updated successfully', movie: updatedMovie })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteMovie = async (req, res) => {
  const { id } = req.params

  try {
    const deletedMovie = await Movie.findByIdAndDelete(id)

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json({ message: 'Movie deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }) // latest first
    res.json({ movies })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password')
    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all theater owners
const getAllTheaters = async (req, res) => {
  try {
    const owners = await User.find({ role: 'theater_owner' }).select('-password')
    res.json({ owners })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const deletedUser = await User.findOneAndDelete({ _id: id, role: 'user' })
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found or already deleted' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteTheaterOwner = async (req, res) => {
  const { id } = req.params
  try {
    const deletedOwner = await User.findOneAndDelete({ _id: id, role: 'theater_owner' })
    if (!deletedOwner) {
      return res.status(404).json({ message: 'Theater owner not found or already deleted' })
    }
    res.json({ message: 'Theater owner deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const approveTheaterOwner = async (req, res) => {
  const { id } = req.params
  try {
    const owner = await User.findOne({ _id: id, role: 'theater_owner' })
    if (!owner) {
      return res.status(404).json({ message: 'Theater owner not found' })
    }
    owner.isApproved = true
    await owner.save()
    res.json({ message: 'Theater owner approved successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


module.exports = {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getAllUsers,
  getAllTheaters,
  deleteUser,
  deleteTheaterOwner,
  approveTheaterOwner
}
