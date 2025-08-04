const https = require('https');
const http = require('http');

async function triggerPasswordReset() {
  try {
    console.log('🔧 Triggering Password Reset\n');
    
    const postData = JSON.stringify({
      email: 'shivg1273@gmail.com'
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('📧 Response:', response.message);
          console.log('✅ Password reset request sent successfully!');
          
          console.log('\n🎯 Next Steps:');
          console.log('1. Check your server console for the mock email output');
          console.log('2. Look for a line that starts with "📧 MOCK EMAIL SENT (for testing):"');
          console.log('3. Copy the reset link from the server console');
          console.log('4. Use that link in your browser');
          
          console.log('\n🔍 Expected Server Console Output:');
          console.log('📧 MOCK EMAIL SENT (for testing):');
          console.log('=====================================');
          console.log('To: shivg1273@gmail.com');
          console.log('Subject: Password Reset Request - AI Chat Assistant');
          console.log('Reset Link: http://localhost:5173/reset-password?token=YOUR_TOKEN_HERE');
          console.log('=====================================');
          
          console.log('\n⚠️ If you don\'t see the mock email output:');
          console.log('1. Make sure your server is running');
          console.log('2. Check that the email configuration is incomplete (which triggers mock email)');
          console.log('3. Try requesting the reset from your app UI instead');
          
        } catch (error) {
          console.error('❌ Error parsing response:', error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Error triggering password reset:', error);
    });
    
    req.write(postData);
    req.end();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

triggerPasswordReset(); 