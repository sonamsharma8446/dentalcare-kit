import { useFetch, useListQuery } from '../hooks.js';
import { formatDateTime, label } from '../format.js';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { Select } from '../components/Form.jsx';

const ACTIONS = ['login', 'create', 'update', 'status', 'approve', 'reject', 'note', 'delete'];
const ENTITIES = ['admin', 'user', 'vendor', 'partner', 'order', 'enquiry', 'ticket'];

// Admin-only page: who did what, and when.
export default function Activity() {
  const query = useListQuery(['action', 'entity', 'from', 'to'], 20);
  const { data, loading, error, reload } = useFetch('/activity', { ...query.params, source: undefined });

  const columns = [
    { header: 'When', render: (item) => formatDateTime(item.createdAt) },
    { header: 'Admin', render: (item) => item.adminName },
    { header: 'Action', render: (item) => <span className={`adm-feed-tag adm-feed-${item.action}`}>{label(item.action)}</span> },
    { header: 'Area', render: (item) => label(item.entity) },
    { header: 'Details', render: (item) => item.summary },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Activity log</h1>
          <p>A record of important actions taken by admin and staff users. Only admins can see this page.</p>
        </div>
      </div>

      <div className="adm-filters" role="search">
        <label className="adm-filter adm-filter-grow"><span>Search</span><input className="adm-input" type="search" value={query.q} onChange={(e) => query.setSearch(e.target.value)} placeholder="Person or details" /></label>
        <label className="adm-filter"><span>Action</span><Select value={query.filters.action} onChange={(v) => query.setFilter('action', v)} options={ACTIONS} allLabel="All" /></label>
        <label className="adm-filter"><span>Area</span><Select value={query.filters.entity} onChange={(v) => query.setFilter('entity', v)} options={ENTITIES} allLabel="All" /></label>
        <label className="adm-filter"><span>From</span><input className="adm-input" type="date" value={query.filters.from} max={query.filters.to || undefined} onChange={(e) => query.setFilter('from', e.target.value)} /></label>
        <label className="adm-filter"><span>To</span><input className="adm-input" type="date" value={query.filters.to} min={query.filters.from || undefined} onChange={(e) => query.setFilter('to', e.target.value)} /></label>
        {query.isFiltered && <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={query.clear}>Clear filters</button>}
      </div>

      <DataTable caption="Activity log" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No activity matches these filters.' : 'No activity recorded yet.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />
    </>
  );
}
