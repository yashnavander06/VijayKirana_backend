const express = require('express');
const router = express.Router();
const {
  getAllImages,
  getImageById,
  addImage,
  updateImage,
  deleteImage
} = require('../controllers/imageController');

const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// ✅ Any logged-in user can view images
router.route('/').get(getAllImages);
router.route('/:id').get(getImageById);

// ✅ Admin-only routes
router.route('/').post(verifyTokenAndAdmin, addImage);
router.route('/:id').put(verifyTokenAndAdmin, updateImage);
router.route('/:id').delete(verifyTokenAndAdmin, deleteImage);

module.exports = router;
