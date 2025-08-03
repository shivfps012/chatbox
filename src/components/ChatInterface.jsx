import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Copy, Download, FileText, File, Moon, Sun, LogOut, Settings, User, Image } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import FileUpload from './FileUpload.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE_URL = 'http://localhost:5000/api';

const ChatInterface = ({ onShowProfile }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. You can chat with me and upload files (PDF, MSG, EML, TXT, DOCX) for analysis.',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user, logout, token, getAuthHeaders } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (user && token) {
      loadChats();
      createNewChat();
    }
  }, [user, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: 'New Chat'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentChatId(data.chat._id);
        setMessages(data.chat.messages || [
          {
            id: '1',
            content: 'Hello! I\'m your AI assistant. You can chat with me and upload files (PDF, MSG, EML, TXT, DOCX) for analysis.',
            sender: 'assistant',
            timestamp: new Date(),
          }
        ]);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChatId) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await fetch(`${API_BASE_URL}/chat/${currentChatId}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: inputValue,
          sender: 'user'
        })
      });

      if (response.ok) {
        const data = await response.json();
        // The backend will automatically generate AI response
        // We'll poll for updates or use WebSocket in production
        setTimeout(() => {
          loadCurrentChat();
          setIsTyping(false);
        }, 2000);
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const loadCurrentChat = async () => {
    if (!currentChatId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/${currentChatId}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.chat.messages);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files) => {
    if (!currentChatId) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('chatId', currentChatId);
    formData.append('messageId', Date.now().toString());

    // Upload files to backend
    fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.files) {
        // Create message with uploaded files
        const fileMessage = {
          id: Date.now().toString(),
          content: `Uploaded ${data.files.length} file(s)`,
          sender: 'user',
          timestamp: new Date(),
          attachments: data.files
        };

        setMessages(prev => [...prev, fileMessage]);
      }
    })
    .catch(error => {
      console.error('Error uploading files:', error);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">AI Assistant</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload files and chat with AI</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={onShowProfile}
                />
              ) : user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={onShowProfile}
                />
              ) : (
                <div 
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={onShowProfile}
                >
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </div>
            <button
              onClick={onShowProfile}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Profile Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={logout}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-6 ${dragActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AI
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Drag Overlay */}
        {dragActive && (
          <div className="fixed inset-0 bg-blue-500 bg-opacity-20 dark:bg-blue-400 dark:bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl border-2 border-dashed border-blue-400 dark:border-blue-500">
              <div className="text-center">
                <Paperclip className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">Drop your files here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supports PDF, MSG, EML, TXT, DOCX</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Upload files or images"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none max-h-32 min-h-[48px]"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 bottom-2 p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.msg,.eml,.txt,.docx,.doc,image/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default ChatInterface;