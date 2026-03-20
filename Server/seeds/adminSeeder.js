// server/seeds/adminSeeder.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit();
  }

  await User.create({
    name: 'SLIIT Admin',
    email: 'admin@sliit.lk',
    password: 'Admin@1234',   // change this immediately after first login
    role: 'admin',
    isVerified: true,          // admin doesn't need email verification
    studentId: 'ADMIN001'
  });

  console.log('Admin seeded successfully');
  console.log('Email: admin@sliit.lk');
  console.log('Password: Admin@1234  ← Change this immediately!');
  process.exit();
};

seedAdmin();