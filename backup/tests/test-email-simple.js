require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 Test Email Configuration (with .env loading)\n');

// Check environment variables
const emailConfig = {
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLIENT_URL: process.env.CLIENT_URL
};

console.log('📧 Email Configuration:');
console.log('=====================================');
Object.entries(emailConfig).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = key.includes('PASS') ? (value ? '***SET***' : 'NOT SET') : (value || 'NOT SET');
  console.log(`${status} ${key}: ${displayValue}`);
});
console.log('=====================================');

// Check if all required fields are set
const requiredFields = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingFields = requiredFields.filter(field => !emailConfig[field]);

if (missingFields.length === 0) {
  console.log('\n✅ All required email fields are configured!');
  console.log('\n🧪 Testing email connection...');
  
  const testConnection = async () => {
    try {
      const transporter = nodemailer.createTransport({
        host: emailConfig.EMAIL_HOST,
        port: emailConfig.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: emailConfig.EMAIL_USER,
          pass: emailConfig.EMAIL_PASS
        }
      });
      
      // Test the connection
      await transporter.verify();
      console.log('✅ Email connection successful!');
      console.log('✅ You should now receive real emails instead of mock emails.');
      
      // Test sending a simple email
      console.log('\n📧 Testing email sending...');
      const info = await transporter.sendMail({
        from: emailConfig.EMAIL_FROM,
        to: emailConfig.EMAIL_USER,
        subject: 'Test Email - AI Chat Assistant',
        text: 'This is a test email to verify your email configuration is working correctly.',
        html: '<h1>Test Email</h1><p>This is a test email to verify your email configuration is working correctly.</p>'
      });
      
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('\n🎯 Check your email inbox for the test message.');
      
    } catch (error) {
      console.log('❌ Email connection failed:');
      console.log('Error:', error.message);
      console.log('\n💡 Common issues:');
      console.log('1. Check your Gmail App Password');
      console.log('2. Make sure 2FA is enabled on your Gmail account');
      console.log('3. Verify EMAIL_USER matches your Gmail address');
      console.log('4. Check if EMAIL_FROM matches EMAIL_USER');
    }
  };
  
  testConnection();
} else {
  console.log('\n❌ Missing required email configuration:');
  missingFields.forEach(field => {
    console.log(`   - ${field}`);
  });
  
  console.log('\n💡 To fix this, check your .env file has these lines:');
  console.log('EMAIL_HOST=smtp.gmail.com');
  console.log('EMAIL_PORT=587');
  console.log('EMAIL_USER=shivg1273@gmail.com');
  console.log('EMAIL_PASS=your-app-password');
  console.log('EMAIL_FROM=shivg1273@gmail.com');
  console.log('CLIENT_URL=http://localhost:5173');
} 