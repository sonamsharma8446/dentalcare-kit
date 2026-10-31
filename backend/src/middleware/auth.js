import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';

// Protects a route: the request must carry "Authorization: Bearer <token>".
export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new ApiError(401, 'Please log in');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again');
  }

  // Check the account on every request, so a deactivated admin is locked out immediately.
  const admin = await Admin.findById(payload.id);
  if (!admin || !admin.isActive) throw new ApiError(401, 'This account is not available');

  req.admin = admin;
  next();
}

// Allows only the listed roles, e.g. requireRole('admin') for deleting.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      throw new ApiError(403, 'You do not have permission to do this');
    }
    next();
  };
}
