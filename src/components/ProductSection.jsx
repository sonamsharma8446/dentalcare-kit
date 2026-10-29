import { categories, products } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductSection({
  search,
  onSearch,
  category,
  onCategory,
  sort,
  onSort,
  items,
  onView,
  onAdd,
  onReset,
}) {
  return (
    <section id="products" className="section section-alt" aria-labelledby="products-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">The essentials</p>
          <h2 id="products-title">Products</h2>
          <p>
            Search, filter and sort the sample range. All prices are invented demo values, and the
            products are illustrative examples.
          </p>
        </div>

        <div className="toolbar">
          <div className="field search-field">
            <label htmlFor="product-search">Search products</label>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Try wax, rinse or filling"
              autoComplete="off"
            />
          </div>

          <div className="field sort-field">
            <label htmlFor="product-sort">Sort by</label>
            <select id="product-sort" value={sort} onChange={(event) => onSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="chip"
            aria-pressed={category === 'all'}
            onClick={() => onCategory('all')}
          >
            All <span className="chip-count">{products.length}</span>
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip"
              aria-pressed={category === item.id}
              onClick={() => onCategory(item.id)}
            >
              {item.shortName}
              <span className="chip-count">
                {products.filter((p) => p.category === item.id).length}
              </span>
            </button>
          ))}
        </div>

        <p className="result-count" aria-live="polite">
          Showing {items.length} of {products.length} products
        </p>

        {items.length === 0 ? (
          <div className="empty-state">
            <h3>No matching products</h3>
            <p>Try a different word, or choose another category.</p>
            <button type="button" className="btn btn-primary btn-small" onClick={onReset}>
              Clear search and filters
            </button>
          </div>
        ) : (
          <ul className="product-grid">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} onView={onView} onAdd={onAdd} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
