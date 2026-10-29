import { categories } from '../data/products';
import { Illustration } from './Illustrations';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">DentalCare &middot; Dental Emergency Essentials</p>
          <h1 id="hero-title">Be ready for a dental emergency before it happens</h1>
          <p className="lead">
            Five essentials to keep at home, in a travel bag or in a sports kit. Each one is a
            short-term helper until you can see your dentist.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#products">
              Shop essentials
            </a>
            <a className="btn btn-secondary" href="#guide">
              Find the right help
            </a>
          </div>

          <ul className="hero-points">
            <li>Five essential product types</li>
            <li>Clear usage and safety notes</li>
            <li>Temporary aids, not a replacement for a dentist</li>
          </ul>
        </div>

        <div className="hero-art" aria-hidden="true">
          {categories.map((category) => (
            <div className="hero-tile" key={category.id}>
              <Illustration type={category.id} />
              <span>{category.shortName}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
