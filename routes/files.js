const express = require('express');
const File = require('../models/File');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// @route   POST /api/files/upload
// @desc    Upload files
// @access  Private
router.post('/upload', auth, upload.array('files', 5), handleMulterError, async (req, res) => {
  try {
    const { chatId, messageId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    if (!chatId || !messageId) {
      return res.status(400).json({ message: 'Chat ID and Message ID are required' });
    }

    // Verify chat belongs to user
    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileUrl = `${process.env.SERVER_URL}/uploads/${req.user.id}/${file.filename}`;
      
      const fileDoc = new File({
        userId: req.user.id,
        chatId,
        messageId,
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl
      });

      await fileDoc.save();

      uploadedFiles.push({
        id: fileDoc._id.toString(),
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: fileUrl,
        path: file.path
      });
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

// @route   GET /api/files
// @desc    Get user files
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const chatId = req.query.chatId;

    const query = { 
      userId: req.user.id, 
      isActive: true 
    };

    if (chatId) {
      query.chatId = chatId;
    }

    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('chatId', 'title')
      .select('originalName filename mimetype size url createdAt chatId messageId');

    const total = await File.countDocuments(query);

    res.json({
      files,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/files/:id
// @desc    Get specific file
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    }).populate('chatId', 'title');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ file });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/files/:id/download
// @desc    Download file
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isActive: true
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimetype);

    // Stream the file
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/files/:id
// @desc    Delete file (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/files/stats/summary
// @desc    Get file statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = await File.aggregate([
      { $match: { userId: req.user.id, isActive: true } },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' },
          avgSize: { $avg: '$size' }
        }
      }
    ]);

    const typeStats = await File.aggregate([
      { $match: { userId: req.user.id, isActive: true } },
      {
        $group: {
          _id: '$mimetype',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      summary: stats[0] || { totalFiles: 0, totalSize: 0, avgSize: 0 },
      byType: typeStats
    });
  } catch (error) {
    console.error('Get file stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;