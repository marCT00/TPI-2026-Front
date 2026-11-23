import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import Select from '../../shared/ui/atoms/Select';
import {
  IdCardIcon,
  SaveIcon,
  StethoscopeIcon,
  UserIcon,
} from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import {
  LICENSE_LIMITS,
  NAME_LIMITS,
  licenseRules,
  nameRules,
  specialityRules,
} from '../helpers/doctorRules';

const EMPTY_VALUES = { name: '', specialityId: '', licenseNumber: '' };

const getSpecialityPlaceholder = (isLoading, hasOptions) => {
  if (isLoading) {
    return 'Cargando especialidades...';
  }

  return hasOptions
    ? 'Seleccione especialidad'
    : 'Primero registrá una especialidad';
};

// Sirve para alta y edición. No conoce el backend: recibe los valores
// iniciales, las especialidades y onSubmit. Si el guardado falla, la página
// marca el campo con setFieldError.
function DoctorForm({
  defaultValues = EMPTY_VALUES,
  specialityOptions = [],
  isLoadingSpecialities = false,
  submitError = '',
  submitLabel = 'Guardar Doctor',
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, mode: 'onTouched' });

  const hasOptions = specialityOptions.length > 0;

  const onValid = (values) =>
    onSubmit(values, {
      setFieldError: (field, message) => setError(field, { message }),
    });

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5">
        <legend className="sr-only">Datos del doctor</legend>

        <Input
          label="Nombre Completo del Doctor"
          placeholder="Ej: Dr. Alejandro Martínez"
          maxLength={NAME_LIMITS.max}
          leftIcon={<UserIcon />}
          error={errors.name?.message}
          {...register('name', nameRules)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Select
            label="Especialidad"
            placeholder={getSpecialityPlaceholder(
              isLoadingSpecialities,
              hasOptions
            )}
            options={specialityOptions}
            disabled={isLoadingSpecialities || !hasOptions}
            leftIcon={<StethoscopeIcon />}
            error={errors.specialityId?.message}
            {...register('specialityId', specialityRules)}
          />

          <Input
            label="Número de Licencia Médica"
            placeholder="ID-45920-X"
            maxLength={LICENSE_LIMITS.max}
            leftIcon={<IdCardIcon />}
            error={errors.licenseNumber?.message}
            {...register('licenseNumber', licenseRules)}
          />
        </div>

        {submitError && <AlertBanner>{submitError}</AlertBanner>}

        <footer className="flex flex-col-reverse gap-2 pt-5 border-t border-med-border sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {!isSubmitting && <SaveIcon />}
            {submitLabel}
          </Button>
        </footer>
      </fieldset>
    </form>
  );
}

export default DoctorForm;
