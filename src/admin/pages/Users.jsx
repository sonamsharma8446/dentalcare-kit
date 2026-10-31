import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useListQuery } from '../hooks.js';
import { formatDate } from '../format.js';
import ListFilters from '../components/ListFilters.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusBadge, { DemoBadge } from '../components/StatusBadge.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Field, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Users() {
  const { admin } = useAuth();
  const notify = useToast();
  const query = useListQuery(['status']);
  const { data, loading, error, reload } = useFetch('/users', query.params);
  const [editing, setEditing] = useState(null); // 'new' or a user
  const [confirm, setConfirm] = useState(null); // { kind: 'deactivate' | 'delete', user }

  async function activate(user) {
    try {
      await api(`/users/${user._id}/status`, { method: 'PATCH', body: { status: 'active' } });
      notify(`${user.name} is active again`);
      reload();
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  async function runConfirm() {
    const { kind, user } = confirm;
    if (kind === 'delete') await api(`/users/${user._id}`, { method: 'DELETE' });
    else await api(`/users/${user._id}/status`, { method: 'PATCH', body: { status: 'inactive' } });
    notify(kind === 'delete' ? `${user.name} was deleted` : `${user.name} was deactivated`);
    setConfirm(null);
    reload();
  }

  const columns = [
    {
      header: 'Name',
      render: (user) => (
        <div className="adm-cell-main">
          <span className="adm-cell-name">{user.name} <DemoBadge show={user.isDemo} /></span>
          <small>{user.email}</small>
        </div>
      ),
    },
    { header: 'Phone', render: (user) => user.phone || '-' },
    { header: 'City', render: (user) => user.city || '-' },
    { header: 'Status', render: (user) => <StatusBadge value={user.status} /> },
    { header: 'Added', render: (user) => formatDate(user.createdAt) },
    {
      header: 'Actions',
      render: (user) => (
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(user)} aria-label={`Edit ${user.name}`}>Edit</button>
          {user.status === 'active' ? (
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setConfirm({ kind: 'deactivate', user })} aria-label={`Deactivate ${user.name}`}>Deactivate</button>
          ) : (
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => activate(user)} aria-label={`Activate ${user.name}`}>Activate</button>
          )}
          {admin.role === 'admin' && (
            <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" onClick={() => setConfirm({ kind: 'delete', user })} aria-label={`Delete ${user.name}`}>Delete</button>
          )}
        </div>
      ),
    },
  ];

  async function saveUser(values) {
    const body = { name: values.name, email: values.email, phone: values.phone, city: values.city, status: values.status, notes: values.notes };
    if (editing === 'new') await api('/users', { method: 'POST', body });
    else await api(`/users/${editing._id}`, { method: 'PUT', body });
    notify(editing === 'new' ? 'User added' : 'User saved');
    setEditing(null);
    reload();
  }

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Users</h1>
          <p>Registered customers. The public website has no sign-up yet, so users are added here.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>Add user</button>
      </div>

      <ListFilters query={query} placeholder="Name, email, phone or city" selects={[{ key: 'status', label: 'Status', options: ['active', 'inactive'] }]} />

      <DataTable caption="Users" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No users match these filters.' : 'No users yet. Click "Add user" to create the first one.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />

      {editing && (
        <FormModal
          title={editing === 'new' ? 'Add user' : 'Edit user'}
          initial={editing === 'new' ? { status: 'active' } : editing}
          onSubmit={saveUser}
          onClose={() => setEditing(null)}
        >
          {({ bind, bindSelect, errors }) => (
            <>
              <div className="adm-form-grid">
                <Field label="Full name" error={errors.name}><input className="adm-input" {...bind('name')} /></Field>
                <Field label="Email" error={errors.email}><input className="adm-input" type="email" {...bind('email')} /></Field>
                <Field label="Phone" error={errors.phone}><input className="adm-input" {...bind('phone')} /></Field>
                <Field label="City" error={errors.city}><input className="adm-input" {...bind('city')} /></Field>
                <Field label="Status" error={errors.status}>
                  <Select {...bindSelect('status')} options={['active', 'inactive']} />
                </Field>
              </div>
              <Field label="Notes" error={errors.notes}><textarea className="adm-textarea" {...bind('notes')} /></Field>
            </>
          )}
        </FormModal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.kind === 'delete' ? 'Delete user?' : 'Deactivate user?'}
          message={confirm.kind === 'delete' ? `${confirm.user.name} will be permanently deleted. This cannot be undone.` : `${confirm.user.name} will be marked inactive. You can activate them again later.`}
          confirmLabel={confirm.kind === 'delete' ? 'Delete' : 'Deactivate'}
          danger={confirm.kind === 'delete'}
          onConfirm={runConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
