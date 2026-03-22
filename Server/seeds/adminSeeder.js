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

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sliit.lk';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  await User.create({
    name: 'SLIIT Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    isVerified: true,
    studentId: 'ADMIN001'
  });

  console.log('Admin seeded successfully');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);
  process.exit();
};

seedAdmin();