# chatbox

A full-stack AI chat application with file upload capabilities, user authentication, and Google OAuth integration.

## Features

- 🤖 **AI Chat Interface**: Interactive chat with AI assistant
- 📁 **File Upload**: Support for documents (PDF, DOC, TXT) and images
- 🔐 **Authentication**: Email/password and Google OAuth login
- 🔑 **Password Reset**: Email-based password recovery
- 💾 **Chat History**: Persistent chat storage per user
- 👤 **User Profiles**: Customizable user profiles with avatar upload
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Multer (file uploads)
- Nodemailer (email sending)
- bcryptjs (password hashing)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email functionality)
- Google Cloud Console project (for OAuth)

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://127.0.0.1:27017/chatapp

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Client Configuration
   CLIENT_URL=http://localhost:5173

   # Email Configuration (for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

3. **Google OAuth Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`

4. **Gmail App Password:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password for the application
   - Use this App Password in `EMAIL_PASS`

5. **Start the backend server:**
   ```bash
   npm run server:dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

### Quick Start (Both Frontend and Backend)

To start both frontend and backend simultaneously:

```bash
npm run start
# or
npm run dev:full
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/profile-image` - Upload profile image
- `DELETE /api/user/profile-image` - Remove profile image
- `GET /api/user/stats` - Get user statistics

### Chat Management
- `GET /api/chat` - Get all user chats
- `GET /api/chat/:id` - Get specific chat
- `POST /api/chat` - Create new chat
- `POST /api/chat/:id/messages` - Add message to chat
- `PUT /api/chat/:id` - Update chat title
- `DELETE /api/chat/:id` - Delete chat

### File Management
- `POST /api/files/upload` - Upload files
- `GET /api/files` - Get user files
- `GET /api/files/:id` - Get specific file
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/stats/summary` - Get file statistics

## File Upload Support

Supported file types:
- **Documents**: PDF, DOC, DOCX, TXT
- **Email**: MSG, EML
- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Size limit**: 10MB per file
- **Batch upload**: Up to 5 files at once

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- File type validation
- User input sanitization
- Secure file storage

## Development

### Running in Development Mode

1. **Backend with auto-reload:**
   ```bash
   npm run server:dev
   ```

2. **Frontend with hot reload:**
   ```bash
   npm run dev
   ```

### Project Structure

```
├── server.js              # Express server entry point
├── models/               # MongoDB models
│   ├── User.js          # User model
│   ├── Chat.js          # Chat model
│   └── File.js          # File model
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── user.js          # User management routes
│   ├── chat.js          # Chat management routes
│   └── files.js         # File management routes
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── upload.js        # File upload handling
├── config/              # Configuration files
│   └── passport.js      # Passport strategies
├── utils/               # Utility functions
│   └── email.js         # Email sending utilities
├── uploads/             # File storage directory
└── src/                 # Frontend React application
```

## Deployment

### Environment Variables for Production

Make sure to set all environment variables in your production environment:
- Use a strong JWT secret
- Use production MongoDB URI
- Configure proper CORS origins
- Set NODE_ENV=production
- Use secure email credentials
- Configure proper Google OAuth redirect URIs

### Database Indexes

The application automatically creates necessary database indexes for optimal performance:
- User email and Google ID indexes
- Chat user and activity indexes
- File user and chat indexes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/shivfps012/chatbox)