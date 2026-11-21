import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';
import Select from '../../shared/ui/atoms/Select';
import { ClockIcon, SaveIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import {
  SLOT_DURATION_MINUTES,
  TIME_OPTIONS,
  validateDayRule,
  validateScheduleDays,
} from '../helpers/availabilityRules';

function DisabledTimeBox() {
  return (
    <div
      aria-hidden="true"
      className="w-full border border-med-border rounded-lg py-2.5 px-3.5 text-sm bg-gray-50 text-med-text-muted text-center select-none"
    >
      --:-- ----
    </div>
  );
}

function DayToggleSwitch({ checked, label, registerProps }) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        role="switch"
        aria-label={`Activar atención el día ${label}`}
        className="sr-only peer"
        {...registerProps}
      />
      <span
        aria-hidden="true"
        className="relative w-10 h-5 rounded-full bg-gray-200 peer-checked:bg-med-primary-900 peer-focus-visible:ring-2 peer-focus-visible:ring-med-primary-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
      />
      <span
        className={`text-xs font-semibold ${
          checked ? 'text-med-primary-900' : 'text-med-text-muted'
        }`}
      >
        {checked ? 'Activo' : 'Inactivo'}
      </span>
    </label>
  );
}

// Organismo del formulario semanal de disponibilidad horaria (RN01, RN02).
function AvailabilityScheduleForm({
  initialDays = [],
  disabled = false,
  submitError = '',
  onSubmit,
  onCancel,
}) {
  const [validationError, setValidationError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { days: initialDays },
  });

  const watchedDays = watch('days') ?? initialDays;

  const onValid = async (values) => {
    setValidationError('');

    const scheduleCheck = validateScheduleDays(values.days);

    if (scheduleCheck !== true) {
      setValidationError(scheduleCheck);

      return;
    }

    await onSubmit(values.days);
  };

  return (
    <Card as="article" className="p-0 overflow-hidden">
      <header className="p-5 sm:px-6 border-b border-med-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-base font-bold text-med-primary-900">
          Configuración de Horarios
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-med-text-muted">
          <ClockIcon className="w-3.5 h-3.5" />
          Intervalos automáticos de {SLOT_DURATION_MINUTES} minutos
        </span>
      </header>

      <form noValidate onSubmit={handleSubmit(onValid)}>
        <fieldset disabled={disabled || isSubmitting} className="min-w-0">
          <legend className="sr-only">
            Horarios semanales de entrada y salida
          </legend>

          {/* Encabezado de columnas visible desde sm */}
          <div
            aria-hidden="true"
            className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-med-primary-50/70 border-b border-med-border text-[11px] font-bold uppercase tracking-wider text-med-text-sub"
          >
            <span className="col-span-3">Día</span>
            <span className="col-span-3">Estado</span>
            <span className="col-span-3">Entrada</span>
            <span className="col-span-3">Salida</span>
          </div>

          <ul
            aria-label="Días de la semana"
            className="divide-y divide-med-border-subtle"
          >
            {initialDays.map((dayDef, index) => {
              const currentDay = watchedDays[index] ?? dayDef;
              const isEnabled = Boolean(currentDay.enabled);
              const rowCheck = isEnabled ? validateDayRule(currentDay) : true;
              const rowError = rowCheck !== true ? rowCheck : '';

              return (
                <li
                  key={dayDef.day}
                  className={`p-4 sm:px-6 transition-colors ${
                    isEnabled ? 'bg-white' : 'bg-gray-50/60'
                  }`}
                >
                  <input
                    type="hidden"
                    {...register(`days.${index}.day`)}
                    defaultValue={dayDef.day}
                  />
                  <input
                    type="hidden"
                    {...register(`days.${index}.label`)}
                    defaultValue={dayDef.label}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 sm:items-center">
                    <div className="flex items-center justify-between sm:col-span-6 sm:grid sm:grid-cols-6 sm:gap-4">
                      <span
                        className={`text-sm font-semibold sm:col-span-3 ${
                          isEnabled
                            ? 'text-med-primary-900'
                            : 'text-med-text-muted'
                        }`}
                      >
                        {dayDef.label}
                      </span>

                      <div className="sm:col-span-3">
                        <DayToggleSwitch
                          checked={isEnabled}
                          label={dayDef.label}
                          registerProps={register(`days.${index}.enabled`)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:col-span-6 sm:gap-4">
                      <div>
                        <span className="block sm:hidden text-[11px] font-semibold text-med-text-sub mb-1">
                          Entrada
                        </span>
                        {isEnabled ? (
                          <Select
                            aria-label={`Hora de entrada ${dayDef.label}`}
                            options={TIME_OPTIONS}
                            leftIcon={<ClockIcon />}
                            {...register(`days.${index}.startTime`)}
                          />
                        ) : (
                          <DisabledTimeBox />
                        )}
                      </div>

                      <div>
                        <span className="block sm:hidden text-[11px] font-semibold text-med-text-sub mb-1">
                          Salida
                        </span>
                        {isEnabled ? (
                          <Select
                            aria-label={`Hora de salida ${dayDef.label}`}
                            options={TIME_OPTIONS}
                            leftIcon={<ClockIcon />}
                            {...register(`days.${index}.endTime`)}
                          />
                        ) : (
                          <DisabledTimeBox />
                        )}
                      </div>
                    </div>
                  </div>

                  {rowError && (
                    <p
                      role="alert"
                      className="mt-2 text-xs font-medium text-red-500"
                    >
                      {rowError}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          {(validationError || submitError) && (
            <div className="px-6 pt-4">
              <AlertBanner>{validationError || submitError}</AlertBanner>
            </div>
          )}

          <footer className="p-5 sm:px-6 border-t border-med-border flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 bg-med-primary-50/30">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {!isSubmitting && <SaveIcon />}
              Guardar Disponibilidad
            </Button>
          </footer>
        </fieldset>
      </form>
    </Card>
  );
}

export default AvailabilityScheduleForm;
