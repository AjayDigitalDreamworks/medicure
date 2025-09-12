import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import sendEmail from '../utils/sendEmail.js';
import { User } from '../models/User.js';

const router = express.Router();

// Request password reset - sends email with token
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  if(!email) return res.status(400).json({error:'Email required'});
  const user = await User.findOne({ email });
  if(!user) return res.status(404).json({error:'User not found'});

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 hour
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const html = `<p>Reset your password by clicking <a href="${resetLink}">here</a>. This link expires in 1 hour.</p>`;
  const sent = await sendEmail(email, 'Password Reset', html);
  if(!sent) return res.status(500).json({error:'Failed to send email'});
  res.json({message:'Password reset email sent'});
});

// Confirm reset
router.post('/confirm-reset', async (req, res) => {
  const { email, token, newPassword } = req.body;
  if(!email || !token || !newPassword) return res.status(400).json({error:'Missing fields'});
  const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }});
  if(!user) return res.status(400).json({error:'Invalid or expired token'});
  const hash = await bcrypt.hash(newPassword, 12);
  user.passwordHash = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({message:'Password reset successful'});
});

export default router;
