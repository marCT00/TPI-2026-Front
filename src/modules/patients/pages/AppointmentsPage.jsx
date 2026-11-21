import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePatientAppointments from '../../appointments/hooks/usePatientAppointments';
import { getErrorMessage } from '../../shared/api/parseBackendError';
import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';
import { PlusIcon } from '../../shared/ui/atoms/icons';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import ListSkeleton from '../../shared/ui/molecules/ListSkeleton';
import ConfirmModal from '../../shared/ui/organisms/ConfirmModal';
import useToast from '../../shared/ui/organisms/toast/useToast';
import PatientAppointmentCard from '../components/PatientAppointmentCard';

const CANCEL_ERROR_MESSAGES = {
  APPOINTMENT_ALREADY_CANCELLED: 'Este turno ya fue cancelado anteriormente.',
};

function AppointmentsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { items, isLoading, error, refresh, cancelById } =
    usePatientAppointments();
  const [toCancel, setToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const confirmCancel = async () => {
    if (!toCancel) {
      return;
    }

    setIsCancelling(true);

    try {
      await cancelById(toCancel.id);
      showToast({
        variant: 'success',
        message: 'El turno fue cancelado y el horario quedó disponible.',
      });
      setToCancel(null);
    } catch (requestError) {
      showToast({
        variant: 'error',
        message: getErrorMessage(requestError, CANCEL_ERROR_MESSAGES),
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <section
      aria-labelledby="patient-appointments-title"
      className="flex flex-col gap-6"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            id="patient-appointments-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
          >
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>

        <Button onClick={() => navigate('/')}>
          <PlusIcon />
          Solicitar Nuevo Turno
        </Button>
      </header>

      {error && (
        <AlertBanner title="No se pudieron cargar tus turnos">
          {error}{' '}
          <button
            type="button"
            onClick={refresh}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </AlertBanner>
      )}

      {isLoading && (
        <Card className="p-0 overflow-hidden">
          <ListSkeleton />
        </Card>
      )}

      {!isLoading && !error && items.length === 0 && (
        <Card as="article" className="p-10 text-center flex flex-col items-center gap-3">
          <h2 className="text-base font-bold text-med-primary-900">
            No tenés turnos activos programados
          </h2>
          <p className="text-xs text-med-text-sub max-w-md">
            Podés consultar la disponibilidad de nuestros profesionales y
            reservar una nueva cita en cualquier momento.
          </p>
          <Button className="mt-1" onClick={() => navigate('/')}>
            <PlusIcon />
            Reservar un Turno
          </Button>
        </Card>
      )}

      {!isLoading && items.length > 0 && (
        <ul
          aria-label="Turnos médicos activos"
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {items.map((appointment) => (
            <li key={appointment.id}>
              <PatientAppointmentCard
                appointment={appointment}
                onCancel={setToCancel}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(toCancel)}
        title="¿Cancelar turno médico?"
        message={
          toCancel
            ? `Vas a cancelar tu turno con ${toCancel.doctor.name} del ${toCancel.date} a las ${toCancel.startTime} hs. El horario quedará disponible para otros pacientes.`
            : ''
        }
        confirmLabel="Sí, cancelar turno"
        isLoading={isCancelling}
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </section>
  );
}

export default AppointmentsPage;
