const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatbox');

async function checkDatabase() {
  try {
    console.log('🔍 Checking Database Structure\n');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections in database:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    console.log('\n🔍 Checking each collection for users:');
    
    for (const collection of collections) {
      console.log(`\n📋 Collection: ${collection.name}`);
      
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   Document count: ${count}`);
        
        if (count > 0) {
          // Get first few documents
          const docs = await db.collection(collection.name).find({}).limit(3).toArray();
          docs.forEach((doc, index) => {
            console.log(`   Document ${index + 1}:`);
            console.log(`     Keys: ${Object.keys(doc).join(', ')}`);
            if (doc.email) {
              console.log(`     Email: ${doc.email}`);
            }
            if (doc.name) {
              console.log(`     Name: ${doc.name}`);
            }
          });
        }
      } catch (error) {
        console.log(`   Error reading collection: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkDatabase(); 