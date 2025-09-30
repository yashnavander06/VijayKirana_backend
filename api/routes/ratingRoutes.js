const express = require('express');
const router = express.Router();
const {getAllRatings,getRatingById,getRatingByOwnerId,getRatingByProductId,addRating,updateRating,deleteRating} = require('../controllers/ratingController');

const { verifyToken, verifyTokenAndAuthorization } = require('../middleware/verifyToken');

// ✅ Any logged-in user can view ratings
router.route('/').get(getAllRatings);
router.route('/owner/:id').get( getRatingByOwnerId);
router.route('/product/:id').get( getRatingByProductId);
router.route('/:id').get( getRatingById);

// ✅ Any logged-in user can add a rating
router.route('/').post(verifyToken, addRating);

// ✅ Only owner or admin can update/delete a rating
router.route('/:id').put(verifyTokenAndAuthorization, updateRating);
router.route('/:id').delete(verifyTokenAndAuthorization, deleteRating);

module.exports = router;
