require('dotenv').config();
// Create simple coloring functions since chalk is now an ESM module
const green = (text) => `✅ ${text}`;
const red = (text) => `❌ ${text}`;
const yellow = (text) => `⚠️ ${text}`;
const blue = (text) => `ℹ️ ${text}`;

console.log('\n🔍 Verifying Google OAuth Configuration\n');

// Required environment variables
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'CLIENT_URL',
  'SERVER_URL',
  'JWT_SECRET'
];

let hasErrors = false;

// Check each required variable
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(red(`Missing ${varName}: This environment variable is required for Google OAuth`));
    hasErrors = true;
  } else if (varName === 'GOOGLE_CLIENT_ID' && (!value.includes('.apps.googleusercontent.com'))) {
    console.log(yellow(`Suspicious ${varName}: Value doesn't look like a valid Google Client ID`));
    console.log(`  Current value: ${value.substring(0, 10)}...`);
  } else if (varName === 'GOOGLE_CALLBACK_URL' && (!value.includes('/api/auth/google/callback'))) {
    console.log(yellow(`Suspicious ${varName}: Callback URL should typically end with /api/auth/google/callback`));
    console.log(`  Current value: ${value}`);
  } else {
    // Show first few characters of sensitive values
    const displayValue = ['GOOGLE_CLIENT_SECRET', 'JWT_SECRET'].includes(varName)
      ? `${value.substring(0, 10)}...`
      : value;
    
    console.log(green(`${varName}: ${displayValue}`));
  }
});

if (process.env.GOOGLE_CALLBACK_URL && process.env.SERVER_URL) {
  const serverUrl = process.env.SERVER_URL;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
  
  if (!callbackUrl.startsWith(serverUrl)) {
    console.log(yellow(`Warning: GOOGLE_CALLBACK_URL (${callbackUrl}) doesn't start with SERVER_URL (${serverUrl})`));
  }
}

if (hasErrors) {
  console.log('\n❌ Configuration errors detected. Please fix them before proceeding.\n');
  console.log('For help setting up Google OAuth, follow these steps:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a project or select an existing one');
  console.log('3. Navigate to "APIs & Services" > "Credentials"');
  console.log('4. Create an OAuth client ID for a "Web application"');
  console.log('5. Add authorized redirect URIs (should match GOOGLE_CALLBACK_URL)');
  console.log('6. Copy Client ID and Client Secret to your .env file');
} else {
  console.log('\n✅ All required environment variables are present\n');
  console.log('To test Google OAuth:');
  console.log('1. Ensure your server is running');
  console.log('2. Click on "Sign in with Google" button in your application');
  console.log('3. Complete Google authentication');
  console.log('4. You should be redirected back to your application and logged in');
}

console.log('\nNote: Make sure your Google OAuth credentials are configured correctly in Google Cloud Console');
console.log('      and that you\'ve enabled the Google+ API for your project.\n');
