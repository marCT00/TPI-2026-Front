import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';
import Select from '../../shared/ui/atoms/Select';
import { SearchIcon } from '../../shared/ui/atoms/icons';

function BookingSearchCard({
  specialities = [],
  doctors = [],
  selectedSpecialityId = '',
  selectedDoctorId = '',
  isLoadingCatalog = false,
  isLoadingSlots = false,
  onChangeSpeciality,
  onChangeDoctor,
  onSearch,
}) {
  const specialityOptions = specialities.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const doctorOptions = doctors.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Card as="section" aria-labelledby="booking-title" className="p-6 sm:p-7">
      <header className="mb-5">
        <h1
          id="booking-title"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900"
        >
          Reservar Turno Médico
        </h1>
        <p className="text-xs sm:text-sm text-med-text-sub mt-1">
          Seleccione la especialidad y el profesional para continuar.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <fieldset
          disabled={isLoadingCatalog}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <legend className="sr-only">
            Filtro de especialidad y profesional médico
          </legend>

          <div className="md:col-span-5">
            <Select
              label="Seleccionar Especialidad"
              placeholder={
                isLoadingCatalog
                  ? 'Cargando especialidades...'
                  : 'Todas las especialidades'
              }
              options={specialityOptions}
              value={selectedSpecialityId}
              onChange={(event) => onChangeSpeciality(event.target.value)}
            />
          </div>

          <div className="md:col-span-4">
            <Select
              label="Seleccionar Doctor"
              placeholder={
                isLoadingCatalog
                  ? 'Cargando profesionales...'
                  : doctorOptions.length > 0
                    ? undefined
                    : 'Sin médicos en esta especialidad'
              }
              options={doctorOptions}
              value={selectedDoctorId}
              disabled={isLoadingCatalog || doctorOptions.length === 0}
              onChange={(event) => onChangeDoctor(event.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <Button
              type="submit"
              className="w-full py-2.5"
              disabled={!selectedDoctorId}
              isLoading={isLoadingSlots}
            >
              {!isLoadingSlots && <SearchIcon />}
              <span>Buscar Disponibilidad</span>
            </Button>
          </div>
        </fieldset>
      </form>
    </Card>
  );
}

export default BookingSearchCard;
