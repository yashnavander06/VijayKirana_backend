const express = require('express');
const router = express.Router();
const {
  getAllComments,
  getCommentById,
  getCommentByAuthorId,
  getCommentByProductId,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const { verifyToken, verifyTokenAndAuthorization } = require('../middleware/verifyToken');

// ✅ Any logged-in user can view comments
router.route('/').get(getAllComments);
router.route('/author/:id').get( getCommentByAuthorId);
router.route('/product/:id').get( getCommentByProductId);
router.route('/:id').get( getCommentById);

// ✅ Any logged-in user can add a comment
router.route('/').post(verifyToken, addComment);

// ✅ Only author of the comment OR admin can update/delete
router.route('/:id').put(verifyTokenAndAuthorization, updateComment);
router.route('/:id').delete(verifyTokenAndAuthorization, deleteComment);

module.exports = router;
