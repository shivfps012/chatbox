const crypto = require('crypto');

console.log('🔧 Generate Working Password Reset Link\n');

// Generate a fresh reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

console.log('📧 Working Reset Link:');
console.log('=====================================');
console.log(resetUrl);
console.log('=====================================');

console.log('\n📋 Token Details:');
console.log(`Token: ${resetToken}`);
console.log(`Length: ${resetToken.length} characters`);
console.log(`URL Length: ${resetUrl.length} characters`);

console.log('\n🎯 Instructions:');
console.log('1. Copy the reset link above');
console.log('2. Paste it in your browser');
console.log('3. You should see the reset password form');
console.log('4. Enter a new password');
console.log('5. Submit the form');

console.log('\n🔍 Expected Results:');
console.log('✅ Token length: 64 characters');
console.log('✅ No "Invalid or missing reset token" error');
console.log('✅ Form should be enabled and ready');
console.log('⚠️ Backend will show "Token is not valid" (this is expected)');
console.log('⚠️ This is because the token is not stored in the database');

console.log('\n💡 To make it work completely:');
console.log('1. The token needs to be stored in the database');
console.log('2. Or use a token from a real password reset request');
console.log('3. Check your server console for mock email output');

console.log('\n📧 Recent Reset Links from Server Logs:');
console.log('(These might be expired, but try them first)');
console.log('1. http://localhost:5173/reset-password?token=3fdc60c97e08302fa4d94d2b2cfbed3df757a3fff38dffb73f5e576ccb0fe983');
console.log('2. http://localhost:5173/reset-password?token=6cbd3568fc6c98947d02e55e5824f56e384260cf9a6fb270b0783c6b0e2d054a'); 