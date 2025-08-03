const express = require('express');
const User = require('../models/User');
const Chat = require('../models/Chat');
const File = require('../models/File');
const auth = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user statistics
    const chatCount = await Chat.countDocuments({ userId: req.user.id, isActive: true });
    const messageCount = await Chat.aggregate([
      { $match: { userId: req.user.id, isActive: true } },
      { $project: { messageCount: { $size: '$messages' } } },
      { $group: { _id: null, total: { $sum: '$messageCount' } } }
    ]);
    const fileCount = await File.countDocuments({ userId: req.user.id, isActive: true });

    const stats = {
      chats: chatCount,
      messages: messageCount[0]?.total || 0,
      files: fileCount,
      joinDate: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.json({
      user: user.toJSON(),
      stats
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validation
    if (name && name.trim().length === 0) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update fields
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase();

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/user/profile-image
// @desc    Upload profile image
// @access  Private
router.post('/profile-image', auth, upload.single('profileImage'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile image URL
    const imageUrl = `${process.env.SERVER_URL}/uploads/${req.user.id}/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();

    res.json({
      message: 'Profile image updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/user/profile-image
// @desc    Remove profile image
// @access  Private
router.delete('/profile-image', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = null;
    await user.save();

    res.json({
      message: 'Profile image removed successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Remove profile image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const [chatCount, messageStats, fileCount] = await Promise.all([
      Chat.countDocuments({ userId: req.user.id, isActive: true }),
      Chat.aggregate([
        { $match: { userId: req.user.id, isActive: true } },
        { $project: { messageCount: { $size: '$messages' } } },
        { $group: { _id: null, total: { $sum: '$messageCount' } } }
      ]),
      File.countDocuments({ userId: req.user.id, isActive: true })
    ]);

    const stats = {
      chats: chatCount,
      messages: messageStats[0]?.total || 0,
      files: fileCount,
      joinDate: req.user.createdAt,
      lastLogin: req.user.lastLogin
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;