import { categories, products } from '../data/products';
import { Illustration } from './Illustrations';

export default function Categories({ onSelect }) {
  return (
    <section id="categories" className="section" aria-labelledby="categories-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Five essentials</p>
          <h2 id="categories-title">Shop by category</h2>
          <p>Pick a category to jump straight to its products.</p>
        </div>

        <ul className="category-grid">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category.id).length;
            return (
              <li key={category.id}>
                <button type="button" className="category-card" onClick={() => onSelect(category.id)}>
                  <span className="category-art">
                    <Illustration type={category.id} />
                  </span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-blurb">{category.blurb}</span>
                  <span className="category-link">
                    View {count} products <span aria-hidden="true">&rarr;</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
