import assert from 'assert';
import dotenv from 'dotenv';
import { connectDB, dbMode } from '../config/db.js';
import { Projects, Blogs, Users, Messages } from '../models/dbStore.js';

dotenv.config();

const runTests = async () => {
  console.log('🧪 Starting API & Database Integration Tests...');
  
  // Connect database
  await connectDB();

  try {
    // Test 1: Check Database Mode
    console.log(`📡 [Test 1] Database initialized. Running in mode: [${dbMode}]`);
    assert.ok(dbMode === 'json' || dbMode === 'mongodb', 'Database mode must be either json or mongodb');
    console.log('✅ [Test 1] Passed.');

    // Test 2: Query Projects
    console.log('📡 [Test 2] Querying projects...');
    const list = await Projects.find();
    assert.ok(Array.isArray(list), 'Projects.find() must return an array');
    console.log(`✅ [Test 2] Passed. Retrieved ${list.length} projects.`);

    // Test 3: Query Blogs
    console.log('📡 [Test 3] Querying blog articles...');
    const blogs = await Blogs.find();
    assert.ok(Array.isArray(blogs), 'Blogs.find() must return an array');
    console.log(`✅ [Test 3] Passed. Retrieved ${blogs.length} articles.`);

    // Test 4: Create a Message record
    console.log('📡 [Test 4] Submitting mock inquiry message...');
    const testMsg = await Messages.create({
      name: 'Test Recruiter',
      email: 'test@hiring.com',
      subject: 'Interview Request',
      category: 'Interview Request',
      content: 'Let\'s schedule a systems architecture overview.'
    });
    assert.ok(testMsg._id, 'Message creation should return a record with _id');
    console.log('✅ [Test 4] Passed.');

    // Cleanup message
    await Messages.findByIdAndDelete(testMsg._id);
    console.log('🧹 Cleaned up test message.');

    console.log('🎉 All Integration Tests Passed Successfully!');
  } catch (error) {
    console.error('❌ Test Suite Failed with error:', error);
    process.exit(1);
  }
};

runTests();
