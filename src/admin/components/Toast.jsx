import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ToastContext = createContext(() => {});

// Shows a short message ("User saved") at the bottom of the screen.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const notify = useCallback((message, type = 'success') => setToast({ message, type, id: Date.now() }), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="adm-toast-area" role="status" aria-live="polite">
        {toast && <div className={`adm-toast adm-toast-${toast.type}`}>{toast.message}</div>}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
