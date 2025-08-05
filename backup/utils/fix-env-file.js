const fs = require('fs');

console.log('🔧 Fix .env File Configuration\n');

// Read current .env file
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
  console.log('✅ .env file read successfully');
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
  return;
}

// Fix the email configuration
const fixedContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/chatapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client Configuration
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=shivg1273@gmail.com
EMAIL_FROM=shivg1273@gmail.com
EMAIL_PASS=rvet wmdc vnun rvcd

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000
`;

try {
  fs.writeFileSync('.env', fixedContent);
  console.log('✅ .env file updated successfully!');
  console.log('\n📧 Changes made:');
  console.log('- Fixed email address: shivgupta45750@gmail.com → shivg1273@gmail.com');
  console.log('- Removed extra spaces in email configuration');
  console.log('- Added SERVER_URL');
  console.log('- Added rate limiting configuration');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Restart your server: npm run server:dev');
  console.log('2. Test email configuration: node test-email-config.js');
  console.log('3. Request a password reset from your app');
  console.log('4. Check your email inbox for the reset link');
  
} catch (error) {
  console.log('❌ Error updating .env file:', error.message);
  console.log('\n💡 Manual fix:');
  console.log('Update your .env file with the content above');
} 