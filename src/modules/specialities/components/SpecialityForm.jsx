import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import Select from '../../shared/ui/atoms/Select';
import TextArea from '../../shared/ui/atoms/TextArea';
import { SaveIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import {
  DESCRIPTION_LIMITS,
  NAME_LIMITS,
  descriptionRules,
  nameRules,
} from '../helpers/specialityRules';

const STATUS_OPTIONS = [
  { value: 'true', label: 'Activo - Disponible para programación' },
  { value: 'false', label: 'Desactivado - No disponible para programación' },
];

const EMPTY_VALUES = { name: '', description: '', isActive: 'true' };

// Formulario de alta/edición. No conoce el backend: recibe onSubmit y, si
// falla, la página le indica qué campo marcar mediante setFieldError.
function SpecialityForm({
  defaultValues = EMPTY_VALUES,
  submitError = '',
  submitLabel = 'Guardar Especialidad',
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues, mode: 'onTouched' });

  const descriptionLength = (watch('description') ?? '').length;

  const onValid = (values) =>
    onSubmit(
      {
        ...values,
        isActive: values.isActive === true || values.isActive === 'true',
      },
      {
        setFieldError: (field, message) => setError(field, { message }),
      }
    );

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5">
        <legend className="sr-only">Datos de la especialidad</legend>

        <Input
          label="Nombre de la Especialidad"
          placeholder="Ej. Cardiología Intervencionista"
          maxLength={NAME_LIMITS.max}
          error={errors.name?.message}
          {...register('name', nameRules)}
        />

        <TextArea
          label="Descripción"
          placeholder="Detalle el alcance de la especialidad, procedimientos principales y requisitos de derivación..."
          maxLength={DESCRIPTION_LIMITS.max}
          hint={`Entre ${DESCRIPTION_LIMITS.min} y ${DESCRIPTION_LIMITS.max} caracteres.`}
          counter={`${descriptionLength}/${DESCRIPTION_LIMITS.max}`}
          error={errors.description?.message}
          {...register('description', descriptionRules)}
        />

        <Select
          label="Estado inicial"
          options={STATUS_OPTIONS}
          {...register('isActive')}
        />

        {submitError && <AlertBanner>{submitError}</AlertBanner>}

        <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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

export default SpecialityForm;
