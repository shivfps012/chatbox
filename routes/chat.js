const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/chat
// @desc    Get all user chats
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const chats = await Chat.find({ 
      userId: req.user._id, 
      isActive: true 
    })
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(limit)
    .select('title lastActivity createdAt messages');

    const total = await Chat.countDocuments({ 
      userId: req.user._id, 
      isActive: true 
    });

    res.json({
      chats,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/:id
// @desc    Get specific chat
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat
// @desc    Create new chat
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, message } = req.body;

    const chat = new Chat({
      userId: req.user._id,
      title: title || 'New Chat',
      messages: message ? [{
        id: Date.now().toString(),
        content: message.content,
        sender: message.sender || 'user',
        timestamp: new Date(),
        attachments: message.attachments || []
      }] : []
    });

    // Generate title from first message if not provided
    if (!title && message) {
      chat.generateTitle();
    }

    await chat.save();

    res.status(201).json({
      message: 'Chat created successfully',
      chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/:id/messages
// @desc    Add message to chat
// @access  Private
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { content, sender, attachments } = req.body;

    if (!content || !sender) {
      return res.status(400).json({ message: 'Content and sender are required' });
    }

    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      sender,
      timestamp: new Date(),
      attachments: attachments || []
    };

    chat.messages.push(newMessage);
    chat.lastActivity = new Date();

    // Generate title from first user message if chat has default title
    if (chat.title === 'New Chat' && sender === 'user') {
      chat.generateTitle();
    }

    await chat.save();

    // Simulate AI response for user messages
    if (sender === 'user') {
      setTimeout(async () => {
        try {
          const aiResponse = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            content: generateAIResponse(content),
            sender: 'assistant',
            timestamp: new Date(),
            attachments: []
          };

          chat.messages.push(aiResponse);
          chat.lastActivity = new Date();
          await chat.save();
        } catch (error) {
          console.error('AI response error:', error);
        }
      }, 1500);
    }

    res.status(201).json({
      message: 'Message added successfully',
      messageId: newMessage.id,
      chat
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chat/:id
// @desc    Update chat title
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true
      },
      { title: title.trim() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({
      message: 'Chat updated successfully',
      chat
    });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/:id
// @desc    Delete chat (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simple AI response generator (replace with actual AI service)
const generateAIResponse = (userMessage) => {
  const responses = [
    `I understand you said: "${userMessage}". How can I help you further?`,
    `That's interesting! Regarding "${userMessage}", let me provide some assistance.`,
    `Thank you for sharing that. Based on your message about "${userMessage}", here's what I think...`,
    `I've received your message: "${userMessage}". Let me help you with that.`,
    `Great question! About "${userMessage}" - I'd be happy to assist you.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

module.exports = router;