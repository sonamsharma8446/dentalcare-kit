import mongoose from 'mongoose';

// Questions from people interested in products or partnerships.
const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: { type: String, trim: true, match: [/^[0-9+()\-\s]{7,20}$/, 'Enter a valid phone number'] },
    type: { type: String, enum: ['product', 'partnership', 'general'], default: 'general' },
    subject: { type: String, required: [true, 'Subject is required'], trim: true, maxlength: 150 },
    message: { type: String, required: [true, 'Message is required'], trim: true, maxlength: 3000 },
    status: { type: String, enum: ['pending', 'ongoing', 'completed'], default: 'pending' },
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
