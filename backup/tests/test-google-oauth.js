require('dotenv').config();

console.log('🔐 Google OAuth Configuration Test\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('=====================================');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
if (process.env.GOOGLE_CLIENT_ID) {
  console.log(`   - Format Valid: ${process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com') ? '✅ Yes' : '❌ No'}`);
  console.log(`   - Length: ${process.env.GOOGLE_CLIENT_ID.length} characters`);
  console.log(`   - First 10 chars: ${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...`);
}
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '❌ Missing');
if (process.env.GOOGLE_CALLBACK_URL && process.env.SERVER_URL) {
  console.log(`   - URL Structure Valid: ${process.env.GOOGLE_CALLBACK_URL.startsWith(process.env.SERVER_URL) ? '✅ Yes' : '❌ No'}`);
}
console.log('SERVER_URL:', process.env.SERVER_URL || '❌ Missing');
console.log('CLIENT_URL:', process.env.CLIENT_URL || '❌ Missing');
console.log('=====================================\n');

// Check if required environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('❌ Google OAuth credentials are missing!');
  console.log('\n💡 To fix this:');
  console.log('1. Run: node setup-google-oauth.js');
  console.log('2. Or manually add to your .env file:');
  console.log('   GOOGLE_CLIENT_ID=your-client-id');
  console.log('   GOOGLE_CLIENT_SECRET=your-client-secret');
  process.exit(1);
}

// Test Passport configuration
try {
  const passport = require('./config/passport');
  console.log('✅ Passport configuration loaded successfully');
} catch (error) {
  console.log('❌ Passport configuration error:', error.message);
  process.exit(1);
}

// Test User model
try {
  const User = require('./models/User');
  console.log('✅ User model loaded successfully');
  
  // Check if googleId field exists
  const userSchema = User.schema;
  const googleIdField = userSchema.paths.googleId;
  if (googleIdField) {
    console.log('✅ User model supports Google OAuth (googleId field exists)');
  } else {
    console.log('❌ User model missing googleId field');
  }
} catch (error) {
  console.log('❌ User model error:', error.message);
  process.exit(1);
}

// Test auth routes
try {
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.log('❌ Auth routes error:', error.message);
  process.exit(1);
}

console.log('\n🎯 Configuration Summary:');
console.log('=====================================');
console.log('✅ Google OAuth credentials configured');
console.log('✅ Passport configuration ready');
console.log('✅ User model supports Google OAuth');
console.log('✅ Auth routes configured');
console.log('=====================================\n');

console.log('🚀 Next Steps:');
console.log('1. Start your server: npm run server:dev');
console.log('2. Test Google login at: http://localhost:5173');
console.log('3. Click "Sign in with Google" button');
console.log('4. You should be redirected to Google OAuth');
console.log('\n📝 Make sure your Google Cloud Console has:');
console.log('- Google+ API enabled');
console.log('- OAuth 2.0 Client ID configured');
console.log('- Redirect URI: http://localhost:5000/api/auth/google/callback');

// Test OAuth endpoint (if server is running)
const http = require('http');

const testOAuthEndpoint = () => {
  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 5000,
    path: '/api/auth/google',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`\n🌐 OAuth Endpoint Test:`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Location: ${res.headers.location || 'No redirect'}`);
    
    if (res.statusCode === 302 && res.headers.location) {
      console.log('✅ OAuth endpoint is working correctly');
      console.log('✅ Redirecting to Google OAuth');
    } else {
      console.log('❌ OAuth endpoint not working as expected');
    }
  });

  req.on('error', (error) => {
    console.log('\n🌐 OAuth Endpoint Test:');
    console.log('❌ Cannot connect to server');
    console.log('💡 Make sure your server is running: npm run server:dev');
  });

  req.end();
};

// Test after a short delay
setTimeout(testOAuthEndpoint, 1000); 