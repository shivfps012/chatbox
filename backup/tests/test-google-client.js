require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

console.log('\n🔍 Google OAuth Direct Test Tool\n');

// Check if required environment variables exist
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Required environment variables are missing.');
  console.log('Please make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your .env file.');
  process.exit(1);
}

// Config
const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_CALLBACK_URL || `${process.env.SERVER_URL}/api/auth/google/callback`,
  scope: 'profile email',
  responseType: 'code'
};

// Function to make HTTP request
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const httpModule = options.protocol === 'https:' ? https : http;
    
    const req = httpModule.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Test the Google OAuth Authorization URL
async function testOAuthURL() {
  console.log('🔄 Testing Google OAuth Authorization URL...');
  
  // Build the OAuth URL
  const authParams = {
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: config.responseType,
    scope: config.scope
  };
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(authParams)}`;
  const parsedUrl = url.parse(authUrl);
  
  try {
    // Make a HEAD request to check if the URL is valid
    const options = {
      method: 'HEAD',
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      protocol: parsedUrl.protocol,
      headers: {
        'User-Agent': 'OAuth-Test/1.0'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200 || response.statusCode === 302) {
      console.log('✅ OAuth URL is valid.');
      console.log(`🔗 Authorization URL: ${authUrl}`);
    } else {
      console.log(`❌ OAuth URL returned status code: ${response.statusCode}`);
      console.log(`🔗 URL: ${authUrl}`);
    }
  } catch (error) {
    console.error('❌ Error testing OAuth URL:', error.message);
  }
}

// Test the Client ID with Google's tokeninfo endpoint
async function testClientId() {
  console.log('\n🔄 Testing Client ID with Google...');
  
  try {
    const options = {
      method: 'GET',
      hostname: 'oauth2.googleapis.com',
      path: `/tokeninfo?client_id=${encodeURIComponent(config.clientId)}`,
      protocol: 'https:',
      headers: {
        'User-Agent': 'OAuth-Test/1.0'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      console.log('✅ Client ID is valid with Google.');
      
      try {
        const data = JSON.parse(response.data);
        console.log(`📋 Client Details:`);
        console.log(`- Project ID: ${data.issued_to.split('-')[0]}`);
        console.log(`- Client ID: ${data.issued_to}`);
        console.log(`- Valid: ${data.audience === config.clientId ? 'Yes' : 'No'}`);
      } catch (e) {
        console.log('Data:', response.data);
      }
    } else if (response.statusCode === 400) {
      console.log('❌ Client ID is invalid or has issues.');
      console.log(response.data);
      console.log('\n🔧 Please verify your Client ID in Google Cloud Console.');
    } else {
      console.log(`⚠️ Unexpected status code: ${response.statusCode}`);
      console.log(response.data);
    }
  } catch (error) {
    console.error('❌ Error testing Client ID:', error.message);
  }
}

// Test the complete OAuth flow
async function testOAuthFlow() {
  console.log('\n🔄 Testing direct access to OAuth endpoint...');
  
  try {
    // Test direct access to your backend's Google OAuth endpoint
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    const options = {
      method: 'GET',
      ...url.parse(`${serverUrl}/api/auth/google`),
      headers: {
        'User-Agent': 'OAuth-Test/1.0'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 302) {
      console.log('✅ OAuth endpoint is working correctly');
      console.log(`🔀 Redirecting to: ${response.headers.location}`);
      
      // Check if the redirect contains the client_id
      if (response.headers.location && response.headers.location.includes(config.clientId)) {
        console.log('✅ Client ID is included in the redirect URL');
      } else {
        console.log('❌ Client ID is missing from the redirect URL');
      }
    } else {
      console.log(`❌ OAuth endpoint returned status code: ${response.statusCode}`);
      console.log(response.data);
    }
  } catch (error) {
    console.error('❌ Error testing OAuth flow:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('📋 Configuration:');
  console.log(`- Client ID: ${config.clientId.substring(0, 10)}...`);
  console.log(`- Redirect URI: ${config.redirectUri}`);
  console.log(`- Scope: ${config.scope}`);
  
  await testOAuthURL();
  await testClientId();
  await testOAuthFlow();
  
  console.log('\n🏁 Testing completed!');
  console.log('If all tests passed, but you still have issues:');
  console.log('1. Make sure your Google Cloud Console project has the correct credentials');
  console.log('2. Verify that OAuth consent screen is properly configured');
  console.log('3. Check that you\'ve added your email as a test user');
  console.log('4. Make sure all required Google APIs are enabled');
}

runTests();
