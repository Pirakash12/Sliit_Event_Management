// server/controllers/auth.controller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,    // JS cannot access this cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  });
};

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      name, email, password, studentId,
      verifyToken, verifyTokenExpiry
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your SLIIT EMS account',
      html: `<p>Hello ${name},</p>
             <p>Click the link below to verify your account:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>
             <p>This link expires in 24 hours.</p>`
    });

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── VERIFY EMAIL ──
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });
    if (!user.isActive) return res.status(403).json({ message: 'Your account has been deactivated' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── REFRESH TOKEN ──
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshToken = refreshToken;
    await user.save();

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Refresh token expired. Please log in again.' });
  }
};

// ── LOGOUT ──
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token }).select('+refreshToken');
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};