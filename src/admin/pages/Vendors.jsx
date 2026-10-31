import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useListQuery } from '../hooks.js';
import { formatDate } from '../format.js';
import { PRODUCT_CATEGORIES, categoryLabel } from '../options.js';
import ListFilters from '../components/ListFilters.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusBadge, { DemoBadge } from '../components/StatusBadge.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Field, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

const STATUS_OPTIONS = ['pending', 'under_review', 'approved', 'rejected'];

export default function Vendors() {
  const { admin } = useAuth();
  const notify = useToast();
  const query = useListQuery(['status', 'productCategory']);
  const { data, loading, error, reload } = useFetch('/vendors', query.params);
  const [editing, setEditing] = useState(null); // 'new' or a vendor
  const [rejecting, setRejecting] = useState(null); // vendor
  const [confirm, setConfirm] = useState(null); // { kind: 'approve' | 'delete', vendor }

  async function setStatus(vendor, status, message) {
    try {
      await api(`/vendors/${vendor._id}/status`, { method: 'PATCH', body: { status } });
      notify(message);
      reload();
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  async function runConfirm() {
    const { kind, vendor } = confirm;
    if (kind === 'delete') await api(`/vendors/${vendor._id}`, { method: 'DELETE' });
    else await api(`/vendors/${vendor._id}/status`, { method: 'PATCH', body: { status: 'approved' } });
    notify(kind === 'delete' ? 'Vendor deleted' : `${vendor.businessName} approved`);
    setConfirm(null);
    reload();
  }

  async function saveVendor(values) {
    const body = { businessName: values.businessName, contactName: values.contactName, email: values.email, phone: values.phone, city: values.city, productCategory: values.productCategory, notes: values.notes };
    if (editing === 'new') await api('/vendors', { method: 'POST', body });
    else await api(`/vendors/${editing._id}`, { method: 'PUT', body });
    notify(editing === 'new' ? 'Vendor added' : 'Vendor saved');
    setEditing(null);
    reload();
  }

  async function rejectVendor(values) {
    await api(`/vendors/${rejecting._id}/status`, { method: 'PATCH', body: { status: 'rejected', rejectionReason: values.rejectionReason } });
    notify(`${rejecting.businessName} rejected`);
    setRejecting(null);
    reload();
  }

  const button = (text, onClick, label, extra = 'adm-btn-ghost') => (
    <button type="button" className={`adm-btn ${extra} adm-btn-sm`} onClick={onClick} aria-label={label}>{text}</button>
  );

  const columns = [
    {
      header: 'Business',
      render: (vendor) => (
        <div className="adm-cell-main">
          <span className="adm-cell-name">{vendor.businessName} <DemoBadge show={vendor.isDemo} /></span>
          <small>{vendor.contactName} &middot; {vendor.email}</small>
        </div>
      ),
    },
    { header: 'Product category', render: (vendor) => categoryLabel(vendor.productCategory) },
    { header: 'City', render: (vendor) => vendor.city || '-' },
    {
      header: 'Onboarding',
      render: (vendor) => (
        <div className="adm-cell-main">
          <StatusBadge value={vendor.status} />
          {vendor.status === 'rejected' && <small>Reason: {vendor.rejectionReason}</small>}
        </div>
      ),
    },
    { header: 'Applied', render: (vendor) => formatDate(vendor.createdAt) },
    {
      header: 'Actions',
      render: (vendor) => (
        <div className="adm-actions">
          {vendor.status === 'pending' && button('Start review', () => setStatus(vendor, 'under_review', `${vendor.businessName} is under review`), `Start review of ${vendor.businessName}`)}
          {vendor.status !== 'approved' && button('Approve', () => setConfirm({ kind: 'approve', vendor }), `Approve ${vendor.businessName}`)}
          {vendor.status !== 'rejected' && button('Reject', () => setRejecting(vendor), `Reject ${vendor.businessName}`, 'adm-btn-text-danger')}
          {button('Edit', () => setEditing(vendor), `Edit ${vendor.businessName}`)}
          {admin.role === 'admin' && button('Delete', () => setConfirm({ kind: 'delete', vendor }), `Delete ${vendor.businessName}`, 'adm-btn-text-danger')}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Vendors</h1>
          <p>Vendor applications and profiles. Review each application, then approve or reject it.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>Add vendor</button>
      </div>

      <ListFilters
        query={query}
        placeholder="Business, contact, email or city"
        selects={[
          { key: 'status', label: 'Onboarding status', options: STATUS_OPTIONS },
          { key: 'productCategory', label: 'Product category', options: PRODUCT_CATEGORIES },
        ]}
      />

      <DataTable caption="Vendors" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No vendors match these filters.' : 'No vendors yet. Click "Add vendor" to record the first application.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />

      {editing && (
        <FormModal title={editing === 'new' ? 'Add vendor' : 'Edit vendor'} initial={editing === 'new' ? { productCategory: 'other' } : editing} onSubmit={saveVendor} onClose={() => setEditing(null)}>
          {({ bind, bindSelect, errors }) => (
            <>
              <div className="adm-form-grid">
                <Field label="Business name" error={errors.businessName}><input className="adm-input" {...bind('businessName')} /></Field>
                <Field label="Contact person" error={errors.contactName}><input className="adm-input" {...bind('contactName')} /></Field>
                <Field label="Email" error={errors.email}><input className="adm-input" type="email" {...bind('email')} /></Field>
                <Field label="Phone" error={errors.phone}><input className="adm-input" {...bind('phone')} /></Field>
                <Field label="City" error={errors.city}><input className="adm-input" {...bind('city')} /></Field>
                <Field label="Product category" error={errors.productCategory}><Select {...bindSelect('productCategory')} options={PRODUCT_CATEGORIES} /></Field>
              </div>
              <Field label="Notes" error={errors.notes}><textarea className="adm-textarea" {...bind('notes')} /></Field>
            </>
          )}
        </FormModal>
      )}

      {rejecting && (
        <FormModal title={`Reject ${rejecting.businessName}?`} initial={{ rejectionReason: '' }} onSubmit={rejectVendor} onClose={() => setRejecting(null)} submitLabel="Reject vendor">
          {({ bind, errors }) => (
            <Field label="Reason for rejection" error={errors.rejectionReason} hint="Required. It is saved on the vendor record.">
              <textarea className="adm-textarea" {...bind('rejectionReason')} />
            </Field>
          )}
        </FormModal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.kind === 'delete' ? 'Delete vendor?' : 'Approve vendor?'}
          message={confirm.kind === 'delete' ? `${confirm.vendor.businessName} will be permanently deleted. This cannot be undone.` : `${confirm.vendor.businessName} will be marked as an approved vendor.`}
          confirmLabel={confirm.kind === 'delete' ? 'Delete' : 'Approve'}
          danger={confirm.kind === 'delete'}
          onConfirm={runConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
