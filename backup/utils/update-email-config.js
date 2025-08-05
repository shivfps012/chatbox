const fs = require('fs');

console.log('🔧 Update Email Configuration\n');

console.log('📧 Current Issue:');
console.log('Gmail App Password authentication failed.');
console.log('This means either:');
console.log('1. The App Password is for a different email address');
console.log('2. The App Password has expired');
console.log('3. 2FA is not enabled on the Gmail account');
console.log('');

console.log('📋 Current Configuration:');
console.log('EMAIL_USER: shivg1273@gmail.com');
console.log('EMAIL_PASS: rvet wmdc vnun rvcd (from shivgupta45750@gmail.com)');
console.log('');

console.log('🎯 Solutions:');
console.log('');
console.log('Option 1: Use the email that has the App Password');
console.log('Change EMAIL_USER and EMAIL_FROM to: shivgupta45750@gmail.com');
console.log('');
console.log('Option 2: Generate new App Password for shivg1273@gmail.com');
console.log('1. Go to https://myaccount.google.com/apppasswords');
console.log('2. Sign in with shivg1273@gmail.com');
console.log('3. Generate new App Password for "Mail"');
console.log('4. Update EMAIL_PASS with the new password');
console.log('');

console.log('💡 Which option do you prefer?');
console.log('1. Use shivgupta45750@gmail.com (existing App Password)');
console.log('2. Generate new App Password for shivg1273@gmail.com');
console.log('');

// Read current .env content
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
  return;
}

// Option 1: Use existing App Password
const option1Content = envContent.replace(
  /EMAIL_USER=shivg1273@gmail.com/g,
  'EMAIL_USER=shivgupta45750@gmail.com'
).replace(
  /EMAIL_FROM=shivg1273@gmail.com/g,
  'EMAIL_FROM=shivgupta45750@gmail.com'
);

// Option 2: Keep current email, need new App Password
const option2Content = envContent; // Keep as is, user needs to update EMAIL_PASS

console.log('📝 Option 1 - Use existing App Password:');
console.log('=====================================');
console.log(option1Content);
console.log('=====================================');

console.log('\n📝 Option 2 - Generate new App Password:');
console.log('Keep current configuration but update EMAIL_PASS with new App Password');
console.log('');

console.log('🎯 To apply Option 1, run:');
console.log('node apply-option1.js');
console.log('');
console.log('🎯 To apply Option 2, manually update EMAIL_PASS in .env file');
console.log('with the new App Password from shivg1273@gmail.com'); 