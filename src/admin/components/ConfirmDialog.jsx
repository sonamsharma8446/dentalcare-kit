import { useState } from 'react';
import Modal from './Modal.jsx';

// "Are you sure?" pop-up used before deleting, rejecting, deactivating, etc.
// The page shows it only when needed ({confirm && <ConfirmDialog ... />}).
// onConfirm may be async. If it throws, the message is shown here and the pop-up stays open.
export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className={'adm-btn ' + (danger ? 'adm-btn-danger' : 'adm-btn-primary')} onClick={handleConfirm} disabled={busy}>
            {busy ? 'Please wait...' : confirmLabel}
          </button>
        </>
      }
    >
      <p>{message}</p>
      {error && <p className="adm-alert adm-alert-error" role="alert">{error}</p>}
    </Modal>
  );
}
