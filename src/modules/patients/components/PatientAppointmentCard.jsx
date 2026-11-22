import AppointmentStatusBadge from '../../appointments/components/AppointmentStatusBadge';
import Button from '../../shared/ui/atoms/Button';
import Card from '../../shared/ui/atoms/Card';

// Tarjeta de turno activo del paciente (mockups págs. 26 y 28).
function PatientAppointmentCard({ appointment, onCancel }) {
  return (
    <Card
      as="article"
      className="flex flex-col justify-between gap-4 p-6 border-med-border"
    >
      <div>
        <header className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
            {appointment.speciality.name}
          </span>
          <AppointmentStatusBadge status={appointment.status} />
        </header>

        <h2 className="text-lg font-bold text-med-primary-900">
          {appointment.doctor.name}
        </h2>

        <p className="text-sm text-med-text-sub mt-2">
          Fecha:{' '}
          <time dateTime={`${appointment.date}T${appointment.startTime}`}>
            <strong className="text-med-text-main font-semibold">
              {appointment.date}
            </strong>{' '}
            a las{' '}
            <strong className="text-med-text-main font-semibold">
              {appointment.startTime} hs
            </strong>
          </time>
        </p>

        {appointment.reason && (
          <p className="text-xs text-med-text-muted mt-1.5 line-clamp-2">
            Motivo: {appointment.reason}
          </p>
        )}
      </div>

      <footer className="flex gap-2 pt-3 border-t border-med-border">
        <Button
          variant="outline"
          className="w-full text-xs"
          onClick={() => onCancel(appointment)}
        >
          Cancelar Turno
        </Button>
      </footer>
    </Card>
  );
}

export default PatientAppointmentCard;
