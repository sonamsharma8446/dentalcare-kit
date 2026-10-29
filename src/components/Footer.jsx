import { categories } from '../data/products';
import Logo from './Logo';

export default function Footer({ onSelect }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand brand-light" href="#top" aria-label="DentalCare, back to top">
              <Logo className="brand-logo" />
              <span className="brand-text">
                <strong>DentalCare</strong>
                <small>Dental Emergency Essentials</small>
              </span>
            </a>
            <p>
              A concept page for a dental emergency kit range. Demo project: prices are sample
              data, products are illustrative, and nothing here is medical advice.
            </p>
          </div>

          <nav aria-label="Shop by category">
            <h2>Shop</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <button type="button" className="footer-link" onClick={() => onSelect(category.id)}>
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Learn more">
            <h2>Learn</h2>
            <ul>
              <li>
                <a className="footer-link" href="#guide">
                  Concern guide
                </a>
              </li>
              <li>
                <a className="footer-link" href="#compare">
                  Compare essentials
                </a>
              </li>
              <li>
                <a className="footer-link" href="#safety">
                  Safety information
                </a>
              </li>
              <li>
                <a className="footer-link" href="#top">
                  Back to top
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 DentalCare concept project. For demonstration only.</p>
          <p>No real orders, payments, reviews or certifications.</p>
        </div>
      </div>
    </footer>
  );
}
