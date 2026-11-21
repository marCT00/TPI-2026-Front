import Card from '../../shared/ui/atoms/Card';
import Select from '../../shared/ui/atoms/Select';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';

const TITLE_PREFIX = /^(dr|dra)\.?\s+/i;

const getInitials = (name = '') =>
  name
    .replace(TITLE_PREFIX, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

function DoctorSelectorCard({
  doctors = [],
  selectedDoctor = null,
  selectedDoctorId = '',
  isLoading = false,
  onSelectDoctor,
}) {
  const doctorOptions = doctors.map((doctor) => ({
    value: doctor.id,
    label: `${doctor.name} - ${doctor.speciality.name}`,
  }));

  const placeholder = isLoading
    ? 'Cargando profesionales...'
    : doctorOptions.length > 0
      ? undefined
      : 'No hay médicos registrados';

  return (
    <aside
      aria-label="Selección de profesional médico"
      className="flex flex-col gap-5"
    >
      <Card as="article" className="flex flex-col gap-5 p-6">
        <Select
          label="Seleccionar Profesional"
          placeholder={placeholder}
          options={doctorOptions}
          value={selectedDoctorId}
          disabled={isLoading || doctorOptions.length === 0}
          onChange={(event) => onSelectDoctor(event.target.value)}
        />

        {selectedDoctor && (
          <div className="p-4 rounded-xl bg-med-primary-50/70 border border-med-primary-200/70 flex items-center gap-3.5">
            <span
              aria-hidden="true"
              className="w-12 h-12 rounded-xl bg-med-primary-900 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-xs"
            >
              {getInitials(selectedDoctor.name)}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-med-primary-900 leading-snug truncate">
                {selectedDoctor.name}
              </h2>
              <p className="text-xs text-med-text-sub truncate">
                ID: {selectedDoctor.licenseNumber || 'Sin matrícula'}
              </p>
              <p className="text-xs font-semibold text-med-primary-700 mt-0.5 truncate">
                {selectedDoctor.speciality.name}
              </p>
            </div>
          </div>
        )}

        <AlertBanner variant="info">
          Los cambios realizados se aplicarán a partir de la próxima semana
          calendario. Las citas ya programadas no se verán afectadas
          automáticamente.
        </AlertBanner>
      </Card>
    </aside>
  );
}

export default DoctorSelectorCard;
