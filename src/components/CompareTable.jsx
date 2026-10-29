import { categories, products, formatPrice } from '../data/products';
import { Illustration } from './Illustrations';

export default function CompareTable({ onSelect }) {
  return (
    <section id="compare" className="section section-alt" aria-labelledby="compare-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">At a glance</p>
          <h2 id="compare-title">Compare the five essentials</h2>
          <p>What each one is for, its form, and the main thing to watch out for.</p>
        </div>

        <div className="table-wrap" role="region" aria-label="Category comparison table" tabIndex={0}>
          <table className="compare-table">
            <caption className="sr-only">Comparison of the five dental emergency essentials</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Best for</th>
                <th scope="col">Form</th>
                <th scope="col">Key caution</th>
                <th scope="col">Demo price from</th>
                <th scope="col">
                  <span className="sr-only">Shop</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const lowest = Math.min(
                  ...products.filter((p) => p.category === category.id).map((p) => p.price),
                );
                return (
                  <tr key={category.id}>
                    <th scope="row">
                      <span className="cmp-name">
                        <Illustration type={category.id} className="cmp-icon" />
                        <span>{category.name}</span>
                      </span>
                    </th>
                    <td>{category.bestFor}</td>
                    <td>{category.form}</td>
                    <td>{category.keyCaution}</td>
                    <td>
                      <strong>{formatPrice(lowest)}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        onClick={() => onSelect(category.id)}
                        aria-label={`View ${category.name} products`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
