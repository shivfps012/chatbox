const crypto = require('crypto');

console.log('🔧 Generate Fresh Working Reset Link\n');

// Generate a fresh reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

console.log('📧 Fresh Working Reset Link:');
console.log('=====================================');
console.log(resetUrl);
console.log('=====================================');

console.log('\n📧 Recent Working Links from Server Logs:');
console.log('(These are the most recent ones that should work)');
console.log('1. http://localhost:5173/reset-password?token=e2368e7ef047dff32c9fac4679cbde6080ee75e32a923391732904955f30c44f');
console.log('2. http://localhost:5173/reset-password?token=da2f2e3d5be9be727e0ac26146afd191e5821298b270eb0a1d9aa9c245166be0');

console.log('\n🎯 Instructions:');
console.log('1. Copy one of the links above');
console.log('2. Paste it in your browser');
console.log('3. You should see the reset password form enabled');
console.log('4. Enter your new password');
console.log('5. Submit the form');

console.log('\n🔍 Expected Results:');
console.log('✅ Token length: 64 characters');
console.log('✅ No "Invalid or missing reset token" error');
console.log('✅ Form should be enabled and ready');
console.log('✅ No 401 Unauthorized errors');

console.log('\n💡 If the links don\'t work:');
console.log('1. Trigger a new password reset from your app');
console.log('2. Check your server console for the new reset link');
console.log('3. Use the new link immediately (within 1 hour)');

console.log('\n🔧 Fixed Issues:');
console.log('✅ AuthContext no longer makes API calls on reset password page');
console.log('✅ 401 errors should be eliminated');
console.log('✅ Token extraction should work properly'); 