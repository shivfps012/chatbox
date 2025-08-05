# Google OAuth Configuration Guide

This guide will help you fix the "Error 401: invalid_client" issue with Google OAuth.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with the Google account associated with your project

## Step 2: Configure OAuth Consent Screen

1. Select your project from the top dropdown
2. Go to **APIs & Services > OAuth consent screen**
3. Choose **External** user type (if this is not a Google Workspace project)
4. Fill in the required information:
   - App name: "ChatBox"
   - User support email: Your email
   - Developer contact information: Your email
5. Click **Save and Continue**
6. On Scopes page, add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
7. Click **Save and Continue**
8. Add test users (including your own email)
9. Click **Save and Continue**

## Step 3: Update or Create OAuth Client ID

1. Go to **APIs & Services > Credentials**
2. Click on your existing client ID or create a new one by clicking **Create Credentials > OAuth client ID**
3. For a new client:
   - Application type: **Web application**
   - Name: "ChatBox Web Client"

4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   ```

5. Under **Authorized redirect URIs**, make sure you have:
   ```
   http://localhost:5000/api/auth/google/callback
   ```

6. Click **Create** or **Save**
7. Note your new Client ID and Client Secret

## Step 4: Enable Required APIs

1. Go to **APIs & Services > Library**
2. Search for and enable these APIs:
   - Google+ API
   - People API
   - Google Identity Services

## Step 5: Update Your Environment Variables

1. Update your `.env` file with the new credentials if they've changed
2. Make sure to use the complete Client ID including `.apps.googleusercontent.com`

## Step 6: Test Again

1. Restart your server
2. Try the Google login again
3. Check the browser console and server logs for any errors

## Common Issues

1. **invalid_client**: Double-check the client ID and secret
2. **redirect_uri_mismatch**: Ensure the callback URL in code matches the one in Google Console
3. **access_denied**: Check if the APIs are enabled and consent screen is configured

## Additional Troubleshooting

- Make sure you're using the same Google account for testing as the one added as a test user
- For detailed error tracking, check both browser console and server logs
- In development, "External" user type with test users is sufficient
- Publishing your app is only required for production use with real users
