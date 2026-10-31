// Usage:
//   npm run seed                  creates the first admin from ADMIN_* variables
//   npm run seed -- --reset-password   also resets that admin's password
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { Admin } from '../src/models/Admin.js';

const resetPassword = process.argv.includes('--reset-password');

await connectDB();

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';
const name = process.env.ADMIN_NAME || 'Site Admin';

if (!email || password.length < 10) {
  console.error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters in backend/.env');
  process.exit(1);
}

const existing = await Admin.findOne({ email });
if (!existing) {
  await Admin.create({ name, email, role: 'admin', passwordHash: await Admin.hashPassword(password) });
  console.log(`Created admin account: ${email}`);
} else if (resetPassword) {
  existing.passwordHash = await Admin.hashPassword(password);
  await existing.save();
  console.log(`Password reset for: ${email}`);
} else {
  console.log(`Admin ${email} already exists. Use "-- --reset-password" to change the password.`);
}

await mongoose.disconnect();
