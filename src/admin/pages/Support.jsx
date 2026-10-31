import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useListQuery } from '../hooks.js';
import { formatDate, formatDateTime } from '../format.js';
import { TICKET_STATUSES } from '../options.js';
import ListFilters from '../components/ListFilters.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusBadge, { DemoBadge } from '../components/StatusBadge.jsx';
import StatusSelect from '../components/StatusSelect.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Modal from '../components/Modal.jsx';
import { Field, FormError, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

const TYPES = ['query', 'complaint'];
const PRIORITIES = ['low', 'medium', 'high'];

// The conversation on one ticket: the customer's message, replies and private internal notes.
function TicketModal({ ticketId, onClose, onChanged }) {
  const notify = useToast();
  const { data, error, reload } = useFetch(`/tickets/${ticketId}`);
  const [text, setText] = useState('');
  const [internal, setInternal] = useState(false);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const ticket = data?.data;

  async function send(event) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      await api(`/tickets/${ticketId}/responses`, { method: 'POST', body: { text, isInternal: internal } });
      notify(internal ? 'Internal note saved' : 'Response saved');
      setText('');
      reload();
      onChanged();
    } catch (err) {
      setFormError(err.errors?.text || err.message);
    }
    setBusy(false);
  }

  return (
    <Modal open wide title={ticket ? ticket.subject : 'Ticket'} onClose={onClose}>
      {error && !ticket && <p className="adm-alert adm-alert-error" role="alert">{error}</p>}
      {!ticket && !error && <p role="status">Loading...</p>}
      {ticket && (
        <>
          <p className="adm-meta">
            <span>{ticket.customerName} ({ticket.customerEmail})</span>
            <span>{formatDateTime(ticket.createdAt)}</span>
            <StatusBadge value={ticket.type} />
            <StatusBadge value={ticket.priority} />
            <label>Status{' '}
              <StatusSelect path="tickets" id={ticket._id} value={ticket.status} options={TICKET_STATUSES} name={ticket.subject} onChanged={() => { reload(); onChanged(); }} />
            </label>
          </p>
          <ul className="adm-thread" aria-label="Conversation">
            <li className="adm-message">
              <header><strong>{ticket.customerName}</strong><span>Original message</span></header>
              <p>{ticket.message}</p>
            </li>
            {ticket.responses.map((reply) => (
              <li className={'adm-message' + (reply.isInternal ? ' adm-message-internal' : '')} key={reply._id}>
                <header>
                  <strong>{reply.author}</strong>
                  <span>{reply.isInternal ? 'Internal note (private, not for the customer)' : 'Response to customer'}</span>
                  <span>{formatDateTime(reply.createdAt)}</span>
                </header>
                <p>{reply.text}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={send} noValidate>
            <FormError message={formError} />
            <Field label="Write a response or note">
              <textarea className="adm-textarea" value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <label className="adm-check">
              <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} /> Internal note (only your team sees it)
            </label>
            <p className="adm-hint">Responses are saved on the ticket only. This app does not send email.</p>
            <button type="submit" className="adm-btn adm-btn-primary adm-btn-sm" disabled={busy || !text.trim()}>{busy ? 'Saving...' : internal ? 'Save note' : 'Save response'}</button>
          </form>
        </>
      )}
    </Modal>
  );
}

export default function Support() {
  const { admin } = useAuth();
  const notify = useToast();
  const query = useListQuery(['status', 'type', 'priority']);
  const { data, loading, error, reload } = useFetch('/tickets', query.params);
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function addTicket(values) {
    const body = { customerName: values.customerName, customerEmail: values.customerEmail, type: values.type, priority: values.priority, subject: values.subject, message: values.message };
    await api('/tickets', { method: 'POST', body });
    notify('Ticket created');
    setAdding(false);
    reload();
  }

  async function deleteTicket() {
    await api(`/tickets/${deleting._id}`, { method: 'DELETE' });
    notify('Ticket deleted');
    setDeleting(null);
    reload();
  }

  const columns = [
    {
      header: 'Ticket',
      render: (ticket) => (
        <div className="adm-cell-main"><span className="adm-cell-name">{ticket.subject} <DemoBadge show={ticket.isDemo} /></span><small>{ticket.customerName} &middot; {ticket.customerEmail}</small></div>
      ),
    },
    { header: 'Type', render: (ticket) => <StatusBadge value={ticket.type} /> },
    { header: 'Priority', render: (ticket) => <StatusBadge value={ticket.priority} /> },
    { header: 'Replies', render: (ticket) => ticket.responses.length },
    { header: 'Created', render: (ticket) => formatDate(ticket.createdAt) },
    { header: 'Status', render: (ticket) => <StatusSelect path="tickets" id={ticket._id} value={ticket.status} options={TICKET_STATUSES} name={ticket.subject} onChanged={reload} /> },
    {
      header: 'Actions',
      render: (ticket) => (
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setOpenId(ticket._id)} aria-label={`Open ${ticket.subject}`}>Open</button>
          {admin.role === 'admin' && <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" onClick={() => setDeleting(ticket)} aria-label={`Delete ${ticket.subject}`}>Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Customer support</h1>
          <p>Queries and complaints. Open a ticket to read it, reply, add a private internal note or change its status. The public website has no support form yet, so tickets are added here.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setAdding(true)}>New ticket</button>
      </div>

      <ListFilters
        query={query}
        placeholder="Customer, email, subject or message"
        selects={[
          { key: 'status', label: 'Status', options: TICKET_STATUSES },
          { key: 'type', label: 'Type', options: TYPES },
          { key: 'priority', label: 'Priority', options: PRIORITIES },
        ]}
      />

      <DataTable caption="Support tickets" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No tickets match these filters.' : 'No tickets yet. Click "New ticket" to record a query or complaint.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />

      {adding && (
        <FormModal title="New ticket" initial={{ type: 'query', priority: 'medium' }} onSubmit={addTicket} onClose={() => setAdding(false)}>
          {({ bind, bindSelect, errors }) => (
            <>
              <div className="adm-form-grid">
                <Field label="Customer name" error={errors.customerName}><input className="adm-input" {...bind('customerName')} /></Field>
                <Field label="Customer email" error={errors.customerEmail}><input className="adm-input" type="email" {...bind('customerEmail')} /></Field>
                <Field label="Type" error={errors.type}><Select {...bindSelect('type')} options={TYPES} /></Field>
                <Field label="Priority" error={errors.priority}><Select {...bindSelect('priority')} options={PRIORITIES} /></Field>
              </div>
              <Field label="Subject" error={errors.subject}><input className="adm-input" {...bind('subject')} /></Field>
              <Field label="Message" error={errors.message}><textarea className="adm-textarea" {...bind('message')} /></Field>
            </>
          )}
        </FormModal>
      )}

      {openId && <TicketModal ticketId={openId} onClose={() => setOpenId(null)} onChanged={reload} />}

      {deleting && (
        <ConfirmDialog title="Delete ticket?" message={`"${deleting.subject}" and all its replies will be permanently deleted. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deleteTicket} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
