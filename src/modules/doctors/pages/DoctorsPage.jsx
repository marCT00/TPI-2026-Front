import Card from '../../shared/ui/atoms/Card';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import SearchInput from '../../shared/ui/molecules/SearchInput';
import TablePagination from '../../shared/ui/molecules/TablePagination';
import DoctorsTable from '../components/DoctorsTable';
import useDoctorsList from '../hooks/useDoctorsList';

function DoctorsPage() {
  const list = useDoctorsList();

  const searchHint = list.isSearchTooShort
    ? `Escribí al menos ${list.minSearchLength} caracteres para filtrar.`
    : '';
  const emptyMessage = list.isFiltered
    ? 'No se encontraron médicos con ese nombre.'
    : 'Todavía no hay médicos registrados.';

  return (
    <section aria-labelledby="doctors-title" className="flex flex-col gap-6">
      <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1
            id="doctors-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
          >
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <SearchInput
          className="sm:w-72"
          label="Buscar doctor por nombre"
          placeholder="Buscar doctor por nombre..."
          value={list.searchTerm}
          hint={searchHint}
          onChange={list.changeSearch}
        />
      </header>

      {list.error && (
        <AlertBanner title="No se pudo cargar el listado">
          {list.error}{' '}
          <button
            type="button"
            onClick={list.refresh}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </AlertBanner>
      )}

      <Card as="article" className="p-0 overflow-hidden">
        <header className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </header>
        <DoctorsTable
          items={list.items}
          isLoading={list.isLoading}
          emptyMessage={emptyMessage}
        />
        <TablePagination
          currentPage={list.page}
          totalPages={list.totalPages}
          totalItems={list.total}
          pageSize={list.pageSize}
          onPageChange={list.setPage}
        />
      </Card>
    </section>
  );
}

export default DoctorsPage;
