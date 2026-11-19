// Versión en tarjetas del TableSkeleton, para las listas en mobile.
function ListSkeleton({ items = 3 }) {
  return (
    <ul
      aria-busy="true"
      aria-label="Cargando registros"
      className="divide-y divide-med-border-subtle"
    >
      {Array.from({ length: items }, (_, index) => (
        <li key={index} className="p-4 flex flex-col gap-2">
          <span className="block h-3.5 w-2/3 rounded bg-med-border animate-pulse" />
          <span className="block h-3 w-1/2 rounded bg-med-border animate-pulse" />
          <span className="block h-3 w-1/3 rounded bg-med-border animate-pulse" />
        </li>
      ))}
    </ul>
  );
}

export default ListSkeleton;
