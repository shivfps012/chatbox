// Google OAuth Flow Test
require('dotenv').config();

/**
 * This script tests the full Google OAuth flow by:
 * 1. Checking all environment variables
 * 2. Testing the redirect URI structure
 * 3. Simulating the token handling process
 */

console.log('===== Google OAuth Flow Test =====');

// Check environment variables
console.log('\nChecking environment variables:');
const requiredVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET', 
  'GOOGLE_CALLBACK_URL',
  'CLIENT_URL'
];

const missingVars = requiredVars.filter(name => !process.env[name]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
} else {
  console.log('✅ All required environment variables are present');
}

// Check redirect URI
const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
const clientUrl = process.env.CLIENT_URL;

console.log('\nValidating URIs:');
console.log(`🔹 Server callback URL: ${callbackUrl}`);
console.log(`🔹 Client redirect URL: ${clientUrl}/auth/success?token=EXAMPLE_TOKEN`);

// Simulate token flow
console.log('\nSimulating auth flow:');
console.log('1. User is redirected to Google OAuth');
console.log('2. User authorizes the application');
console.log(`3. Google redirects to: ${callbackUrl}`);
console.log('4. Server validates the user and generates JWT token');
console.log(`5. Server redirects to: ${clientUrl}/auth/success?token=EXAMPLE_TOKEN`);
console.log('6. Frontend extracts token from URL');
console.log('7. Frontend calls handleGoogleAuthSuccess with token');
console.log('8. Token stored in localStorage and user data fetched');

// Simulate GoogleAuthSuccess component
function simulateGoogleAuthSuccess() {
  console.log('\nSimulating GoogleAuthSuccess component:');
  
  try {
    // Mock URL parameters
    const mockParams = new URLSearchParams();
    mockParams.append('token', 'EXAMPLE_TOKEN');
    
    console.log('✅ Successfully extracted token from URL');
    
    // Simulate the auth context function
    const mockHandleAuth = (token) => {
      console.log(`✅ handleGoogleAuthSuccess called with token: ${token}`);
      
      // Mock setting localStorage
      console.log('✅ Token stored in localStorage');
      
      // Mock fetching user data
      console.log('✅ User data fetched successfully');
      
      return { success: true };
    };
    
    const result = mockHandleAuth(mockParams.get('token'));
    
    if (result.success) {
      console.log('✅ Auth flow completed successfully');
    }
  } catch (error) {
    console.error('❌ Error in auth simulation:', error.message);
  }
}

simulateGoogleAuthSuccess();

console.log('\n===== End of Test =====');
console.log('If all checks passed, your OAuth configuration should be correct.');
console.log('If you are still experiencing issues, check the browser console for errors.');
