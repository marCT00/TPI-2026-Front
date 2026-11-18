import TableSkeleton from '../../shared/ui/molecules/TableSkeleton';
import {
  PencilIcon,
  StethoscopeIcon,
  TrashIcon,
} from '../../shared/ui/atoms/icons';
import SpecialtyStatusBadge from './SpecialtyStatusBadge';

const COLUMNS = 4;

function SpecialtiesTable({
  items,
  isLoading,
  emptyMessage,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Listado de especialidades médicas</caption>
        <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Nombre de la Especialidad
            </th>
            <th scope="col" className="px-6 py-3.5">
              Descripción
            </th>
            <th scope="col" className="px-6 py-3.5 text-center">
              Estado
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

            {items.map((specialty) => (
              <tr
                key={specialty.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <th scope="row" className="px-6 py-4 font-normal">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                      <StethoscopeIcon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-semibold text-med-primary-900">
                      {specialty.name}
                    </span>
                  </div>
                </th>
                <td className="px-6 py-4 text-med-text-sub min-w-56 max-w-md">
                  <p className="line-clamp-2" title={specialty.description}>
                    {specialty.description}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <SpecialtyStatusBadge isActive={specialty.isActive} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="Editar especialidad"
                      aria-label={`Editar ${specialty.name}`}
                      onClick={() => onEdit(specialty)}
                      className="p-1.5 rounded-lg text-med-text-muted hover:bg-med-primary-50 hover:text-med-primary-900 transition"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      title="Eliminar especialidad"
                      aria-label={`Eliminar ${specialty.name}`}
                      onClick={() => onDelete(specialty)}
                      className="p-1.5 rounded-lg text-med-text-muted hover:bg-red-50 hover:text-med-danger-text transition"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default SpecialtiesTable;
