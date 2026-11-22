import Card from '../../shared/ui/atoms/Card';

const BADGE_STYLES = {
  active: 'bg-med-active-bg text-med-active-text',
  neutral: 'bg-gray-100 text-gray-600',
  primary: 'bg-med-primary-100 text-med-primary-700',
};

function KpiStatCard({
  icon,
  badgeText,
  badgeVariant = 'neutral',
  label,
  value,
  isLoading = false,
}) {
  const badgeClass = BADGE_STYLES[badgeVariant] || BADGE_STYLES.neutral;

  return (
    <Card as="article" className="flex flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div
          aria-hidden="true"
          className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center"
        >
          {icon}
        </div>
        {badgeText && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
          {label}
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1 tabular-nums">
          {isLoading ? '—' : value}
        </p>
      </div>
    </Card>
  );
}

export default KpiStatCard;
