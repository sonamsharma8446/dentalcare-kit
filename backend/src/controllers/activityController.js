import { Activity } from '../models/Activity.js';
import { str, searchRegex, parseDate } from '../utils/helpers.js';

// GET /api/activity?action=&entity=&q=&from=&to=&page=&limit=
export async function list(req, res) {
  const filter = {};
  const action = str(req.query.action);
  const entity = str(req.query.entity);
  if (action) filter.action = action;
  if (entity) filter.entity = entity;

  const q = str(req.query.q);
  if (q) {
    const regex = searchRegex(q);
    filter.$or = [{ summary: regex }, { adminName: regex }];
  }

  const from = parseDate(req.query.from);
  const to = parseDate(req.query.to, true);
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = from;
    if (to) filter.createdAt.$lte = to;
  }

  const page = Math.max(1, parseInt(str(req.query.page), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(str(req.query.limit), 10) || 20));

  const [data, total] = await Promise.all([
    Activity.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Activity.countDocuments(filter),
  ]);
  res.json({ data, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
}
