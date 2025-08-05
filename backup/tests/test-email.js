const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
async function testEmailConfig() {
  console.log('🔍 Testing Email Configuration...\n');
  
  // Log current email settings (without password)
  console.log('📧 Email Settings:');
  console.log(`Host: ${process.env.EMAIL_HOST}`);
  console.log(`Port: ${process.env.EMAIL_PORT}`);
  console.log(`User: ${process.env.EMAIL_USER}`);
  console.log(`From: ${process.env.EMAIL_FROM}`);
  console.log(`Password: ${process.env.EMAIL_PASS ? '***SET***' : '***NOT SET***'}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}\n`);

  if (!process.env.EMAIL_PASS) {
    console.log('❌ ERROR: EMAIL_PASS is not set in .env file');
    console.log('Please add your Gmail App Password to the .env file');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    console.log('🔐 Testing Gmail authentication...');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail authentication successful!');
    
    // Test sending email
    console.log('📤 Testing email sending...');
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Password Reset System',
      text: 'This is a test email to verify your email configuration is working correctly.',
      html: '<h1>Test Email</h1><p>Your email configuration is working correctly!</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    
  } catch (error) {
    console.log('❌ Email test failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Gmail Authentication Issues:');
      console.log('1. Make sure 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Generate a new App Password:');
      console.log('   - Go to https://myaccount.google.com/');
      console.log('   - Security → 2-Step Verification → App passwords');
      console.log('   - Select "Mail" and generate a new password');
      console.log('3. Update your .env file with the new app password');
      console.log('4. Make sure the password has spaces: "abcd efgh ijkl mnop"');
    }
  }
}

// Run the test
testEmailConfig().catch(console.error); 