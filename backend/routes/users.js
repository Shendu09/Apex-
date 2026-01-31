const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../utils/upload');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = ['profile', 'location', 'payment', 'language'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   POST /api/users/upload-photo
// @desc    Upload profile photo
// @access  Private
router.post('/upload-photo', protect, uploadImage.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photo'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.photo': req.file.path },
      { new: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      photoUrl: req.file.path,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading photo',
      error: error.message
    });
  }
});

// @route   GET /api/users/nearby-farmers
// @desc    Get nearby farmers (for buyers)
// @access  Private
router.get('/nearby-farmers', protect, authorize('buyer'), async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const farmers = await User.find({
      userType: 'farmer',
      active: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).select('profile location rating');

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby farmers',
      error: error.message
    });
  }
});

// @route   GET /api/users/farmer/:id
// @desc    Get farmer details
// @access  Public
router.get('/farmer/:id', async (req, res) => {
  try {
    const farmer = await User.findOne({
      _id: req.params.id,
      userType: 'farmer'
    }).select('profile location rating payment createdAt');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get farmer's product stats
    const productStats = await Product.aggregate([
      { $match: { farmer: farmer._id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          categories: { $addToSet: '$category' }
        }
      }
    ]);

    // Get completed orders count
    const completedOrders = await Order.countDocuments({
      farmer: farmer._id,
      status: 'delivered'
    });

    res.status(200).json({
      success: true,
      farmer,
      stats: {
        totalProducts: productStats[0]?.totalProducts || 0,
        categories: productStats[0]?.categories || [],
        completedOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer details',
      error: error.message
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let stats = {};

    if (req.user.userType === 'farmer') {
      // Farmer stats
      const totalProducts = await Product.countDocuments({ farmer: req.user._id });
      const activeProducts = await Product.countDocuments({ 
        farmer: req.user._id, 
        status: 'available' 
      });
      
      const orders = await Order.aggregate([
        { $match: { farmer: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.total' }
          }
        }
      ]);

      stats = {
        totalProducts,
        activeProducts,
        orders: orders.reduce((acc, curr) => {
          acc[curr._id] = {
            count: curr.count,
            revenue: curr.totalRevenue
          };
          return acc;
        }, {}),
        totalRevenue: orders.reduce((sum, curr) => sum + curr.totalRevenue, 0)
      };
    } else {
      // Buyer stats
      const totalOrders = await Order.countDocuments({ buyer: req.user._id });
      const ordersByStatus = await Order.aggregate([
        { $match: { buyer: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' }
          }
        }
      ]);

      stats = {
        totalOrders,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => {
          acc[curr._id] = {
            count: curr.count,
            spent: curr.totalSpent
          };
          return acc;
        }, {}),
        totalSpent: ordersByStatus.reduce((sum, curr) => sum + curr.totalSpent, 0)
      };
    }

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deactivating account',
      error: error.message
    });
  }
});

module.exports = router;
