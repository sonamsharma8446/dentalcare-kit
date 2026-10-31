// Small helpers so every form looks and behaves the same.
export function Field({ label, error, children, hint }) {
  return (
    <label className="adm-field">
      <span className="adm-field-label">{label}</span>
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
      {error && <span className="adm-error-text" role="alert">{error}</span>}
    </label>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return <p className="adm-alert adm-alert-error" role="alert">{message}</p>;
}

// Dropdown for a list of values. options: ['active', 'inactive'] or [{ value, label }]
export function Select({ value, onChange, options, allLabel, ...rest }) {
  return (
    <select className="adm-select" value={value} onChange={(event) => onChange(event.target.value)} {...rest}>
      {allLabel !== undefined && <option value="">{allLabel}</option>}
      {options.map((option) => {
        const item = typeof option === 'string' ? { value: option, label: option.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) } : option;
        return <option key={item.value} value={item.value}>{item.label}</option>;
      })}
    </select>
  );
}

export const SOURCE_OPTIONS = [
  { value: 'real', label: 'Real records only' },
  { value: 'demo', label: 'Demo (sample) only' },
];
