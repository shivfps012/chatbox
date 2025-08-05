const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Chat = require('../models/Chat');
const router = express.Router();

// @route   GET /api/stats
// @desc    Get account statistics
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get active users (users who logged in within the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: sevenDaysAgo } });
    
    // Get new users (users who registered within the last 7 days)
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
    // Get total chats
    const totalChats = await Chat.countDocuments();
    
    // Get total messages
    const messageStats = await Chat.aggregate([
      {
        $unwind: '$messages'
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 }
        }
      }
    ]);
    const totalMessages = messageStats.length > 0 ? messageStats[0].totalMessages : 0;
    
    // Get active chats (chats with messages in the last 7 days)
    const activeChats = await Chat.countDocuments({
      'messages.timestamp': { $gte: sevenDaysAgo }
    });
    
    // Get users by authentication method
    const googleUsers = await User.countDocuments({ googleId: { $exists: true, $ne: null } });
    const emailUsers = totalUsers - googleUsers;
    
    // Get verification stats
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    res.json({
      userStats: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        verified: verifiedUsers,
        byAuthMethod: {
          email: emailUsers,
          google: googleUsers
        }
      },
      chatStats: {
        total: totalChats,
        active: activeChats,
        totalMessages
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// @route   GET /api/stats/realtime
// @desc    Get realtime statistics (for websocket/SSE connection)
// @access  Private (Admin only)
router.get('/realtime', auth, (req, res) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Function to send statistics
  const sendStats = async () => {
    try {
      // Get the same statistics as the regular endpoint
      const totalUsers = await User.countDocuments();
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const activeUsers = await User.countDocuments({ lastLogin: { $gte: sevenDaysAgo } });
      const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
      
      const totalChats = await Chat.countDocuments();
      const messageStats = await Chat.aggregate([
        {
          $unwind: '$messages'
        },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 }
          }
        }
      ]);
      const totalMessages = messageStats.length > 0 ? messageStats[0].totalMessages : 0;
      
      const stats = {
        userStats: {
          total: totalUsers,
          active: activeUsers,
          new: newUsers
        },
        chatStats: {
          total: totalChats,
          totalMessages
        },
        timestamp: new Date()
      };
      
      // Send the data as an SSE event
      res.write(`data: ${JSON.stringify(stats)}\n\n`);
    } catch (error) {
      console.error('Error generating real-time stats:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate statistics' })}\n\n`);
    }
  };
  
  // Send initial statistics
  sendStats();
  
  // Set up interval to send statistics every 10 seconds
  const intervalId = setInterval(sendStats, 10000);
  
  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

module.exports = router;
