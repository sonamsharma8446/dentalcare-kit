import { formatPrice, getCategory } from '../data/products';
import { Illustration } from './Illustrations';

export default function ProductCard({ product, onView, onAdd }) {
  const category = getCategory(product.category);

  return (
    <article className="product-card">
      <div className="product-image">
        <Illustration type={product.category} />
        <span className="size-badge">{product.size}</span>
      </div>

      <div className="product-body">
        <p className="product-category">{category.shortName}</p>
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">
          <strong>{formatPrice(product.price)}</strong>
          <span>Demo price</span>
        </p>

        <div className="product-actions">
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => onView(product)}
            aria-label={`View details: ${product.name}`}
          >
            View details
          </button>
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => onAdd(product)}
            aria-label={`Add to kit: ${product.name}`}
          >
            Add to kit
          </button>
        </div>
      </div>
    </article>
  );
}
