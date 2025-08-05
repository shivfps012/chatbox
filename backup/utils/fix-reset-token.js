const mongoose = require('mongoose');
const crypto = require('crypto');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatbox', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updateResetToken() {
  try {
    console.log('🔧 Updating Reset Token in Database\n');
    
    // Generate new token
    const newToken = crypto.randomBytes(32).toString('hex');
    const newHash = crypto.createHash('sha256').update(newToken).digest('hex');
    
    console.log('📧 Generated New Token:');
    console.log(`Token: ${newToken}`);
    console.log(`Hash: ${newHash}`);
    
    // Import User model
    const User = require('./models/User');
    
    // Update the user's reset token
    const result = await User.updateOne(
      { email: 'shivgupta45750@gmail.com' },
      {
        $set: {
          resetPasswordToken: newHash,
          resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Database updated successfully!');
      console.log('\n📧 Working Reset Link:');
      console.log('=====================================');
      console.log(`http://localhost:5173/reset-password?token=${newToken}`);
      console.log('=====================================');
      
      console.log('\n🎯 Instructions:');
      console.log('1. Copy the reset link above');
      console.log('2. Paste it in your browser');
      console.log('3. Enter your new password');
      console.log('4. Click "Reset password"');
      
      console.log('\n🔍 Expected Behavior:');
      console.log('- Token length: 64 characters');
      console.log('- No "Invalid or missing reset token" error');
      console.log('- Form should be enabled');
      console.log('- Password reset should work');
      
    } else {
      console.log('❌ User not found or no changes made');
    }
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateResetToken(); 