import mongoose from 'mongoose';
import { randomInt } from 'node:crypto';

// Orders are recorded by admins (the public site has no checkout yet).
const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Item name is required'], trim: true, maxlength: 120 },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [999, 'Quantity is too large'],
      validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' },
    },
    unitPrice: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  },
  { _id: false },
);

function makeOrderNumber() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  return `DC-${date}-${randomInt(1000, 10000)}`;
}

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, default: makeOrderNumber },
    customerName: { type: String, required: [true, 'Customer name is required'], trim: true, maxlength: 80 },
    customerEmail: { type: String, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'] },
    customerPhone: { type: String, trim: true, match: [/^[0-9+()\-\s]{7,20}$/, 'Enter a valid phone number'] },
    items: {
      type: [itemSchema],
      validate: { validator: (items) => items.length > 0, message: 'Add at least one item' },
    },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    channel: { type: String, enum: ['phone', 'email', 'whatsapp', 'walk_in', 'other'], default: 'other' },
    notes: { type: String, trim: true, maxlength: 1000 },
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// The total is always calculated on the server, never trusted from the browser.
orderSchema.pre('validate', function calculateTotal() {
  const sum = (this.items || []).reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  this.total = Math.round(sum * 100) / 100;
});

export const Order = mongoose.model('Order', orderSchema);
