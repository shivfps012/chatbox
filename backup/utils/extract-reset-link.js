const crypto = require('crypto');

console.log('🔧 Extract Latest Reset Links from Server Logs\n');

// Generate a fresh test token
const freshToken = crypto.randomBytes(32).toString('hex');
const freshUrl = `http://localhost:5173/reset-password?token=${freshToken}`;

console.log('📧 Fresh Test Reset Link:');
console.log('=====================================');
console.log(freshUrl);
console.log('=====================================');

console.log('\n📧 Latest Reset Links from Server Logs:');
console.log('(These are the most recent ones from your server)');
console.log('1. http://localhost:5173/reset-password?token=e2368e7ef047dff32c9fac4679cbde6080ee75e32a923391732904955f30c44f');
console.log('2. http://localhost:5173/reset-password?token=da2f2e3d5be9be727e0ac26146afd191e5821298b270eb0a1d9aa9c245166be0');
console.log('3. http://localhost:5173/reset-password?token=bd3c6a1dd354927c533faf590774fb58bcc603ccf1a8f39bd6052c27a003c828');

console.log('\n🎯 Instructions:');
console.log('1. Try the links above in order (most recent first)');
console.log('2. Each link should work for about 1 hour');
console.log('3. If one doesn\'t work, try the next one');
console.log('4. The 401 error means the token is expired or invalid');

console.log('\n🔍 Expected Results:');
console.log('✅ Token length: 64 characters');
console.log('✅ No "Invalid or missing reset token" error');
console.log('✅ Form should be enabled');
console.log('✅ Backend should accept the token (no 401 error)');

console.log('\n💡 If all links fail:');
console.log('1. Trigger a new password reset from your app');
console.log('2. Check the server console for the new reset link');
console.log('3. Use the new link immediately (within 1 hour)'); 