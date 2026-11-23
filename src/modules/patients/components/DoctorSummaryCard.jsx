import Card from '../../shared/ui/atoms/Card';

const TITLE_PREFIX = /^(dr|dra)\.?\s+/i;

const getInitials = (name = '') =>
  name
    .replace(TITLE_PREFIX, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

function DoctorSummaryCard({ doctor }) {
  if (!doctor) {
    return null;
  }

  return (
    <Card
      as="article"
      aria-label="Información del profesional seleccionado"
      className="p-5 sm:p-6 flex items-center gap-4 border-med-border"
    >
      <div className="relative shrink-0">
        <div
          aria-hidden="true"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 text-med-primary-900 font-bold text-lg flex items-center justify-center border border-med-primary-200"
        >
          {getInitials(doctor.name)}
        </div>
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
        />
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
            {doctor.name}
          </h2>
          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-med-primary-100 text-med-primary-700">
            Verificado
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold uppercase sm:normal-case tracking-wide sm:tracking-normal text-med-primary-700 sm:text-med-text-sub mt-0.5">
          {doctor.speciality?.name ?? 'Especialidad Médica'}
        </p>
        <p className="text-xs text-med-text-muted mt-0.5 truncate">
          Matrícula: {doctor.licenseNumber || 'Sede Central'} • Turnos de 30 min
        </p>
      </div>
    </Card>
  );
}

export default DoctorSummaryCard;
