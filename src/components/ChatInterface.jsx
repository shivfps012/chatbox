import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Copy, Download, FileText, File, Moon, Sun, LogOut, Settings, User, Image } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import FileUpload from './FileUpload.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { api } from '../utils/api.js';

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
  const [showChatSelector, setShowChatSelector] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatSelectorRef = useRef(null);
  const { user, logout, token, getAuthHeaders } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (user && token) {
      loadChatsAndInitialize();
    }
  }, [user, token]);

  const loadChatsAndInitialize = async () => {
    try {
      const response = await api.chat.getAll(token);

      if (response.ok) {
        const data = await response.json();
        const existingChats = data.chats || [];
        setChats(existingChats);

        if (existingChats.length > 0) {
          // Load the most recent chat
          const mostRecentChat = existingChats[0];
          setCurrentChatId(mostRecentChat._id);
          
          // Load messages from the most recent chat
          const chatResponse = await api.chat.getById(token, mostRecentChat._id);
          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            const messagesWithDates = chatData.chat.messages.map(message => ({
              ...message,
              timestamp: new Date(message.timestamp)
            }));
            setMessages(messagesWithDates);
          }
        } else {
          // Only create a new chat if there are no existing chats
          createNewChat();
        }
      } else {
        console.error('Failed to load chats:', response.status);
        // Fallback to creating a new chat if loading fails
        createNewChat();
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      // Fallback to creating a new chat if loading fails
      createNewChat();
    }
  };

  // Function to refresh user data (useful for profile image updates)
  const refreshUserData = async () => {
    try {
      const response = await api.auth.me(token);
      if (response.ok) {
        const data = await response.json();
        // Update user data in localStorage and context
        localStorage.setItem('user', JSON.stringify(data.user));
        // Note: You might need to update the auth context here if you have a way to refresh it
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chat selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatSelectorRef.current && !chatSelectorRef.current.contains(event.target)) {
        setShowChatSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
console.log("Token:", token);


  const createNewChat = async () => {
    try {
      const response = await api.chat.create(token, {
        title: 'New Chat'
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
      } else {
        console.error('Failed to create chat:', response.status);
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
      const response = await api.chat.addMessage(token, currentChatId, {
        content: inputValue,
        sender: 'user'
      });

      if (response.ok) {
        const data = await response.json();
        // The backend will automatically generate AI response
        // We'll poll for updates or use WebSocket in production
        setTimeout(() => {
          loadCurrentChat();
          loadChatsAndInitialize(); // Refresh chat list to show updated titles
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
      const response = await api.chat.getById(token, currentChatId);

      if (response.ok) {
        const data = await response.json();
        // Ensure timestamps are Date objects
        const messagesWithDates = data.chat.messages.map(message => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const switchToChat = async (chatId) => {
    setCurrentChatId(chatId);
    setShowChatSelector(false);
    await loadCurrentChat();
  };

  const createNewChatAndSwitch = async () => {
    try {
      const response = await api.chat.create(token, {
        title: 'New Chat'
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentChatId(data.chat._id);
        setMessages([
          {
            id: '1',
            content: 'Hello! I\'m your AI assistant. You can chat with me and upload files (PDF, MSG, EML, TXT, DOCX) for analysis.',
            sender: 'assistant',
            timestamp: new Date(),
          }
        ]);
        // Refresh chat list
        await loadChatsAndInitialize();
      } else {
        console.error('Failed to create chat:', response.status);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const deleteChat = async (chatId, event) => {
    event.stopPropagation(); // Prevent switching to the chat
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    if (isDeleting) return; // Prevent multiple simultaneous deletions
    setIsDeleting(true);

    // Disable the delete button to prevent rapid clicks
    const deleteButton = event.target.closest('button');
    if (deleteButton) {
      deleteButton.disabled = true;
      deleteButton.style.opacity = '0.5';
    }

    try {
      const response = await api.chat.delete(token, chatId);
      
      if (response.ok) {
        // If we're deleting the current chat, switch to the first available chat
        if (chatId === currentChatId) {
          const remainingChats = chats.filter(chat => chat._id !== chatId);
          if (remainingChats.length > 0) {
            await switchToChat(remainingChats[0]._id);
          } else {
            // No chats left, create a new one
            await createNewChatAndSwitch();
          }
        }
        // Refresh chat list
        await loadChatsAndInitialize();
      } else if (response.status === 429) {
        // Rate limit exceeded
        alert('Too many requests. Please wait a moment before trying again.');
      } else {
        console.error('Failed to delete chat:', response.status);
        alert('Failed to delete chat. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      if (error.message.includes('Failed to fetch')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error deleting chat. Please try again.');
      }
    } finally {
      // Re-enable the delete button
      if (deleteButton) {
        deleteButton.disabled = false;
        deleteButton.style.opacity = '1';
      }
      setIsDeleting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // const handleFileUpload = (files) => {
  //   if (!currentChatId) return;

  //   const formData = new FormData();
  //   Array.from(files).forEach(file => {
  //     formData.append('files', file);
  //   });
  //   formData.append('chatId', currentChatId);
  //   formData.append('messageId', Date.now().toString());

  //   // Upload files to backend
  //   fetch(`${API_BASE_URL}/files/upload`, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     },
  //     body: formData
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     if (data.files) {
  //       // Create message with uploaded files
  //       const fileMessage = {
  //         id: Date.now().toString(),
  //         content: `Uploaded ${data.files.length} file(s)`,
  //         sender: 'user',
  //         timestamp: new Date(),
  //         attachments: data.files
  //       };

  //       setMessages(prev => [...prev, fileMessage]);
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error uploading files:', error);
  //   });
  // };
  const handleFileUpload = async (files) => {
    if (!currentChatId) return;
    const messageId = Date.now().toString();
    
    try {
      // First upload the files
      const uploadResponse = await api.files.upload(token, files, currentChatId, messageId);
      const uploadData = await uploadResponse.json();
      
      if (uploadData.files) {
        // Create a message with the uploaded files
        const fileMessage = {
          content: `Uploaded ${uploadData.files.length} file(s)`,
          sender: 'user',
          attachments: uploadData.files
        };

        // Add the message to the chat in the database
        const messageResponse = await api.chat.addMessage(token, currentChatId, fileMessage);
        
        if (messageResponse.ok) {
          const messageData = await messageResponse.json();
          // Refresh the chat to show the new message with attachments
          await loadCurrentChat();
        } else {
          console.error('Failed to add file message to chat:', messageResponse.status);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
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
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">AI Assistant</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload files and chat with AI</p>
            </div>
            
            {/* Chat Selector */}
            <div className="relative" ref={chatSelectorRef}>
              <button
                onClick={() => setShowChatSelector(!showChatSelector)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {chats.find(chat => chat._id === currentChatId)?.title || 'Select Chat'}
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showChatSelector && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={createNewChatAndSwitch}
                      className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    >
                      + New Chat
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    {chats.map((chat) => (
                      <div
                        key={chat._id}
                        className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                          chat._id === currentChatId
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <button
                          onClick={() => switchToChat(chat._id)}
                          className="flex-1 text-left"
                        >
                          <div className="font-medium truncate">{chat.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(chat.lastActivity).toLocaleDateString()}
                          </div>
                        </button>
                        <button
                          onClick={(e) => deleteChat(chat._id, e)}
                          disabled={isDeleting}
                          className={`ml-2 p-1 transition-colors ${
                            isDeleting 
                              ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                              : 'text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                          }`}
                          title={isDeleting ? "Deleting..." : "Delete chat"}
                        >
                          {isDeleting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user?.profileImage && user.profileImage !== 'undefined/uploads/' ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={onShowProfile}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Profile image failed to load:', user.profileImage);
                    e.target.style.display = 'none';
                  }}
                />
              ) : user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  onClick={onShowProfile}
                  crossOrigin="anonymous"
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
