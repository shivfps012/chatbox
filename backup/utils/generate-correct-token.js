const crypto = require('crypto');

console.log('🔧 Generate Correct Reset Token\n');

// The stored hash in the database
const storedHash = '946089a064594213ff2118e0c2f401561987d8c60241d1152d8dc1ba3209ac2b';

console.log('📋 Database Info:');
console.log(`Stored Hash: ${storedHash}`);
console.log(`Hash Length: ${storedHash.length} characters`);

// Generate a token that will hash to the stored value
// Since we can't reverse the hash, we need to generate a new token
// and update the database, or use a different approach

console.log('\n🎯 Solution: Generate New Reset Token');
console.log('1. We need to generate a new reset token');
console.log('2. Update the database with the new token');
console.log('3. Use the new token in the reset link');

// Generate a new token
const newToken = crypto.randomBytes(32).toString('hex');
const newHash = crypto.createHash('sha256').update(newToken).digest('hex');

console.log('\n📧 New Reset Token:');
console.log('=====================================');
console.log(`Token: ${newToken}`);
console.log(`Hash: ${newHash}`);
console.log(`Reset URL: http://localhost:5173/reset-password?token=${newToken}`);
console.log('=====================================');

console.log('\n🔧 Database Update Required:');
console.log('You need to update the database with this new token.');
console.log('The current stored hash is expired or invalid.');

console.log('\n🎯 Quick Fix:');
console.log('1. Use the new reset link above');
console.log('2. Update the database with the new hash');
console.log('3. Test the password reset');

console.log('\n📝 Database Update Command:');
console.log('In MongoDB, update the user document:');
console.log(`db.users.updateOne(
  { email: "shivgupta45750@gmail.com" },
  { 
    $set: { 
      resetPasswordToken: "${newHash}",
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000)
    }
  }
)`); 