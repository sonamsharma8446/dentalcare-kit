// Adds SAMPLE records so you can try the dashboard before real data exists.
// Every record is flagged isDemo: true, so it shows a "Demo" badge in the dashboard and can be
// filtered out ("Real only"). Names are invented and emails use example.com.
//
//   npm run seed:demo          add demo data (skipped if demo data already exists)
//   npm run seed:demo:reset    delete ALL demo data, then add it again
//
// Real records (isDemo: false) are never touched by this script.
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Vendor } from '../src/models/Vendor.js';
import { Partner } from '../src/models/Partner.js';
import { Order } from '../src/models/Order.js';
import { Enquiry } from '../src/models/Enquiry.js';
import { Ticket } from '../src/models/Ticket.js';

const models = [User, Vendor, Partner, Order, Enquiry, Ticket];
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days) => new Date(Date.now() - days * DAY - Math.floor(Math.random() * 6) * 3600 * 1000);
const demo = (records) => records.map((record, index) => ({ ...record, isDemo: true, createdAt: daysAgo((index * 3) % 29) }));

await connectDB();

if (process.argv.includes('--reset')) {
  for (const Model of models) {
    const { deletedCount } = await Model.deleteMany({ isDemo: true });
    console.log(`Removed ${deletedCount} demo ${Model.modelName} record(s)`);
  }
}

const existing = await Promise.all(models.map((Model) => Model.countDocuments({ isDemo: true })));
if (existing.some((count) => count > 0)) {
  console.log('Demo data already exists. Run "npm run seed:demo:reset" to replace it.');
  await mongoose.disconnect();
  process.exit(0);
}

const cities = ['Delhi', 'Mumbai', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad', 'Jaipur', 'Kolkata'];
const names = ['Aarav Mehta', 'Diya Nair', 'Kabir Shah', 'Ira Kapoor', 'Vihaan Rao', 'Anaya Iyer', 'Reyansh Das', 'Myra Bose', 'Arjun Pillai', 'Saanvi Joshi'];

await User.create(
  demo(names.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    phone: `+91 90000 000${String(i).padStart(2, '0')}`,
    city: cities[i % cities.length],
    status: i % 4 === 3 ? 'inactive' : 'active',
  }))),
);

await Vendor.create(
  demo([
    { businessName: 'Sample Dental Supplies', contactName: 'Rohan Gupta', email: 'rohan@example.com', productCategory: 'cement', city: 'Delhi', status: 'approved' },
    { businessName: 'Demo Botanicals', contactName: 'Leela Menon', email: 'leela@example.com', productCategory: 'clove', city: 'Kochi', status: 'approved' },
    { businessName: 'Example Oral Care Co', contactName: 'Imran Qureshi', email: 'imran@example.com', productCategory: 'rinse', city: 'Mumbai', status: 'under_review' },
    { businessName: 'Sample Ortho Traders', contactName: 'Pooja Sethi', email: 'pooja@example.com', productCategory: 'wax', city: 'Pune', status: 'pending' },
    { businessName: 'Demo Sports Guards', contactName: 'Nikhil Verma', email: 'nikhil@example.com', productCategory: 'guard', city: 'Jaipur', status: 'pending' },
    { businessName: 'Example Wholesale', contactName: 'Tara Bhat', email: 'tara@example.com', productCategory: 'other', city: 'Chennai', status: 'rejected', rejectionReason: 'Sample record: documents were incomplete' },
  ]),
);

await Partner.create(
  demo([
    { name: 'Sample Smile Clinic', contactName: 'Dr. A. Sample', email: 'clinic1@example.com', partnerType: 'clinic', status: 'active', details: 'Sample referral partnership', connections: [{ label: 'Referral programme started', note: 'Sample entry' }] },
    { name: 'Demo Care Pharmacy', email: 'pharmacy@example.com', partnerType: 'pharmacy', status: 'active', details: 'Sample counter-display partnership' },
    { name: 'Example Sports Club', email: 'club@example.com', partnerType: 'sports_club', status: 'pending', details: 'Sample mouthguard programme' },
    { name: 'Sample School Network', email: 'school@example.com', partnerType: 'school', status: 'inactive', details: 'Sample paused partnership' },
    { name: 'Demo Distributors', email: 'dist@example.com', partnerType: 'distributor', status: 'active', details: 'Sample regional distribution' },
  ]),
);

const catalogue = [
  ['Temporary Filling Repair Cement - Starter Pack', 249],
  ['Pure Clove Oil - 10 ml', 149],
  ['Chlorhexidine Mouth Rinse - 200 ml', 199],
  ['Orthodontic Wax - Pocket Case', 99],
  ['Boil-and-Bite Mouthguard - Adult Size', 399],
];
const orderStatuses = ['pending', 'ongoing', 'completed', 'completed', 'completed', 'cancelled'];
const channels = ['phone', 'email', 'whatsapp', 'walk_in'];
await Order.create(
  demo(Array.from({ length: 14 }, (_, i) => ({
    customerName: names[i % names.length],
    customerEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
    channel: channels[i % channels.length],
    status: orderStatuses[i % orderStatuses.length],
    items: [
      { name: catalogue[i % 5][0], quantity: 1 + (i % 3), unitPrice: catalogue[i % 5][1] },
      ...(i % 2 ? [{ name: catalogue[(i + 2) % 5][0], quantity: 1, unitPrice: catalogue[(i + 2) % 5][1] }] : []),
    ],
    notes: 'Sample order (demo data)',
  }))),
);

const enquiryStatuses = ['pending', 'ongoing', 'completed'];
const enquiryTypes = ['product', 'partnership', 'general'];
await Enquiry.create(
  demo(Array.from({ length: 9 }, (_, i) => ({
    name: names[(i + 3) % names.length],
    email: `enquiry${i}@example.com`,
    type: enquiryTypes[i % 3],
    subject: ['Bulk order pricing', 'Partnership with our clinic', 'Question about mouthguard sizes'][i % 3],
    message: 'Sample enquiry message (demo data).',
    status: enquiryStatuses[i % 3],
  }))),
);

const ticketStatuses = ['open', 'in_progress', 'resolved', 'closed'];
await Ticket.create(
  demo(Array.from({ length: 8 }, (_, i) => ({
    customerName: names[(i + 5) % names.length],
    customerEmail: `ticket${i}@example.com`,
    type: i % 3 === 0 ? 'complaint' : 'query',
    subject: ['Where is my order?', 'Product question', 'Packaging was damaged', 'Need an invoice copy'][i % 4],
    message: 'Sample support message (demo data).',
    priority: ['low', 'medium', 'high'][i % 3],
    status: ticketStatuses[i % 4],
    responses: i % 4 >= 1 ? [{ author: 'Demo Support', text: 'Sample reply (demo data).', isInternal: false }] : [],
  }))),
);

for (const Model of models) {
  console.log(`Added ${await Model.countDocuments({ isDemo: true })} demo ${Model.modelName} record(s)`);
}
await mongoose.disconnect();
