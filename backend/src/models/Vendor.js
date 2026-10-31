import mongoose from 'mongoose';

// Businesses that apply to supply products. Onboarding goes:
// pending -> under_review -> approved or rejected.
const vendorSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: [true, 'Business name is required'], trim: true, maxlength: 100 },
    contactName: { type: String, required: [true, 'Contact name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: { type: String, trim: true, match: [/^[0-9+()\-\s]{7,20}$/, 'Enter a valid phone number'] },
    city: { type: String, trim: true, maxlength: 60 },
    productCategory: {
      type: String,
      enum: ['cement', 'clove', 'rinse', 'wax', 'guard', 'other'],
      default: 'other',
    },
    status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      required: [
        function needsReason() {
          return this.status === 'rejected';
        },
        'Please give a reason for rejecting this vendor',
      ],
    },
    notes: { type: String, trim: true, maxlength: 1000 },
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// A reason only makes sense while the vendor is rejected.
vendorSchema.pre('validate', function clearReason() {
  if (this.status !== 'rejected') this.rejectionReason = undefined;
});

export const Vendor = mongoose.model('Vendor', vendorSchema);
