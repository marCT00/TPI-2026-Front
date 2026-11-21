import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../shared/ui/atoms/Card';
import Spinner from '../../shared/ui/atoms/Spinner';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import useToast from '../../shared/ui/organisms/toast/useToast';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import AvailabilityScheduleForm from '../components/AvailabilityScheduleForm';
import DoctorSelectorCard from '../components/DoctorSelectorCard';
import useDoctorAvailability from '../hooks/useDoctorAvailability';

const DOCTORS_LIST_PATH = '/admin/doctors';

const AVAILABILITY_ERROR_MESSAGES = {
  AVAILABILITY_OVERLAP:
    'Los horarios ingresados se superponen con una disponibilidad existente.',
  AVAILABILITY_MONTH_HAS_BOOKINGS:
    'No se puede modificar la disponibilidad porque el médico ya tiene turnos reservados este mes.',
  AVAILABILITY_INVALID_RANGE:
    'La hora de salida debe ser posterior a la hora de entrada.',
  AVAILABILITY_INVALID_DURATION:
    'Los rangos horarios deben ser divisibles en bloques de 30 minutos.',
  AVAILABILITY_INVALID_RULEDAY: 'Debés activar al menos un día de atención.',
};

function DoctorAvailabilityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') ?? '';
  const { showToast } = useToast();
  const [submitError, setSubmitError] = useState('');

  const {
    doctors,
    selectedDoctor,
    selectedDoctorId,
    selectDoctor,
    initialDays,
    isLoadingDoctors,
    isLoadingSchedule,
    doctorsError,
    scheduleError,
    saveAvailability,
  } = useDoctorAvailability(initialDoctorId);

  const handleSelectDoctor = (doctorId) => {
    setSubmitError('');
    selectDoctor(doctorId);
    setSearchParams(doctorId ? { doctorId } : {}, { replace: true });
  };

  const handleSubmit = async (daysFormValues) => {
    setSubmitError('');

    try {
      await saveAvailability(daysFormValues);
      showToast({
        variant: 'success',
        message: `Se guardó la disponibilidad horaria de ${selectedDoctor?.name ?? 'el profesional'}.`,
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error, AVAILABILITY_ERROR_MESSAGES));
    }
  };

  return (
    <section
      aria-labelledby="availability-page-title"
      className="flex flex-col gap-6"
    >
      <header>
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-med-text-muted">
            <li>
              <Link
                to={DOCTORS_LIST_PATH}
                className="hover:text-med-primary-900"
              >
                Doctores
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li
              aria-current="page"
              className="font-semibold text-med-primary-900"
            >
              Disponibilidad Horaria
            </li>
          </ol>
        </nav>

        <h1
          id="availability-page-title"
          className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
        >
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Defina los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </header>

      {doctorsError && (
        <AlertBanner title="No se pudieron cargar los profesionales">
          {doctorsError}
        </AlertBanner>
      )}

      {scheduleError && (
        <AlertBanner
          variant="warning"
          title="No se pudo consultar la disponibilidad actual"
        >
          {scheduleError}
        </AlertBanner>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <DoctorSelectorCard
            doctors={doctors}
            selectedDoctor={selectedDoctor}
            selectedDoctorId={selectedDoctorId}
            isLoading={isLoadingDoctors}
            onSelectDoctor={handleSelectDoctor}
          />
        </div>

        <div className="lg:col-span-8">
          {isLoadingDoctors || isLoadingSchedule ? (
            <Card className="flex justify-center py-16 text-med-primary-900">
              <Spinner size="lg" label="Cargando disponibilidad horaria" />
            </Card>
          ) : (
            <AvailabilityScheduleForm
              key={selectedDoctorId || 'empty'}
              initialDays={initialDays}
              disabled={!selectedDoctorId}
              submitError={submitError}
              onSubmit={handleSubmit}
              onCancel={() => navigate(DOCTORS_LIST_PATH)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default DoctorAvailabilityPage;
