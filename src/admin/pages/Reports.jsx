import { useState } from 'react';
import { useFetch } from '../hooks.js';
import { Select, SOURCE_OPTIONS } from '../components/Form.jsx';
import { BarList, DailyChart } from '../components/Charts.jsx';

function isoDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export default function Reports() {
  const [source, setSource] = useState('');
  const [from, setFrom] = useState(isoDaysAgo(29));
  const [to, setTo] = useState(isoDaysAgo(0));
  const { data, loading, error, reload } = useFetch('/dashboard/reports', { source, from, to });

  const preset = (days) => { setFrom(isoDaysAgo(days - 1)); setTo(isoDaysAgo(0)); };
  const totals = data ? data.perDay.reduce((sum, day) => ({ orders: sum.orders + day.orders, enquiries: sum.enquiries + day.enquiries, tickets: sum.tickets + day.tickets }), { orders: 0, enquiries: 0, tickets: 0 }) : null;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Reports</h1>
          <p>Simple statistics for the chosen dates, counted from the database.</p>
        </div>
      </div>

      <div className="adm-filters">
        <div className="adm-filter">
          <span>Quick range</span>
          <div className="adm-presets">
            {[7, 30, 90].map((days) => (
              <button type="button" key={days} className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => preset(days)}>Last {days} days</button>
            ))}
          </div>
        </div>
        <label className="adm-filter"><span>From</span><input className="adm-input" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="adm-filter"><span>To</span><input className="adm-input" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} /></label>
        <label className="adm-filter"><span>Show</span><Select value={source} onChange={setSource} options={SOURCE_OPTIONS} allLabel="All records" /></label>
      </div>

      {error && !data && (
        <div className="adm-state adm-state-error" role="alert">
          <p><strong>Could not load the report.</strong></p>
          <p>{error}</p>
          <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={reload}>Try again</button>
        </div>
      )}
      {error && data && <p className="adm-alert adm-alert-error" role="alert">{error}</p>}
      {loading && !data && <div className="adm-state" role="status"><div className="adm-skeleton" /><div className="adm-skeleton" /><span className="adm-sr-only">Loading...</span></div>}

      {data && (
        <div aria-busy={loading} className={loading ? 'is-loading' : undefined}>
          <section className="adm-card" aria-labelledby="daily-title">
            <h2 id="daily-title">Created per day</h2>
            <p className="adm-muted">{totals.orders} orders, {totals.enquiries} enquiries and {totals.tickets} tickets between {data.range.from} and {data.range.to}.</p>
            <DailyChart days={data.perDay} />
          </section>

          <div className="adm-chart-grid">
            <section className="adm-card" aria-labelledby="orders-title">
              <h2 id="orders-title">Orders by status</h2>
              <BarList items={data.statusBreakdown.orders.map((item) => ({ name: item.status, count: item.count }))} />
            </section>
            <section className="adm-card" aria-labelledby="enq-title">
              <h2 id="enq-title">Enquiries by status</h2>
              <BarList color="#0d9488" items={data.statusBreakdown.enquiries.map((item) => ({ name: item.status, count: item.count }))} />
            </section>
            <section className="adm-card" aria-labelledby="tix-title">
              <h2 id="tix-title">Support tickets by status</h2>
              <BarList color="#d97706" items={data.statusBreakdown.tickets.map((item) => ({ name: item.status, count: item.count }))} />
            </section>
            <section className="adm-card" aria-labelledby="ven-title">
              <h2 id="ven-title">Vendor applications by status</h2>
              <BarList color="#7c3aed" items={data.statusBreakdown.vendors.map((item) => ({ name: item.status, count: item.count }))} />
            </section>
            <section className="adm-card adm-span-2" aria-labelledby="act-title">
              <h2 id="act-title">Admin actions in this period</h2>
              <p className="adm-muted">Counts every logged action, whatever the &ldquo;Show&rdquo; setting.</p>
              <BarList color="#475569" items={data.adminActions.map((item) => ({ name: item.action, count: item.count }))} />
            </section>
          </div>
        </div>
      )}
    </>
  );
}
