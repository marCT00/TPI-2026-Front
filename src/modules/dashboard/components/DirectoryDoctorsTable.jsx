import ListSkeleton from '../../shared/ui/molecules/ListSkeleton';
import TableSkeleton from '../../shared/ui/molecules/TableSkeleton';

const COLUMNS = 3;
const TITLE_PREFIX = /^(dr|dra)\.?\s+/i;

const getInitials = (name = '') =>
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
      className="w-9 h-9 rounded-full bg-med-primary-100 text-med-primary-700 text-xs font-bold flex items-center justify-center shrink-0"
    >
      {getInitials(name)}
    </span>
  );
}

// Directorio resumido del Tablero Admin (mockup pág. 21: Ver Detalle -> Doctores).
function DirectoryDoctorsTable({
  items = [],
  isLoading = false,
  emptyMessage,
  onViewDetail,
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
            aria-label="Directorio de profesionales médicos"
            className="divide-y divide-med-border-subtle"
          >
            {items.map((doctor) => (
              <li key={doctor.id}>
                <article className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <DoctorAvatar name={doctor.name} />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-med-primary-900 text-sm truncate">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-med-text-sub truncate">
                        {doctor.speciality.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewDetail(doctor)}
                    className="shrink-0 text-xs font-semibold text-med-primary-700 hover:text-med-primary-900"
                  >
                    Ver Detalle
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Directorio de profesionales médicos
          </caption>
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
                      <span className="font-semibold text-med-primary-900">
                        {doctor.name}
                      </span>
                    </div>
                  </th>
                  <td className="px-6 py-4 text-med-text-sub">
                    {doctor.speciality.name}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetail(doctor)}
                      className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900"
                    >
                      Ver Detalle
                    </button>
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

export default DirectoryDoctorsTable;
