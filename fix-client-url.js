const fs = require('fs');
const path = require('path');

// Read the current .env file
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with the correct CLIENT_URL');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Check if CLIENT_URL is set to wrong port
if (envContent.includes('CLIENT_URL=http://localhost:5175')) {
  console.log('🔧 Fixing CLIENT_URL from port 5175 to 5173...');
  
  // Replace the wrong port with correct port
  envContent = envContent.replace(
    'CLIENT_URL=http://localhost:5175',
    'CLIENT_URL=http://localhost:5173'
  );
  
  // Write back to .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ CLIENT_URL fixed! Now using port 5173');
} else if (envContent.includes('CLIENT_URL=http://localhost:5173')) {
  console.log('✅ CLIENT_URL is already correct (port 5173)');
} else {
  console.log('⚠️ CLIENT_URL not found or has different format');
  console.log('Please manually set CLIENT_URL=http://localhost:5173 in your .env file');
}

console.log('\n📋 Current .env CLIENT_URL settings:');
const lines = envContent.split('\n');
lines.forEach(line => {
  if (line.startsWith('CLIENT_URL=')) {
    console.log(`   ${line}`);
  }
});

console.log('\n🚀 Next steps:');
console.log('1. Restart your server: npm run server:dev');
console.log('2. Try the password reset again');
console.log('3. The reset link should now work on port 5173'); 