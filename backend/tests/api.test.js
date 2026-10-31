// Integration tests: they start the real API and talk to a real (test) MongoDB.
//   npm test
// Uses TEST_MONGODB_URI (default: mongodb://127.0.0.1:27017/dentalcare_test).
// The database name MUST end in "_test" because these tests delete everything in it.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

const uri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/dentalcare_test';
if (!new URL(uri).pathname.endsWith('_test')) {
  throw new Error('Refusing to run: the test database name must end in "_test"');
}
process.env.MONGODB_URI = uri;
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123456';
process.env.BCRYPT_ROUNDS = '4';
process.env.LOGIN_RATE_LIMIT = '1000';

const { default: mongoose } = await import('mongoose');
const { default: app } = await import('../src/app.js');
const { Admin } = await import('../src/models/Admin.js');
const { User } = await import('../src/models/User.js');
const { Order } = await import('../src/models/Order.js');
const { Ticket } = await import('../src/models/Ticket.js');

let server;
let base;
let adminToken;
let staffToken;

async function api(method, path, body, token = adminToken) {
  const response = await fetch(base + path, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

async function login(email, password) {
  const result = await api('POST', '/api/auth/login', { email, password }, null);
  return result.body.token;
}

before(async () => {
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  await Admin.syncIndexes();
  await User.syncIndexes();
  await Order.syncIndexes();
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;

  const passwordHash = await Admin.hashPassword('Password-12345');
  await Admin.create({ name: 'Ada Admin', email: 'ada@test.dev', role: 'admin', passwordHash });
  await Admin.create({ name: 'Sam Staff', email: 'sam@test.dev', role: 'staff', passwordHash });
  adminToken = await login('ada@test.dev', 'Password-12345');
  staffToken = await login('sam@test.dev', 'Password-12345');
});

after(async () => {
  server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('authentication', () => {
  test('rejects wrong password and missing/forged tokens', async () => {
    assert.equal((await api('POST', '/api/auth/login', { email: 'ada@test.dev', password: 'bad' }, null)).status, 401);
    assert.equal((await api('GET', '/api/users', undefined, null)).status, 401);
    assert.equal((await api('GET', '/api/users', undefined, 'not-a-token')).status, 401);
  });

  test('a deactivated admin is locked out immediately, even with a valid token', async () => {
    const hash = await Admin.hashPassword('Password-12345');
    const temp = await Admin.create({ name: 'Temp', email: 'temp@test.dev', passwordHash: hash });
    const token = await login('temp@test.dev', 'Password-12345');
    assert.equal((await api('GET', '/api/users', undefined, token)).status, 200);
    temp.isActive = false;
    await temp.save();
    assert.equal((await api('GET', '/api/users', undefined, token)).status, 401);
    assert.equal((await api('POST', '/api/auth/login', { email: 'temp@test.dev', password: 'Password-12345' }, null)).status, 401);
  });
});

describe('users', () => {
  let userId;

  test('create, validate, and reject duplicates', async () => {
    const created = await api('POST', '/api/users', { name: 'Asha Rao', email: 'ASHA@example.com', phone: '+91 98765 43210', city: 'Pune', isDemo: true });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.email, 'asha@example.com'); // lower-cased
    assert.equal(created.body.data.isDemo, false); // cannot be set from the browser
    assert.equal(created.body.data.status, 'active');
    userId = created.body.data._id;

    const invalid = await api('POST', '/api/users', { name: '', email: 'nope' });
    assert.equal(invalid.status, 400);
    assert.ok(invalid.body.errors.name && invalid.body.errors.email);

    const duplicate = await api('POST', '/api/users', { name: 'Other', email: 'asha@example.com' });
    assert.equal(duplicate.status, 409);
  });

  test('pagination, search, filter and sort', async () => {
    for (let i = 1; i <= 11; i++) {
      await api('POST', '/api/users', { name: `Person ${String(i).padStart(2, '0')}`, email: `p${i}@example.com`, city: i % 2 ? 'Delhi' : 'Mumbai' });
    }
    const page1 = await api('GET', '/api/users?limit=5&page=1');
    assert.equal(page1.body.data.length, 5);
    assert.deepEqual(page1.body.pagination, { page: 1, limit: 5, total: 12, pages: 3 });
    assert.equal((await api('GET', '/api/users?limit=5&page=3')).body.data.length, 2);

    assert.equal((await api('GET', '/api/users?q=mumbai')).body.pagination.total, 5);
    assert.equal((await api('GET', '/api/users?q=asha')).body.data[0].name, 'Asha Rao');
    assert.equal((await api('GET', '/api/users?q=.*')).body.pagination.total, 0); // regex characters are escaped
    assert.equal((await api('GET', '/api/users?status[$ne]=active')).status, 200); // injection is ignored, not executed

    const sorted = await api('GET', '/api/users?sort=name&limit=100');
    const names = sorted.body.data.map((u) => u.name);
    assert.deepEqual(names, [...names].sort());
    assert.equal((await api('GET', '/api/users?sort=-name&limit=1')).body.data[0].name, 'Person 11');
  });

  test('update, deactivate, then filter by status', async () => {
    const updated = await api('PUT', `/api/users/${userId}`, { city: 'Nagpur', status: 'active' });
    assert.equal(updated.body.data.city, 'Nagpur');
    const off = await api('PATCH', `/api/users/${userId}/status`, { status: 'inactive' });
    assert.equal(off.body.data.status, 'inactive');
    assert.equal((await api('PATCH', `/api/users/${userId}/status`, { status: 'banana' })).status, 400);
    assert.equal((await api('GET', '/api/users?status=inactive')).body.pagination.total, 1);
  });

  test('bad ids, missing records and role permissions', async () => {
    assert.equal((await api('GET', '/api/users/not-an-id')).status, 400);
    assert.equal((await api('GET', '/api/users/64b64b64b64b64b64b64b64b')).status, 404);
    assert.equal((await api('DELETE', `/api/users/${userId}`, undefined, staffToken)).status, 403);
    assert.equal((await api('DELETE', `/api/users/${userId}`)).status, 200);
    assert.equal((await api('GET', `/api/users/${userId}`)).status, 404);
  });
});

describe('vendors', () => {
  test('onboarding: reject needs a reason, approve clears it', async () => {
    const created = await api('POST', '/api/vendors', { businessName: 'Sample Supplies', contactName: 'Ravi', email: 'ravi@example.com', productCategory: 'wax' });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.status, 'pending');
    const id = created.body.data._id;

    assert.equal((await api('PATCH', `/api/vendors/${id}/status`, { status: 'under_review' })).body.data.status, 'under_review');
    const noReason = await api('PATCH', `/api/vendors/${id}/status`, { status: 'rejected' });
    assert.equal(noReason.status, 400);
    assert.ok(noReason.body.errors.rejectionReason);

    const rejected = await api('PATCH', `/api/vendors/${id}/status`, { status: 'rejected', rejectionReason: 'Missing licence' });
    assert.equal(rejected.body.data.rejectionReason, 'Missing licence');
    const approved = await api('PATCH', `/api/vendors/${id}/status`, { status: 'approved' });
    assert.equal(approved.body.data.status, 'approved');
    assert.equal(approved.body.data.rejectionReason, undefined);

    assert.equal((await api('PUT', `/api/vendors/${id}`, { city: 'Jaipur' })).body.data.city, 'Jaipur');
    assert.equal((await api('GET', '/api/vendors?status=approved&productCategory=wax')).body.pagination.total, 1);
    assert.equal((await api('GET', '/api/vendors?status=pending')).body.pagination.total, 0);
  });
});

describe('partners', () => {
  test('create, track connections, update status', async () => {
    const created = await api('POST', '/api/partners', { name: 'Sample Clinic', email: 'clinic@example.com', partnerType: 'clinic', startDate: '2026-09-01', details: 'Referral partner' });
    assert.equal(created.status, 201);
    const id = created.body.data._id;

    const added = await api('POST', `/api/partners/${id}/connections`, { label: 'Referred 3 patients', note: 'September' });
    assert.equal(added.status, 201);
    assert.equal(added.body.data.connections.length, 1);
    assert.equal((await api('POST', `/api/partners/${id}/connections`, { label: '' })).status, 400);

    const connectionId = added.body.data.connections[0]._id;
    const removed = await api('DELETE', `/api/partners/${id}/connections/${connectionId}`);
    assert.equal(removed.body.data.connections.length, 0);
    assert.equal((await api('DELETE', `/api/partners/${id}/connections/${connectionId}`)).status, 404);

    assert.equal((await api('PATCH', `/api/partners/${id}/status`, { status: 'active' })).body.data.status, 'active');
  });
});

describe('orders', () => {
  let orderId;

  test('total is calculated on the server and input is validated', async () => {
    const created = await api('POST', '/api/orders', {
      customerName: 'Meera', channel: 'phone', total: 99999,
      items: [{ name: 'Orthodontic Wax', quantity: 2, unitPrice: 99 }, { name: 'Clove Oil 10 ml', quantity: 1, unitPrice: 149.5 }],
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.total, 347.5);
    assert.match(created.body.data.orderNumber, /^DC-\d{6}-\d{4}$/);
    orderId = created.body.data._id;

    assert.equal((await api('POST', '/api/orders', { customerName: 'X', items: [] })).status, 400);
    assert.equal((await api('POST', '/api/orders', { customerName: 'X', items: [{ name: 'A', quantity: 0, unitPrice: 5 }] })).status, 400);
    assert.equal((await api('POST', '/api/orders', { customerName: 'X', items: [{ name: 'A', quantity: 1.5, unitPrice: 5 }] })).status, 400);
    assert.equal((await api('POST', '/api/orders', { customerName: 'X', items: [{ name: 'A', quantity: 1, unitPrice: -5 }] })).status, 400);
  });

  test('status moves pending -> ongoing -> completed; edit recalculates total; search & filter', async () => {
    assert.equal((await api('PATCH', `/api/orders/${orderId}/status`, { status: 'ongoing' })).body.data.status, 'ongoing');
    assert.equal((await api('PATCH', `/api/orders/${orderId}/status`, { status: 'completed' })).body.data.status, 'completed');
    const edited = await api('PUT', `/api/orders/${orderId}`, { items: [{ name: 'Mouthguard', quantity: 3, unitPrice: 100 }] });
    assert.equal(edited.body.data.total, 300);
    assert.equal((await api('GET', '/api/orders?status=completed')).body.pagination.total, 1);
    assert.equal((await api('GET', '/api/orders?q=meera')).body.pagination.total, 1);
    assert.equal((await api('GET', '/api/orders?q=nobody')).body.pagination.total, 0);
  });
});

describe('enquiries and support tickets', () => {
  test('enquiry lifecycle', async () => {
    const created = await api('POST', '/api/enquiries', { name: 'Kiran', email: 'kiran@example.com', type: 'partnership', subject: 'Bulk pricing', message: 'Do you supply schools?' });
    assert.equal(created.status, 201);
    assert.equal((await api('PATCH', `/api/enquiries/${created.body.data._id}/status`, { status: 'completed' })).body.data.status, 'completed');
    assert.equal((await api('POST', '/api/enquiries', { name: 'No message', email: 'a@b.co', subject: 's' })).status, 400);
    assert.equal((await api('GET', '/api/enquiries?type=partnership')).body.pagination.total, 1);
  });

  test('ticket responses and internal notes', async () => {
    const created = await api('POST', '/api/tickets', { customerName: 'Latha', customerEmail: 'latha@example.com', type: 'complaint', subject: 'Late delivery', message: 'Still waiting', priority: 'high' });
    assert.equal(created.status, 201);
    const id = created.body.data._id;

    const reply = await api('POST', `/api/tickets/${id}/responses`, { text: 'Sorry, checking now.' });
    assert.equal(reply.body.data.responses[0].isInternal, false);
    assert.equal(reply.body.data.responses[0].author, 'Ada Admin');
    const note = await api('POST', `/api/tickets/${id}/responses`, { text: 'Courier delayed', isInternal: true });
    assert.equal(note.body.data.responses[1].isInternal, true);
    const sneaky = await api('POST', `/api/tickets/${id}/responses`, { text: 'x', isInternal: 'true' });
    assert.equal(sneaky.body.data.responses[2].isInternal, false); // only a real boolean true counts
    assert.equal((await api('POST', `/api/tickets/${id}/responses`, { text: '   ' })).status, 400);

    assert.equal((await api('PATCH', `/api/tickets/${id}/status`, { status: 'in_progress' })).body.data.status, 'in_progress');
    assert.equal((await api('PATCH', `/api/tickets/${id}/status`, { status: 'resolved' })).body.data.status, 'resolved');
    assert.equal((await api('GET', '/api/tickets?priority=high&type=complaint')).body.pagination.total, 1);
  });
});

describe('dashboard, reports and activity log', () => {
  test('demo records are separate from real ones and counted from the database', async () => {
    await User.create({ name: 'Demo Person', email: 'demo1@example.com', isDemo: true });
    await User.create({ name: 'Demo Two', email: 'demo2@example.com', isDemo: true, status: 'inactive' });

    const all = (await api('GET', '/api/dashboard/summary')).body;
    const real = (await api('GET', '/api/dashboard/summary?source=real')).body;
    const demo = (await api('GET', '/api/dashboard/summary?source=demo')).body;

    assert.equal(demo.cards.users.total, 2);
    assert.equal(demo.demoRecords, 2); // total sample records, whatever the filter
    assert.equal(real.demoRecords, 2);
    assert.equal(demo.cards.users.active, 1);
    assert.equal(real.cards.users.total, 11); // 12 created - 1 deleted
    assert.equal(all.cards.users.total, real.cards.users.total + demo.cards.users.total);
    assert.equal(demo.cards.orders, 0);
    assert.equal(real.cards.orders, 1);
    assert.equal(real.activities.orders.completed, 1);
    assert.equal(real.activities.tickets.completed, 1); // resolved counts as completed
    assert.equal(real.activities.vendorApplications.completed, 1); // approved
    assert.equal(real.cards.vendors.approved, 1);
    assert.equal(real.cards.partners.active, 1);
    assert.ok(real.recentActivity.length > 0 && real.recentActivity.length <= 10);
  });

  test('date filter on the summary', async () => {
    const old = await Order.create({ customerName: 'Old', items: [{ name: 'A', quantity: 1, unitPrice: 1 }], createdAt: new Date('2025-01-15T10:00:00Z') });
    assert.ok(old);
    assert.equal((await api('GET', '/api/dashboard/summary?source=real&from=2025-01-01&to=2025-01-31')).body.cards.orders, 1);
    assert.equal((await api('GET', '/api/dashboard/summary?source=real&from=2025-02-01&to=2025-02-28')).body.cards.orders, 0);
    assert.equal((await api('GET', '/api/dashboard/summary?from=garbage')).status, 400);
  });

  test('reports: per-day series, status breakdown, and range validation', async () => {
    const report = (await api('GET', '/api/dashboard/reports?source=real')).body;
    assert.equal(report.perDay.length, 30);
    const totals = report.perDay.reduce((sum, day) => ({ o: sum.o + day.orders, t: sum.t + day.tickets, e: sum.e + day.enquiries }), { o: 0, t: 0, e: 0 });
    assert.deepEqual(totals, { o: 1, t: 1, e: 1 }); // the 2025 order is outside the default 30 days
    const completed = report.statusBreakdown.orders.find((row) => row.status === 'completed');
    assert.equal(completed.count, 1);
    assert.ok(report.adminActions.find((row) => row.action === 'login').count >= 2);

    const january = (await api('GET', '/api/dashboard/reports?source=real&from=2025-01-10&to=2025-01-20')).body;
    assert.equal(january.perDay.length, 11);
    assert.equal(january.perDay.find((day) => day.date === '2025-01-15').orders, 1);

    assert.equal((await api('GET', '/api/dashboard/reports?from=2026-02-01&to=2026-01-01')).status, 400);
    assert.equal((await api('GET', '/api/dashboard/reports?from=2020-01-01&to=2026-01-01')).status, 400);
  });

  test('activity log records actions; only admins can read it', async () => {
    const log = await api('GET', '/api/activity?limit=100');
    assert.equal(log.status, 200);
    const actions = new Set(log.body.data.map((row) => row.action));
    for (const expected of ['login', 'create', 'update', 'delete', 'approve', 'reject', 'note', 'status']) {
      assert.ok(actions.has(expected), `missing "${expected}" in activity log`);
    }
    assert.ok(log.body.data.every((row) => row.adminName));
    assert.equal((await api('GET', '/api/activity?action=delete')).body.data.every((row) => row.action === 'delete'), true);
    assert.ok((await api('GET', '/api/activity?q=Sample Supplies')).body.pagination.total >= 1);
    assert.equal((await api('GET', '/api/activity', undefined, staffToken)).status, 403);
  });

  test('a ticket that no longer exists is reported cleanly', async () => {
    await Ticket.deleteMany({});
    assert.equal((await api('POST', '/api/tickets/64b64b64b64b64b64b64b64b/responses', { text: 'hi' })).status, 404);
  });
});
