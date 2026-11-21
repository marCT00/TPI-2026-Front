import { useForm } from 'react-hook-form';
import {
  REASON_LIMITS,
  reasonRules,
} from '../../appointments/helpers/bookingRules';
import Button from '../../shared/ui/atoms/Button';
import Input from '../../shared/ui/atoms/Input';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';

function BookingConfirmSection({
  doctor = null,
  selectedDayObj = null,
  selectedSlot = null,
  bookingError = '',
  onConfirm,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { reason: '' },
    mode: 'onTouched',
  });

  const hasSelection = Boolean(doctor && selectedSlot);

  const onValid = async (values) => {
    const ok = await onConfirm(values);

    if (ok) {
      reset({ reason: '' });
    }
  };

  return (
    <section
      aria-label="Resumen de selección y confirmación de turno"
      className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
    >
      <form noValidate onSubmit={handleSubmit(onValid)}>
        <fieldset
          disabled={!hasSelection || isSubmitting}
          className="flex flex-col gap-4"
        >
          <legend className="sr-only">
            Confirmar reserva con motivo de consulta
          </legend>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="border-l-4 border-med-primary-900 pl-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
                Resumen de Selección
              </span>

              {hasSelection ? (
                <>
                  <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5">
                    <time
                      dateTime={`${selectedSlot.date}T${selectedSlot.startTime}`}
                    >
                      {selectedDayObj?.fullDate ?? selectedSlot.date},{' '}
                      {selectedSlot.startTime} HS
                    </time>
                  </p>
                  <p className="text-xs text-med-text-sub mt-0.5">
                    {doctor.name} ({doctor.speciality?.name}) • Duración: 30 min
                  </p>
                </>
              ) : (
                <p className="text-sm font-semibold text-med-text-sub mt-1">
                  Seleccioná un día y un bloque horario disponible en el
                  calendario superior.
                </p>
              )}
            </div>

            <div className="flex-1 max-w-md w-full">
              <Input
                label="Motivo de la Consulta"
                placeholder="Ej: Control cardiológico anual (mín. 5 caracteres)"
                maxLength={REASON_LIMITS.max}
                error={errors.reason?.message}
                {...register('reason', reasonRules)}
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!hasSelection}
              className="py-3 px-6 rounded-xl shadow-md text-sm shrink-0 lg:self-end"
            >
              <span>Confirmar Turno</span>
              {!isSubmitting && (
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </Button>
          </div>

          {bookingError && <AlertBanner>{bookingError}</AlertBanner>}
        </fieldset>
      </form>
    </section>
  );
}

export default BookingConfirmSection;
