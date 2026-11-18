// Se usa dentro de un <table> en lugar del <tbody> real mientras carga.
function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <tbody aria-busy="true" aria-label="Cargando registros">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-med-border-subtle">
          {Array.from({ length: columns }, (__, columnIndex) => (
            <td key={columnIndex} className="px-4 py-3">
              <span className="block h-3.5 w-full max-w-40 rounded bg-med-border animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableSkeleton;
