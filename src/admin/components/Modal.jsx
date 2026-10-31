import { useEffect, useId, useLayoutEffect, useRef } from 'react';

// A pop-up built on the native <dialog>: the browser handles the backdrop,
// the Esc key and keeping keyboard focus inside it.
// The content is only rendered while open, so forms start fresh every time.
export default function Modal({ open, title, onClose, children, footer, wide }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // If the page removes this pop-up while it is open, close it properly first,
  // so keyboard focus goes back to the button that opened it.
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={'adm-modal' + (wide ? ' adm-modal-wide' : '')}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose(); // click on the dark backdrop
      }}
    >
      {open && (
        <div className="adm-modal-inner">
          <div className="adm-modal-head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="adm-icon-button" onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
          <div className="adm-modal-body">{children}</div>
          {footer && <div className="adm-modal-foot">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
