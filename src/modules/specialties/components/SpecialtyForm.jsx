import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import TextArea from '../../shared/ui/atoms/TextArea';
import { SaveIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import {
  DESCRIPTION_LIMITS,
  NAME_LIMITS,
  descriptionRules,
  nameRules,
} from '../helpers/specialtyRules';
import SpecialtyStatusBadge from './SpecialtyStatusBadge';

const EMPTY_VALUES = { name: '', description: '' };

// Formulario de alta/edición. No conoce el backend: recibe onSubmit y, si
// falla, la página le indica qué campo marcar mediante setFieldError.
function SpecialtyForm({
  defaultValues = EMPTY_VALUES,
  isActive = true,
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
    onSubmit(values, {
      setFieldError: (field, message) => setError(field, { message }),
    });

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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-med-text-main">
            Estado
          </span>
          <p className="flex items-center gap-2 text-xs text-med-text-sub">
            <SpecialtyStatusBadge isActive={isActive} />
            {isActive && 'Disponible para programación'}
          </p>
        </div>

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

export default SpecialtyForm;
