# Chatbox

A full-stack AI chat application with file upload capabilities, comprehensive user authentication, and Google OAuth integration.

![Chatbox Logo](https://img.shields.io/badge/Chatbox-AI%20Chat%20Application-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📌 Overview

Chatbox is a modern web application that provides an intuitive interface for interacting with AI assistants while supporting robust user management, file sharing, and real-time communication.

## ✨ Features

- 🤖 **AI Chat Interface**: Interactive conversations with AI assistant
- 📁 **File Upload System**: Support for documents (PDF, DOC, TXT) and images
- 🔐 **Authentication**: Secure email/password and Google OAuth integration
- 🔑 **Password Reset Flow**: Email-based password recovery system
- 💾 **Chat Persistence**: User chat history saved across sessions
- 👤 **User Profiles**: Customizable profiles with avatar upload
- 📊 **User Statistics**: Track messages, uploads, and active days
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔒 **Secure File Storage**: User-specific file organization

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Modern icon library
- **Vite**: Next-generation frontend build tool

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Passport.js**: Authentication middleware with Google OAuth support
- **Multer**: File upload handling
- **Nodemailer**: Email sending functionality
- **bcryptjs**: Password hashing

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account (for email functionality)
- Google Cloud Console project (for OAuth)

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivfps012/chatbox.git
   cd chatbox
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
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

4. **Google OAuth Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Client Secret to `.env`
   
   For detailed instructions, see [GOOGLE_OAUTH_SETUP_GUIDE.md](./GOOGLE_OAUTH_SETUP_GUIDE.md)

5. **Gmail App Password:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password for the application
   - Use this App Password in `EMAIL_PASS`
   
   For detailed instructions, see [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)

### Frontend Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

   This will start both the backend server and frontend development server.
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

2. **Building for production:**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication Endpoints

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login with email and password
- **GET /api/auth/google**: Initiate Google OAuth login
- **GET /api/auth/google/callback**: Google OAuth callback
- **POST /api/auth/forgot-password**: Request password reset
- **POST /api/auth/reset-password/:token**: Reset password with token
- **GET /api/auth/me**: Get current user profile

### User Endpoints

- **GET /api/user/profile**: Get user profile
- **PUT /api/user/profile**: Update user profile
- **PUT /api/user/password**: Change password
- **GET /api/user/stats**: Get user statistics

### Chat Endpoints

- **GET /api/chat**: Get all chats for current user
- **POST /api/chat**: Create a new chat message
- **DELETE /api/chat/:id**: Delete a chat message

### File Endpoints

- **POST /api/files/upload**: Upload a file
- **GET /api/files**: Get all files for current user
- **GET /api/files/:id**: Get file by ID
- **DELETE /api/files/:id**: Delete a file

## 🧪 Testing

Run the tests with:

```bash
npm test
```

For specific test suites:

```bash
# Test authentication
npm run test-auth

# Test email functionality
npm run test-email

# Test Google OAuth flow
npm run test-google-oauth

# Test stats API
npm run test-stats-api
```

## 🔧 Troubleshooting

Common issues and their solutions:

- **Google OAuth Issues**: See [GOOGLE_OAUTH_ERROR_FIX.md](./GOOGLE_OAUTH_ERROR_FIX.md)
- **Password Reset Issues**: See [PASSWORD_RESET_GUIDE.md](./PASSWORD_RESET_GUIDE.md)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📬 Contact

Shiv - shivgupta45750@gmail.com

Project Link: [https://github.com/shivfps012/chatbox](https://github.com/shivfps012/chatbox)

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