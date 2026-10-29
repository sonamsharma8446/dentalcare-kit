import { useState } from 'react';
import Logo from './Logo';

const links = [
  { href: '#categories', label: 'Categories' },
  { href: '#products', label: 'Shop' },
  { href: '#guide', label: 'Concern guide' },
  { href: '#compare', label: 'Compare' },
  { href: '#safety', label: 'Safety' },
];

export default function Header({ kitCount, onOpenKit }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setMenuOpen(false);
      }}
    >
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="DentalCare, back to top">
          <Logo className="brand-logo" />
          <span className="brand-text">
            <strong>DentalCare</strong>
            <small>Dental Emergency Essentials</small>
          </span>
        </a>

        <nav id="site-nav" className={'site-nav' + (menuOpen ? ' open' : '')} aria-label="Main">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-primary btn-small" onClick={onOpenKit}>
            My kit
            <span className="kit-count">{kitCount}</span>
            <span className="sr-only">items in kit</span>
          </button>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="menu-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
