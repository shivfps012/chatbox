# Google OAuth Setup Guide

This guide will help you enable Google login for your chat application.

## Prerequisites

1. **Google Cloud Console Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - In your Google Cloud Console project
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

## Step 1: Create OAuth 2.0 Credentials

1. **Navigate to Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen**
   - If prompted, configure the OAuth consent screen
   - Add your application name and user support email
   - Add authorized domains (your domain or localhost for development)

3. **Create OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: Your app name (e.g., "ChatBox")
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (for production)
     ```

4. **Copy Credentials**
   - Copy the **Client ID** and **Client Secret**
   - Keep these secure and don't share them

## Step 2: Configure Environment Variables

### Option A: Use the Setup Script (Recommended)

Run the setup script to configure Google OAuth:

```bash
node setup-google-oauth.js
```

Follow the prompts to enter your Google Client ID and Client Secret.

### Option B: Manual Configuration

Add these lines to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 3: Verify Configuration

1. **Check Dependencies**
   Your `package.json` should include:
   ```json
   {
     "dependencies": {
       "passport": "^0.7.0",
       "passport-google-oauth20": "^2.0.0"
     }
   }
   ```

2. **Verify Server Configuration**
   - Passport is initialized in `server.js`
   - Google OAuth routes are configured in `routes/auth.js`
   - User model supports `googleId` field

3. **Check Frontend Integration**
   - `AuthContext.jsx` has `googleLogin` function
   - `AuthForm.jsx` has Google login button

## Step 4: Test Google Login

1. **Start the Server**
   ```bash
   npm run server:dev
   ```

2. **Test the Flow**
   - Go to your login page
   - Click "Sign in with Google"
   - You should be redirected to Google's consent screen
   - After authorization, you'll be redirected back to your app

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Check for trailing slashes or protocol differences

2. **"invalid_client" Error**
   - Verify your Client ID and Client Secret are correct
   - Make sure they're properly set in your `.env` file

3. **CORS Issues**
   - Ensure your CORS configuration allows your frontend domain
   - Check that `CLIENT_URL` is set correctly in `.env`

4. **"Google+ API not enabled" Error**
   - Go to Google Cloud Console → APIs & Services → Library
   - Search for and enable "Google+ API"

### Debug Steps

1. **Check Environment Variables**
   ```bash
   node -e "console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)"
   node -e "console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET)"
   ```

2. **Test OAuth Endpoint**
   ```bash
   curl http://localhost:5000/api/auth/google
   ```
   This should redirect to Google's OAuth page.

3. **Check Server Logs**
   Look for any errors in your server console when testing Google login.

## Security Considerations

1. **Environment Variables**
   - Never commit your `.env` file to version control
   - Use different credentials for development and production

2. **HTTPS in Production**
   - Google OAuth requires HTTPS in production
   - Use a valid SSL certificate

3. **Redirect URIs**
   - Only add necessary redirect URIs
   - Remove development URIs from production credentials

## Production Deployment

1. **Update Google Cloud Console**
   - Add your production domain to authorized domains
   - Add production redirect URI: `https://yourdomain.com/api/auth/google/callback`

2. **Environment Variables**
   - Set production Google OAuth credentials
   - Update `CLIENT_URL` and `SERVER_URL` for production

3. **HTTPS Configuration**
   - Ensure your production server uses HTTPS
   - Google OAuth requires HTTPS for production

## Features Included

Your Google OAuth implementation includes:

- ✅ **Automatic User Creation**: New users are created when they first sign in with Google
- ✅ **Account Linking**: Existing users can link their Google account
- ✅ **Profile Data**: Name, email, and profile picture are imported from Google
- ✅ **Email Verification**: Google users are automatically email verified
- ✅ **JWT Integration**: Google login generates JWT tokens for API access
- ✅ **Session Management**: Proper session handling and token storage

## Next Steps

After setting up Google OAuth:

1. **Test the complete flow** from login to chat interface
2. **Customize the UI** to match your brand
3. **Add additional OAuth providers** (Facebook, GitHub, etc.) if needed
4. **Implement user profile management** for Google users
5. **Add account unlinking** functionality if needed

## Support

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Google Cloud Console configuration is correct
4. Test with a fresh browser session (clear cookies/cache) 