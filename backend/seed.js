/**
 * Seed script — creates a default admin user
 * Run once: node seed.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager');

  const existing = await User.findOne({ email: 'admin@taskflow.com' });
  if (existing) {
    // Ensure username field exists on legacy records
    if (!existing.username) {
      existing.username = 'admin';
      await existing.save();
      console.log('✅ Admin updated with username: admin');
    } else {
      console.log('✅ Admin already exists:', existing.email, '| username:', existing.username);
    }
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('admin123', salt);

  await User.create({
    username: 'admin',
    name: 'Admin User',
    email: 'admin@taskflow.com',
    password,
    role: 'admin',
  });

  console.log('✅ Admin created:  admin@taskflow.com / admin123 / username: admin');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
