import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { Field, FormError } from '../components/Form.jsx';
import Logo from '../../components/Logo.jsx';

export default function Login() {
  const { admin, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to={location.state?.from || '/'} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={handleSubmit} noValidate>
        <div className="adm-login-brand">
          <Logo className="adm-brand-logo" />
          <div>
            <h1>Admin sign in</h1>
            <p>DentalCare dashboard</p>
          </div>
        </div>

        <FormError message={error} />

        <Field label="Email">
          <input className="adm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required autoFocus />
        </Field>
        <Field label="Password">
          <input className="adm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>

        <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={busy || !email || !password}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
        <a className="adm-login-back" href="/">&larr; Back to the website</a>
      </form>
    </div>
  );
}
