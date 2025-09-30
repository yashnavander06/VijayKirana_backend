const express = require('express');
const router = express.Router();
const {
  getAllMiniImages,
  getMiniImageById,
  addMiniImage,
  updateMiniImage,
  deleteMiniImage
} = require('../controllers/miniImageController');

const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// ✅ Any logged-in user can view mini images
router.route('/').get(getAllMiniImages);
router.route('/:id').get(getMiniImageById);

// ✅ Admin-only routes
router.route('/').post(verifyTokenAndAdmin, addMiniImage);
router.route('/:id').put(verifyTokenAndAdmin, updateMiniImage);
router.route('/:id').delete(verifyTokenAndAdmin, deleteMiniImage);

module.exports = router;
