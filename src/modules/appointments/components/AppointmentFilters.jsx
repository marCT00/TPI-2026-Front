import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import Select from '../../shared/ui/atoms/Select';
import { SearchIcon } from '../../shared/ui/atoms/icons';
import { DNI_LIMITS, patientDniRules } from '../helpers/appointmentFilterRules';

const findLabel = (options, value) =>
  options.find((option) => option.value === value)?.label ?? '';

const formatDate = (value) => value.split('-').reverse().join('/');

// Etiquetas con los filtros que se están aplicando en la búsqueda.
const getActiveChips = (filters, specialties, doctors) =>
  [
    filters.patientDni && `DNI: ${filters.patientDni}`,
    filters.specialtyId &&
      `Especialidad: ${findLabel(specialties, filters.specialtyId)}`,
    filters.doctorId && `Doctor: ${findLabel(doctors, filters.doctorId)}`,
    filters.date && `Fecha: ${formatDate(filters.date)}`,
  ].filter(Boolean);

function AppointmentFilters({
  defaultValues,
  appliedFilters,
  specialties,
  doctors,
  isLoadingOptions,
  onApply,
  onClear,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues, mode: 'onTouched' });

  const selectedSpecialty = watch('specialtyId');
  const doctorOptions = selectedSpecialty
    ? doctors.filter((doctor) => doctor.specialtyId === selectedSpecialty)
    : doctors;

  // Si el médico elegido no pertenece a la nueva especialidad, se limpia.
  useEffect(() => {
    const doctor = doctors.find(
      (option) => option.value === getValues('doctorId')
    );

    if (
      doctor &&
      selectedSpecialty &&
      doctor.specialtyId !== selectedSpecialty
    ) {
      setValue('doctorId', '');
    }
  }, [selectedSpecialty, doctors, getValues, setValue]);

  const chips = getActiveChips(appliedFilters, specialties, doctors);

  const handleClear = () => {
    reset(defaultValues);
    onClear();
  };

  return (
    <form noValidate onSubmit={handleSubmit(onApply)}>
      <fieldset className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-4 xl:items-start">
        <legend className="sr-only">Criterios de búsqueda</legend>

        <Input
          label="DNI del Paciente"
          placeholder="Ej: 40123456"
          inputMode="numeric"
          maxLength={DNI_LIMITS.max}
          leftIcon={<SearchIcon />}
          error={errors.patientDni?.message}
          {...register('patientDni', patientDniRules)}
        />

        <Select
          label="Especialidad"
          placeholder="Todas las Especialidades"
          options={specialties}
          disabled={isLoadingOptions}
          {...register('specialtyId')}
        />

        <Select
          label="Doctor"
          placeholder="Todos los Doctores"
          options={doctorOptions}
          disabled={isLoadingOptions}
          {...register('doctorId')}
        />

        <Input label="Fecha" type="date" {...register('date')} />

        <div className="flex gap-2 sm:col-span-2 sm:justify-end xl:col-span-1 xl:pt-6">
          <Button
            type="submit"
            className="flex-1 sm:flex-none whitespace-nowrap"
          >
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        </div>
      </fieldset>

      {chips.length > 0 && (
        <ul
          aria-label="Filtros activos"
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-med-border"
        >
          {chips.map((chip) => (
            <li
              key={chip}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default AppointmentFilters;
