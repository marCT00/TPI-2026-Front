import { getStatusInfo } from '../helpers/appointmentStatus';

function AppointmentStatusBadge({ status }) {
  const { label, className } = getStatusInfo(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap ${className}`}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-current"
      />
      {label}
    </span>
  );
}

export default AppointmentStatusBadge;
