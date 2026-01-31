const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Buyer)
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress, paymentMethod } = req.body;

    // Validate product
    const product = await Product.findById(productId).populate('farmer');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    if (product.quantity.available < quantity.amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient product quantity'
      });
    }

    // Calculate pricing
    const subtotal = product.price.amount * quantity.amount;
    const deliveryFee = 50; // Fixed delivery fee, can be dynamic
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + deliveryFee + tax;

    // Create order
    const order = await Order.create({
      buyer: req.user._id,
      farmer: product.farmer._id,
      product: product._id,
      productDetails: {
        name: product.name,
        category: product.category,
        image: product.images[0]?.url,
        price: product.price.amount,
        unit: product.price.unit
      },
      quantity,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        total
      },
      deliveryAddress,
      pickupAddress: {
        fullAddress: product.deliveryAddress || product.farmer.profile.address,
        location: product.location
      },
      payment: {
        method: paymentMethod,
        farmerAccount: product.farmer.payment
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed'
      }]
    });

    // Update product quantity
    product.quantity.available -= quantity.amount;
    product.orders += 1;
    await product.save();

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'profile phoneNumber')
      .populate('farmer', 'profile phoneNumber payment')
      .populate('product');

    // Send real-time notification to farmer
    const io = req.app.get('io');
    io.to(`user_${product.farmer._id}`).emit('newOrder', {
      orderId: order.orderId,
      buyer: req.user.profile.name,
      product: product.name,
      amount: total
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (req.user.userType === 'buyer') {
      query.buyer = req.user._id;
    } else {
      query.farmer = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('buyer', 'profile phoneNumber')
      .populate('farmer', 'profile phoneNumber payment')
      .populate('product')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'profile phoneNumber')
      .populate('farmer', 'profile phoneNumber payment')
      .populate('product')
      .populate('review');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.buyer._id.toString() !== req.user._id.toString() &&
        order.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer)
router.put('/:id/status', protect, authorize('farmer'), async (req, res) => {
  try {
    const { status, note, location } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      location,
      note
    });

    // Update tracking location if provided
    if (location) {
      order.tracking.currentLocation = location;
      order.tracking.route.push({
        location,
        timestamp: new Date()
      });
    }

    // Mark as delivered
    if (status === 'delivered') {
      order.delivery.deliveredAt = new Date();
      order.payment.status = order.payment.method === 'cod' ? 'completed' : order.payment.status;
    }

    await order.save();

    // Send real-time notification to buyer
    const io = req.app.get('io');
    io.to(`user_${order.buyer}`).emit('orderUpdate', {
      orderId: order.orderId,
      status,
      note
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id/tracking
// @desc    Update order tracking location
// @access  Private (Farmer)
router.put('/:id/tracking', protect, authorize('farmer'), async (req, res) => {
  try {
    const { location, estimatedDelivery, deliveryPartner } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (location) {
      order.tracking.currentLocation = location;
      order.tracking.route.push({
        location,
        timestamp: new Date()
      });
    }

    if (estimatedDelivery) {
      order.tracking.estimatedDelivery = estimatedDelivery;
    }

    if (deliveryPartner) {
      order.tracking.deliveryPartner = deliveryPartner;
    }

    await order.save();

    // Send real-time location update
    const io = req.app.get('io');
    io.to(`user_${order.buyer}`).emit('locationUpdate', {
      orderId: order.orderId,
      location: order.tracking.currentLocation,
      estimatedDelivery: order.tracking.estimatedDelivery
    });

    res.status(200).json({
      success: true,
      message: 'Tracking updated',
      tracking: order.tracking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tracking',
      error: error.message
    });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.buyer.toString() !== req.user._id.toString() &&
        order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Order cancelled by user'
    });

    await order.save();

    // Restore product quantity
    await Product.findByIdAndUpdate(order.product, {
      $inc: { 'quantity.available': order.quantity.amount }
    });

    // Notify other party
    const io = req.app.get('io');
    const notifyUserId = req.user.userType === 'buyer' ? order.farmer : order.buyer;
    io.to(`user_${notifyUserId}`).emit('orderCancelled', {
      orderId: order.orderId,
      reason: req.body.reason
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

// @route   POST /api/orders/:id/return
// @desc    Request order return
// @access  Private (Buyer)
router.post('/:id/return', protect, authorize('buyer'), async (req, res) => {
  try {
    const { reason, images } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders can be returned'
      });
    }

    order.returnRequest = {
      requested: true,
      reason,
      status: 'pending',
      requestedAt: new Date(),
      images: images || []
    };

    await order.save();

    // Notify farmer
    const io = req.app.get('io');
    io.to(`user_${order.farmer}`).emit('returnRequest', {
      orderId: order.orderId,
      reason
    });

    res.status(200).json({
      success: true,
      message: 'Return request submitted',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting return request',
      error: error.message
    });
  }
});

module.exports = router;
