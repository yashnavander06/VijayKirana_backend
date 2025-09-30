// api/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product'); // ensure path is correct

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({}).populate('buyer');
    res.status(200).json({ allOrders });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

// Owner or admin can view (controller enforces)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyer');
    if (!order) 
      return res.status(404).json({ status: 'failed', message: 'Order not found' });

    const requesterId = String(req.user?.id ?? req.user?._id); // convert to string
    const buyerId = String(order.buyer?._id ?? order.buyer); // convert to string
    const isAdmin = !!req.user?.admin;

    if (!isAdmin && requesterId !== buyerId) {
      console.warn('403 Blocked', { requesterId, buyerId, isAdmin });
      return res.status(403).json({ message: 'Not allowed to view this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

// Get orders by user id: only that user or admin
exports.getOrdersByUserId = async (req, res) => {
  try {
    const requesterId = req.user?.id;
    const isAdmin = !!req.user?.admin;
    if (!isAdmin && requesterId !== req.params.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    const orders = await Order.find({ buyer: req.params.id }).populate('buyer');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status }).populate('buyer');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

// Add order: use req.user.id as buyer (do not trust client)
exports.addOrder = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const payload = { ...req.body, buyer: buyerId };
    const newOrder = await Order.create(payload);
    res.status(201).json({ newOrder });
  } catch (error) {
    res.status(400).json({ status: 'failed', error: error.message });
  }
};

// Update order: only owner or admin; cannot set stage to null
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 'failed', message: 'Order not found' });

    const requesterId = req.user?.id;
    const isAdmin = !!req.user?.admin;
    if (!isAdmin && requesterId !== order.buyer.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this order' });
    }

    // Prevent stage being set to null - only update defined fields
    const updates = { ...req.body };
    if ('stage' in updates && (updates.stage === null)) {
      delete updates.stage;
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ order: updated });
  } catch (error) {
    res.status(400).json({ status: 'failed', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 'failed', message: 'Order not found' });

    const requesterId = req.user?.id;
    const isAdmin = !!req.user?.admin;
    if (!isAdmin && requesterId !== order.buyer.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this order' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(400).json({ status: 'failed', error: error.message });
  }
};

/**
 * updateOrderStatus
 * - Only buyer (owner) or admin may update status or stage.
 * - If status === 'cancelled', restore inventory safely.
 * - Do not set stage to null; only set stage when provided and not null.
 */
// api/controllers/orderController.js

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, stage } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const requesterId = req.user?.id;
    const isAdmin = !!req.user?.admin;
    if (!isAdmin && requesterId !== order.buyer.toString()) {
      return res.status(403).json({ message: 'You are not allowed to do that!' });
    }

    // Restore inventory if order is cancelled
    if (status === 'cancelled') {
      for (const item of order.products) {
        try {
          const prod = await Product.findById(item.product);
          if (!prod) continue;

          // ✅ Increase product-level inventory only
          prod.inventory = (prod.inventory || 0) + (item.amount || 0);
          await prod.save();
        } catch (err) {
          console.error('Error restoring inventory for item', item, err.message);
        }
      }
    }

    // ✅ Update status and stage safely
    if (status !== undefined) order.status = status;
    if (stage !== undefined && stage !== null) order.stage = stage;

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
