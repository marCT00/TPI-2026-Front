import Spinner from './Spinner';

const VARIANT_STYLES = {
  default:
    'bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
  secondary:
    'border border-med-primary-900 text-med-primary-900 bg-white hover:bg-med-primary-50 font-medium px-4 py-2 rounded-lg transition',
  outline:
    'border border-med-border text-med-text-main bg-white hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition',
  ghost:
    'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900 font-medium px-3 py-2 rounded-lg transition',
  danger:
    'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
};

const ALLOWED_TYPES = ['button', 'reset', 'submit'];

function Button({
  children,
  type = 'button',
  variant = 'default',
  isLoading = false,
  disabled = false,
  className = '',
  ...restProps
}) {
  if (!ALLOWED_TYPES.includes(type)) {
    console.warn(`Button: type "${type}" no soportado`);
  }

  const appliedClass = `${VARIANT_STYLES[variant] || VARIANT_STYLES.default}
    inline-flex items-center justify-center gap-2
    disabled:opacity-60 disabled:cursor-not-allowed ${className}`;

  return (
    <button
      {...restProps}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={appliedClass}
    >
      {isLoading && <Spinner size="sm" label="Procesando" />}
      {children}
    </button>
  );
}

export default Button;
