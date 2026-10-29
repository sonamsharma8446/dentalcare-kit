import { useEffect, useRef } from 'react';
import { formatPrice } from '../data/products';
import { Illustration } from './Illustrations';

// "My kit" side panel. There is no checkout: this is a demo of the shopping interaction only.
export default function KitDrawer({ open, items, onClose, onChangeQty, onRemove, onClear, onBrowse, maxQty }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <dialog
      ref={dialogRef}
      className="drawer"
      aria-labelledby="kit-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="drawer-head">
        <h2 id="kit-title">My kit</h2>
        <button type="button" className="modal-close-inline" onClick={onClose} aria-label="Close my kit">
          &times;
        </button>
      </div>

      <div className="drawer-body">
        {items.length === 0 ? (
          <div className="empty-state">
            <h3>Your kit is empty</h3>
            <p>Add a few essentials to see them here.</p>
            <button type="button" className="btn btn-primary btn-small" onClick={onBrowse}>
              Browse products
            </button>
          </div>
        ) : (
          <ul className="kit-list">
            {items.map(({ product, qty }) => (
              <li className="kit-item" key={product.id}>
                <div className="kit-item-art">
                  <Illustration type={product.category} />
                </div>
                <div>
                  <h3>{product.name}</h3>
                  <p className="kit-meta">
                    {formatPrice(product.price)} each &middot; demo price
                  </p>
                  <div className="kit-controls">
                    <div className="qty" role="group" aria-label={`Quantity of ${product.name}`}>
                      <button
                        type="button"
                        onClick={() => onChangeQty(product.id, -1)}
                        disabled={qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        onClick={() => onChangeQty(product.id, 1)}
                        disabled={qty >= maxQty}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <strong>{formatPrice(product.price * qty)}</strong>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onRemove(product.id)}
                      aria-label={`Remove ${product.name} from kit`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="drawer-foot">
          <p className="kit-total">
            <span>Demo total</span>
            <strong>{formatPrice(total)}</strong>
          </p>
          <p className="kit-note">
            Demo only: there is no checkout or payment in this project.
          </p>
          <div className="kit-foot-actions">
            <button type="button" className="btn btn-secondary btn-small" onClick={onBrowse}>
              Keep browsing
            </button>
            <button type="button" className="btn btn-secondary btn-small" onClick={onClear}>
              Clear kit
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
