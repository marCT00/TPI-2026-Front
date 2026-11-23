import ListSkeleton from '../../shared/ui/molecules/ListSkeleton';
import TableSkeleton from '../../shared/ui/molecules/TableSkeleton';
import { ClockIcon, PencilIcon, TrashIcon } from '../../shared/ui/atoms/icons';

const COLUMNS = 3;
const TITLE_PREFIX = /^(dr|dra)\.?\s+/i;

const getInitials = (name) =>
  name
    .replace(TITLE_PREFIX, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

function DoctorAvatar({ name }) {
  return (
    <span
      aria-hidden="true"
      className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 text-xs font-bold flex items-center justify-center shrink-0"
    >
      {getInitials(name)}
    </span>
  );
}

function SpecialityTag({ name }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700 whitespace-nowrap">
      {name}
    </span>
  );
}

function RowActions({ doctor, onEdit, onManageAvailability, onDelete }) {
  if (!onEdit && !onManageAvailability && !onDelete) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2 shrink-0">
      {onEdit && (
        <button
          type="button"
          title="Editar doctor"
          aria-label={`Editar ${doctor.name}`}
          onClick={() => onEdit(doctor)}
          className="p-1.5 rounded-lg text-med-text-muted hover:bg-med-primary-50 hover:text-med-primary-900 transition"
        >
          <PencilIcon />
        </button>
      )}
      {onManageAvailability && (
        <button
          type="button"
          title="Gestionar disponibilidad horaria"
          aria-label={`Gestionar disponibilidad de ${doctor.name}`}
          onClick={() => onManageAvailability(doctor)}
          className="p-1.5 rounded-lg text-med-text-muted hover:bg-med-primary-50 hover:text-med-primary-900 transition"
        >
          <ClockIcon />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          title="Eliminar doctor"
          aria-label={`Eliminar ${doctor.name}`}
          onClick={() => onDelete(doctor)}
          className="p-1.5 rounded-lg text-med-text-muted hover:bg-red-50 hover:text-med-danger-text transition"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

// En mobile se muestra como lista de tarjetas y desde md como tabla.
function DoctorsTable({
  items,
  isLoading,
  emptyMessage,
  onEdit,
  onManageAvailability,
  onDelete,
}) {
  const isEmpty = !isLoading && items.length === 0;

  return (
    <>
      <div className="md:hidden">
        {isLoading && <ListSkeleton />}
        {isEmpty && (
          <p className="px-4 py-10 text-center text-sm text-med-text-muted">
            {emptyMessage}
          </p>
        )}
        {!isLoading && items.length > 0 && (
          <ul
            aria-label="Listado de médicos registrados"
            className="divide-y divide-med-border-subtle"
          >
            {items.map((doctor) => (
              <li key={doctor.id}>
                <article className="p-4 flex items-start gap-3">
                  <DoctorAvatar name={doctor.name} />
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <h3 className="font-semibold text-med-primary-900 leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-med-text-muted">
                      Licencia: {doctor.licenseNumber || '—'}
                    </p>
                    <div>
                      <SpecialityTag name={doctor.speciality.name} />
                    </div>
                  </div>
                  <RowActions
                    doctor={doctor}
                    onEdit={onEdit}
                    onManageAvailability={onManageAvailability}
                    onDelete={onDelete}
                  />
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Listado de médicos registrados</caption>
          <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Nombre del Doctor
              </th>
              <th scope="col" className="px-6 py-3.5">
                Especialidad
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          {isLoading ? (
            <TableSkeleton rows={5} columns={COLUMNS} />
          ) : (
            <tbody className="divide-y divide-med-border-subtle">
              {isEmpty && (
                <tr>
                  <td
                    colSpan={COLUMNS}
                    className="px-6 py-10 text-center text-med-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}

              {items.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <th scope="row" className="px-6 py-4 font-normal">
                    <div className="flex items-center gap-3">
                      <DoctorAvatar name={doctor.name} />
                      <div className="min-w-40">
                        <p className="font-semibold text-med-primary-900 leading-tight">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-med-text-muted mt-0.5">
                          Licencia: {doctor.licenseNumber || '—'}
                        </p>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <SpecialityTag name={doctor.speciality.name} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <RowActions
                      doctor={doctor}
                      onEdit={onEdit}
                      onManageAvailability={onManageAvailability}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}

export default DoctorsTable;
