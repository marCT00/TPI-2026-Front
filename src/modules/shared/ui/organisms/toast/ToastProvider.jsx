import { useCallback, useMemo, useRef, useState } from 'react';
import AlertBanner from '../../molecules/AlertBanner';
import ToastContext from './ToastContext';

const DEFAULT_DURATION_MS = 4000;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      title = '',
      variant = 'info',
      duration = DEFAULT_DURATION_MS,
    }) => {
      const id = nextId.current++;

      setToasts((current) => [...current, { id, message, title, variant }]);

      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-live="polite"
        aria-label="Notificaciones"
        className="fixed z-50 bottom-4 inset-x-4 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-96"
      >
        {toasts.map((toast) => (
          <AlertBanner
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            onDismiss={() => dismissToast(toast.id)}
            className="shadow-lg"
          >
            {toast.message}
          </AlertBanner>
        ))}
      </section>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
