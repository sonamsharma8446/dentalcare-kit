import { useState } from 'react';
import { api } from '../api.js';
import { Select } from './Form.jsx';
import { useToast } from './Toast.jsx';

// A dropdown inside a table row that changes a record's status straight away.
export default function StatusSelect({ path, id, value, options, name, onChanged }) {
  const notify = useToast();
  const [busy, setBusy] = useState(false);

  async function change(status) {
    setBusy(true);
    try {
      await api(`/${path}/${id}/status`, { method: 'PATCH', body: { status } });
      notify('Status updated');
      onChanged();
    } catch (err) {
      notify(err.message, 'error');
    }
    setBusy(false);
  }

  return <Select value={value} onChange={change} options={options} disabled={busy} aria-label={`Status of ${name}`} />;
}
