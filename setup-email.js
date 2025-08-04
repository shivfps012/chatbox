const fs = require('fs');
const readline = require('readline');

console.log('📧 Email Configuration Setup\\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('This script will help you set up email configuration for password reset emails.\\n');

console.log('📋 Prerequisites:');
console.log('1. Gmail account with 2-Factor Authentication enabled');
console.log('2. Gmail App Password generated');
console.log('\\n💡 To get Gmail App Password:');
console.log('1. Go to https://myaccount.google.com/apppasswords');
console.log('2. Select "Mail" and generate a password');
console.log('3. Copy the 16-character password\\n');

rl.question('Enter your Gmail address (e.g., yourname@gmail.com): ', (email) => {
  rl.question('Enter your Gmail App Password (16 characters): ', (password) => {
    rl.question('Confirm your Gmail address: ', (confirmEmail) => {
      
      if (email !== confirmEmail) {
        console.log('❌ Email addresses do not match. Please try again.');
        rl.close();
        return;
      }
      
      if (password.length !== 16) {
        console.log('❌ App Password should be 16 characters. Please check your Gmail App Password.');
        rl.close();
        return;
      }
      
      // Create .env content
      const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chatbox

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=${email}
EMAIL_PASS=${password}
EMAIL_FROM=${email}

# Client Configuration
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# File Upload Configuration
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000
`;
      
      console.log('\\n📧 Email Configuration:');
      console.log('=====================================');
      console.log(`EMAIL_HOST: smtp.gmail.com`);
      console.log(`EMAIL_PORT: 587`);
      console.log(`EMAIL_USER: ${email}`);
      console.log(`EMAIL_PASS: ${'*'.repeat(16)}`);
      console.log(`EMAIL_FROM: ${email}`);
      console.log('=====================================');
      
      rl.question('\\nDo you want to create/update the .env file? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          try {
            fs.writeFileSync('.env', envContent);
            console.log('✅ .env file created/updated successfully!');
            console.log('\\n🎯 Next Steps:');
            console.log('1. Restart your server: npm run server:dev');
            console.log('2. Test email configuration: node test-email-config.js');
            console.log('3. Request a password reset from your app');
            console.log('4. Check your email inbox for the reset link');
          } catch (error) {
            console.log('❌ Error creating .env file:', error.message);
            console.log('\\n💡 Manual Setup:');
            console.log('Create a .env file in your project root with the configuration above.');
          }
        } else {
          console.log('\\n💡 Manual Setup:');
          console.log('Create a .env file in your project root with this content:');
          console.log('\\n' + envContent);
        }
        
        rl.close();
      });
    });
  });
}); 