import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useFetch, useListQuery } from '../hooks.js';
import { formatDate, formatMoney, label } from '../format.js';
import { ORDER_CHANNELS, ORDER_STATUSES } from '../options.js';
import { products } from '../../data/products.js';
import ListFilters from '../components/ListFilters.jsx';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { DemoBadge } from '../components/StatusBadge.jsx';
import StatusSelect from '../components/StatusSelect.jsx';
import FormModal from '../components/FormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Field, Select } from '../components/Form.jsx';
import { useToast } from '../components/Toast.jsx';

const EMPTY_ITEM = { name: '', quantity: 1, unitPrice: '' };

// Rows for the products on the order. The name box suggests the public site's products
// and fills in the demo price; you can still type any item and any price.
function ItemsEditor({ items, onChange, error }) {
  function update(index, changes) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  }
  function changeName(index, name) {
    const known = products.find((product) => product.name === name);
    update(index, known ? { name, unitPrice: known.price } : { name });
  }
  const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);

  return (
    <fieldset className="adm-fieldset">
      <legend>Items</legend>
      <datalist id="adm-product-names">
        {products.map((product) => <option key={product.id} value={product.name} />)}
      </datalist>
      <div className="adm-items">
        {items.map((item, index) => (
          <div className="adm-item-row" key={index}>
            <input className="adm-input" list="adm-product-names" placeholder="Item name" aria-label={`Item ${index + 1} name`} value={item.name} onChange={(e) => changeName(index, e.target.value)} />
            <input className="adm-input" type="number" min="1" step="1" aria-label={`Item ${index + 1} quantity`} value={item.quantity} onChange={(e) => update(index, { quantity: e.target.value })} />
            <input className="adm-input" type="number" min="0" step="0.01" placeholder="Price" aria-label={`Item ${index + 1} unit price`} value={item.unitPrice} onChange={(e) => update(index, { unitPrice: e.target.value })} />
            <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" disabled={items.length === 1} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove item ${index + 1}`}>Remove</button>
          </div>
        ))}
      </div>
      {error && <p className="adm-error-text" role="alert">{error}</p>}
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onChange([...items, { ...EMPTY_ITEM }])}>Add another item</button>
      <div className="adm-total"><span>Total (the server recalculates this when saving)</span><span>{formatMoney(total)}</span></div>
    </fieldset>
  );
}

export default function Orders() {
  const { admin } = useAuth();
  const notify = useToast();
  const query = useListQuery(['status', 'channel']);
  const { data, loading, error, reload } = useFetch('/orders', query.params);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function saveOrder(values) {
    const body = {
      customerName: values.customerName, customerEmail: values.customerEmail, customerPhone: values.customerPhone,
      channel: values.channel, status: values.status, notes: values.notes,
      items: values.items.map((item) => ({ name: item.name, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) })),
    };
    if (editing === 'new') await api('/orders', { method: 'POST', body });
    else await api(`/orders/${editing._id}`, { method: 'PUT', body });
    notify(editing === 'new' ? 'Order recorded' : 'Order saved');
    setEditing(null);
    reload();
  }

  async function deleteOrder() {
    await api(`/orders/${deleting._id}`, { method: 'DELETE' });
    notify('Order deleted');
    setDeleting(null);
    reload();
  }

  const columns = [
    {
      header: 'Order',
      render: (order) => (
        <div className="adm-cell-main">
          <span className="adm-cell-name">{order.orderNumber} <DemoBadge show={order.isDemo} /></span>
          <small>{formatDate(order.createdAt)}</small>
        </div>
      ),
    },
    {
      header: 'Customer',
      render: (order) => (
        <div className="adm-cell-main"><span>{order.customerName}</span><small>{order.customerEmail || order.customerPhone || ''}</small></div>
      ),
    },
    { header: 'Items', render: (order) => order.items.reduce((sum, item) => sum + item.quantity, 0) },
    { header: 'Total', render: (order) => formatMoney(order.total) },
    { header: 'Channel', render: (order) => label(order.channel) },
    { header: 'Status', render: (order) => <StatusSelect path="orders" id={order._id} value={order.status} options={ORDER_STATUSES} name={order.orderNumber} onChanged={reload} /> },
    {
      header: 'Actions',
      render: (order) => (
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setViewing(order)} aria-label={`View ${order.orderNumber}`}>View</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(order)} aria-label={`Edit ${order.orderNumber}`}>Edit</button>
          {admin.role === 'admin' && <button type="button" className="adm-btn adm-btn-text-danger adm-btn-sm" onClick={() => setDeleting(order)} aria-label={`Delete ${order.orderNumber}`}>Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Orders</h1>
          <p>Orders recorded by your team (by phone, email, WhatsApp or in person). The public website has no checkout yet, so nothing here arrives automatically.</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => setEditing('new')}>Record order</button>
      </div>

      <ListFilters
        query={query}
        placeholder="Order number, customer, email or phone"
        selects={[
          { key: 'status', label: 'Status', options: ORDER_STATUSES },
          { key: 'channel', label: 'Channel', options: ORDER_CHANNELS },
        ]}
      />

      <DataTable caption="Orders" columns={columns} rows={data?.data ?? []} loading={loading} error={error} onRetry={reload} emptyMessage={query.isFiltered ? 'No orders match these filters.' : 'No orders yet. Click "Record order" to add one.'} />
      <Pagination pagination={data?.pagination} onPage={query.setPage} />

      {editing && (
        <FormModal
          wide
          title={editing === 'new' ? 'Record order' : `Edit ${editing.orderNumber}`}
          initial={editing === 'new' ? { channel: 'phone', status: 'pending', items: [{ ...EMPTY_ITEM }] } : { ...editing, items: editing.items.map((item) => ({ ...item })) }}
          onSubmit={saveOrder}
          onClose={() => setEditing(null)}
        >
          {({ values, bind, bindSelect, setValue, errors }) => (
            <>
              <div className="adm-form-grid">
                <Field label="Customer name" error={errors.customerName}><input className="adm-input" {...bind('customerName')} /></Field>
                <Field label="Customer email" error={errors.customerEmail}><input className="adm-input" type="email" {...bind('customerEmail')} /></Field>
                <Field label="Customer phone" error={errors.customerPhone}><input className="adm-input" {...bind('customerPhone')} /></Field>
                <Field label="Received by" error={errors.channel}><Select {...bindSelect('channel')} options={ORDER_CHANNELS} /></Field>
                <Field label="Status" error={errors.status}><Select {...bindSelect('status')} options={ORDER_STATUSES} /></Field>
              </div>
              <ItemsEditor items={values.items} onChange={(items) => setValue('items', items)} error={errors.items} />
              <Field label="Notes" error={errors.notes}><textarea className="adm-textarea" {...bind('notes')} /></Field>
            </>
          )}
        </FormModal>
      )}

      {viewing && (
        <FormModal wide title={`Order ${viewing.orderNumber}`} initial={{}} onSubmit={async () => setViewing(null)} onClose={() => setViewing(null)} submitLabel="Close">
          {() => (
            <>
              <p className="adm-meta"><span>{viewing.customerName}</span><span>{viewing.customerEmail}</span><span>{viewing.customerPhone}</span><span>Received by {label(viewing.channel)}</span></p>
              <ul className="adm-thread">
                {viewing.items.map((item, index) => (
                  <li className="adm-message" key={index}><strong>{item.name}</strong><p>{item.quantity} × {formatMoney(item.unitPrice)} = {formatMoney(item.quantity * item.unitPrice)}</p></li>
                ))}
              </ul>
              <div className="adm-total"><span>Total</span><span>{formatMoney(viewing.total)}</span></div>
              {viewing.notes && <p><strong>Notes:</strong> {viewing.notes}</p>}
            </>
          )}
        </FormModal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete order?" message={`Order ${deleting.orderNumber} will be permanently deleted. This cannot be undone.`} confirmLabel="Delete" danger onConfirm={deleteOrder} onCancel={() => setDeleting(null)} />
      )}
    </>
  );
}
