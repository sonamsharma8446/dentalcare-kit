import mongoose from 'mongoose';

// Business partners (clinics, pharmacies, distributors...) and the connections tracked with them.
const connectionSchema = new mongoose.Schema({
  label: { type: String, required: [true, 'Connection label is required'], trim: true, maxlength: 100 },
  note: { type: String, trim: true, maxlength: 500 },
  date: { type: Date, default: Date.now },
});

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Partner name is required'], trim: true, maxlength: 100 },
    contactName: { type: String, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: { type: String, trim: true, match: [/^[0-9+()\-\s]{7,20}$/, 'Enter a valid phone number'] },
    partnerType: {
      type: String,
      enum: ['clinic', 'pharmacy', 'distributor', 'sports_club', 'school', 'other'],
      default: 'other',
    },
    status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
    startDate: { type: Date },
    details: { type: String, trim: true, maxlength: 2000 }, // partnership terms and details
    connections: [connectionSchema],
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Partner = mongoose.model('Partner', partnerSchema);
