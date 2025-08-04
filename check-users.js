const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatbox');

async function checkUsers() {
  try {
    console.log('🔍 Checking Users in Database\n');
    
    // Import User model
    const User = require('./models/User');
    
    // Find all users
    const users = await User.find({}, 'email name resetPasswordToken resetPasswordExpires');
    
    console.log(`📊 Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Reset Token: ${user.resetPasswordToken ? user.resetPasswordToken.substring(0, 20) + '...' : 'None'}`);
      console.log(`   Token Expires: ${user.resetPasswordExpires || 'None'}`);
      console.log('');
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log('✅ Users found. Use one of the email addresses above.');
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers(); 