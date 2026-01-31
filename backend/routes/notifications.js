const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // In production, store notifications in database
    // For now, return sample structure
    const notifications = [
      {
        id: 1,
        type: 'order',
        title: 'New Order',
        message: 'You have a new order',
        read: false,
        createdAt: new Date()
      }
    ];

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// @route   POST /api/notifications/fcm-token
// @desc    Save FCM token for push notifications
// @access  Private
router.post('/fcm-token', protect, async (req, res) => {
  try {
    const { token } = req.body;

    // Update user's FCM token
    await User.findByIdAndUpdate(req.user._id, {
      fcmToken: token
    });

    res.status(200).json({
      success: true,
      message: 'FCM token saved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving FCM token',
      error: error.message
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

module.exports = router;
