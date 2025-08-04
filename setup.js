const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 ChatBox Setup Script\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/chatapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Client Configuration
CLIENT_URL=http://localhost:5173

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the .env file with your actual configuration values.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Check if uploads directory exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Uploads directory created successfully!\n');
} else {
  console.log('✅ Uploads directory already exists.\n');
}

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.log('❌ Node.js version 16 or higher is required.');
    console.log(`Current version: ${nodeVersion}`);
    process.exit(1);
  } else {
    console.log(`✅ Node.js version: ${nodeVersion}`);
  }
} catch (error) {
  console.log('❌ Could not check Node.js version.');
}

// Check if MongoDB is running (optional check)
console.log('\n🔍 Checking MongoDB connection...');
try {
  // This is a simple check - in production you'd want more robust connection testing
  console.log('ℹ️  Make sure MongoDB is running on mongodb://127.0.0.1:27017');
  console.log('ℹ️  You can start MongoDB with: mongod');
} catch (error) {
  console.log('⚠️  Could not verify MongoDB connection.');
}

// Check if dependencies are installed
console.log('\n📦 Checking dependencies...');
try {
  const packageLockPath = path.join(__dirname, 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    console.log('✅ Dependencies appear to be installed.');
  } else {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!');
  }
} catch (error) {
  console.log('❌ Error checking/installing dependencies:', error.message);
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env file with your actual configuration values');
console.log('2. Start MongoDB if not already running');
console.log('3. Run the development servers:');
console.log('   npm run start');
console.log('\n🌐 The application will be available at:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend:  http://localhost:5000');
console.log('\n📚 For more information, see the README.md file.'); 