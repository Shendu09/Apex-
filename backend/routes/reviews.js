const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create review for delivered order
// @access  Private (Buyer)
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const { orderId, ratings, comment, images } = req.body;

    // Validate order
    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user._id,
      status: 'delivered'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not delivered yet'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this order'
      });
    }

    // Create review
    const review = await Review.create({
      order: orderId,
      product: order.product,
      farmer: order.farmer,
      buyer: req.user._id,
      ratings,
      comment,
      images: images || []
    });

    // Update order with review reference
    order.review = review._id;
    order.rating = ratings;
    await order.save();

    // Update product rating
    const productReviews = await Review.find({ product: order.product });
    const avgProductRating = productReviews.reduce((sum, r) => sum + r.ratings.product, 0) / productReviews.length;
    await Product.findByIdAndUpdate(order.product, {
      'rating.average': avgProductRating,
      'rating.count': productReviews.length
    });

    // Update farmer rating
    const farmerReviews = await Review.find({ farmer: order.farmer });
    const avgFarmerRating = farmerReviews.reduce((sum, r) => sum + r.ratings.farmer, 0) / farmerReviews.length;
    await User.findByIdAndUpdate(order.farmer, {
      'rating.average': avgFarmerRating,
      'rating.count': farmerReviews.length
    });

    const populatedReview = await Review.findById(review._id)
      .populate('buyer', 'profile')
      .populate('product', 'name images')
      .populate('farmer', 'profile');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ product: req.params.productId })
      .populate('buyer', 'profile')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: req.params.productId });

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(req.params.productId) } },
      {
        $group: {
          _id: '$ratings.product',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      ratingDistribution,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/farmer/:farmerId
// @desc    Get reviews for a farmer
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ farmer: req.params.farmerId })
      .populate('buyer', 'profile')
      .populate('product', 'name images')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ farmer: req.params.farmerId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private (Buyer)
router.put('/:id', protect, authorize('buyer'), async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      buyer: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const { ratings, comment, images } = req.body;

    if (ratings) review.ratings = ratings;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

// @route   POST /api/reviews/:id/response
// @desc    Farmer response to review
// @access  Private (Farmer)
router.post('/:id/response', protect, authorize('farmer'), async (req, res) => {
  try {
    const { text } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.response = {
      text,
      respondedAt: new Date(),
      respondedBy: req.user._id
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message
    });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      helpful: review.helpful
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

module.exports = router;
