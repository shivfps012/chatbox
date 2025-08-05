# Fix for Google OAuth "invalid_client" Error

## Problem
Google OAuth is showing "Error 401: invalid_client" when trying to sign in with Google.

## Solution

Follow these exact steps to fix the issue:

### Step 1: Check Your OAuth 2.0 Client ID in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project from the dropdown at the top
3. Navigate to **APIs & Services** > **Credentials**
4. Find your **OAuth 2.0 Client ID** in the list and click on it

### Step 2: Update Your Client ID Configuration

1. Verify the following settings:
   - **Application type** should be "Web application"
   - **Name** should be descriptive (e.g., "ChatBox Web Client")

2. Under **Authorized JavaScript origins**, make sure you have:
   ```
   http://localhost:5173
   ```

3. Under **Authorized redirect URIs**, make sure you have:
   ```
   http://localhost:5000/api/auth/google/callback
   ```

4. Click **Save**

### Step 3: Update the OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Ensure all required fields are filled in
3. Under **Scopes**, make sure you have:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
4. Under **Test users**, make sure your email address is added
5. Click **Save**

### Step 4: Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Search for and enable:
   - **Google+ API** (or People API)
   - **Google Identity Services API**

### Step 5: Update Your Project

1. Restart your server with:
   ```
   npm run server
   ```

2. In a separate terminal, start your frontend:
   ```
   npm run dev
   ```

3. Try signing in with Google again

### Step 6: If Still Not Working

If the issue persists, try these advanced solutions:

1. **Create a new OAuth 2.0 Client ID**:
   - Go back to **Credentials**
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**
   - Set up a new web client
   - Update your `.env` file with the new credentials

2. **Check credentials format**:
   - Make sure your client ID ends with `.apps.googleusercontent.com`
   - Double-check for any typos or extra spaces in your credentials

3. **Test with a direct OAuth URL**:
   - Navigate directly to: http://localhost:5000/api/auth/google
   - This bypasses your frontend and directly tests the OAuth flow

4. **Clear browser cookies and cache**:
   - Previous failed attempts might be cached

### Step 7: Monitor Logs

Keep an eye on the following logs for errors:

1. **Server logs** for backend errors
2. **Browser console** for frontend errors
3. **Network tab** in browser dev tools to see the OAuth requests

### Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Common OAuth 2.0 Errors](https://developers.google.com/identity/protocols/oauth2/web-server#error-codes)
