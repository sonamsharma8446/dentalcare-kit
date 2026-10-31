import { useState } from 'react';
import Modal from './Modal.jsx';
import { FormError } from './Form.jsx';

// A pop-up with a form. The page shows it only when needed ({editing && <FormModal ... />}), so the
// form starts fresh every time. Usage:
//   <FormModal title="Add user" initial={{ name: '' }} onSubmit={(values) => api(...)} onClose={close}>
//     {({ bind, bindSelect, errors }) => <Field label="Name" error={errors.name}><input {...bind('name')} /></Field>}
//   </FormModal>
// onSubmit may throw an ApiError: its message and field messages are shown in the form.
function FormBody({ initial, onSubmit, onClose, submitLabel, children }) {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => setValues((previous) => ({ ...previous, [name]: value }));
  // Props for an <input>/<select>/<textarea>: { value, onChange }
  const bind = (name) => ({
    value: values[name] ?? '',
    onChange: (event) => setValue(name, event.target.value),
  });

  // Same for our <Select> component, which reports the chosen value (not an event)
  const bindSelect = (name) => ({ value: values[name] ?? '', onChange: (value) => setValue(name, value) });

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setErrors({});
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
      setErrors(err.errors || {});
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />
      {children({ values, bind, bindSelect, setValue, errors })}
      <div className="adm-form-actions">
        <button type="button" className="adm-btn adm-btn-secondary" onClick={onClose} disabled={busy}>Cancel</button>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={busy}>{busy ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  );
}

export default function FormModal({ title, initial, onSubmit, onClose, submitLabel = 'Save', wide, children }) {
  return (
    <Modal open title={title} onClose={onClose} wide={wide}>
      <FormBody initial={initial} onSubmit={onSubmit} onClose={onClose} submitLabel={submitLabel}>
        {children}
      </FormBody>
    </Modal>
  );
}
