/**
 * Script to create a test user for development
 * Run with: node scripts/create-test-user.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  console.log('\n👤 Creating Test User...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = require('../models/User').default || require('../models/User');

    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log(`ℹ️  User ${testEmail} already exists`);
      console.log('\n📝 Use these credentials to sign in:');
      console.log(`   Email: ${testEmail}`);
      console.log(`   Password: ${testPassword}`);
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Create user
    const user = await User.create({
      name: 'Test User',
      email: testEmail,
      password: hashedPassword,
      company: 'Test Company',
      plan: 'free',
    });

    console.log('✅ Test user created successfully!');
    console.log('\n📝 Use these credentials to sign in:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`\n👉 Go to: http://localhost:3000/auth/signin`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
