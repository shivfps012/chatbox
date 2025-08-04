const crypto = require('crypto');

console.log('🔧 Latest Password Reset Link Generator\n');

// Generate a fresh test token
const freshToken = crypto.randomBytes(32).toString('hex');
const freshUrl = `http://localhost:5173/reset-password?token=${freshToken}`;

console.log('📧 Fresh Test Reset Link:');
console.log('=====================================');
console.log(freshUrl);
console.log('=====================================');

console.log('\n📧 Recent Reset Links from Server Logs:');
console.log('(These might be expired, but try them first)');
console.log('1. http://localhost:5173/reset-password?token=3fdc60c97e08302fa4d94d2b2cfbed3df757a3fff38dffb73f5e576ccb0fe983');
console.log('2. http://localhost:5173/reset-password?token=6cbd3568fc6c98947d02e55e5824f56e384260cf9a6fb270b0783c6b0e2d054a');

console.log('\n🎯 Step-by-Step Instructions:');
console.log('1. First, try the recent links from server logs');
console.log('2. If those don\'t work, use the fresh test link above');
console.log('3. Copy and paste the link in your browser');
console.log('4. Check the browser console for debug messages');
console.log('5. The token should be 64 characters long');

console.log('\n🔍 Debug Verification:');
console.log('When you use the correct link, you should see in browser console:');
console.log('- ✅ Token set successfully');
console.log('- 🔍 Debug: Token length: 64');
console.log('- No "Invalid or missing reset token" error');

console.log('\n⚠️ Important:');
console.log('- Don\'t use "YOUR_TOKEN" - that\'s just a placeholder');
console.log('- Use the actual 64-character tokens from the links above');
console.log('- The tokens are case-sensitive');
console.log('- Each token can only be used once');

console.log('\n🔄 If Still Not Working:');
console.log('1. Request a new password reset from your app');
console.log('2. Check the server console for the latest mock email');
console.log('3. Use the link from the most recent mock email output'); 