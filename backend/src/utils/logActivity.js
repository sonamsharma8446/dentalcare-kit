import { Activity } from '../models/Activity.js';

// Saves one line in the activity log. Logging must never break the real action,
// so a failure here is only printed.
export async function logActivity(admin, action, entity, summary, entityId) {
  try {
    await Activity.create({
      admin: admin._id,
      adminName: admin.name,
      action,
      entity,
      entityId,
      summary,
    });
  } catch (error) {
    console.error('Could not write activity log:', error.message);
  }
}
