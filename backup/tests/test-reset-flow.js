const crypto = require('crypto');

// Test the token generation and hashing process
console.log('🔍 Testing Password Reset Token Flow\n');

// Simulate the backend token generation (like in forgot-password route)
const resetToken = crypto.randomBytes(32).toString('hex');
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

console.log('📧 Generated Reset Token:');
console.log(`Raw Token: ${resetToken}`);
console.log(`Token Length: ${resetToken.length} characters`);
console.log(`Hashed Token: ${hashedToken}`);
console.log(`Hashed Length: ${hashedToken.length} characters`);

// Simulate the reset-password route verification
console.log('\n🔐 Testing Token Verification:');
const incomingToken = resetToken; // This would come from the frontend
const verifyHash = crypto.createHash('sha256').update(incomingToken).digest('hex');

console.log(`Incoming Token: ${incomingToken}`);
console.log(`Verify Hash: ${verifyHash}`);
console.log(`Hashes Match: ${hashedToken === verifyHash ? '✅ YES' : '❌ NO'}`);

// Test URL encoding/decoding
console.log('\n🌐 Testing URL Encoding:');
const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
console.log(`Reset URL: ${resetUrl}`);

// Simulate URL parameter extraction
const urlParams = new URLSearchParams(resetUrl.split('?')[1]);
const extractedToken = urlParams.get('token');
console.log(`Extracted Token: ${extractedToken}`);
console.log(`Extraction Success: ${extractedToken === resetToken ? '✅ YES' : '❌ NO'}`);

console.log('\n🎯 Expected Frontend Behavior:');
console.log('1. User clicks reset link');
console.log('2. Frontend extracts token from URL');
console.log('3. Frontend sends raw token to backend');
console.log('4. Backend hashes token and compares with stored hash');
console.log('5. If match, password is reset');

console.log('\n🔧 Debugging Steps:');
console.log('1. Check browser console for token extraction logs');
console.log('2. Verify token length is 64 characters');
console.log('3. Check network tab for API request');
console.log('4. Verify backend receives correct token'); 