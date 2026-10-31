import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useListQuery } from '../hooks.js';
import { formatDate, label, toDateInput } from '../format.js';
import { PARTNER_TYPES } from '../options.js';
import ListFilters from '../components/ListFilters.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusBadge, { DemoBadge } from '../components/StatusBadge.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Modal from '../components/Modal.jsx';
import { Field, FormError, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

// Lists the connections tracked with one partner, and lets you add or remove them.
function ConnectionsModal({ partner: initial, onClose, onChanged }) {
  const notify = useToast();
  const [partner, setPartner] = useState(initial);
  const [labelText, setLabelText] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function add(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api(`/partners/${partner._id}/connections`, { method: 'POST', body: { label: labelText, note } });
      setPartner(result.data);
      setLabelText('');
      setNote('');
      notify('Connection added');
      onChanged();
    } catch (err) {
      setError(err.errors?.label || err.message);
    }
    setBusy(false);
  }

  async function remove(connection) {
    try {
      const result = await api(`/partners/${partner._id}/connections/${connection._id}`, { method: 'DELETE' });
      setPartner(result.data);
      notify('Connection removed');
      onChanged();
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  return (
    <Modal open wide title={`Connections: ${partner.name}`} onClose={onClose}>
      <p className="adm-muted">Record each interaction or link with this partner, such as referrals, meetings or agreements.</p>
      {partner.connections.length === 0 ? (
        <p className="adm-state">No connections recorded yet.</p>
      ) : (
        <ul className="adm-thread">
          {partner.connections.map((connection) => (
            <li className="adm-message" key={connection._id}>
              <header>
                <strong>{connection.label}</strong>
                <span>{formatDate(connection.date)}</span>
                <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" onClick={() => remove(connection)} aria-label={`Remove connection ${connection.label}`}>Remove</button>
              </header>
              {connection.note && <p>{connection.note}</p>}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} noValidate>
        <h3 className="adm-section-title">Add a connection</h3>
        <FormError message={error} />
        <div className="adm-form-grid">
          <Field label="What happened?"><input className="adm-input" value={labelText} onChange={(e) => setLabelText(e.target.value)} placeholder="e.g. Referred 3 customers" /></Field>
          <Field label="Note (optional)"><input className="adm-input" value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </div>
        <button type="submit" className="adm-btn adm-btn-primary adm-btn-sm" disabled={busy || !labelText.trim()}>{busy ? 'Adding...' : 'Add connection'}</button>
      </form>
    </Modal>
  );
}

export default function Partners() {
  const { admin } = useAuth();
  const notify = useToast();
  const query = useListQuery(['status', 'partnerType']);
  const { data, loading, error, reload } = useFetch('/partners', query.params);
  const [editing, setEditing] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function savePartner(values) {
    const body = { name: values.name, contactName: values.contactName, email: values.email, phone: values.phone, partnerType: values.partnerType, status: values.status, startDate: values.startDate || null, details: values.details };
    if (editing === 'new') await api('/partners', { method: 'POST', body });
    else await api(`/partners/${editing._id}`, { method: 'PUT', body });
    notify(editing === 'new' ? 'Partner added' : 'Partner saved');
    setEditing(null);
    reload();
  }

  async function deletePartner() {
    await api(`/partners/${deleting._id}`, { method: 'DELETE' });
    notify('Partner deleted');
    setDeleting(null);
    reload();
  }

  const columns = [
    {
      header: 'Partner',
      render: (partner) => (
        <div className="adm-cell-main">
          <span className="adm-cell-name">{partner.name} <DemoBadge show={partner.isDemo} /></span>
          <small>{partner.contactName ? `${partner.contactName} · ` : ''}{partner.email}</small>
        </div>
      ),
    },
    { header: 'Type', render: (partner) => label(partner.partnerType) },
    { header: 'Status', render: (partner) => <StatusBadge value={partner.status} /> },
    { header: 'Connections', render: (partner) => partner.connections.length },
    { header: 'Partner since', render: (partner) => formatDate(partner.startDate) },
    {
      header: 'Actions',
      render: (partner) => (
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setConnecting(partner)} aria-label={`Connections of ${partner.name}`}>Connections</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(partner)} aria-label={`Edit ${partner.name}`}>Edit</button>
          {admin.role === 'admin' && <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" onClick={() => setDeleting(partner)} aria-label={`Delete ${partner.name}`}>Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Partners</h1>
          <p>Business partners, partnership details and the connections tracked with each one.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>Add partner</button>
      </div>

      <ListFilters
        query={query}
        placeholder="Name, contact or email"
        selects={[
          { key: 'status', label: 'Status', options: ['pending', 'active', 'inactive'] },
          { key: 'partnerType', label: 'Type', options: PARTNER_TYPES },
        ]}
      />

      <DataTable caption="Partners" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No partners match these filters.' : 'No partners yet. Click "Add partner" to create the first one.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />

      {editing && (
        <FormModal
          title={editing === 'new' ? 'Add partner' : 'Edit partner'}
          initial={editing === 'new' ? { partnerType: 'other', status: 'pending' } : { ...editing, startDate: toDateInput(editing.startDate) }}
          onSubmit={savePartner}
          onClose={() => setEditing(null)}
        >
          {({ bind, bindSelect, errors }) => (
            <>
              <div className="adm-form-grid">
                <Field label="Partner name" error={errors.name}><input className="adm-input" {...bind('name')} /></Field>
                <Field label="Contact person" error={errors.contactName}><input className="adm-input" {...bind('contactName')} /></Field>
                <Field label="Email" error={errors.email}><input className="adm-input" type="email" {...bind('email')} /></Field>
                <Field label="Phone" error={errors.phone}><input className="adm-input" {...bind('phone')} /></Field>
                <Field label="Type" error={errors.partnerType}><Select {...bindSelect('partnerType')} options={PARTNER_TYPES} /></Field>
                <Field label="Status" error={errors.status}><Select {...bindSelect('status')} options={['pending', 'active', 'inactive']} /></Field>
                <Field label="Partner since" error={errors.startDate}><input className="adm-input" type="date" {...bind('startDate')} /></Field>
              </div>
              <Field label="Partnership details" error={errors.details}><textarea className="adm-textarea" {...bind('details')} /></Field>
            </>
          )}
        </FormModal>
      )}

      {connecting && <ConnectionsModal partner={connecting} onClose={() => setConnecting(null)} onChanged={reload} />}

      {deleting && (
        <ConfirmDialog title="Delete partner?" message={`${deleting.name} and its recorded connections will be permanently deleted. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deletePartner} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
