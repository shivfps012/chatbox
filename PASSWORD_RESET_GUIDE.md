# Password Reset Guide

## How to Reset Your Password

Your application has a complete password reset system implemented. Here's how to use it:

### 🔧 **Prerequisites**

Before using password reset, you need to configure email settings in your `.env` file:

```env
# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Client URL (for reset links)
CLIENT_URL=http://localhost:5173
```

### 📧 **Email Setup (Gmail Example)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Use the app password** in your `EMAIL_PASS` environment variable

### 🔄 **Password Reset Process**

#### **Step 1: Request Password Reset**

1. **On the login page**, click "Forgot password?" link
2. **Enter your email address** in the form
3. **Click "Send reset link"**
4. **Check your email** for the reset link

#### **Step 2: Reset Your Password**

1. **Click the reset link** in your email (or copy-paste the URL)
2. **Enter your new password** (minimum 6 characters)
3. **Confirm your new password**
4. **Click "Reset password"**
5. **You'll be automatically logged in** and redirected to the app

### 🛠️ **How It Works**

#### **Backend Process**
1. **Request Reset**: User enters email → Server generates reset token
2. **Send Email**: Server sends email with reset link (valid for 1 hour)
3. **Reset Password**: User clicks link → Enters new password → Server updates password
4. **Auto Login**: Server generates new JWT token and logs user in

#### **Security Features**
- **Token Expiration**: Reset tokens expire after 1 hour
- **One-time Use**: Tokens are invalidated after use
- **Secure Hashing**: Tokens are hashed before storage
- **Email Validation**: Only sends reset emails to registered accounts

### 📁 **Files Involved**

#### **Backend**
- `routes/auth.js` - Password reset API endpoints
- `utils/email.js` - Email sending functionality
- `models/User.js` - User model with reset token fields

#### **Frontend**
- `src/components/ForgotPasswordForm.jsx` - Request reset form
- `src/components/ResetPasswordForm.jsx` - Reset password form
- `src/contexts/AuthContext.jsx` - Authentication context with reset methods

### 🧪 **Testing the Password Reset**

#### **Test Scenario 1: Valid Reset**
1. Go to login page
2. Click "Forgot password?"
3. Enter your email address
4. Check email for reset link
5. Click link and set new password
6. Verify you're logged in with new password

#### **Test Scenario 2: Invalid Token**
1. Try to access reset page with invalid token
2. Verify error message is shown
3. Verify form is disabled

#### **Test Scenario 3: Expired Token**
1. Wait more than 1 hour after requesting reset
2. Try to use the old reset link
3. Verify "expired token" error is shown

### 🔍 **Troubleshooting**

#### **Email Not Received**
- Check spam/junk folder
- Verify email configuration in `.env`
- Check server logs for email errors
- Ensure Gmail app password is correct

#### **Reset Link Not Working**
- Verify `CLIENT_URL` is set correctly in `.env`
- Check if token is expired (1 hour limit)
- Ensure token is properly passed in URL

#### **Server Errors**
- Check MongoDB connection
- Verify all environment variables are set
- Check server logs for detailed error messages

### 📧 **Email Templates**

The system includes beautiful HTML email templates:

#### **Password Reset Email**
- Professional design with your app branding
- Clear instructions and security warnings
- Mobile-responsive layout
- Direct reset button and fallback link

#### **Welcome Email**
- Sent to new users upon registration
- Highlights key features of your app
- Encourages user engagement

### 🔐 **Security Best Practices**

1. **Token Expiration**: Reset tokens expire after 1 hour
2. **Secure Storage**: Tokens are hashed in database
3. **Rate Limiting**: Prevents abuse of reset requests
4. **Email Validation**: Only sends to registered emails
5. **HTTPS Links**: Reset links use secure protocol
6. **Password Requirements**: Minimum 6 characters enforced

### 🚀 **Production Deployment**

For production, update your `.env` file:

```env
# Production Email (example with Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
EMAIL_FROM=your-production-email@gmail.com

# Production Client URL
CLIENT_URL=https://yourdomain.com
```

### 📝 **API Endpoints**

#### **Request Password Reset**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### **Reset Password**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "new-password"
}
```

Your password reset system is fully functional and ready to use! 🎉 