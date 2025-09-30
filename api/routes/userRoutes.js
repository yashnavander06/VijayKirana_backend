const express = require('express');
const router = express.Router();
const {   verifyToken,  verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const { getAllUsers, getUserById, updateUser, deleteUser, addFavorite, deleteFavorite } = require('../controllers/userController');
const { Login, Register } = require('../controllers/authController');

router.route('/').get(verifyToken, verifyTokenAndAdmin, getAllUsers);
router.route('/:id').get(verifyTokenAndAuthorization, getUserById);
router.route('/:id').put(verifyTokenAndAuthorization, updateUser);
router.route('/:id').delete(verifyTokenAndAuthorization, deleteUser);
router.route('/register').post(Register);
router.route('/login').post(Login);
router.route('/:id/favorite/:favorite').post(verifyTokenAndAuthorization, addFavorite);
router.route('/:id/favorite/:favorite').delete(verifyTokenAndAuthorization, deleteFavorite);

module.exports = router;