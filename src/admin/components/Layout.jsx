import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import FormModal from './FormModal.jsx';
import { Field } from './Form.jsx';
import { useToast } from './Toast.jsx';
import Icon from './Icons.jsx';
import Logo from '../../components/Logo.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/users', label: 'Users', icon: 'users' },
  { to: '/vendors', label: 'Vendors', icon: 'vendors' },
  { to: '/partners', label: 'Partners', icon: 'partners' },
  { to: '/orders', label: 'Orders', icon: 'orders' },
  { to: '/enquiries', label: 'Enquiries', icon: 'enquiries' },
  { to: '/support', label: 'Support', icon: 'support' },
  { to: '/reports', label: 'Reports', icon: 'reports' },
  { to: '/team', label: 'Team', icon: 'users', adminOnly: true },
  { to: '/activity', label: 'Activity log', icon: 'activity', adminOnly: true },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const notify = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  async function changePassword(values) {
    await api('/auth/password', { method: 'PUT', body: { currentPassword: values.currentPassword, newPassword: values.newPassword } });
    notify('Password changed');
    setChangingPassword(false);
  }
  const visibleItems = navItems.filter((item) => !item.adminOnly || admin.role === 'admin');

  return (
    <div className="adm-shell">
      <a className="adm-skip" href="#adm-main">Skip to main content</a>

      <aside className={'adm-sidebar' + (menuOpen ? ' is-open' : '')} id="adm-sidebar" aria-label="Admin">
        <div className="adm-brand">
          <Logo className="adm-brand-logo" />
          <span>
            <strong>DentalCare</strong>
            <small>Admin dashboard</small>
          </span>
        </div>
        <nav aria-label="Main">
          <ul>
            {visibleItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <a className="adm-sidebar-link" href="/">View public website</a>
      </aside>
      {menuOpen && <div className="adm-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-icon-button adm-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="adm-sidebar"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name="menu" />
          </button>
          <div className="adm-topbar-title">DentalCare Admin</div>
          <div className="adm-user">
            <span className="adm-user-text">
              <strong>{admin.name}</strong>
              <small>{admin.role === 'admin' ? 'Administrator' : 'Staff'}</small>
            </span>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setChangingPassword(true)}>Change password</button>
            <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={logout}>
              <Icon name="logout" />
              Log out
            </button>
          </div>
        </header>

        <main className="adm-content" id="adm-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {changingPassword && (
        <FormModal title="Change password" initial={{ currentPassword: '', newPassword: '' }} onSubmit={changePassword} onClose={() => setChangingPassword(false)}>
          {({ bind, errors }) => (
            <>
              <Field label="Current password" error={errors.currentPassword}><input className="adm-input" type="password" autoComplete="current-password" {...bind('currentPassword')} /></Field>
              <Field label="New password" error={errors.newPassword} hint="At least 10 characters."><input className="adm-input" type="password" autoComplete="new-password" {...bind('newPassword')} /></Field>
            </>
          )}
        </FormModal>
      )}
    </div>
  );
}
