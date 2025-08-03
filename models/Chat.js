const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
});

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  attachments: [attachmentSchema]
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat',
    maxlength: 200
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ userId: 1, isActive: 1 });
chatSchema.index({ 'messages.id': 1 });

// Update lastActivity on message addition
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Generate chat title from first message
chatSchema.methods.generateTitle = function() {
  if (this.messages.length > 0) {
    const firstUserMessage = this.messages.find(msg => msg.sender === 'user');
    if (firstUserMessage) {
      this.title = firstUserMessage.content.substring(0, 50) + 
                   (firstUserMessage.content.length > 50 ? '...' : '');
    }
  }
};

module.exports = mongoose.model('Chat', chatSchema);