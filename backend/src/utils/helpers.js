import mongoose from 'mongoose';
import { ApiError } from './ApiError.js';

// Copy only the allowed fields from the request body.
// This stops people from sending extra fields such as "isDemo" or "role".
export function pick(body, allowedFields) {
  const result = {};
  for (const field of allowedFields) {
    if (body && body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

// Query-string values must be plain strings. This blocks NoSQL injection such as ?status[$ne]=x
export function str(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Turn user text into a safe, case-insensitive regular expression.
export function searchRegex(text) {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

// Middleware: rejects ids that are not valid MongoDB ObjectIds.
export function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ApiError(400, 'Invalid id'));
  }
  next();
}

// Reads a date from the query string (YYYY-MM-DD). Returns null when empty.
export function parseDate(value, endOfDay = false) {
  const text = str(value);
  if (!text) return null;
  const date = new Date(text + (endOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z'));
  if (Number.isNaN(date.getTime())) throw new ApiError(400, `Invalid date: ${text}`);
  return date;
}

// Filters shared by lists, the dashboard and reports:
//   source = real | demo | all     (demo records are sample data created by "npm run seed:demo")
//   from / to = YYYY-MM-DD         (applied to the date the record was created)
export function recordFilter(query) {
  const filter = {};
  const source = str(query.source);
  if (source === 'demo') filter.isDemo = true;
  if (source === 'real') filter.isDemo = false;

  const from = parseDate(query.from);
  const to = parseDate(query.to, true);
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = from;
    if (to) filter.createdAt.$lte = to;
  }
  return filter;
}
