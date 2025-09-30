const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  getOrdersByStatus,
  addOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus
} = require('../controllers/orderController');

const {  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin, } = require('../middleware/verifyToken');

// Admin-only: view all orders
router.route('/').get(verifyToken, verifyTokenAndAdmin, getAllOrders);

// Any logged-in user can view their own order (controller will check owner/admin)

router.route('/user/:id').get(verifyToken, getOrdersByUserId);
router.route('/:id').get(verifyToken, getOrderById);

// Admin-only: view orders by status
router.route('/status/:status').get(verifyToken, verifyTokenAndAdmin, getOrdersByStatus);

// Any logged-in user can place an order
router.route('/').post(verifyToken, addOrder);

// Only owner or admin can update/delete an order — controller will validate permissions
router.route('/:id').put(verifyToken, updateOrder);
router.route('/:id').delete(verifyToken, deleteOrder);

// Admin or owner can update order status
router.route('/:id').patch(verifyToken, updateOrderStatus);

module.exports = router;
