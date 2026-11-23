import Button from '../../shared/ui/atoms/Button';
import Modal from '../../shared/ui/organisms/Modal';

function BookingSuccessModal({ booking, onClose, onGoToAppointments }) {
  return (
    <Modal
      open={Boolean(booking)}
      onClose={onClose}
      title="¡Turno Confirmado con Éxito!"
      description={
        booking
          ? `Tu turno con ${booking.doctorName} fue registrado para el ${booking.fullDate} a las ${booking.startTime} hs.`
          : ''
      }
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Reservar Otro
          </Button>
          <Button onClick={onGoToAppointments}>Ver Mis Turnos</Button>
        </>
      }
    >
      {booking && (
        <dl className="p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 space-y-1.5">
          <div className="flex justify-between gap-2">
            <dt className="font-semibold">Profesional:</dt>
            <dd className="text-right">{booking.doctorName}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="font-semibold">Especialidad:</dt>
            <dd className="text-right">{booking.specialityName}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="font-semibold">Horario:</dt>
            <dd className="text-right">
              {booking.startTime} a {booking.endTime} hs (30 min)
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="font-semibold">Motivo:</dt>
            <dd className="text-right truncate max-w-48" title={booking.reason}>
              {booking.reason}
            </dd>
          </div>
          <div className="flex justify-between gap-2 pt-1 border-t border-med-primary-200/60">
            <dt className="font-semibold">Paciente:</dt>
            <dd className="text-right">
              {booking.patientEmail} (DNI: {booking.patientDni})
            </dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}

export default BookingSuccessModal;
