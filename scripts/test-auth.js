/**
 * Test script to diagnose authentication issues
 * Run with: node scripts/test-auth.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testAuth() {
  console.log('\n🔍 Testing Authentication Setup...\n');

  // 1. Check environment variables
  console.log('1️⃣ Checking Environment Variables:');
  const requiredEnvVars = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  let envIssues = false;

  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('your-') || value.includes('generate-with')) {
      console.log(`   ❌ ${varName}: Missing or not configured`);
      envIssues = true;
    } else {
      console.log(`   ✅ ${varName}: Configured`);
    }
  });

  if (envIssues) {
    console.log('\n⚠️  Please update your .env.local file with proper values');
    return;
  }

  // 2. Test MongoDB connection
  console.log('\n2️⃣ Testing MongoDB Connection:');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ MongoDB connected successfully');

    // 3. Check for User model and users
    console.log('\n3️⃣ Checking Database:');
    const User = require('../models/User').default || require('../models/User');
    const userCount = await User.countDocuments();
    console.log(`   ℹ️  Total users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('   ⚠️  No users found. You need to sign up first!');
    } else {
      const users = await User.find().select('email name createdAt').limit(5);
      console.log('\n   📋 Existing users:');
      users.forEach(user => {
        console.log(`      - ${user.email} (${user.name})`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ All checks completed!');
    
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Make sure MongoDB is running (if local)');
    console.log('   - Check your MONGODB_URI in .env.local');
    console.log('   - If using Atlas, verify your IP is whitelisted');
  }
}

testAuth().catch(console.error);
