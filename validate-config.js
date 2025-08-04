const fs = require('fs');
const path = require('path');

console.log('🔍 Validating ChatBox Configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('💡 Run "npm run setup" to create the .env file automatically.');
  process.exit(1);
}

// Read and parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Required environment variables
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL'
];

// Optional but recommended variables
const recommendedVars = [
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET'
];

console.log('📋 Checking required environment variables:');
let allRequiredPresent = true;

requiredVars.forEach(varName => {
  if (envVars[varName] && envVars[varName] !== '') {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing or empty`);
    allRequiredPresent = false;
  }
});

console.log('\n📋 Checking recommended environment variables:');
recommendedVars.forEach(varName => {
  if (envVars[varName] && envVars[varName] !== '') {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

// Check for default values that should be changed
console.log('\n🔒 Security checks:');
if (envVars.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  console.log('⚠️  JWT_SECRET: Using default value - change this in production!');
} else {
  console.log('✅ JWT_SECRET: Custom value set');
}

if (envVars.EMAIL_USER === 'your-email@gmail.com') {
  console.log('⚠️  EMAIL_USER: Using default value - update with your email');
} else if (envVars.EMAIL_USER) {
  console.log('✅ EMAIL_USER: Custom value set');
}

if (envVars.GOOGLE_CLIENT_ID === 'your-google-client-id') {
  console.log('⚠️  GOOGLE_CLIENT_ID: Using default value - update for Google OAuth');
} else if (envVars.GOOGLE_CLIENT_ID) {
  console.log('✅ GOOGLE_CLIENT_ID: Custom value set');
}

// Check MongoDB URI format
if (envVars.MONGODB_URI) {
  if (envVars.MONGODB_URI.includes('127.0.0.1') || envVars.MONGODB_URI.includes('localhost')) {
    console.log('ℹ️  MONGODB_URI: Using local MongoDB instance');
  } else {
    console.log('✅ MONGODB_URI: Using remote MongoDB instance');
  }
}

console.log('\n📊 Summary:');
if (allRequiredPresent) {
  console.log('✅ All required environment variables are set!');
  console.log('🚀 You can now start the application with: npm run start');
} else {
  console.log('❌ Some required environment variables are missing.');
  console.log('💡 Please update your .env file and run this validation again.');
  process.exit(1);
}

console.log('\n💡 Tips:');
console.log('- For production, make sure to use strong, unique values for all secrets');
console.log('- Enable Google OAuth by setting up Google Cloud Console credentials');
console.log('- Configure email settings for password reset functionality');
console.log('- Use a remote MongoDB instance for production deployments'); 