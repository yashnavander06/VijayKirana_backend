const express = require('express');
const router = express.Router();
const {
  getAllGenres,
  getGenreById,
  addGenre,
  updateGenre,
  deleteGenre
} = require('../controllers/genreController');

const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// ✅ Any logged-in user can view genres
router.route('/').get(getAllGenres);
router.route('/:id').get( getGenreById);

// ✅ Admin-only routes
router.route('/').post(verifyTokenAndAdmin, addGenre);
router.route('/:id').put(verifyTokenAndAdmin, updateGenre);
router.route('/:id').delete(verifyTokenAndAdmin, deleteGenre);

module.exports = router;
