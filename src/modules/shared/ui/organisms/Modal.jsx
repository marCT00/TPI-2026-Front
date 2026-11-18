import { useEffect, useId, useRef } from 'react';
import { CloseIcon } from '../atoms/icons';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

// Usa <dialog> nativo: trae foco atrapado, tecla Escape y backdrop accesibles.
function Modal({
  open,
  onClose,
  title,
  description = '',
  children,
  footer = null,
  size = 'md',
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (event) => {
    // Escape: dejamos que el estado lo controle el padre.
    event.preventDefault();
    onClose?.();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={`m-auto w-[calc(100%-2rem)] ${SIZES[size] || SIZES.md} rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/50`}
    >
      {open && (
        <article className="flex flex-col">
          <header className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <h2
                id={titleId}
                className="text-lg font-bold text-med-primary-900"
              >
                {title}
              </h2>
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-xs text-med-text-sub leading-relaxed"
                >
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="p-1 rounded-lg text-med-text-muted hover:text-med-text-main hover:bg-gray-50"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </header>
          <section className="px-6 py-4 text-sm text-med-text-main">
            {children}
          </section>
          {footer && (
            <footer className="flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end">
              {footer}
            </footer>
          )}
        </article>
      )}
    </dialog>
  );
}

export default Modal;
