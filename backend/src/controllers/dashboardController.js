import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { Partner } from '../models/Partner.js';
import { Order } from '../models/Order.js';
import { Enquiry } from '../models/Enquiry.js';
import { Ticket } from '../models/Ticket.js';
import { Activity } from '../models/Activity.js';
import { ApiError } from '../utils/ApiError.js';
import { recordFilter, parseDate } from '../utils/helpers.js';

const DAY = 24 * 60 * 60 * 1000;

// GET /api/dashboard/summary?source=all|real|demo&from=&to=
// Every number is counted from the database when this is called.
export async function summary(req, res) {
  const filter = recordFilter(req.query);
  const count = (Model, extra = {}) => Model.countDocuments({ ...filter, ...extra });

  const [
    users, activeUsers,
    vendors, approvedVendors, vendorsAwaiting,
    partners, activePartners,
    orders, enquiries, tickets, openTickets,
    ordersPending, ordersOngoing, ordersCompleted,
    enquiriesPending, enquiriesOngoing, enquiriesCompleted,
    ticketsPending, ticketsOngoing, ticketsCompleted,
    vendorsPending, vendorsOngoing, vendorsCompleted,
    recentActivity,
    ...demoCounts
  ] = await Promise.all([
    count(User), count(User, { status: 'active' }),
    count(Vendor), count(Vendor, { status: 'approved' }), count(Vendor, { status: { $in: ['pending', 'under_review'] } }),
    count(Partner), count(Partner, { status: 'active' }),
    count(Order), count(Enquiry), count(Ticket), count(Ticket, { status: 'open' }),
    count(Order, { status: 'pending' }), count(Order, { status: 'ongoing' }), count(Order, { status: 'completed' }),
    count(Enquiry, { status: 'pending' }), count(Enquiry, { status: 'ongoing' }), count(Enquiry, { status: 'completed' }),
    count(Ticket, { status: 'open' }), count(Ticket, { status: 'in_progress' }), count(Ticket, { status: { $in: ['resolved', 'closed'] } }),
    count(Vendor, { status: 'pending' }), count(Vendor, { status: 'under_review' }), count(Vendor, { status: { $in: ['approved', 'rejected'] } }),
    Activity.find().sort({ createdAt: -1 }).limit(10),
    // How many sample (demo) records exist in total, so the page can show a notice
    ...[User, Vendor, Partner, Order, Enquiry, Ticket].map((Model) => Model.countDocuments({ isDemo: true })),
  ]);

  res.json({
    cards: {
      users: { total: users, active: activeUsers },
      vendors: { total: vendors, approved: approvedVendors, awaitingDecision: vendorsAwaiting },
      partners: { total: partners, active: activePartners },
      orders,
      enquiries,
      tickets: { total: tickets, open: openTickets },
    },
    // "Pending" = not started, "ongoing" = being worked on, "completed" = finished
    activities: {
      orders: { pending: ordersPending, ongoing: ordersOngoing, completed: ordersCompleted },
      enquiries: { pending: enquiriesPending, ongoing: enquiriesOngoing, completed: enquiriesCompleted },
      tickets: { pending: ticketsPending, ongoing: ticketsOngoing, completed: ticketsCompleted },
      vendorApplications: { pending: vendorsPending, ongoing: vendorsOngoing, completed: vendorsCompleted },
    },
    recentActivity,
    demoRecords: demoCounts.reduce((sum, count) => sum + count, 0),
  });
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

// GET /api/reports?source=&from=&to=   (defaults to the last 30 days)
export async function reports(req, res) {
  const today = new Date(dayKey(new Date()) + 'T00:00:00.000Z');
  const from = parseDate(req.query.from) || new Date(today.getTime() - 29 * DAY);
  const to = parseDate(req.query.to, true) || new Date(today.getTime() + DAY - 1);
  if (from > to) throw new ApiError(400, '"From" date must be before "to" date');
  if (to - from > 366 * DAY) throw new ApiError(400, 'Please choose a range of one year or less');

  const range = { createdAt: { $gte: from, $lte: to } };
  const base = { ...recordFilter({ source: req.query.source }), ...range };

  // Requests per day: load only the dates, then count them per day in JavaScript.
  const perDay = {};
  for (let time = from.getTime(); time <= to.getTime(); time += DAY) {
    perDay[dayKey(new Date(time))] = { date: dayKey(new Date(time)), orders: 0, enquiries: 0, tickets: 0 };
  }
  const sources = [['orders', Order], ['enquiries', Enquiry], ['tickets', Ticket]];
  await Promise.all(
    sources.map(async ([key, Model]) => {
      const docs = await Model.find(base).select('createdAt').limit(20000);
      for (const doc of docs) {
        const row = perDay[dayKey(doc.createdAt)];
        if (row) row[key] += 1;
      }
    }),
  );

  const breakdown = async (Model, statuses) => {
    const counts = await Promise.all(statuses.map((status) => Model.countDocuments({ ...base, status })));
    return statuses.map((status, index) => ({ status, count: counts[index] }));
  };
  const actions = ['login', 'create', 'update', 'status', 'approve', 'reject', 'note', 'delete'];
  const actionCounts = await Promise.all(actions.map((action) => Activity.countDocuments({ ...range, action })));

  const [orders, enquiries, tickets, vendors] = await Promise.all([
    breakdown(Order, ['pending', 'ongoing', 'completed', 'cancelled']),
    breakdown(Enquiry, ['pending', 'ongoing', 'completed']),
    breakdown(Ticket, ['open', 'in_progress', 'resolved', 'closed']),
    breakdown(Vendor, ['pending', 'under_review', 'approved', 'rejected']),
  ]);

  res.json({
    range: { from: dayKey(from), to: dayKey(to) },
    perDay: Object.values(perDay),
    statusBreakdown: { orders, enquiries, tickets, vendors },
    adminActions: actions.map((action, index) => ({ action, count: actionCounts[index] })),
  });
}
