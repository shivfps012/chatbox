import React, { useState } from 'react';
import { Copy, Download, FileText, File, CheckCircle, Image as ImageIcon } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type, name) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-green-500" />;
    }
    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (name.endsWith('.msg') || name.endsWith('.eml')) {
      return <File className="h-5 w-5 text-blue-500" />;
    }
    if (type.includes('text') || name.endsWith('.txt')) {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
    if (name.endsWith('.docx') || name.endsWith('.doc')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
        isUser ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500'
      }`}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-2xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`group relative rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-md' 
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* File Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div key={attachment.id}>
                  {attachment.type.startsWith('image/') ? (
                    // Image Preview
                    <div className={`relative rounded-lg overflow-hidden max-w-sm ${
                      isUser ? 'ml-auto' : ''
                    }`}>
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        crossOrigin="anonymous"
                        onClick={() => {
                          // Open image in new tab for full view
                          window.open(attachment.url, '_blank');
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', attachment.url);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className={`absolute top-2 right-2 flex space-x-1`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = attachment.url;
                            link.download = attachment.name;
                            link.click();
                          }}
                          className="p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                          title="Download image"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2`}>
                        <p className="text-white text-xs font-medium truncate">
                          {attachment.name}
                        </p>
                        <p className="text-white text-xs opacity-75">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Regular File Attachment
                    <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      isUser ? 'bg-blue-500 dark:bg-blue-600 border-blue-400 dark:border-blue-500' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}>
                      {getFileIcon(attachment.type, attachment.name)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isUser ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {attachment.name}
                        </p>
                        <p className={`text-xs ${
                          isUser ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = attachment.url;
                          link.download = attachment.name;
                          link.click();
                        }}
                        className={`p-1 rounded hover:bg-opacity-20 hover:bg-white transition-colors ${
                          isUser ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser 
                ? 'hover:bg-white hover:bg-opacity-20 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;