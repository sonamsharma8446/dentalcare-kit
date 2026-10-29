import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { products, getCategory } from './data/products';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductSection from './components/ProductSection';
import ProductModal from './components/ProductModal';
import KitDrawer from './components/KitDrawer';
import ConcernGuide from './components/ConcernGuide';
import CompareTable from './components/CompareTable';
import Safety from './components/Safety';
import Footer from './components/Footer';

const MAX_QTY = 9;

function scrollToProducts() {
  const target = document.getElementById('products');
  if (!target) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

// Applies the search text, category filter and sort order to the product list.
function filterAndSort(list, { search, category, sort }) {
  const query = search.trim().toLowerCase();

  const result = list.filter((product) => {
    if (category !== 'all' && product.category !== category) return false;
    if (!query) return true;
    const categoryName = getCategory(product.category).name;
    const text = `${product.name} ${product.description} ${categoryName}`.toLowerCase();
    return text.includes(query);
  });

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  return result; // "featured" keeps the order from the data file
}

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState(null); // product shown in the details modal
  const [kit, setKit] = useState([]); // [{ id, qty }]
  const [kitOpen, setKitOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const visibleProducts = useMemo(
    () => filterAndSort(products, { search, category, sort }),
    [search, category, sort],
  );

  const kitItems = kit.map((item) => ({
    product: products.find((p) => p.id === item.id),
    qty: item.qty,
  }));
  const kitCount = kit.reduce((sum, item) => sum + item.qty, 0);

  // Hide the "added to kit" message after a short delay.
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  function showCategory(id) {
    setCategory(id);
    setSearch('');
    scrollToProducts();
  }

  function resetFilters() {
    setSearch('');
    setCategory('all');
    setSort('featured');
  }

  function addToKit(product) {
    setKit((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (!exists) return [...prev, { id: product.id, qty: 1 }];
      return prev.map((item) =>
        item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, MAX_QTY) } : item,
      );
    });
    setNotice(`Added to your kit: ${product.name}`);
  }

  function changeQty(id, change) {
    setKit((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.min(MAX_QTY, Math.max(1, item.qty + change)) } : item,
      ),
    );
  }

  function removeFromKit(id) {
    setKit((prev) => prev.filter((item) => item.id !== id));
  }

  function browseFromKit() {
    setKitOpen(false);
    scrollToProducts();
  }

  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <Header kitCount={kitCount} onOpenKit={() => setKitOpen(true)} />

      <main id="main" tabIndex={-1}>
        <Hero />
        <Categories onSelect={showCategory} />
        <ProductSection
          search={search}
          onSearch={setSearch}
          category={category}
          onCategory={setCategory}
          sort={sort}
          onSort={setSort}
          items={visibleProducts}
          onView={setSelected}
          onAdd={addToKit}
          onReset={resetFilters}
        />
        <ConcernGuide onSelect={showCategory} />
        <CompareTable onSelect={showCategory} />
        <Safety />
      </main>

      <Footer onSelect={showCategory} />

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addToKit} />
      <KitDrawer
        open={kitOpen}
        items={kitItems}
        onClose={() => setKitOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeFromKit}
        onClear={() => setKit([])}
        onBrowse={browseFromKit}
        maxQty={MAX_QTY}
      />

      <div className={'toast' + (notice ? ' show' : '')} role="status" aria-live="polite">
        {notice}
      </div>
    </div>
  );
}
