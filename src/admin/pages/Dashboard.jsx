import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks.js';
import { Select, SOURCE_OPTIONS } from '../components/Form.jsx';
import { formatDateTime, label } from '../format.js';

const activityRows = [
  { key: 'orders', title: 'Orders', link: '/orders' },
  { key: 'enquiries', title: 'Enquiries', link: '/enquiries' },
  { key: 'tickets', title: 'Support tickets', link: '/support' },
  { key: 'vendorApplications', title: 'Vendor applications', link: '/vendors' },
];

function StatCard({ title, value, detail, to }) {
  return (
    <Link className="adm-stat" to={to}>
      <span className="adm-stat-title">{title}</span>
      <strong className="adm-stat-value">{value}</strong>
      <span className="adm-stat-detail">{detail}</span>
    </Link>
  );
}

function ProgressBar({ pending, ongoing, completed }) {
  const total = pending + ongoing + completed;
  if (total === 0) return <span className="adm-muted">No records</span>;
  const part = (count) => `${(count / total) * 100}%`;
  return (
    <div className="adm-progress" role="img" aria-label={`${pending} pending, ${ongoing} ongoing, ${completed} completed`}>
      <span className="is-pending" style={{ width: part(pending) }} />
      <span className="is-ongoing" style={{ width: part(ongoing) }} />
      <span className="is-completed" style={{ width: part(completed) }} />
    </div>
  );
}

export default function Dashboard() {
  const [source, setSource] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data, loading, error, reload } = useFetch('/dashboard/summary', { source, from, to });

  const cards = data?.cards;
  const noRecords = cards && cards.users.total + cards.vendors.total + cards.partners.total + cards.orders + cards.enquiries + cards.tickets.total === 0;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Live numbers from the database.</p>
        </div>
      </div>

      <div className="adm-filters">
        <label className="adm-filter">
          <span>Show</span>
          <Select value={source} onChange={setSource} options={SOURCE_OPTIONS} allLabel="All records" />
        </label>
        <label className="adm-filter">
          <span>Created from</span>
          <input className="adm-input" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="adm-filter">
          <span>to</span>
          <input className="adm-input" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
        </label>
        {(source || from || to) && (
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setSource(''); setFrom(''); setTo(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {error && !data && (
        <div className="adm-state adm-state-error" role="alert">
          <p><strong>Could not load the dashboard.</strong></p>
          <p>{error}</p>
          <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={reload}>Try again</button>
        </div>
      )}
      {loading && !data && <div className="adm-state" role="status"><div className="adm-skeleton" /><div className="adm-skeleton" /><span className="adm-sr-only">Loading...</span></div>}

      {data && (
        <div aria-busy={loading} className={loading ? 'is-loading' : undefined}>
          {data.demoRecords > 0 && source !== 'real' && (
            <p className="adm-alert adm-alert-info">
              These numbers include <strong>{data.demoRecords} demo (sample) records</strong> added by the seed script.
              Choose &ldquo;Real records only&rdquo; to see only genuine data.
            </p>
          )}
          {noRecords && (
            <p className="adm-alert adm-alert-info">
              There are no records for this selection yet. Add users, vendors, orders and more from the menu,
              or run <code>npm run seed:demo</code> in the backend folder to load sample data.
            </p>
          )}

          <section aria-label="Totals" className="adm-stat-grid">
            <StatCard title="Registered users" value={cards.users.total} detail={`${cards.users.active} active`} to="/users" />
            <StatCard title="Vendors" value={cards.vendors.total} detail={`${cards.vendors.approved} approved, ${cards.vendors.awaitingDecision} awaiting decision`} to="/vendors" />
            <StatCard title="Partners" value={cards.partners.total} detail={`${cards.partners.active} active`} to="/partners" />
            <StatCard title="Orders" value={cards.orders} detail="Recorded by admins" to="/orders" />
            <StatCard title="Enquiries" value={cards.enquiries} detail="Product and partnership" to="/enquiries" />
            <StatCard title="Support tickets" value={cards.tickets.total} detail={`${cards.tickets.open} open`} to="/support" />
          </section>

          <div className="adm-two-col">
            <section className="adm-card" aria-labelledby="activities-title">
              <h2 id="activities-title">Pending and completed activities</h2>
              <div className="adm-table-wrap" role="region" aria-label="Pending and completed activities" tabIndex={0}>
                <table className="adm-table adm-table-compact">
                  <thead>
                    <tr>
                      <th scope="col">Work item</th>
                      <th scope="col">Pending</th>
                      <th scope="col">Ongoing</th>
                      <th scope="col">Completed</th>
                      <th scope="col">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row) => {
                      const counts = data.activities[row.key];
                      return (
                        <tr key={row.key}>
                          <th scope="row"><Link to={row.link}>{row.title}</Link></th>
                          <td>{counts.pending}</td>
                          <td>{counts.ongoing}</td>
                          <td>{counts.completed}</td>
                          <td className="adm-progress-cell"><ProgressBar {...counts} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <ul className="adm-legend">
                <li><span className="adm-dot is-pending" />Pending: not started</li>
                <li><span className="adm-dot is-ongoing" />Ongoing: being worked on</li>
                <li><span className="adm-dot is-completed" />Completed: finished or decided</li>
              </ul>
            </section>

            <section className="adm-card" aria-labelledby="recent-title">
              <h2 id="recent-title">Recent activity</h2>
              {data.recentActivity.length === 0 ? (
                <p className="adm-muted">Nothing has happened yet. Admin actions will appear here.</p>
              ) : (
                <ul className="adm-feed">
                  {data.recentActivity.map((item) => (
                    <li key={item._id}>
                      <span className={`adm-feed-tag adm-feed-${item.action}`}>{label(item.action)}</span>
                      <span className="adm-feed-text">{item.summary}</span>
                      <small>{item.adminName} &middot; {formatDateTime(item.createdAt)}</small>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
