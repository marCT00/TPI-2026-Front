import Card from '../../shared/ui/atoms/Card';
import AlertBanner from '../../shared/ui/molecules/AlertBanner';
import TablePagination from '../../shared/ui/molecules/TablePagination';
import AppointmentFilters from '../components/AppointmentFilters';
import AppointmentsTable from '../components/AppointmentsTable';
import useAppointmentsSearch, {
  EMPTY_FILTERS,
} from '../hooks/useAppointmentsSearch';
import useFilterOptions from '../hooks/useFilterOptions';

function AppointmentsSearchPage() {
  const search = useAppointmentsSearch();
  const options = useFilterOptions();

  const getEmptyMessage = () => {
    if (search.error) {
      return 'No hay turnos para mostrar.';
    }

    return search.isFiltered
      ? 'No se encontraron turnos con esos filtros.'
      : 'Todavía no hay turnos registrados.';
  };

  return (
    <section
      aria-labelledby="appointments-title"
      className="flex flex-col gap-6"
    >
      <header>
        <h1
          id="appointments-title"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main"
        >
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </header>

      <Card as="article" className="p-6">
        <h2 className="text-base font-bold text-med-primary-900 mb-4">
          Criterios de Búsqueda
        </h2>

        {options.error && (
          <AlertBanner variant="warning" className="mb-4">
            No se pudieron cargar las especialidades y médicos para filtrar.
          </AlertBanner>
        )}

        <AppointmentFilters
          defaultValues={EMPTY_FILTERS}
          appliedFilters={search.filters}
          specialities={options.specialities}
          doctors={options.doctors}
          isLoadingOptions={options.isLoading}
          onApply={search.applyFilters}
          onClear={search.clearFilters}
        />
      </Card>

      {search.error && (
        <AlertBanner title="No se pudieron cargar los turnos">
          {search.error}{' '}
          <button
            type="button"
            onClick={search.refresh}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </AlertBanner>
      )}

      <Card as="article" className="p-0 overflow-hidden">
        <header className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </header>
        <AppointmentsTable
          items={search.items}
          isLoading={search.isLoading}
          emptyMessage={getEmptyMessage()}
        />
        <TablePagination
          currentPage={search.page}
          totalPages={search.totalPages}
          totalItems={search.total}
          pageSize={search.pageSize}
          onPageChange={search.setPage}
        />
      </Card>
    </section>
  );
}

export default AppointmentsSearchPage;
