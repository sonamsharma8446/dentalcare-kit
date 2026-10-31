import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../utils/logActivity.js';

function publicAdmin(admin) {
  return { id: admin._id, name: admin.name, email: admin.email, role: admin.role };
}

// POST /api/auth/login
export async function login(req, res) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const admin = await Admin.findOne({ email }).select('+passwordHash');
  // For an unknown email we still do the slow hashing step, so the response time
  // does not reveal which emails have accounts.
  let passwordOk = false;
  if (admin) passwordOk = await admin.checkPassword(password);
  else await Admin.hashPassword(password);

  if (!admin || !passwordOk || !admin.isActive) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  const token = jwt.sign({ id: admin._id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  await logActivity(admin, 'login', 'admin', `${admin.name} logged in`, admin._id);
  res.json({ token, admin: publicAdmin(admin) });
}

// GET /api/auth/me
export function me(req, res) {
  res.json({ admin: publicAdmin(req.admin) });
}
