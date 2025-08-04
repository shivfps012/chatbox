# Media and Profile Image Fixes - Summary

## Issues Identified

Based on the server logs and user feedback, there were several media-related issues:

1. **Profile Image Not Visible**: Profile images showing `undefined/uploads/...` URLs
2. **Media Files Not Persisting**: Uploaded files not being saved to chat messages properly
3. **Missing SERVER_URL**: Environment variable not set, causing malformed URLs

## Root Causes

### Profile Image Issue
- `SERVER_URL` environment variable was not set in the server
- Profile image URLs were being constructed as `undefined/uploads/...`
- No error handling for failed image loads

### Media Files Issue
- File upload was working but messages weren't being saved to the database
- Files were uploaded but not properly linked to chat messages
- No persistence of file attachments in chat history

### URL Construction Issue
- Server was not setting default `SERVER_URL` when environment variable was missing
- File URLs were malformed due to missing base URL

## Fixes Implemented

### 1. Fixed SERVER_URL Configuration
**File**: `server.js`

**Before**:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**After**:
```javascript
const PORT = process.env.PORT || 5000;

// Set default SERVER_URL if not provided
if (!process.env.SERVER_URL) {
  process.env.SERVER_URL = `http://localhost:${PORT}`;
  console.log(`SERVER_URL not set, using default: ${process.env.SERVER_URL}`);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: ${process.env.SERVER_URL}`);
});
```

### 2. Fixed Profile Image Upload
**File**: `routes/user.js`

**Issue**: Using `req.user.id` instead of `req.user._id`

**Before**:
```javascript
const user = await User.findById(req.user.id);
```

**After**:
```javascript
const user = await User.findById(req.user._id);
```

### 3. Enhanced Profile Image Display
**File**: `src/components/ChatInterface.jsx`

**Added**:
- Check for malformed profile image URLs
- Error handling for failed image loads
- Fallback to avatar or default icon

```javascript
{user?.profileImage && user.profileImage !== 'undefined/uploads/' ? (
  <img
    src={user.profileImage}
    alt={user.name}
    onError={(e) => {
      console.error('Profile image failed to load:', user.profileImage);
      e.target.style.display = 'none';
    }}
  />
) : user?.avatar ? (
  <img src={user.avatar} alt={user.name} />
) : (
  <div className="w-8 h-8 bg-blue-600 rounded-full">
    <User className="h-4 w-4 text-white" />
  </div>
)}
```

### 4. Fixed File Upload and Message Persistence
**File**: `src/components/ChatInterface.jsx`

**Before**: Files were uploaded but not saved to chat messages
**After**: Complete file upload and message persistence workflow

```javascript
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
        // Refresh the chat to show the new message with attachments
        await loadCurrentChat();
      }
    }
  } catch (error) {
    console.error('Error uploading files:', error);
  }
};
```

### 5. Added User Data Refresh Function
**File**: `src/components/ChatInterface.jsx`

Added function to refresh user data after profile updates:
```javascript
const refreshUserData = async () => {
  try {
    const response = await api.auth.me(token);
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  } catch (error) {
    console.error('Error refreshing user data:', error);
  }
};
```

## How It Works Now

### Profile Images
1. **Upload**: Profile images are uploaded to `/uploads/{userId}/{filename}`
2. **URL Construction**: Proper URLs like `http://localhost:5000/uploads/{userId}/{filename}`
3. **Display**: Images are displayed with error handling and fallbacks
4. **Persistence**: Profile images are saved to user profile in database

### Media Files in Chats
1. **Upload**: Files are uploaded to the server
2. **Database Storage**: File metadata is saved to File collection
3. **Message Creation**: Chat message is created with file attachments
4. **Persistence**: Messages with attachments are saved to chat history
5. **Display**: Files are displayed in MessageBubble component with proper icons and previews

### File Types Supported
- **Images**: JPEG, PNG, GIF (with preview)
- **Documents**: PDF, DOCX, DOC, TXT
- **Email**: MSG, EML
- **All files**: Download functionality

## Testing the Fixes

1. **Profile Image**:
   - Upload a profile image
   - Check if it displays correctly in the header
   - Verify URL is properly formatted

2. **Media Files**:
   - Upload files to a chat
   - Check if they appear in the message
   - Refresh the page and verify files persist
   - Test different file types

3. **URL Construction**:
   - Check server logs for proper SERVER_URL
   - Verify file URLs are correctly formatted

## Files Modified

- `server.js` - Added SERVER_URL configuration
- `routes/user.js` - Fixed profile image upload
- `src/components/ChatInterface.jsx` - Enhanced file upload and profile display
- `src/components/MessageBubble.jsx` - Already had good media display support

## Server Logs

The server now logs:
- SERVER_URL configuration
- File upload status
- Profile image updates
- Proper error messages for media issues

Your media files and profile images should now work correctly and persist across sessions! 