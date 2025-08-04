const fs = require('fs');

console.log('🔧 Apply Option 1: Use Existing App Password\n');

// Read current .env content
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
  console.log('✅ .env file read successfully');
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
  return;
}

// Apply Option 1: Use existing App Password with correct email
const updatedContent = envContent.replace(
  /EMAIL_USER=shivg1273@gmail.com/g,
  'EMAIL_USER=shivgupta45750@gmail.com'
).replace(
  /EMAIL_FROM=shivg1273@gmail.com/g,
  'EMAIL_FROM=shivgupta45750@gmail.com'
);

try {
  fs.writeFileSync('.env', updatedContent);
  console.log('✅ .env file updated successfully!');
  console.log('\n📧 Changes made:');
  console.log('- EMAIL_USER: shivg1273@gmail.com → shivgupta45750@gmail.com');
  console.log('- EMAIL_FROM: shivg1273@gmail.com → shivgupta45750@gmail.com');
  console.log('- EMAIL_PASS: rvet wmdc vnun rvcd (unchanged)');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Restart your server: npm run server:dev');
  console.log('2. Test email configuration: node test-email-simple.js');
  console.log('3. Request a password reset from your app');
  console.log('4. Check shivgupta45750@gmail.com inbox for the reset link');
  
} catch (error) {
  console.log('❌ Error updating .env file:', error.message);
} 