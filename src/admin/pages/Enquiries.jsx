import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useListQuery } from '../hooks.js';
import { formatDate, formatDateTime, label } from '../format.js';
import { ENQUIRY_STATUSES, ENQUIRY_TYPES } from '../options.js';
import ListFilters from '../components/ListFilters.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { DemoBadge } from '../components/StatusBadge.jsx';
import StatusSelect from '../components/StatusSelect.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Field, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Enquiries() {
  const { admin } = useAuth();
  const notify = useToast();
  const query = useListQuery(['status', 'type']);
  const { data, loading, error, reload } = useFetch('/enquiries', query.params);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function saveEnquiry(values) {
    const body = { name: values.name, email: values.email, phone: values.phone, type: values.type, subject: values.subject, message: values.message, status: values.status };
    if (editing === 'new') await api('/enquiries', { method: 'POST', body });
    else await api(`/enquiries/${editing._id}`, { method: 'PUT', body });
    notify(editing === 'new' ? 'Enquiry added' : 'Enquiry saved');
    setEditing(null);
    reload();
  }

  async function deleteEnquiry() {
    await api(`/enquiries/${deleting._id}`, { method: 'DELETE' });
    notify('Enquiry deleted');
    setDeleting(null);
    reload();
  }

  const columns = [
    {
      header: 'From',
      render: (item) => (
        <div className="adm-cell-main"><span className="adm-cell-name">{item.name} <DemoBadge show={item.isDemo} /></span><small>{item.email}</small></div>
      ),
    },
    { header: 'Subject', render: (item) => item.subject },
    { header: 'Type', render: (item) => label(item.type) },
    { header: 'Received', render: (item) => formatDate(item.createdAt) },
    { header: 'Status', render: (item) => <StatusSelect path="enquiries" id={item._id} value={item.status} options={ENQUIRY_STATUSES} name={item.subject} onChanged={reload} /> },
    {
      header: 'Actions',
      render: (item) => (
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setViewing(item)} aria-label={`Read ${item.subject}`}>Read</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(item)} aria-label={`Edit ${item.subject}`}>Edit</button>
          {admin.role === 'admin' && <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" onClick={() => setDeleting(item)} aria-label={`Delete ${item.subject}`}>Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Enquiries</h1>
          <p>Product and partnership questions. The public website has no contact form yet, so enquiries are added here by your team.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>Add enquiry</button>
      </div>

      <ListFilters
        query={query}
        placeholder="Name, email, subject or message"
        selects={[
          { key: 'status', label: 'Status', options: ENQUIRY_STATUSES },
          { key: 'type', label: 'Type', options: ENQUIRY_TYPES },
        ]}
      />

      <DataTable caption="Enquiries" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No enquiries match these filters.' : 'No enquiries yet. Click "Add enquiry" to record one.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />

      {editing && (
        <FormModal title={editing === 'new' ? 'Add enquiry' : 'Edit enquiry'} initial={editing === 'new' ? { type: 'general', status: 'pending' } : editing} onSubmit={saveEnquiry} onClose={() => setEditing(null)}>
          {({ bind, bindSelect, errors }) => (
            <>
              <div className="adm-form-grid">
                <Field label="Name" error={errors.name}><input className="adm-input" {...bind('name')} /></Field>
                <Field label="Email" error={errors.email}><input className="adm-input" type="email" {...bind('email')} /></Field>
                <Field label="Phone" error={errors.phone}><input className="adm-input" {...bind('phone')} /></Field>
                <Field label="Type" error={errors.type}><Select {...bindSelect('type')} options={ENQUIRY_TYPES} /></Field>
                <Field label="Status" error={errors.status}><Select {...bindSelect('status')} options={ENQUIRY_STATUSES} /></Field>
              </div>
              <Field label="Subject" error={errors.subject}><input className="adm-input" {...bind('subject')} /></Field>
              <Field label="Message" error={errors.message}><textarea className="adm-textarea" {...bind('message')} /></Field>
            </>
          )}
        </FormModal>
      )}

      {viewing && (
        <FormModal title={viewing.subject} initial={{}} onSubmit={async () => setViewing(null)} onClose={() => setViewing(null)} submitLabel="Close">
          {() => (
            <>
              <p className="adm-meta"><span>{viewing.name}</span><span>{viewing.email}</span><span>{viewing.phone}</span><span>{formatDateTime(viewing.createdAt)}</span></p>
              <p className="adm-message">{viewing.message}</p>
            </>
          )}
        </FormModal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete enquiry?" message={`"${deleting.subject}" will be permanently deleted. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deleteEnquiry} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
