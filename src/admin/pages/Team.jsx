import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useDebounced } from '../hooks.js';
import { formatDate, label } from '../format.js';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Field, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

const ROLES = [
  { value: 'staff', label: 'Staff (no deleting, no activity log, no team)' },
  { value: 'admin', label: 'Admin (full access)' },
];

// Admin-only page: add people who can log in, and manage them.
export default function Team() {
  const { admin } = useAuth();
  const notify = useToast();
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const { data, loading, error, reload } = useFetch('/team', { q: search });
  const [editing, setEditing] = useState(null); // 'new' or a member
  const [resetting, setResetting] = useState(null);
  const [toggling, setToggling] = useState(null);

  async function saveMember(values) {
    if (editing === 'new') {
      await api('/team', { method: 'POST', body: { name: values.name, email: values.email, role: values.role, password: values.password } });
    } else {
      await api(`/team/${editing._id}`, { method: 'PUT', body: { name: values.name, role: values.role } });
    }
    notify(editing === 'new' ? 'Team member added' : 'Team member saved');
    setEditing(null);
    reload();
  }

  async function resetPassword(values) {
    await api(`/team/${resetting._id}/password`, { method: 'POST', body: { password: values.password } });
    notify(`Password updated for ${resetting.name}`);
    setResetting(null);
  }

  async function toggleActive() {
    await api(`/team/${toggling._id}`, { method: 'PUT', body: { isActive: !toggling.isActive } });
    notify(toggling.isActive ? `${toggling.name} deactivated` : `${toggling.name} activated`);
    setToggling(null);
    reload();
  }

  const columns = [
    { header: 'Person', render: (m) => <div className="adm-cell-main"><span className="adm-cell-name">{m.name}{m._id === admin.id ? ' (you)' : ''}</span><small>{m.email}</small></div> },
    { header: 'Role', render: (m) => label(m.role) },
    { header: 'Status', render: (m) => <StatusBadge value={m.isActive ? 'active' : 'inactive'} /> },
    { header: 'Added', render: (m) => formatDate(m.createdAt) },
    {
      header: 'Actions',
      render: (m) => (
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(m)} aria-label={`Edit ${m.name}`}>Edit</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setResetting(m)} aria-label={`Reset password of ${m.name}`}>Reset password</button>
          {m._id !== admin.id && (
            <button type="button" className={`adm-btn adm-btn-sm ${m.isActive ? 'adm-btn-text-danger' : 'adm-btn-ghost'}`} onClick={() => setToggling(m)} aria-label={`${m.isActive ? 'Deactivate' : 'Activate'} ${m.name}`}>
              {m.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Team</h1>
          <p>People who can log in to this dashboard. Give each person their own account, and share the temporary password privately.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>Add team member</button>
      </div>

      <div className="adm-filters" role="search">
        <label className="adm-filter adm-filter-grow"><span>Search</span><input className="adm-input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or email" /></label>
      </div>

      <DataTable caption="Team members" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage="No team members match." />

      {editing && (
        <FormModal title={editing === 'new' ? 'Add team member' : 'Edit team member'} initial={editing === 'new' ? { role: 'staff' } : editing} onSubmit={saveMember} onClose={() => setEditing(null)}>
          {({ bind, bindSelect, errors }) => (
            <>
              <Field label="Name" error={errors.name}><input className="adm-input" {...bind('name')} /></Field>
              <Field label="Email (used to log in)" error={errors.email}><input className="adm-input" type="email" disabled={editing !== 'new'} {...bind('email')} /></Field>
              <Field label="Role" error={errors.role} hint={editing !== 'new' && editing._id === admin.id ? 'You cannot change your own role.' : undefined}>
                <Select {...bindSelect('role')} options={ROLES} disabled={editing !== 'new' && editing._id === admin.id} />
              </Field>
              {editing === 'new' && (
                <Field label="Temporary password" error={errors.password} hint="At least 10 characters. Tell the person to change it after logging in (top bar, Change password).">
                  <input className="adm-input" type="text" autoComplete="off" {...bind('password')} />
                </Field>
              )}
            </>
          )}
        </FormModal>
      )}

      {resetting && (
        <FormModal title={`Reset password: ${resetting.name}`} initial={{ password: '' }} onSubmit={resetPassword} onClose={() => setResetting(null)} submitLabel="Set password">
          {({ bind, errors }) => (
            <Field label="New temporary password" error={errors.password} hint="At least 10 characters. Their current password stops working.">
              <input className="adm-input" type="text" autoComplete="off" {...bind('password')} />
            </Field>
          )}
        </FormModal>
      )}

      {toggling && (
        <ConfirmDialog
          title={toggling.isActive ? 'Deactivate this person?' : 'Activate this person?'}
          message={toggling.isActive ? `${toggling.name} will be logged out and unable to log in until you activate them again.` : `${toggling.name} will be able to log in again.`}
          confirmLabel={toggling.isActive ? 'Deactivate' : 'Activate'}
          danger={toggling.isActive}
          onConfirm={toggleActive}
          onCancel={() => setToggling(null)}
        />
      )}
    </>
  );
}
