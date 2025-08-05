// Google OAuth Diagnostic Tool
require('dotenv').config();
console.log('===== Google OAuth Diagnostic Tool =====');

// Function to check client URL and callback settings
function checkSettings() {
  console.log('\nChecking environment variables...');
  
  const clientUrl = process.env.CLIENT_URL || 'Not set';
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'Not set';
  const clientId = process.env.GOOGLE_CLIENT_ID ? 'Set (hidden for security)' : 'Not set';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ? 'Set (hidden for security)' : 'Not set';
  
  console.log(`CLIENT_URL: ${clientUrl}`);
  console.log(`GOOGLE_CALLBACK_URL: ${callbackUrl}`);
  console.log(`GOOGLE_CLIENT_ID: ${clientId}`);
  console.log(`GOOGLE_CLIENT_SECRET: ${clientSecret}`);
  
  // Check if callback URL matches CLIENT_URL domain
  if (callbackUrl !== 'Not set' && clientUrl !== 'Not set') {
    try {
      const callbackDomain = new URL(callbackUrl).hostname;
      const clientDomain = new URL(clientUrl).hostname;
      
      console.log(`\nCallback URL domain: ${callbackDomain}`);
      console.log(`Client URL domain: ${clientDomain}`);
      
      if (callbackDomain !== clientDomain) {
        console.log('⚠️ WARNING: The callback URL domain does not match the client URL domain.');
        console.log('This might be intentional in a development setup, but for production they usually match.');
      }
    } catch (error) {
      console.log('Error parsing URLs:', error.message);
    }
  }
  
  return { clientUrl, callbackUrl };
}

// Verify configuration
const { clientUrl, callbackUrl } = checkSettings();

// Check redirect URLs
console.log('\nVerifying auth success redirect URL...');
const expectedRedirect = `${clientUrl}/auth/success?token=YOUR_TOKEN`;
console.log(`Expected redirect after successful auth: ${expectedRedirect}`);

console.log('\n===== End of Diagnostic =====');
console.log('If you are seeing 401 errors, check that your Google Client ID and Secret are correct');
console.log('and that you have authorized the callback URL in the Google Cloud Console.');

// Export functions for use in other files
module.exports = { checkSettings };
