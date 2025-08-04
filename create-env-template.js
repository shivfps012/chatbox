const fs = require('fs');

console.log('📧 Create .env File Template\n');

// Check if .env file exists
const envExists = fs.existsSync('.env');

if (envExists) {
  console.log('✅ .env file exists');
  console.log('📋 Current .env content:');
  console.log('=====================================');
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    console.log(envContent);
  } catch (error) {
    console.log('❌ Error reading .env file:', error.message);
  }
  console.log('=====================================');
} else {
  console.log('❌ .env file does not exist');
}

console.log('\n📧 Required Email Configuration:');
console.log('=====================================');
console.log('Add these lines to your .env file:');
console.log('');
console.log('# Email Configuration (Gmail)');
console.log('EMAIL_HOST=smtp.gmail.com');
console.log('EMAIL_PORT=587');
console.log('EMAIL_USER=shivg1273@gmail.com');
console.log('EMAIL_PASS=your-16-character-app-password');
console.log('EMAIL_FROM=shivg1273@gmail.com');
console.log('CLIENT_URL=http://localhost:5173');
console.log('=====================================');

console.log('\n📧 Gmail App Password Setup:');
console.log('1. Go to https://myaccount.google.com/apppasswords');
console.log('2. Select "Mail" from the dropdown');
console.log('3. Click "Generate"');
console.log('4. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")');
console.log('5. Replace "your-16-character-app-password" with the actual password');

console.log('\n🎯 After adding the email configuration:');
console.log('1. Restart your server: npm run server:dev');
console.log('2. Test the configuration: node test-email-config.js');
console.log('3. Request a password reset from your app');
console.log('4. Check your email inbox for the reset link');

console.log('\n💡 Example .env file content:');
console.log('=====================================');
console.log(`# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chatbox

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=shivg1273@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=shivg1273@gmail.com

# Client Configuration
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000`);
console.log('====================================='); 