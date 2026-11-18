import TableSkeleton from '../../shared/ui/molecules/TableSkeleton';
import AppointmentStatusBadge from './AppointmentStatusBadge';

const COLUMNS = 4;

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

// "2026-11-24" -> "24 nov 2026" (se arma en hora local para no correr el día)
const formatDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return dateFormatter.format(new Date(year, month - 1, day));
};

function AppointmentsTable({ items, isLoading, emptyMessage }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Turnos encontrados</caption>
        <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3.5">
              Especialidad
            </th>
            <th scope="col" className="px-6 py-3.5">
              Paciente
            </th>
            <th scope="col" className="px-6 py-3.5 text-center">
              Estado
            </th>
          </tr>
        </thead>

        {isLoading ? (
          <TableSkeleton rows={5} columns={COLUMNS} />
        ) : (
          <tbody className="divide-y divide-med-border-subtle">
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS}
                  className="px-6 py-10 text-center text-med-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {items.map((appointment) => (
              <tr
                key={appointment.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <th scope="row" className="px-6 py-4 font-normal">
                  <time
                    dateTime={`${appointment.date}T${appointment.startTime}`}
                    className="flex flex-col whitespace-nowrap"
                  >
                    <span className="font-semibold text-med-primary-900">
                      {formatDate(appointment.date)}
                    </span>
                    <span className="text-xs text-med-text-muted">
                      {appointment.startTime} hs
                    </span>
                  </time>
                </th>
                <td className="px-6 py-4">
                  <p className="font-semibold text-med-primary-900">
                    {appointment.specialty.name}
                  </p>
                  <p className="text-xs text-med-text-muted">
                    {appointment.doctor.name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-med-primary-900">
                    {appointment.patient.name || 'Sin nombre'}
                  </p>
                  <p className="text-xs text-med-text-muted">
                    DNI: {appointment.patient.dni}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <AppointmentStatusBadge status={appointment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default AppointmentsTable;
