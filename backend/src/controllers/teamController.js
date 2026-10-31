import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../utils/logActivity.js';
import { pick, str, searchRegex } from '../utils/helpers.js';

export const MIN_PASSWORD = 10;

// Checks a new password. Returns nothing, or throws a 400 with a message for the "password" field.
export function checkPassword(value) {
  if (typeof value !== 'string' || value.length < MIN_PASSWORD) {
    throw new ApiError(400, 'Please fix the highlighted fields', { password: `Password must be at least ${MIN_PASSWORD} characters` });
  }
  if (value.length > 100) {
    throw new ApiError(400, 'Please fix the highlighted fields', { password: 'Password is too long' });
  }
}

async function findMember(id) {
  const member = await Admin.findById(id);
  if (!member) throw new ApiError(404, 'Team member not found');
  return member;
}

// GET /api/team
export async function list(req, res) {
  const filter = {};
  const q = str(req.query.q);
  if (q) filter.$or = [{ name: searchRegex(q) }, { email: searchRegex(q) }];
  const data = await Admin.find(filter).sort({ createdAt: 1 });
  res.json({ data });
}

// POST /api/team  { name, email, role, password }
export async function create(req, res) {
  const body = pick(req.body, ['name', 'email', 'role']);
  // Check every field first, so the form can show all problems at once
  const problems = {};
  try {
    await new Admin({ ...body, passwordHash: 'placeholder' }).validate();
  } catch (error) {
    for (const [field, detail] of Object.entries(error.errors || {})) problems[field] = detail.message;
  }
  try {
    checkPassword(req.body.password);
  } catch (error) {
    problems.password = error.errors.password;
  }
  if (Object.keys(problems).length > 0) throw new ApiError(400, 'Please fix the highlighted fields', problems);
  const member = await Admin.create({ ...body, passwordHash: await Admin.hashPassword(req.body.password) });
  await logActivity(req.admin, 'create', 'admin', `Added team member: ${member.name} (${member.role})`, member._id);
  res.status(201).json({ data: member });
}

// PUT /api/team/:id  { name, role, isActive }
export async function update(req, res) {
  const member = await findMember(req.params.id);
  const changes = pick(req.body, ['name', 'role', 'isActive']);
  const isSelf = member._id.equals(req.admin._id);
  if (isSelf && ((changes.role && changes.role !== member.role) || changes.isActive === false)) {
    throw new ApiError(400, 'You cannot deactivate your own account or change your own role');
  }
  member.set(changes);
  await member.save();
  await logActivity(req.admin, 'update', 'admin', `Updated team member: ${member.name} (${member.role}, ${member.isActive ? 'active' : 'inactive'})`, member._id);
  res.json({ data: member });
}

// POST /api/team/:id/password  { password }   (an admin sets a new temporary password)
export async function resetPassword(req, res) {
  const member = await findMember(req.params.id);
  checkPassword(req.body.password);
  member.passwordHash = await Admin.hashPassword(req.body.password);
  await member.save();
  await logActivity(req.admin, 'update', 'admin', `Reset the password of: ${member.name}`, member._id);
  res.json({ message: 'Password updated' });
}
