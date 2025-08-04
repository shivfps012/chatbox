const crypto = require('crypto');
const mongoose = require('mongoose');

console.log('🔧 Create Working Reset Link\n');

// Generate a fresh reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const resetHash = crypto.createHash('sha256').update(resetToken).digest('hex');
const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

console.log('📧 Generated Reset Link:');
console.log('=====================================');
console.log(resetUrl);
console.log('=====================================');

console.log('\n📋 Token Details:');
console.log(`Token: ${resetToken}`);
console.log(`Hash: ${resetHash}`);
console.log(`Length: ${resetToken.length} characters`);

console.log('\n🎯 Instructions:');
console.log('1. Copy the reset link above');
console.log('2. Paste it in your browser');
console.log('3. Check the browser console for debug messages');
console.log('4. The token should be 64 characters long');
console.log('5. No "Invalid or missing reset token" error should appear');

console.log('\n🔍 Expected Debug Messages:');
console.log('✅ Token set successfully');
console.log('🔍 Debug: Token length: 64');
console.log('🔍 Debug: Token value: [64-character token]');

console.log('\n⚠️ Note:');
console.log('- This is a test token for UI verification');
console.log('- The backend will reject it as "Invalid or expired"');
console.log('- But the frontend should accept it and enable the form');
console.log('- This proves the token extraction is working');

console.log('\n🔄 For Real Password Reset:');
console.log('1. Go to your app: http://localhost:5173');
console.log('2. Click "Forgot password?"');
console.log('3. Enter your email: shivg1273@gmail.com');
console.log('4. Check the server console for the mock email output');
console.log('5. Use the reset link from the server console');

console.log('\n📝 Database Update (Optional):');
console.log('If you want to make this token work with the backend:');
console.log('1. Connect to your MongoDB database');
console.log('2. Update the user document with this hash:');
console.log(`   resetPasswordToken: "${resetHash}"`);
console.log('3. Set resetPasswordExpires to a future time');
console.log('4. Then the backend will accept this token'); 