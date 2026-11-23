import ListSkeleton from '../../shared/ui/molecules/ListSkeleton';
import TableSkeleton from '../../shared/ui/molecules/TableSkeleton';
import {
  PencilIcon,
  StethoscopeIcon,
  TrashIcon,
} from '../../shared/ui/atoms/icons';
import SpecialityStatusBadge from './SpecialityStatusBadge';

const COLUMNS = 4;

function SpecialityIcon() {
  return (
    <span
      aria-hidden="true"
      className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0"
    >
      <StethoscopeIcon className="w-5 h-5" strokeWidth={1.75} />
    </span>
  );
}

function ActionButtons({ speciality, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2 shrink-0">
      <button
        type="button"
        title="Editar especialidad"
        aria-label={`Editar ${speciality.name}`}
        onClick={() => onEdit(speciality)}
        className="p-1.5 rounded-lg text-med-text-muted hover:bg-med-primary-50 hover:text-med-primary-900 transition"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        title="Eliminar especialidad"
        aria-label={`Eliminar ${speciality.name}`}
        onClick={() => onDelete(speciality)}
        className="p-1.5 rounded-lg text-med-danger-text hover:bg-red-50 transition"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// En mobile se muestra como lista de tarjetas y desde md como tabla.
function SpecialitiesTable({
  items,
  isLoading,
  emptyMessage,
  onEdit,
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
            aria-label="Listado de especialidades médicas"
            className="divide-y divide-med-border-subtle"
          >
            {items.map((speciality) => (
              <li key={speciality.id}>
                <article className="p-4 flex items-start gap-3">
                  <SpecialityIcon />
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <h3 className="font-semibold text-med-primary-900 leading-tight">
                      {speciality.name}
                    </h3>
                    <p className="text-xs text-med-text-sub leading-relaxed">
                      {speciality.description}
                    </p>
                    <div>
                      <SpecialityStatusBadge isActive={speciality.isActive} />
                    </div>
                  </div>
                  <ActionButtons
                    speciality={speciality}
                    onEdit={onEdit}
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
          <caption className="sr-only">
            Listado de especialidades médicas
          </caption>
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

              {items.map((speciality) => (
                <tr
                  key={speciality.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <th scope="row" className="px-6 py-4 font-normal">
                    <div className="flex items-center gap-3">
                      <SpecialityIcon />
                      <span className="font-semibold text-med-primary-900">
                        {speciality.name}
                      </span>
                    </div>
                  </th>
                  <td className="px-6 py-4 text-med-text-sub min-w-56 max-w-md">
                    <p className="line-clamp-2" title={speciality.description}>
                      {speciality.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <SpecialityStatusBadge isActive={speciality.isActive} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons
                      speciality={speciality}
                      onEdit={onEdit}
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

export default SpecialitiesTable;
