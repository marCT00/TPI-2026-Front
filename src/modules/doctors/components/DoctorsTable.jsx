import TableSkeleton from '../../shared/ui/molecules/TableSkeleton';
import { TrashIcon } from '../../shared/ui/atoms/icons';

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

function DoctorsTable({ items, isLoading, emptyMessage, onDelete }) {
  return (
    <div className="overflow-x-auto">
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

            {items.map((doctor) => (
              <tr
                key={doctor.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <th scope="row" className="px-6 py-4 font-normal">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 text-xs font-bold flex items-center justify-center shrink-0"
                    >
                      {getInitials(doctor.name)}
                    </span>
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
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700 whitespace-nowrap">
                    {doctor.specialty.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
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
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default DoctorsTable;
