import mongoose from 'mongoose';

// Customer support: queries and complaints, with replies and private internal notes.
const responseSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: [true, 'Write a message first'], trim: true, maxlength: 2000 },
  isInternal: { type: Boolean, default: false }, // true = private note, not for the customer
  createdAt: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: [true, 'Customer name is required'], trim: true, maxlength: 80 },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    type: { type: String, enum: ['query', 'complaint'], default: 'query' },
    subject: { type: String, required: [true, 'Subject is required'], trim: true, maxlength: 150 },
    message: { type: String, required: [true, 'Message is required'], trim: true, maxlength: 3000 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    responses: [responseSchema],
    isDemo: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
