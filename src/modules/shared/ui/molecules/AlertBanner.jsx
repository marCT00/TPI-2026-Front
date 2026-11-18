import { CloseIcon } from '../atoms/icons';

const VARIANT_STYLES = {
  error: 'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  success: 'bg-med-active-bg border-emerald-200 text-med-active-text',
  info: 'bg-med-primary-50 border-med-primary-200 text-med-primary-900',
};

function AlertBanner({
  variant = 'error',
  title = '',
  children,
  onDismiss,
  className = '',
}) {
  // Los errores se anuncian de inmediato; el resto de forma no intrusiva.
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <aside
      role={role}
      className={`flex items-start gap-3 p-3 border rounded-lg text-xs ${
        VARIANT_STYLES[variant] || VARIANT_STYLES.error
      } ${className}`}
    >
      <div className="flex-1 leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className="shrink-0 opacity-70 hover:opacity-100 transition"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
}

export default AlertBanner;
