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
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists with this email" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Store pending registration (do NOT create user yet)
  const pending = await prisma.registrationRequest.upsert({
    where: { email },
    update: {
      hashedPassword,
      name: name || email.split('@')[0],
      code: otp,
      expires
    },
    create: {
      email,
      hashedPassword,
      name: name || email.split('@')[0],
      code: otp,
      expires
    },
    select: { email: true, expires: true }
  });

  // Send OTP via email
  try {
    const nodemailer = await import('nodemailer');

    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        requireTLS: true,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        } : undefined
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
    }

    const fromEmail = process.env.FROM_EMAIL || 'no-reply@soumya-shrishty.local';
    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 15 minutes.</p>`
    });

    if (!process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log('Verification email preview URL:', previewUrl);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email. Verify to create account.',
    email: pending.email
  });
});

// Verify email with OTP
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and code are required' });
  }

  // Find pending registration
  const pending = await prisma.registrationRequest.findUnique({ where: { email } });
  if (!pending) {
    return res.status(404).json({ success: false, message: 'No pending registration found for this email' });
  }

  // Validate code and expiry
  if (!pending.code || !pending.expires || new Date(pending.expires) < new Date()) {
    return res.status(400).json({ success: false, message: 'Verification code expired or invalid' });
  }
  if (pending.code !== code) {
    return res.status(400).json({ success: false, message: 'Invalid verification code' });
  }

  // Ensure user was not accidentally created already
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    // Clean up pending request and just mark verified if needed
    await prisma.registrationRequest.delete({ where: { email } });
    if (!existingUser.isVerified) {
      await prisma.user.update({ where: { email }, data: { isVerified: true, verificationCode: null, verificationExpires: null } });
    }
    return res.status(200).json({ success: true, message: 'Email verified successfully', user: { id: existingUser.id, email: existingUser.email, name: existingUser.name } });
  }

  // Create the actual user now
  const user = await prisma.user.create({
    data: {
      email,
      password: pending.hashedPassword,
      name: pending.name || email.split('@')[0],
      favResidenciesID: [],
      bookedVisits: [],
      isVerified: true,
      verificationCode: null,
      verificationExpires: null
    },
    select: { id: true, email: true, name: true, createdAt: true }
  });

  // Remove pending registration
  await prisma.registrationRequest.delete({ where: { email } });

  res.status(200).json({ success: true, message: 'Account created and email verified', user });
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
  console.log('🔄 Forgot password request for:', email);

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Always respond success to avoid email enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('❌ User not found for email:', email);
    return res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent' });
  }

  console.log('✅ User found, generating OTP for:', email);

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
    let transporter;

    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        requireTLS: true,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        } : undefined
      });
    } else {
      // Dev fallback using Ethereal for testing email delivery
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const fromEmail = process.env.FROM_EMAIL || 'no-reply@soumya-shrishty.local';
    console.log('📧 Sending email from:', fromEmail, 'to:', email);
    console.log('🔧 Using SMTP:', process.env.SMTP_HOST ? 'Yes' : 'No (Ethereal)');
    
    const info = await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Password reset code',
      text: `Your password reset code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 15 minutes.</p>`
    });

    console.log('✅ Email sent successfully! Message ID:', info.messageId);

    // Log preview URL in dev fallback
    if (!process.env.SMTP_HOST) {
      console.log('Password reset email preview URL:', nodemailer.getTestMessageUrl(info));
    } else {
      console.log('📬 Email sent via SMTP to:', email);
    }
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
