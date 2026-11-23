const BADGE_VARIANTS = {
  active: 'bg-med-active-bg text-med-active-text',
  neutral: 'bg-gray-100 text-gray-600',
  primary: 'bg-med-primary-100 text-med-primary-700',
};

function Badge({ variant = 'neutral', className = '', children }) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${variantClass} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

export default Badge;
