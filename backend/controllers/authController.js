import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Register user with OTP verification
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Basic validations
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }
  if (typeof password !== "string" || password.length <= 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be longer than 6 characters"
    });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email"
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Create user (unverified)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      favResidenciesID: [],
      bookedVisits: [],
      isVerified: false,
      verificationCode: otp,
      verificationExpires: expires
    },
    select: {
      id: true,
      email: true,
      name: true,
      isVerified: true,
      createdAt: true
    }
  });

  // Send OTP via email (basic SMTP, env-driven)
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });

    const fromEmail = process.env.FROM_EMAIL || 'no-reply@soumya-shrishty.local';
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 15 minutes.</p>`
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  res.status(201).json({
    success: true,
    message: 'User registered. Please verify your email with the OTP sent.',
    user
  });
});

// Verify email with OTP
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and code are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(200).json({ success: true, message: 'Email already verified' });
  }

  if (!user.verificationCode || !user.verificationExpires || new Date(user.verificationExpires) < new Date()) {
    return res.status(400).json({ success: false, message: 'Verification code expired or invalid' });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ success: false, message: 'Invalid verification code' });
  }

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verificationCode: null,
      verificationExpires: null
    }
  });

  res.status(200).json({ success: true, message: 'Email verified successfully' });
});


// Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Basic validations
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }
  if (typeof password !== "string" || password.length <= 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be longer than 6 characters"
    });
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }


  // Generate token
  const token = generateToken(user.id);

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: userWithoutPassword
  });
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      name: true,
      favResidenciesID: true,
      bookedVisits: true,
      createdAt: true
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Middleware to verify JWT token
export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token."
    });
  }
});

// Request password reset - sends OTP to email
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Always respond success to avoid email enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetCode: otp,
      resetExpires: expires
    }
  });

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });

    const fromEmail = process.env.FROM_EMAIL || 'no-reply@soumya-shrishty.local';
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Password reset code',
      text: `Your password reset code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 15 minutes.</p>`
    });
  } catch (error) {
    console.error('Reset email sending failed:', error);
  }

  return res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent' });
});

// Verify reset OTP
export const verifyReset = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and code are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!user.resetCode || !user.resetExpires || new Date(user.resetExpires) < new Date()) {
    return res.status(400).json({ success: false, message: 'Reset code expired or invalid' });
  }

  if (user.resetCode !== code) {
    return res.status(400).json({ success: false, message: 'Invalid reset code' });
  }

  return res.status(200).json({ success: true, message: 'Reset code verified' });
});

// Reset password after OTP verification
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, code and new password are required' });
  }
  if (typeof newPassword !== 'string' || newPassword.length <= 6) {
    return res.status(400).json({ success: false, message: 'Password must be longer than 6 characters' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!user.resetCode || !user.resetExpires || new Date(user.resetExpires) < new Date()) {
    return res.status(400).json({ success: false, message: 'Reset code expired or invalid' });
  }

  if (user.resetCode !== code) {
    return res.status(400).json({ success: false, message: 'Invalid reset code' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetExpires: null
    }
  });

  return res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
});
