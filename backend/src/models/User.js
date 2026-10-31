import mongoose from 'mongoose';

// Customers / registered users. (There is no public sign-up on the website yet,
// so these are added by admins.)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: { type: String, trim: true, match: [/^[0-9+()\-\s]{7,20}$/, 'Enter a valid phone number'] },
    city: { type: String, trim: true, maxlength: 60 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String, trim: true, maxlength: 1000 },
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
