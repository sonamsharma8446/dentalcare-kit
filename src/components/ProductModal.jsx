import { useEffect, useRef } from 'react';
import { formatPrice, getCategory } from '../data/products';
import { Illustration } from './Illustrations';

// Uses the native <dialog> element: it traps keyboard focus, closes with Esc,
// and returns focus to the button that opened it.
export default function ProductModal({ product, onClose, onAdd }) {
  const dialogRef = useRef(null);
  const category = product ? getCategory(product.category) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  function handleBackdropClick(event) {
    // Clicks on the dark backdrop land on the <dialog> element itself.
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {product && (
        <div className="modal-layout">
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close details">
            &times;
          </button>

          <div className="modal-art">
            <Illustration type={product.category} />
            <span className="size-badge">{product.size}</span>
          </div>

          <div className="modal-body">
            <p className="product-category">{category.name}</p>
            <h2 id="modal-title">{product.name}</h2>
            <p className="modal-price">
              <strong>{formatPrice(product.price)}</strong>
              <span>Demo price</span>
            </p>
            <p>{product.description}</p>

            <h3>What it is for</h3>
            <p>{category.whatFor}</p>

            <h3>General use</h3>
            <ul>
              {category.howToUse.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>

            <h3>Cautions</h3>
            <ul className="caution-list">
              {category.cautions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3>Illustrative pack contents</h3>
            <ul className="tag-list">
              {product.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="demo-note">
              Demo content: the price is invented and the pack contents are illustrative. This is
              general information, not medical advice. Always follow a real product&rsquo;s label.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onAdd(product);
                  onClose();
                }}
              >
                Add to kit
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
