const crypto = require('crypto');

// Generate a test reset token
console.log('🔧 Generating Test Reset Link\n');

// Generate a new reset token (like the backend does)
const resetToken = crypto.randomBytes(32).toString('hex');
const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

console.log('📧 Test Reset Link:');
console.log('=====================================');
console.log(resetUrl);
console.log('=====================================');

console.log('\n🎯 Instructions:');
console.log('1. Copy the link above');
console.log('2. Paste it in your browser');
console.log('3. The password reset form should now work');
console.log('4. Note: This is a test token - it won\'t work with the backend');
console.log('5. For real testing, use the link from your email/server console');

console.log('\n📋 Token Details:');
console.log(`Token: ${resetToken}`);
console.log(`Length: ${resetToken.length} characters`);
console.log(`URL Length: ${resetUrl.length} characters`);

console.log('\n💡 For Real Testing:');
console.log('1. Request a password reset from your app');
console.log('2. Check the server console for the mock email output');
console.log('3. Copy the reset link from there');
console.log('4. Use that link in your browser'); 