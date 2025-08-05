const fs = require('fs');
const http = require('http');
const { exec } = require('child_process');
require('dotenv').config();

// Function to open URL in default browser (since open is an ESM module)
function openBrowser(url) {
  const command = process.platform === 'win32' ? 
    `start "${url}"` : 
    process.platform === 'darwin' ? 
      `open "${url}"` : 
      `xdg-open "${url}"`;

  exec(command, (error) => {
    if (error) {
      console.error(`Failed to open browser: ${error.message}`);
      console.log(`Please manually open: ${url}`);
    }
  });
}

// Create a simple HTML page with troubleshooting steps
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Google OAuth Troubleshooter</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #0066cc; }
    h2 { color: #0066cc; margin-top: 30px; }
    .step { 
      background-color: #f5f5f5;
      border-left: 4px solid #0066cc;
      padding: 15px;
      margin-bottom: 20px;
    }
    .code {
      font-family: monospace;
      background-color: #f0f0f0;
      padding: 2px 5px;
      border-radius: 3px;
    }
    .warning { color: #cc3300; }
    .success { color: #007700; }
    button {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 10px 15px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 4px;
      margin: 10px 0;
    }
    button:hover {
      background-color: #0055aa;
    }
    .hidden {
      display: none;
    }
    #client-id-status, #redirect-status {
      margin-top: 10px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Google OAuth Error Fix - 401 Invalid Client</h1>
  
  <div class="warning">
    <p>You're seeing this tool because you encountered an <strong>"Error 401: invalid_client"</strong> when trying to sign in with Google.</p>
  </div>

  <h2>Current Configuration</h2>
  <div class="step">
    <p><strong>Client ID:</strong> <span class="code">${process.env.GOOGLE_CLIENT_ID || 'Not set'}</span></p>
    <p><strong>Redirect URI:</strong> <span class="code">${process.env.GOOGLE_CALLBACK_URL || 'Not set'}</span></p>
  </div>

  <h2>Step 1: Check Project in Google Cloud Console</h2>
  <div class="step">
    <p>1. Go to Google Cloud Console:</p>
    <button onclick="window.open('https://console.cloud.google.com/apis/credentials')">Open Google Cloud Console</button>
    
    <p>2. Verify your OAuth Client ID matches what's in your .env file:</p>
    <p>First few characters should be: <span class="code">${process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 15) + '...' : 'N/A'}</span></p>
    
    <div id="client-id-check">
      <p>Does your Client ID in Google Cloud Console match?</p>
      <button onclick="document.getElementById('client-id-status').innerHTML = '<span class=\\'success\\'>✓ Client ID matches</span>'; document.getElementById('step2').classList.remove('hidden');">Yes, it matches</button>
      <button onclick="document.getElementById('client-id-status').innerHTML = '<span class=\\'warning\\'>✗ Client IDs don\\'t match! Update your .env file with the correct Client ID</span>'">No, it's different</button>
      <div id="client-id-status"></div>
    </div>
  </div>
  
  <div id="step2" class="hidden">
    <h2>Step 2: Verify Redirect URI</h2>
    <div class="step">
      <p>Check that this exact Redirect URI is added to your OAuth Client ID configuration:</p>
      <p class="code">${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'}</p>
      
      <div id="redirect-check">
        <p>Is this exact redirect URI added to your client configuration?</p>
        <button onclick="document.getElementById('redirect-status').innerHTML = '<span class=\\'success\\'>✓ Redirect URI is configured correctly</span>'; document.getElementById('step3').classList.remove('hidden');">Yes, it's there</button>
        <button onclick="document.getElementById('redirect-status').innerHTML = '<span class=\\'warning\\'>✗ Add this redirect URI to your OAuth Client configuration</span>'">No, it's missing</button>
        <div id="redirect-status"></div>
      </div>
    </div>
  </div>
  
  <div id="step3" class="hidden">
    <h2>Step 3: Check OAuth Consent Screen</h2>
    <div class="step">
      <p>Ensure your OAuth Consent Screen is properly configured:</p>
      <button onclick="window.open('https://console.cloud.google.com/apis/credentials/consent')">Open OAuth Consent Screen</button>
      
      <ul>
        <li>Make sure all required fields are filled in</li>
        <li>Add your email as a test user</li>
        <li>Verify scopes include profile and email</li>
      </ul>
    </div>
    
    <h2>Step 4: Enable Required APIs</h2>
    <div class="step">
      <p>Make sure these APIs are enabled:</p>
      <button onclick="window.open('https://console.cloud.google.com/apis/library')">Open API Library</button>
      
      <ul>
        <li>Google+ API</li>
        <li>People API</li>
        <li>Google Identity Services API</li>
      </ul>
    </div>
    
    <h2>Step 5: Test Again</h2>
    <div class="step">
      <p>After completing all steps, test your Google Sign-In again:</p>
      <button onclick="window.location.href = '${process.env.CLIENT_URL}'">Go to Your App</button>
    </div>
  </div>
  
  <h2>Additional Resources</h2>
  <div class="step">
    <p>If you're still having issues, consult these resources:</p>
    <ul>
      <li><a href="https://developers.google.com/identity/protocols/oauth2" target="_blank">Google OAuth 2.0 Documentation</a></li>
      <li><a href="https://developers.google.com/identity/protocols/oauth2/web-server#error-codes" target="_blank">Common OAuth 2.0 Errors</a></li>
    </ul>
  </div>
</body>
</html>
`;

// Write the HTML to a temporary file
fs.writeFileSync('google-oauth-troubleshooter.html', html);

// Create a simple server to serve the troubleshooter
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

// Start the server on port 3333
server.listen(3333, () => {
  console.log('Google OAuth Troubleshooter running at http://localhost:3333');
  console.log('Opening browser...');
  
  // Open the troubleshooter in the default browser
  openBrowser('http://localhost:3333');
});

// Handle server shutdown
console.log('Press Ctrl+C to stop the troubleshooter server');
process.on('SIGINT', () => {
  console.log('Shutting down troubleshooter server');
  server.close();
  process.exit(0);
});
