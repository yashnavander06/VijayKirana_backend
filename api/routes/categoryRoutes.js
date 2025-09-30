const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  getCategoryByGenre,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// ✅ Public routes (any logged-in user)
router.route('/').get(getAllCategories);
router.route('/genre/:id').get( getCategoryByGenre);
router.route('/:id').get( getCategoryById);

// ✅ Admin-only routes
router.route('/').post(verifyTokenAndAdmin, addCategory);
router.route('/:id').put(verifyTokenAndAdmin, updateCategory);
router.route('/:id').delete(verifyTokenAndAdmin, deleteCategory);

module.exports = router;
