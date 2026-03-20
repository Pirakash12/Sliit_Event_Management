const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email']
  },
  password: {
    type: String,
    minlength: 8,
    select: false        // never returned in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'organizer', 'finance', 'admin'],
    default: 'student'
  },
  studentId: {
    type: String,
    trim: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  googleId: {
    type: String      // only set for Google OAuth users
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  refreshToken: {
    type: String,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true      // admin can deactivate users
  },
  lastLogin: Date
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('User', userSchema);