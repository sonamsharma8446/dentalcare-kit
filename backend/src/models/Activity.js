import mongoose from 'mongoose';

// One row per important admin action (login, create, update, status change, delete).
const activitySchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    adminName: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ['login', 'create', 'update', 'status', 'delete', 'approve', 'reject', 'note'],
    },
    entity: { type: String, required: true }, // e.g. "vendor", "order"
    entityId: { type: mongoose.Schema.Types.ObjectId },
    summary: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

activitySchema.index({ createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
